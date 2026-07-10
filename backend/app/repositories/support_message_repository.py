from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.support_message import SupportMessage


class SupportMessageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        **kwargs,
    ) -> SupportMessage:
        message = SupportMessage(**kwargs)

        self.db.add(message)

        await self.db.commit()
        await self.db.refresh(message)

        return message

    async def get_by_id(
        self,
        message_id: UUID,
    ) -> SupportMessage | None:
        result = await self.db.execute(
            select(SupportMessage).where(
                SupportMessage.id == message_id
            )
        )

        return result.scalar_one_or_none()

    async def list_by_conversation(
        self,
        conversation_id: UUID,
    ) -> list[SupportMessage]:
        result = await self.db.execute(
            select(SupportMessage)
            .where(
                SupportMessage.conversation_id
                == conversation_id
            )
            .order_by(
                SupportMessage.created_at.asc()
            )
        )

        return list(result.scalars().all())

    async def delete(
        self,
        message: SupportMessage,
    ) -> None:
        await self.db.delete(message)
        await self.db.commit()
