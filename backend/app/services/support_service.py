from uuid import UUID

from app.models.support_conversation import SupportConversation
from app.models.support_message import SupportMessage
from app.repositories.support_conversation_repository import (
    SupportConversationRepository,
)
from app.repositories.support_message_repository import (
    SupportMessageRepository,
)


class SupportService:
    def __init__(
        self,
        conversation_repository: SupportConversationRepository,
        message_repository: SupportMessageRepository,
    ):
        self.conversation_repository = conversation_repository
        self.message_repository = message_repository

    async def get_or_create_conversation(
        self,
        subscription_id: UUID,
    ) -> SupportConversation:
        conversation = (
            await self.conversation_repository.get_by_subscription(
                subscription_id
            )
        )

        if conversation:
            return conversation

        return await self.conversation_repository.create(
            subscription_id=subscription_id,
            status="open",
        )

    async def send_message(
        self,
        subscription_id: UUID,
        sender: str,
        text: str,
    ) -> SupportMessage:
        conversation = await self.get_or_create_conversation(
            subscription_id
        )

        return await self.message_repository.create(
            conversation_id=conversation.id,
            sender=sender,
            text=text,
        )

    async def get_messages(
        self,
        subscription_id: UUID,
    ) -> list[SupportMessage]:
        conversation = await self.get_or_create_conversation(
            subscription_id
        )

        return (
            await self.message_repository.list_by_conversation(
                conversation.id
            )
        )

    async def close_conversation(
        self,
        subscription_id: UUID,
    ) -> SupportConversation:
        conversation = await self.get_or_create_conversation(
            subscription_id
        )

        return await self.conversation_repository.update(
            conversation,
            status="closed",
        )
