from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
)

from app.api.deps import get_subscription_service
from app.services.subscription_service import SubscriptionService
from app.services.vpn_service import vpn_service

router = APIRouter(
    prefix="/trial",
    tags=["Trial"],
)

COOKIE_NAME = "kalitka_trial"


@router.post("")
async def create_trial(
    request: Request,
    response: Response,
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
):
    try:
        trial_cookie = request.cookies.get(COOKIE_NAME)

        if trial_cookie:
            subscription = await subscription_service.get_by_token(
                trial_cookie
            )

            if subscription:
                return {
                    "success": True,
                    "trial": {
                        "subscriptionUrl": (
                            subscription_service.build_subscription_url(
                                subscription.subscription_token
                            )
                        ),
                        "trafficLimit": "1 GB",
                        "country": subscription.country,
                        "protocols": [
                            subscription.protocol,
                            "Hysteria 2",
                        ],
                    },
                }

        vpn = await vpn_service.create_trial()

        await subscription_service.create_trial(
            subscription_token=vpn["subscription_token"],
            client_email=vpn["client_email"],
            country=vpn["country"],
            protocol=vpn["protocol"],
            traffic_limit=vpn["traffic_limit"],
        )

        response.set_cookie(
            key=COOKIE_NAME,
            value=vpn["subscription_token"],
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
        )

        return {
            "success": True,
            "trial": {
                "subscriptionUrl": vpn["subscription_url"],
                "trafficLimit": "1 GB",
                "country": vpn["country"],
                "protocols": [
                    vpn["protocol"],
                    "Hysteria 2",
                ],
            },
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )
