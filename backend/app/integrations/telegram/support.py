from telegram import Message

from app.integrations.telegram.bot import send_message

OPERATOR_CHAT_ID = 6944966420


async def notify_new_message(
    conversation_id: str,
    text: str,
) -> Message:
    return await send_message(
        chat_id=OPERATOR_CHAT_ID,
        text=(
            "💬 Новое сообщение\n\n"
            f"Диалог: {conversation_id}\n\n"
            f"{text}"
        ),
    )
