from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(chat.router)