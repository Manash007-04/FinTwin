from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class User(Document):
    username: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)
    # Financial DNA
    avatar_style: str = "default"
    currency: str = "USD"
    
    class Settings:
        name = "users"

class Transaction(Document):
    user_id: str # Link to User.id
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime = Field(default_factory=datetime.now)
    is_recurring: bool = False
    
    class Settings:
        name = "transactions"
