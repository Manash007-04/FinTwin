from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Simple settings class (replacing pydantic-settings for MVP simplicity if needed, but sticking to plan)
class Settings:
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "fintwin_db")

settings = Settings()

from models import User, Transaction

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DB_NAME], document_models=[User, Transaction])
    print(f"Database initialized: {settings.DB_NAME}")
