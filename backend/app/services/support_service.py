from uuid import UUID

from app.integrations.telegram.support import (
    notify_new_message,
)
from app.models.support_conversation import SupportConversation
from app.models.support_message import SupportMessage
from app.repositories.support_conversation_repository import (
    SupportConversationRepository,
)
from app.repositories.support_message_repository import (
    SupportMessageRepository,
)
from app.services.websocket_manager import manager


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

        message = await self.message_repository.create(
            conversation_id=conversation.id,
            sender=sender,
            text=text,
        )

        if sender == "client":
            telegram_message = await notify_new_message(
                conversation_id=str(conversation.id),
                text=text,
            )

            message = await self.message_repository.update(
                message,
                telegram_message_id=telegram_message.message_id,
            )

        await self._send_to_conversation(message)

        return message

    async def handle_telegram_update(
        self,
        update: dict,
    ) -> SupportMessage | None:
        telegram_message = update.get("message")

        if not telegram_message:
            return None

        reply_to_message = telegram_message.get(
            "reply_to_message"
        )

        if not reply_to_message:
            return None

        reply_to_message_id = reply_to_message.get(
            "message_id"
        )

        if reply_to_message_id is None:
            return None

        source_message = (
            await self.message_repository.get_by_telegram_message_id(
                reply_to_message_id,
            )
        )

        if not source_message:
            return None

        text = telegram_message.get("text") or telegram_message.get(
            "caption"
        )

        if not text:
            return None

        message = await self.message_repository.create(
            conversation_id=source_message.conversation_id,
            sender="operator",
            text=text,
        )

        await self._send_to_conversation(message)

        return message

    async def _send_to_conversation(
        self,
        message: SupportMessage,
    ) -> None:
        await manager.send_to_conversation(
            message.conversation_id,
            {
                "id": str(message.id),
                "sender": message.sender,
                "text": message.text,
                "createdAt": message.created_at.isoformat(),
            },
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
