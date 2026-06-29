from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.users import router as users_router
from app.api.v1.health import router as health_router
from app.api.v1.trial import router as trial_router
from app.core.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем все роутеры ПОСЛЕ создания FastAPI
app.include_router(users_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")
app.include_router(trial_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "api": "/api/v1",
    }
