from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.subscription_repository import SubscriptionRepository
from app.repositories.user_repository import UserRepository
from app.services.subscription_service import SubscriptionService
from app.services.user_service import UserService


def get_user_service(
    db: AsyncSession = Depends(get_db),
) -> UserService:
    repository = UserRepository(db)
    return UserService(repository)


def get_subscription_service(
    db: AsyncSession = Depends(get_db),
) -> SubscriptionService:
    repository = SubscriptionRepository(db)
    return SubscriptionService(repository)
