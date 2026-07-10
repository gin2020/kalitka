from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.models import BaseModel


class SupportConversation(BaseModel):
    __tablename__ = "support_conversations"

    subscription_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "subscriptions.id",
            ondelete="CASCADE",
        ),
        unique=True,
    )

    status: Mapped[str] = mapped_column(
        String(32),
        default="open",
    )

    subscription = relationship(
        "Subscription",
        back_populates="conversation",
    )

    messages = relationship(
        "SupportMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="SupportMessage.created_at",
    )
