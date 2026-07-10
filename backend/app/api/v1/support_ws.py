from fastapi import (
    APIRouter,
    Depends,
    WebSocket,
    WebSocketDisconnect,
)

from app.api.deps import (
    get_subscription_service,
    get_support_service,
)

from app.services.subscription_service import (
    SubscriptionService,
)

from app.services.support_service import (
    SupportService,
)

COOKIE_NAME = "kalitka_trial"

router = APIRouter()


@router.websocket("/ws/support")
async def support_websocket(
    websocket: WebSocket,
    subscription_service: SubscriptionService = Depends(
        get_subscription_service,
    ),
    support_service: SupportService = Depends(
        get_support_service,
    ),
):
    await websocket.accept()

    try:
        token = websocket.cookies.get(COOKIE_NAME)

        if not token:
            await websocket.close(code=1008)
            return

        subscription = (
            await subscription_service.get_by_token(
                token
            )
        )

        if not subscription:
            await websocket.close(code=1008)
            return

        await support_service.get_or_create_conversation(
            subscription.id,
        )

        while True:
            text = await websocket.receive_text()

            message = await support_service.send_message(
                subscription.id,
                sender="client",
                text=text,
            )

            await websocket.send_json(
                {
                    "id": str(message.id),
                    "sender": message.sender,
                    "text": message.text,
                    "createdAt": (
                        message.created_at.isoformat()
                    ),
                }
            )

    except WebSocketDisconnect:
        pass
