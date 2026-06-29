from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("", response_model=UserRead, status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    service = UserService(UserRepository(db))

    try:
        return await service.register(data)
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )
