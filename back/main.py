# main.py

import os
import uuid
import json
from datetime import datetime
from typing import List, Optional

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from sqlmodel import (Field, Relationship, Session, SQLModel, create_engine,
                      select)
from sqlmodel import or_


# --- 1. AI Planner Service ---

# Load environment variables from the .env file
load_dotenv()

# Configure the Gemini API client
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except TypeError:
    print("ERROR: GOOGLE_API_KEY environment variable not set. The AI planner will not work.")

# The detailed instruction prompt for the AI
SYSTEM_PROMPT = """
You are an expert project planner. Your task is to transform a user's natural language request into a structured JSON array of tasks.

The user will provide a goal, and you must break it down into a list of actionable tasks.

RULES:
1. The output MUST be a valid JSON array (`[]`).
2. Each object in the array must contain exactly three keys: "title" (a concise string), "description" (a detailed string), and "points" (an integer between 5 and 50, reflecting the task's complexity).
3. Do NOT output anything other than the raw JSON. No introductory text, no explanations, no markdown code fences like ```json.
4. If the user's request is ambiguous, nonsensical, or unethical, return an empty JSON array (`[]`).

EXAMPLE:
User's Request: "Plan a surprise birthday party for my friend Sarah."
Your Output:
[
  {
    "title": "Set a Budget",
    "description": "Determine the total budget for the party, including venue, food, decorations, and entertainment.",
    "points": 15
  },
  {
    "title": "Create Guest List",
    "description": "Compile a list of all friends and family to invite. Get contact information for everyone.",
    "points": 10
  }
]
"""

def generate_tasks_from_prompt(user_prompt: str) -> list:
    """Calls the Gemini API to generate tasks and safely parses the JSON response."""
    if not os.getenv("GOOGLE_API_KEY"):
        raise HTTPException(status_code=500, detail="Google API Key is not configured on the server.")
        
    try:
        model = genai.GenerativeModel('gemini-pro')
        full_prompt = f"{SYSTEM_PROMPT}\nUser's Request: \"{user_prompt}\"\nYour Output:"
        response = model.generate_content(full_prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        tasks = json.loads(cleaned_response)
        if not isinstance(tasks, list):
            return []
        return tasks
    except json.JSONDecodeError:
        print("AI returned a non-JSON response.")
        return []
    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        raise HTTPException(status_code=503, detail="The AI service is currently unavailable.")

# --- 2. Database Configuration ---

DATABASE_FILE = "questtasks.db"
engine = create_engine(f"sqlite:///{DATABASE_FILE}", echo=False, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# --- 3. Model Definitions ---

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    avatar: Optional[str] = None

class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    password: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = True
    updatedAt: datetime = Field(default_factory=datetime.utcnow) 
    createdMissions: List["Mission"] = Relationship(back_populates="createdBy")
    participations: List["MissionParticipant"] = Relationship(back_populates="user")

class MissionBase(SQLModel):
    name: str
    description: Optional[str] = None
    status: str = "active"

class Mission(MissionBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    createdById: uuid.UUID = Field(foreign_key="user.id")
    createdBy: User = Relationship(back_populates="createdMissions")
    
    tasks: List["Task"] = Relationship(back_populates="mission")
    participants: List["MissionParticipant"] = Relationship(back_populates="mission")

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    points: int = Field(gt=0)

class Task(TaskBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    missionId: uuid.UUID = Field(foreign_key="mission.id")
    mission: Mission = Relationship(back_populates="tasks")

class MissionParticipant(SQLModel, table=True):
    mission_id: uuid.UUID = Field(foreign_key="mission.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    total_points: int = 0
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"

    mission: "Mission" = Relationship(back_populates="participants")
    user: "User" = Relationship(back_populates="participations")

# --- 4. Schemas for API I/O (Create/Read) ---

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID

class MissionCreate(MissionBase):
    createdById: uuid.UUID

class MissionRead(MissionBase):
    id: uuid.UUID
    createdById: uuid.UUID

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: uuid.UUID

class ParticipantCreate(SQLModel):
    user_id: uuid.UUID

class MissionParticipantRead(SQLModel):
    mission_id: uuid.UUID
    user_id: uuid.UUID
    total_points: int
    joined_at: datetime
    
class MissionParticipantReadWithUser(MissionParticipantRead):
    user: UserRead

class MissionReadWithParticipants(MissionRead):
    participants: List[MissionParticipantReadWithUser] = []

class AIPlannerRequest(SQLModel):
    prompt: str

class TaskSuggestion(SQLModel):
    title: str
    description: str
    points: int

# --- 5. FastAPI App and DB Session ---

app = FastAPI(title="QuestTasks API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    with Session(engine) as session:
        yield session

# --- 6. API Endpoints ---

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to QuestTasks API"}

# AI Planner Endpoint
@app.post("/missions/plan-with-ai", response_model=List[TaskSuggestion], tags=["AI Planner"])
def plan_mission_with_ai(request: AIPlannerRequest):
    if not request.prompt or len(request.prompt) < 10:
        raise HTTPException(status_code=400, detail="Prompt must be at least 10 characters long.")
    suggested_tasks = generate_tasks_from_prompt(request.prompt)
    return suggested_tasks

# User Endpoints
@app.post("/users/", response_model=UserRead, status_code=status.HTTP_201_CREATED, tags=["Users"])
def create_user(user_in: UserCreate, session: Session = Depends(get_session)):
    db_user = User.model_validate(user_in)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[UserRead], tags=["Users"])
def list_users(session: Session = Depends(get_session)):
    """
    Retrieves a list of all users.
    """
    users = session.exec(select(User)).all()
    return users

@app.get("/users/{user_id}", response_model=UserRead, tags=["Users"])
def get_user(user_id: uuid.UUID, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/{user_id}/missions/", response_model=List[MissionRead], tags=["Users"])
def get_user_missions(user_id: uuid.UUID, session: Session = Depends(get_session)):
    """
    Retrieves a list of all missions a user is involved in (either created or participates in).
    """
    # First, ensure the user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # This query finds missions where the user is the creator OR a participant
    statement = (
        select(Mission)
        .join(MissionParticipant, Mission.id == MissionParticipant.mission_id, isouter=True)
        .where(
            or_(
                Mission.createdById == user_id,
                MissionParticipant.user_id == user_id
            )
        )
        .distinct()
    )
    
    missions = session.exec(statement).all()
    return missions

# Mission Endpoints
@app.post("/missions/", response_model=MissionRead, status_code=status.HTTP_201_CREATED, tags=["Missions"])
def create_mission(mission_in: MissionCreate, session: Session = Depends(get_session)):
    db_mission = Mission.model_validate(mission_in)
    session.add(db_mission)
    session.commit()
    session.refresh(db_mission)
    return db_mission

@app.get("/missions/", response_model=List[MissionRead], tags=["Missions"])
def list_missions(session: Session = Depends(get_session)):
    """
    Retrieves a list of all missions.
    """
    missions = session.exec(select(Mission)).all()
    return missions

@app.get("/missions/{mission_id}", response_model=MissionReadWithParticipants, tags=["Missions"])
def get_mission(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@app.post("/missions/{mission_id}/participants", response_model=MissionParticipantRead, status_code=status.HTTP_201_CREATED, tags=["Missions"])
def add_participant_to_mission(mission_id: uuid.UUID, participant_in: ParticipantCreate, session: Session = Depends(get_session)):
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    user = session.get(User, participant_in.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing_participant = session.get(MissionParticipant, (mission_id, participant_in.user_id))
    if existing_participant:
        raise HTTPException(status_code=400, detail="User is already a participant in this mission")
    
    new_participant = MissionParticipant(mission_id=mission_id, user_id=participant_in.user_id)
    session.add(new_participant)
    session.commit()
    session.refresh(new_participant)
    return new_participant

@app.get("/missions/{mission_id}/leaderboard", response_model=List[MissionParticipantReadWithUser], tags=["Missions"])
def get_mission_leaderboard(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    statement = select(MissionParticipant).where(MissionParticipant.mission_id == mission_id).order_by(MissionParticipant.total_points.desc())
    participants = session.exec(statement).all()
    if not participants:
        mission = session.get(Mission, mission_id)
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
    return participants

# Task Endpoints
@app.post("/missions/{mission_id}/tasks/", response_model=TaskRead, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task_for_mission(mission_id: uuid.UUID, task_in: TaskCreate, session: Session = Depends(get_session)):
    db_task = Task.model_validate(task_in, update={"missionId": mission_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/missions/{mission_id}/tasks/", response_model=List[TaskRead], tags=["Tasks"])
def list_tasks_for_mission(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    """
    Retrieves a list of all tasks for a specific mission.
    """
    # First, check if the mission exists
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # Query for the tasks related to that mission
    tasks = session.exec(select(Task).where(Task.missionId == mission_id)).all()
    return tasks
