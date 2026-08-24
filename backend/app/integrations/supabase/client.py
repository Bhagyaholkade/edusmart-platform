import httpx
from typing import Dict, Any

class SupabaseAuthClient:
    """Thin wrapper around Supabase Auth REST API.
    Uses the service_role key for server‑side operations (sign‑in, sign‑up).
    """
    def __init__(self, supabase_url: str, service_key: str):
        self.base_url = supabase_url.rstrip('/')
        self.headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        }
        self.client = httpx.AsyncClient(base_url=self.base_url, headers=self.headers)

    async def sign_up(self, email: str, password: str) -> Dict[str, Any]:
        """Create a new user via Supabase Auth.
        Returns the raw JSON response which includes `user` and `access_token`.
        """
        payload = {"email": email, "password": password}
        resp = await self.client.post("/auth/v1/signup", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def close(self):
        await self.client.aclose()
