# /config.py
import os
from dotenv import load_dotenv

load_dotenv()

# We can use a simple class or just variables for a simpler setup
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./questtasks.db")
    GOOGLE_API_KEY: str | None = os.getenv("GOOGLE_API_KEY")

settings = Settings()