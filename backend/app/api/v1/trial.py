from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_subscription_service
from app.schemas.subscription import SubscriptionCreate
from app.services.subscription_service import SubscriptionService
from app.services.vpn_service import vpn_service

router = APIRouter(
    prefix="/trial",
    tags=["Trial"],
)


@router.post("")
async def create_trial(
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
):
    try:
        vpn = await vpn_service.create_trial()

        await subscription_service.create_trial(
            subscription_token=vpn["subscription_token"],
            country=vpn["country"],
            protocol=vpn["protocol"],
            traffic_limit=vpn["traffic_limit"],
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
