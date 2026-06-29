import secrets

from app.core.config import settings
from app.integrations.xui.client import xui_client

TRIAL_TRAFFIC_BYTES = 1024 * 1024 * 1024


class VPNService:
    @staticmethod
    def generate_client_email() -> str:
        return f"{secrets.token_hex(8)}@kalitka.local"

    async def create_trial(self) -> dict:
        email = self.generate_client_email()

        create_result = await xui_client.create_client(
            email=email,
            traffic_bytes=TRIAL_TRAFFIC_BYTES,
            expiry_time=0,
            limit_ip=1,
        )

        if not create_result.get("success"):
            raise RuntimeError(create_result.get("msg"))

        client = await xui_client.get_client(email)

        subscription_token = client["obj"]["subId"]

        subscription_url = (
            f"{settings.XUI_SUBSCRIPTION_BASE}/{subscription_token}"
        )

        return {
            "subscription_token": subscription_token,
            "subscription_url": subscription_url,
            "country": "Germany",
            "protocol": "VLESS Reality",
            "traffic_limit": TRIAL_TRAFFIC_BYTES,
        }


vpn_service = VPNService()
