# /models.py

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    password: str
    avatar: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    isActive: bool = Field(default=True)
    
    createdMissions: List["Mission"] = Relationship(back_populates="createdBy")
    participations: List["MissionParticipant"] = Relationship(back_populates="user")

class Mission(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: Optional[str] = None
    status: str = "active"
    # CORRIGIDO: O campo da chave estrangeira foi renomeado para "createdById"
    createdById: uuid.UUID = Field(foreign_key="user.id")
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    isActive: bool = Field(default=True)

    # Esta é a propriedade que estabelece o relacionamento de volta para o User
    createdBy: User = Relationship(back_populates="createdMissions")
    tasks: List["Task"] = Relationship(back_populates="mission")
    participants: List["MissionParticipant"] = Relationship(back_populates="mission")

class Task(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    description: Optional[str] = None
    points: int = Field(gt=0)
    missionId: uuid.UUID = Field(foreign_key="mission.id")
    deadline: Optional[datetime] = None
    completed: bool = Field(default=False)
    isFinal: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    bossType: Optional[str] = None
    bossName: Optional[str] = None

    mission: Mission = Relationship(back_populates="tasks")

class MissionParticipant(SQLModel, table=True):
    mission_id: uuid.UUID = Field(foreign_key="mission.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    total_points: int = 0
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    mission: "Mission" = Relationship(back_populates="participants")
    user: "User" = Relationship(back_populates="participations")