from uuid import UUID

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(self, data: UserCreate) -> User:
        if data.email:
            exists = await self.repository.exists(data.email)
            if exists:
                raise ValueError("User already exists")

        return await self.repository.create(
            email=data.email,
            apple_id=data.apple_id,
            google_id=data.google_id,
            telegram_id=data.telegram_id,
            display_name=data.display_name,
            avatar=data.avatar,
        )

    async def get(self, user_id: UUID) -> User | None:
        return await self.repository.get_by_id(user_id)

    async def list(self) -> list[User]:
        return await self.repository.list()

    async def delete(self, user_id: UUID) -> bool:
        user = await self.repository.get_by_id(user_id)

        if user is None:
            return False

        await self.repository.delete(user)
        return True
