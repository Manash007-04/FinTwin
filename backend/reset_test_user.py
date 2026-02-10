"""Reset the test user's password so mobile login works."""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

async def reset_password():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["fintwin_db"]
    
    new_password = "Test1234"
    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    result = await db.users.update_one(
        {"email": "test@example.com"},
        {"$set": {"password_hash": hashed}}
    )
    
    if result.modified_count > 0:
        print(f"Password reset for test@example.com -> Test1234")
    else:
        # User doesn't exist, create one
        await db.users.insert_one({
            "username": "test",
            "email": "test@example.com",
            "password_hash": hashed
        })
        print(f"Created user test@example.com with password Test1234")
    
    client.close()

asyncio.run(reset_password())
