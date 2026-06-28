from fastapi import APIRouter, HTTPException

from app.services.vpn_service import vpn_service

router = APIRouter(prefix="/trial", tags=["Trial"])


@router.post("")
async def create_trial():
    try:
        return await vpn_service.create_trial()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )
