import asyncio
from database import init_db
from models import User

async def list_users():
    await init_db()
    users = await User.find_all().to_list()
    print(f"\n--- Found {len(users)} Users ---")
    for u in users:
        print(f"ID: {u.id} | Username: {u.username} | Email: {u.email}")
        # Note: We do NOT print passwords because they are hashed (bcrypt).
        # You cannot retrieve the original password, only verify a candidate.
        print(f"Hash: {u.password_hash[:20]}...")
    print("--------------------------\n")

if __name__ == "__main__":
    asyncio.run(list_users())
