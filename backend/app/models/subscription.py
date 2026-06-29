from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.models import BaseModel


class Subscription(BaseModel):
    __tablename__ = "subscriptions"

    user_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    subscription_token: Mapped[str] = mapped_column(
        String(128),
        unique=True,
        index=True,
    )

    xui_client_id: Mapped[str | None] = mapped_column(
        String(128),
        unique=True,
        nullable=True,
    )

    country: Mapped[str] = mapped_column(
        String(64),
        default="Germany",
    )

    protocol: Mapped[str] = mapped_column(
        String(32),
        default="VLESS Reality",
    )

    traffic_limit: Mapped[int] = mapped_column(
        Integer,
        default=1073741824,  # 1 GB
    )

    traffic_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    status: Mapped[str] = mapped_column(
        String(32),
        default="trial",
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
