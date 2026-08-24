from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Learning Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database
    # Defaulting to Supabase PostgreSQL pattern. Use .env to override.
    DATABASE_URL: str = "postgresql+asyncpg://postgres.project_ref:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
    
    # JWT Auth
    SECRET_KEY: str = "SECRET_KEY_CHANGE_IN_PRODUCTION" # Use `openssl rand -hex 32` to generate
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Supabase Auth
    SUPABASE_URL: str = "https://YOUR_PROJECT.supabase.co"
    SUPABASE_SERVICE_KEY: str = "YOUR_SUPABASE_SERVICE_ROLE_KEY"
    SUPABASE_JWT_SECRET: str = "YOUR_SUPABASE_JWT_SECRET"
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")

settings = Settings()
