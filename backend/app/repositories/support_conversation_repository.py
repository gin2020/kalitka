from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.support_conversation import (
    SupportConversation,
)


class SupportConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        **kwargs,
    ) -> SupportConversation:
        conversation = SupportConversation(**kwargs)

        self.db.add(conversation)

        await self.db.commit()
        await self.db.refresh(conversation)

        return conversation

    async def save(
        self,
        conversation: SupportConversation,
    ) -> SupportConversation:
        await self.db.commit()
        await self.db.refresh(conversation)

        return conversation

    async def get_by_id(
        self,
        conversation_id: UUID,
    ) -> SupportConversation | None:
        result = await self.db.execute(
            select(SupportConversation).where(
                SupportConversation.id == conversation_id
            )
        )

        return result.scalar_one_or_none()

    async def get_by_subscription(
        self,
        subscription_id: UUID,
    ) -> SupportConversation | None:
        result = await self.db.execute(
            select(SupportConversation).where(
                SupportConversation.subscription_id
                == subscription_id
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        conversation: SupportConversation,
        **kwargs,
    ) -> SupportConversation:
        for key, value in kwargs.items():
            setattr(conversation, key, value)

        return await self.save(conversation)

    async def delete(
        self,
        conversation: SupportConversation,
    ) -> None:
        await self.db.delete(conversation)
        await self.db.commit()
