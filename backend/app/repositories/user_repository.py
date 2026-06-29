from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, **kwargs) -> User:
        user = User(**kwargs)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def save(self, user: User) -> User:
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_by_id(self, user_id: UUID) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_by_google(self, google_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.google_id == google_id)
        )
        return result.scalar_one_or_none()

    async def get_by_apple(self, apple_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.apple_id == apple_id)
        )
        return result.scalar_one_or_none()

    async def get_by_telegram(self, telegram_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[User]:
        result = await self.db.execute(select(User))
        return list(result.scalars().all())

    async def exists(self, email: str) -> bool:
        return await self.get_by_email(email) is not None

    async def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            setattr(user, key, value)

        return await self.save(user)

    async def delete(self, user: User) -> None:
        await self.db.delete(user)
        await self.db.commit()
