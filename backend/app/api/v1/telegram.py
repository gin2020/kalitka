from fastapi import APIRouter, Depends, Request

from app.api.deps import get_support_service
from app.services.support_service import SupportService

router = APIRouter(
    prefix="/telegram",
    tags=["Telegram"],
)


@router.post("/webhook")
async def telegram_webhook(
    request: Request,
    support_service: SupportService = Depends(
        get_support_service,
    ),
):
    update = await request.json()

    await support_service.handle_telegram_update(
        update,
    )

    return {
        "ok": True,
    }
