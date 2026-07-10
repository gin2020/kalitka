from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.deps import (
    get_subscription_service,
    get_support_service,
)
from app.services.subscription_service import (
    SubscriptionService,
)
from app.services.support_service import SupportService
from app.schemas.support import SupportMessageCreate


router = APIRouter(
    prefix="/support",
    tags=["Support"],
)

COOKIE_NAME = "kalitka_trial"

@router.get("")
async def get_messages(
    request: Request,
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
    support_service: SupportService = Depends(
        get_support_service,
    ),
):
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    subscription = await subscription_service.get_by_token(
        token
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    messages = await support_service.get_messages(
        subscription.id,
    )

    return [
        {
            "id": str(message.id),
            "sender": message.sender,
            "text": message.text,
            "createdAt": message.created_at,
        }
        for message in messages
    ]

@router.post("/messages")
async def send_message(
    payload: SupportMessageCreate,
    request: Request,
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
    support_service: SupportService = Depends(
        get_support_service,
    ),
):
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    subscription = await subscription_service.get_by_token(
        token
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    message = await support_service.send_message(
        subscription.id,
        sender="client",
        text=payload.text,
    )

    return {
        "id": str(message.id),
        "sender": message.sender,
        "text": message.text,
        "createdAt": message.created_at,
    }
