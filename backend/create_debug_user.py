"""Create a fresh debug user with known credentials."""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

async def create_debug_user():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["fintwin_db"]
    
    email = "debug@test.com"
    password = "Password123"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    await db.users.delete_one({"email": email})
    await db.users.insert_one({
        "username": "debug",
        "email": email,
        "password_hash": hashed
    })
    print(f"Created debug user: {email} / {password}")
    client.close()

asyncio.run(create_debug_user())
