import json
from uuid import UUID

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
SUBSCRIPTION_PURCHASE_PLANS = {
    "30 ГБ": "150 ₽",
    "50 ГБ": "300 ₽",
    "Безлимит": "500 ₽",
}

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
            raw_message = await websocket.receive_text()

            try:
                payload = json.loads(raw_message)
            except json.JSONDecodeError:
                payload = {
                    "type": "message",
                    "text": raw_message,
                    "messageType": "text",
                }

            if payload.get("type") == "message_read":
                message_id = payload.get("messageId")

                if message_id:
                    try:
                        await support_service.mark_message_read(
                            subscription.id,
                            UUID(message_id),
                        )
                    except ValueError:
                        await websocket.send_json(
                            {
                                "type": "error",
                                "message": "Invalid message id",
                            }
                        )

                continue

            try:
                purchase_plan = None
                purchase_price = None

                if payload.get("type") == "subscription_purchase":
                    plan = payload.get("plan")

                    if isinstance(plan, dict):
                        purchase_plan = str(
                            plan.get("label", "")
                        )
                        purchase_price = (
                            SUBSCRIPTION_PURCHASE_PLANS.get(
                                purchase_plan
                            )
                        )

                    if not purchase_price:
                        raise ValueError(
                            "Unsupported subscription plan"
                        )

                await support_service.send_message(
                    subscription.id,
                    sender="client",
                    text=str(payload.get("text", "")),
                    message_type=str(
                        payload.get("messageType", "text")
                    ),
                    image=payload.get("image"),
                    client_email=subscription.client_email,
                    subscription_token=(
                        subscription.subscription_token
                    ),
                    user_id=subscription.user_id,
                    purchase_plan=purchase_plan,
                    purchase_price=purchase_price,
                )
            except ValueError as error:
                await websocket.send_json(
                    {
                        "type": "error",
                        "message": str(error),
                    }
                )

    except WebSocketDisconnect:
        manager.disconnect(
            conversation.id,
            websocket,
        )
