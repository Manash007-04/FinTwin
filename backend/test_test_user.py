import requests
BASE_URL = "http://localhost:8001/api/auth/login"
def test_test_user():
    data = {"username": "test@example.com", "password": "Test1234"}
    res = requests.post(BASE_URL, data=data)
    print(f"Login test@example.com: {res.status_code}")
    print(f"Response: {res.text}")

if __name__ == "__main__":
    test_test_user()
