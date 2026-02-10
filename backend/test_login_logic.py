import asyncio
from database import init_db
from models import User
from auth import verify_password, create_access_token
from datetime import timedelta

async def test_login():
    try:
        await init_db()
        email = "test@example.com"
        password = "password123"
        
        user = await User.find_one(User.email == email)
        if not user:
            print(f"User {email} not found. Run seed_user.py first.")
            return

        print(f"Found user: {user.email}")
        print(f"Stored Hash: {user.password_hash}")
        
        is_valid = verify_password(password, user.password_hash)
        print(f"Password Valid: {is_valid}")
        
        if is_valid:
            token = create_access_token(data={"sub": user.email})
            print(f"Token Generated: {token[:20]}...")
            
    except Exception as e:
        print(f"Login Logic Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_login())
