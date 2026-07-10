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

from app.services.websocket_manager import (
    manager,
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
    token = websocket.cookies.get(COOKIE_NAME)

    if not token:
        await websocket.close(code=1008)
        return

    subscription = await subscription_service.get_by_token(
        token
    )

    if not subscription:
        await websocket.close(code=1008)
        return

    conversation = (
        await support_service.get_or_create_conversation(
            subscription.id,
        )
    )

    await manager.connect(
        conversation.id,
        websocket,
    )

    try:
        while True:
            text = await websocket.receive_text()

            await support_service.send_message(
                subscription.id,
                sender="client",
                text=text,
            )

    except WebSocketDisconnect:
        manager.disconnect(
            conversation.id,
            websocket,
        )
