# /config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./questtasks.db")
    GOOGLE_API_KEY: str | None = os.getenv("GOOGLE_API_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "a_very_secret_default_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()