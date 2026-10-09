from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "AMMAI Cinema Platform API"
    API_V1_STR: str = "/api"
    
    # JWT & Security
    SECRET_KEY: str = "ammai-super-secret-key-change-in-production"
    JWT_SECRET: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # MongoDB
    MONGODB_URI: str = "mongodb+srv://reddymca16082003_db_user:g9tabKeMqhlXAvJX@cluster0.tug0d5t.mongodb.net/Ammai_website?retryWrites=true&w=majority"
    MONGODB_URL: Optional[str] = None
    MONGODB_DB_NAME: str = "Ammai_website"
    DATABASE_URL: Optional[str] = "file:../db/custom.db"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = "dzcss22tm"
    CLOUDINARY_API_KEY: str = "861726572422394"
    CLOUDINARY_API_SECRET: str = "cer9RzDFXFIw_OT0JWHxkTOTpNc"

    # Groq AI Service
    GROQ_API_KEY: str = "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"
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:80",
        "https://ammai.in",
        "http://ammai.in",
        "https://www.ammai.in",
        "http://www.ammai.in"
    ]

    # Seed Admin
    INITIAL_ADMIN_EMAIL: str = "admin@ammai.in"
    INITIAL_ADMIN_PASSWORD: str = "Admin@1234"
    INITIAL_ADMIN_NAME: str = "Ammai Administrator"

    @model_validator(mode="after")
    def assemble_overrides(self):
        if self.JWT_SECRET:
            self.SECRET_KEY = self.JWT_SECRET
        if self.MONGODB_URL:
            self.MONGODB_URI = self.MONGODB_URL
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
