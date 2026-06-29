import secrets

from app.core.config import settings
from app.integrations.xui.client import xui_client

TRIAL_TRAFFIC_BYTES = 1024 * 1024 * 1024


class XUIService:
    @staticmethod
    def generate_client_email() -> str:
        return f"{secrets.token_hex(8)}@kalitka.local"

    async def create_trial(self) -> dict:
        email = self.generate_client_email()

        result = await xui_client.create_client(
            email=email,
            traffic_bytes=TRIAL_TRAFFIC_BYTES,
            expiry_time=0,
            limit_ip=1,
        )

        if not result.get("success"):
            raise RuntimeError(
                result.get("msg", "Failed to create client")
            )

        client = await xui_client.get_client(email)

        if not client.get("success"):
            raise RuntimeError(
                client.get("msg", "Client not found")
            )

        subscription_token = client["obj"]["subId"]

        return {
            "subscription_token": subscription_token,
            "subscription_url": (
                f"{settings.XUI_SUBSCRIPTION_BASE}/"
                f"{subscription_token}"
            ),
            "country": "Germany",
            "protocol": "VLESS Reality",
            "traffic_limit": TRIAL_TRAFFIC_BYTES,
        }


xui_service = XUIService()
