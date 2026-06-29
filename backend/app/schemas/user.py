from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str | None = None
    apple_id: str | None = None
    google_id: str | None = None
    telegram_id: str | None = None
    display_name: str | None = None
    avatar: str | None = None


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str | None
    display_name: str | None
    avatar: str | None
    role: str
    status: str
