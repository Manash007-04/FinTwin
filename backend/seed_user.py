import asyncio
from database import init_db
from models import User
from routers.auth import get_password_hash

async def seed():
    await init_db()
    
    email = "test@example.com"
    password = "password123"
    
    # Check if user exists
    user = await User.find_one(User.email == email)
    if user:
        print(f"User {email} already exists.")
        # Optional: reset password if needed, but for now just inform
    else:
        hashed = get_password_hash(password)
        new_user = User(
            username="TestUser",
            email=email,
            password_hash=hashed
        )
        await new_user.insert()
        print("\n--------------------------------------------------")
        print("✅ USER CREATED SUCCESSFULLY")
        print(f"Email:    {email}")
        print(f"Password: {password}")
        print("--------------------------------------------------\n")

if __name__ == "__main__":
    asyncio.run(seed())
