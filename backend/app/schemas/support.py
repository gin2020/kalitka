from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SupportMessageCreate(BaseModel):
    text: str


class SupportMessageRead(BaseModel):
    id: UUID

    sender: str

    text: str

    created_at: datetime

    class Config:
        from_attributes = True
