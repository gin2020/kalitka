from app.core.config import settings
from app.models.subscription import Subscription
from app.repositories.subscription_repository import (
    SubscriptionRepository,
)
from app.schemas.subscription import SubscriptionCreate
from app.services.xui_service import xui_service


class SubscriptionService:
    def __init__(
        self,
        repository: SubscriptionRepository,
    ):
        self.repository = repository

    async def create(
        self,
        data: SubscriptionCreate,
    ) -> Subscription:
        return await self.repository.create(
            subscription_token=data.subscription_token,
            xui_client_id=data.xui_client_id,
            client_email=data.client_email,
            country=data.country,
            protocol=data.protocol,
            traffic_limit=data.traffic_limit,
            expires_at=data.expires_at,
        )

    async def create_trial(
        self,
        subscription_token: str,
        client_email: str,
        country: str,
        protocol: str,
        traffic_limit: int,
    ) -> Subscription:
        return await self.repository.create(
            subscription_token=subscription_token,
            xui_client_id=None,
            client_email=client_email,
            country=country,
            protocol=protocol,
            traffic_limit=traffic_limit,
        )

    async def get_by_token(
        self,
        token: str,
    ) -> Subscription | None:
        return await self.repository.get_by_token(token)

    async def get_by_token_with_actual_traffic(
        self,
        token: str,
    ) -> Subscription | None:
        subscription = await self.repository.get_by_token(token)

        if not subscription:
            return None

        try:
            traffic = await xui_service.get_client_traffic(
                subscription.client_email
            )
        except Exception:
            return subscription

        traffic_limit = int(traffic["traffic_limit"])

        return await self.repository.update(
            subscription,
            traffic_used=int(traffic["traffic_used"]),
            traffic_limit=traffic_limit
            if traffic_limit > 0
            else subscription.traffic_limit,
            status=str(traffic["status"]),
        )

    async def list(self) -> list[Subscription]:
        return await self.repository.list()

    @staticmethod
    def build_subscription_url(
        subscription_token: str,
    ) -> str:
        return (
            f"{settings.XUI_SUBSCRIPTION_BASE}/"
            f"{subscription_token}"
        )
