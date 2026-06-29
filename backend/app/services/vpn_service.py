from app.services.xui_service import xui_service


class VPNService:
    async def create_trial(self) -> dict:
        return await xui_service.create_trial()


vpn_service = VPNService()
