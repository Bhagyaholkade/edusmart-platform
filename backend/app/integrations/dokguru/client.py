from typing import List, Dict
import httpx
import json
from app.core.config import settings

class DokGuruClient:
    def __init__(self):
        self.base_url = settings.DOKGURU_URL
        self.client = httpx.AsyncClient(timeout=30.0)

    async def ask(self, context: str, question: str) -> str:
        try:
            response = await self.client.post(
                f"{self.base_url}/api/v1/ask",
                json={"context": context, "question": question}
            )
            response.raise_for_status()
            data = response.json()
            return data.get("answer", "I could not process that request.")
        except Exception as e:
            # Fallback for when DokGuru is not running locally
            print(f"DokGuru Error: {e}")
            return "This is a simulated response. DokGuru engine is currently unreachable."

    async def close(self):
        await self.client.aclose()
