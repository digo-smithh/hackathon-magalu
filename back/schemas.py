# /schemas.py

import uuid
from datetime import datetime
from typing import List
from sqlmodel import SQLModel

# --- User Schemas ---
class UserBase(SQLModel):
    email: str
    username: str
    avatar: str | None = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID

# --- Task Schemas ---
class TaskBase(SQLModel):
    title: str
    description: str | None = None
    points: int
    deadline: datetime | None = None
    completed: bool = False
    isFinal: bool = False
    bossType: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: uuid.UUID
    createdAt: datetime

# --- Mission Schemas ---
class MissionBase(SQLModel):
    name: str
    description: str | None = None

class MissionCreate(MissionBase):
    createdById: uuid.UUID

class MissionRead(MissionBase):
    id: uuid.UUID
    createdById: uuid.UUID

# --- AI Planner Schemas ---
class AIPlannerRequest(SQLModel):
    prompt: str

class TaskSuggestion(SQLModel):
    title: str
    description: str
    points: int

class MissionWithTasksCreate(MissionCreate):
    tasks: List[TaskSuggestion]

# --- Participant Schemas ---
class ParticipantCreate(SQLModel):
    user_id: uuid.UUID

class MissionParticipantRead(SQLModel):
    mission_id: uuid.UUID
    user_id: uuid.UUID
    total_points: int

class MissionParticipantReadWithUser(MissionParticipantRead):
    user: UserRead

class MissionReadWithParticipants(MissionRead):
    participants: List[MissionParticipantReadWithUser] = []
    
# --- Token and Login Schemas ---
class Token(SQLModel):
    """Schema for the JWT access token response."""
    access_token: str
    token_type: str

class TokenData(SQLModel):
    """Schema for the data encoded within the JWT."""
    username: str | None = None

class LoginResponse(SQLModel):
    """Schema for the login response, including the token and user info."""
    access_token: str
    token_type: str
    user: UserRead