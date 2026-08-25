# backend/app/integrations/supabase/client.py
import httpx
from fastapi import HTTPException
from typing import Any, Dict


class SupabaseAuthClient:
    def __init__(self, url: str, service_key: str):
        self.base_url = f"{url.rstrip('/')}/auth/v1"
        self.headers = {
            "apikey": service_key,
            "Content-Type": "application/json",
        }
        self._client: httpx.AsyncClient | None = None

    async def _ensure_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(10.0, read=30.0, write=10.0),
                follow_redirects=True,
            )
        return self._client

    async def sign_up(self, *, email: str, password: str) -> Dict[str, Any]:
        """
        Calls Supabase /signup endpoint.
        Returns the raw JSON on success.
        Raises HTTPException on any failure.
        """
        client = await self._ensure_client()
        payload = {"email": email, "password": password}
        try:
            resp = await client.post(
                f"{self.base_url}/signup",
                json=payload,
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()
        except (httpx.ConnectError, httpx.ReadTimeout) as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Unable to reach Supabase at {self.base_url}: {exc}",
            ) from exc
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=exc.response.text,
            ) from exc

    async def sign_in(self, *, email: str, password: str) -> Dict[str, Any]:
        """
        Calls Supabase /token?grant_type=password endpoint.
        Returns the raw JSON on success.
        Raises HTTPException on any failure.
        """
        client = await self._ensure_client()
        payload = {"email": email, "password": password}
        try:
            resp = await client.post(
                f"{self.base_url}/token?grant_type=password",
                json=payload,
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()
        except (httpx.ConnectError, httpx.ReadTimeout) as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Unable to reach Supabase at {self.base_url}: {exc}",
            ) from exc
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=exc.response.text,
            ) from exc

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None
