from uuid import UUID

from sqlalchemy import BigInteger, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.models import BaseModel


class SupportMessage(BaseModel):
    __tablename__ = "support_messages"

    conversation_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "support_conversations.id",
            ondelete="CASCADE",
        ),
    )

    sender: Mapped[str] = mapped_column(
        String(16),
    )

    text: Mapped[str] = mapped_column(
        Text,
    )

    telegram_message_id: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    conversation = relationship(
        "SupportConversation",
        back_populates="messages",
    )
