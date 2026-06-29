from app.models.subscription import Subscription
from app.repositories.subscription_repository import (
    SubscriptionRepository,
)
from app.schemas.subscription import SubscriptionCreate


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
            country=data.country,
            protocol=data.protocol,
            traffic_limit=data.traffic_limit,
            expires_at=data.expires_at,
        )

    async def create_trial(
        self,
        subscription_token: str,
        country: str,
        protocol: str,
        traffic_limit: int,
    ) -> Subscription:
        return await self.repository.create(
            subscription_token=subscription_token,
            xui_client_id=None,
            country=country,
            protocol=protocol,
            traffic_limit=traffic_limit,
        )

    async def get_by_token(
        self,
        token: str,
    ) -> Subscription | None:
        return await self.repository.get_by_token(token)

    async def list(self) -> list[Subscription]:
        return await self.repository.list()
