from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscription import Subscription


class SubscriptionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, **kwargs) -> Subscription:
        subscription = Subscription(**kwargs)
        self.db.add(subscription)
        await self.db.commit()
        await self.db.refresh(subscription)
        return subscription

    async def save(self, subscription: Subscription) -> Subscription:
        await self.db.commit()
        await self.db.refresh(subscription)
        return subscription

    async def get_by_id(
        self,
        subscription_id: UUID,
    ) -> Subscription | None:
        result = await self.db.execute(
            select(Subscription).where(
                Subscription.id == subscription_id
            )
        )
        return result.scalar_one_or_none()

    async def get_by_token(
        self,
        token: str,
    ) -> Subscription | None:
        result = await self.db.execute(
            select(Subscription).where(
                Subscription.subscription_token == token
            )
        )
        return result.scalar_one_or_none()

    async def get_by_xui_client(
        self,
        client_id: str,
    ) -> Subscription | None:
        result = await self.db.execute(
            select(Subscription).where(
                Subscription.xui_client_id == client_id
            )
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[Subscription]:
        result = await self.db.execute(
            select(Subscription)
        )
        return list(result.scalars().all())

    async def update(
        self,
        subscription: Subscription,
        **kwargs,
    ) -> Subscription:
        for key, value in kwargs.items():
            setattr(subscription, key, value)

        return await self.save(subscription)

    async def delete(
        self,
        subscription: Subscription,
    ) -> None:
        await self.db.delete(subscription)
        await self.db.commit()
