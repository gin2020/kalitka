from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SubscriptionCreate(BaseModel):
    subscription_token: str
    xui_client_id: str
    country: str = "Germany"
    protocol: str = "VLESS Reality"
    traffic_limit: int = 1073741824
    expires_at: datetime | None = None


class SubscriptionRead(BaseModel):
    id: UUID

    subscription_token: str

    country: str
    protocol: str

    traffic_limit: int
    traffic_used: int

    status: str

    expires_at: datetime | None

    class Config:
        from_attributes = True
