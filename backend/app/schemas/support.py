from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SupportMessageCreate(BaseModel):
    text: str


class SupportMessageRead(BaseModel):
    id: UUID

    sender: str

    text: str

    message_type: str = "text"

    image_path: str | None = None

    status: str = "sent"

    created_at: datetime

    class Config:
        from_attributes = True
