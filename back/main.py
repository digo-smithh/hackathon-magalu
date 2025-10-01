# /main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routers import users, missions, ai_planner, auth

app = FastAPI(title="QuestTasks API")

# --- Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://201.23.71.157:3000/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Startup Event ---
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- API Routers ---
app.include_router(auth.router, prefix="/auth", tags=["Authentication"]) 
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(missions.router, prefix="/missions", tags=["Missions"])
app.include_router(ai_planner.router, prefix="/ai", tags=["AI Planner"])

# --- Root Endpoint ---
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to QuestTasks API"}
