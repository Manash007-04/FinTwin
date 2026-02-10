from fastapi import FastAPI
from contextlib import asynccontextmanager

from database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("Startup: Database connection initialized.")
    yield
    print("Shutdown: Cleanup.")

from fastapi.middleware.cors import CORSMiddleware
from routers import chat, auth

app = FastAPI(title="FinTwin API", lifespan=lifespan)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev (fixes localhost vs 127.0.0.1 issues)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "FinTwin API is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "disconnected (placeholder)"}
