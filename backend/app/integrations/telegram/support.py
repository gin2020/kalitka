from telegram import Message

from app.integrations.telegram.bot import send_message, send_photo

OPERATOR_CHAT_ID = 6944966420


async def notify_new_message(
    conversation_id: str,
    text: str,
    image_path: str | None = None,
) -> Message:
    caption = (
        "💬 Новое сообщение\n\n"
        f"Диалог: {conversation_id}"
    )

    if text:
        caption = f"{caption}\n\n{text}"

    if image_path:
        return await send_photo(
            chat_id=OPERATOR_CHAT_ID,
            photo_path=image_path,
            caption=caption,
        )

    return await send_message(
        chat_id=OPERATOR_CHAT_ID,
        text=caption,
    )
