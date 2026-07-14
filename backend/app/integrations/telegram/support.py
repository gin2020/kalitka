from telegram import Message

from app.integrations.telegram.bot import send_message, send_photo

OPERATOR_CHAT_ID = 6944966420


async def notify_new_message(
    conversation_id: str,
    text: str,
    image_path: str | None = None,
    client_email: str | None = None,
    subscription_token: str | None = None,
    user_id: str | None = None,
    purchase_plan: str | None = None,
    purchase_price: str | None = None,
) -> Message:
    title = "💬 Новое сообщение"

    if purchase_plan:
        title = "🛒 Заявка на покупку подписки"

    caption = f"{title}\n\n"

    if purchase_plan:
        caption = (
            f"{caption}"
            f"Тариф: {purchase_plan}\n"
            f"Стоимость: {purchase_price or 'не указана'}\n"
        )

    caption = (
        f"{caption}"
        f"Email: {client_email or 'не указан'}\n"
        f"Sub ID: {subscription_token or 'не указан'}\n"
        f"Dialog ID: {conversation_id}\n"
        f"User ID: {user_id or 'не указан'}"
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
