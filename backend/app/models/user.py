from sqlalchemy import String

from sqlalchemy.orm import Mapped, mapped_column

from app.db.models import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    apple_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    google_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    telegram_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    display_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    avatar: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    role: Mapped[str] = mapped_column(
        String(32),
        default="user",
    )

    status: Mapped[str] = mapped_column(
        String(32),
        default="active",
    )
