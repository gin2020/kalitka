import httpx

from app.core.config import settings


class XUIClient:
    def __init__(self) -> None:
        self.base_url = settings.XUI_BASE_URL.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {settings.XUI_API_TOKEN}",
            "Content-Type": "application/json",
        }

    async def create_client(
        self,
        email: str,
        traffic_bytes: int,
        expiry_time: int = 0,
        limit_ip: int = 1,
    ) -> dict:

        payload = {
            "client": {
                "email": email,
                "totalGB": traffic_bytes,
                "expiryTime": expiry_time,
                "tgId": 0,
                "limitIp": limit_ip,
                "enable": True,
            },
            "inboundIds": [
                settings.XUI_DEFAULT_INBOUND_ID,
            ],
        }

        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.base_url}/panel/api/clients/add",
                headers=self.headers,
                json=payload,
            )

        response.raise_for_status()

        return response.json()

    async def get_links(self, email: str) -> dict:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(
                f"{self.base_url}/panel/api/clients/links/{email}",
                headers=self.headers,
            )

        response.raise_for_status()

        return response.json()


xui_client = XUIClient()
