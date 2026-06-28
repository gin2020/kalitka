import secrets

from app.integrations.xui.client import xui_client


TRIAL_TRAFFIC_BYTES = 1024 * 1024 * 1024  # 1 GB


class VPNService:
    @staticmethod
    def generate_client_email() -> str:
        return f"u_{secrets.token_hex(8)}@kalitka.local"

    async def create_trial(self) -> dict:
        email = self.generate_client_email()

        # Создаем клиента в 3x-ui
        create_result = await xui_client.create_client(
            email=email,
            traffic_bytes=TRIAL_TRAFFIC_BYTES,
            expiry_time=0,
            limit_ip=1,
        )

        if not create_result.get("success"):
            raise Exception(
                create_result.get("msg", "Failed to create client in 3x-ui")
            )

        # Получаем ссылки
        links_result = await xui_client.get_links(email)

        if not links_result.get("success"):
            raise Exception(
                links_result.get("msg", "Failed to get client links")
            )

        return {
            "success": True,
            "email": email,
            "subscription": links_result["obj"],
        }


vpn_service = VPNService()
