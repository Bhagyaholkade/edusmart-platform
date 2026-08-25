# test_auth.py
"""Tests the Supabase Auth integration end-to-end via FastAPI."""
import os
import asyncio
import httpx
import uuid

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")


async def main():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:

        # 1️⃣  Sign-up (fresh email each run)
        unique_id = uuid.uuid4().hex[:8]
        email = f"testuser_{unique_id}@example.com"
        creds = {"username": email, "password": "TestPassword123!"}

        resp = await client.post("/api/v1/auth/signup", data=creds)
        print("Signup status:", resp.status_code)
        print("Signup body  :", resp.text if not resp.is_success else resp.json())

        if not resp.is_success:
            print("Signup failed – trying login with existing credentials...")

        # 2️⃣  Login
        login_resp = await client.post("/api/v1/auth/login", data=creds)
        print("Login status :", login_resp.status_code)
        if not login_resp.is_success:
            print("Login body   :", login_resp.text)
            print("Login failed – aborting.")
            return
        login_body = login_resp.json()
        print("Login body   :", login_body)
        token = login_body.get("access_token")

        if not token:
            print("No token in login response – aborting.")
            return

        # 3️⃣  /me
        headers = {"Authorization": f"Bearer {token}"}
        me_resp = await client.get("/api/v1/auth/me", headers=headers)
        print("/me status   :", me_resp.status_code)
        print("/me body     :", me_resp.text if not me_resp.is_success else me_resp.json())


if __name__ == "__main__":
    asyncio.run(main())
