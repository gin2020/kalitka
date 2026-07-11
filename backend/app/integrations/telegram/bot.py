from telegram import Bot
from telegram import Message

BOT_TOKEN = "8897155191:AAG0iitZJgxpE0uPUqw2HOu8p_31ani8f1w"

bot = Bot(BOT_TOKEN)


async def send_message(
    chat_id: int,
    text: str,
) -> Message:
    message = await bot.send_message(
        chat_id=chat_id,
        text=text,
    )

    return message


async def send_photo(
    chat_id: int,
    photo_path: str,
    caption: str | None = None,
) -> Message:
    with open(photo_path, "rb") as photo:
        message = await bot.send_photo(
            chat_id=chat_id,
            photo=photo,
            caption=caption,
        )

    return message
