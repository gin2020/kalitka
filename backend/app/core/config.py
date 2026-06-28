from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Kalitka API"
    VERSION: str = "0.1.0"

    XUI_SUBSCRIPTION_BASE: str 
    XUI_BASE_URL: str
    XUI_API_TOKEN: str
    XUI_DEFAULT_INBOUND_ID: int

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
