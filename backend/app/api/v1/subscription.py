from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from app.api.deps import get_subscription_service
from app.services.subscription_service import SubscriptionService

router = APIRouter(
    prefix="/subscription",
    tags=["Subscription"],
)

COOKIE_NAME = "kalitka_trial"


@router.get("/me")
async def get_my_subscription(
    request: Request,
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
):
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    subscription = (
        await subscription_service.get_by_token_with_actual_traffic(
            token
        )
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    return {
        "active": True,
        "status": subscription.status,
        "country": subscription.country,
        "protocol": subscription.protocol,
        "trafficLimit": subscription.traffic_limit,
        "trafficUsed": subscription.traffic_used,
        "subscriptionUrl": (
            subscription_service.build_subscription_url(
                subscription.subscription_token
            )
        ),
        "clientEmail": subscription.client_email,
        "createdAt": subscription.created_at,
        "expiresAt": subscription.expires_at,
    }
