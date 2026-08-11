import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    JWT_SECRET: str = "super_secret_jwt_signing_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = "sqlite:///./bloomora.db"
    
    SPOTIFY_CLIENT_ID: Optional[str] = ""
    SPOTIFY_CLIENT_SECRET: Optional[str] = ""

    # Load from .env file at the workspace root
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
