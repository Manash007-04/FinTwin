import requests
import json

BASE_URL = "http://localhost:8001/api"

def test_flow():
    # 1. Login
    print("Testing Login...")
    login_data = {
        "username": "debug@test.com",
        "password": "Password123"
    }
    # OAuth2PasswordRequestForm expects form-data
    res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.content.decode()}")
    
    if res.status_code != 200:
        return

    token = res.json().get("access_token")

    # 2. Chat
    print("\nTesting Chat...")
    chat_payload = {
        "message": "Hello, how much did I spend on food?",
        "healthScore": 75
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    res = requests.post(f"{BASE_URL}/chat", json=chat_payload, headers=headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.content.decode()}")

if __name__ == "__main__":
    test_flow()
