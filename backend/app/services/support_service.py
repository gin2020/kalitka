import base64
import binascii
import logging
from pathlib import Path
from uuid import UUID, uuid4

from app.core.config import settings
from app.integrations.telegram.bot import bot
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


UPLOAD_DIR = Path("uploads/support")
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
logger = logging.getLogger(__name__)
ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".heic",
}


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
        text: str = "",
        message_type: str = "text",
        image: dict | None = None,
        image_path: str | None = None,
        client_email: str | None = None,
        subscription_token: str | None = None,
        user_id: UUID | None = None,
        purchase_plan: str | None = None,
        purchase_price: str | None = None,
    ) -> SupportMessage:
        conversation = await self.get_or_create_conversation(
            subscription_id
        )

        normalized_text = text.strip()
        saved_image_path = image_path

        if message_type not in {"text", "image"}:
            raise ValueError("Unsupported message type")

        if message_type == "image":
            if image:
                saved_image_path = self._save_image_upload(
                    file_name=str(image.get("name", "")),
                    data=str(image.get("data", "")),
                )

            if not saved_image_path:
                raise ValueError("Image is required")
        elif not normalized_text:
            raise ValueError("Text is required")

        message = await self.message_repository.create(
            conversation_id=conversation.id,
            sender=sender,
            text=normalized_text,
            message_type=message_type,
            image_path=saved_image_path,
            status="sent",
        )

        await self._send_to_conversation(message)

        if sender == "client":
            try:
                telegram_message = await notify_new_message(
                    conversation_id=str(conversation.id),
                    text=normalized_text,
                    image_path=saved_image_path,
                    client_email=client_email,
                    subscription_token=subscription_token,
                    user_id=str(user_id) if user_id else None,
                    purchase_plan=purchase_plan,
                    purchase_price=purchase_price,
                )

                message = await self.message_repository.update(
                    message,
                    telegram_message_id=telegram_message.message_id,
                )
            except Exception:
                logger.exception(
                    "Failed to notify Telegram about support message"
                )

        return message

    async def mark_message_read(
        self,
        subscription_id: UUID,
        message_id: UUID,
    ) -> SupportMessage | None:
        conversation = await self.get_or_create_conversation(
            subscription_id
        )
        message = await self.message_repository.get_by_id(
            message_id
        )

        if (
            not message
            or message.conversation_id != conversation.id
            or message.status == "read"
        ):
            return message

        message = await self.message_repository.update(
            message,
            status="read",
        )

        await manager.send_to_conversation(
            message.conversation_id,
            {
                "type": "message_status",
                "messageId": str(message.id),
                "status": message.status,
            },
        )

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
        ) or ""
        photo = telegram_message.get("photo") or []
        image_path = None
        message_type = "text"

        if photo:
            image_path = await self._save_telegram_photo(photo)
            message_type = "image"

        if not text and not image_path:
            return None

        message = await self.message_repository.create(
            conversation_id=source_message.conversation_id,
            sender="operator",
            text=text.strip(),
            message_type=message_type,
            image_path=image_path,
            status="sent",
        )

        await self._send_to_conversation(message)

        return message

    async def _send_to_conversation(
        self,
        message: SupportMessage,
    ) -> None:
        await manager.send_to_conversation(
            message.conversation_id,
            self.serialize_message(message),
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

    def serialize_message(
        self,
        message: SupportMessage,
    ) -> dict:
        image_url = None

        if message.image_path:
            image_url = (
                f"{settings.PUBLIC_BASE_URL}/"
                f"{message.image_path}"
            )

        return {
            "type": "message",
            "id": str(message.id),
            "sender": message.sender,
            "text": message.text,
            "messageType": message.message_type,
            "imagePath": message.image_path,
            "imageUrl": image_url,
            "status": message.status,
            "createdAt": message.created_at.isoformat(),
        }

    def _save_image_upload(
        self,
        file_name: str,
        data: str,
    ) -> str:
        extension = Path(file_name).suffix.lower()

        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValueError("Unsupported image format")

        try:
            content = base64.b64decode(
                data,
                validate=True,
            )
        except binascii.Error as error:
            raise ValueError("Invalid image data") from error

        if len(content) > MAX_IMAGE_SIZE_BYTES:
            raise ValueError("Image is too large")

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        path = UPLOAD_DIR / f"{uuid4().hex}{extension}"
        path.write_bytes(content)

        return path.as_posix()

    async def _save_telegram_photo(
        self,
        photo_sizes: list[dict],
    ) -> str:
        largest_photo = photo_sizes[-1]
        file_id = largest_photo.get("file_id")

        if not file_id:
            raise ValueError("Telegram photo file_id is missing")

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        path = UPLOAD_DIR / f"{uuid4().hex}.jpg"
        telegram_file = await bot.get_file(file_id)
        await telegram_file.download_to_drive(
            custom_path=path.as_posix(),
        )

        return path.as_posix()
