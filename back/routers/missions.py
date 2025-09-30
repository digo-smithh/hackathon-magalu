# /routers/missions.py

from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

import services
from database import get_session
from models import Mission, Task, MissionParticipant, User
from schemas import (
    MissionCreate, MissionRead, MissionReadWithParticipants,
    TaskCreate, TaskRead, MissionWithTasksCreate,
    ParticipantCreate, MissionParticipantRead, MissionParticipantReadWithUser
)

router = APIRouter()

@router.post("/with-tasks", response_model=MissionRead)
def handle_create_mission_with_tasks(
    mission_data: MissionWithTasksCreate, session: Session = Depends(get_session)
):
    """Creates a mission and its tasks together by calling the service layer."""
    return services.create_mission_with_tasks(session=session, mission_data=mission_data)

@router.post("/", response_model=MissionRead, status_code=status.HTTP_201_CREATED)
def handle_create_mission(mission_in: MissionCreate, session: Session = Depends(get_session)):
    """Creates a single mission without any tasks."""
    db_mission = Mission.model_validate(mission_in)
    session.add(db_mission)
    session.commit()
    session.refresh(db_mission)
    return db_mission

@router.get("/", response_model=List[MissionRead])
def handle_list_missions(session: Session = Depends(get_session)):
    """Retrieves a list of all missions."""
    missions = session.exec(select(Mission)).all()
    return missions

@router.get("/{mission_id}", response_model=MissionReadWithParticipants)
def handle_get_mission(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    """Retrieves a single mission by its ID, including its participants."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    return mission

@router.post("/{mission_id}/tasks/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def handle_create_task_for_mission(
    mission_id: uuid.UUID, task_in: TaskCreate, session: Session = Depends(get_session)
):
    """Adds a new task to an existing mission."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    
    db_task = Task.model_validate(task_in, update={"missionId": mission_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/{mission_id}/tasks/", response_model=List[TaskRead])
def handle_list_tasks_for_mission(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    """Retrieves all tasks associated with a specific mission."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    
    tasks = session.exec(select(Task).where(Task.missionId == mission_id)).all()
    return tasks

@router.post("/{mission_id}/participants", response_model=MissionParticipantRead, status_code=status.HTTP_201_CREATED)
def handle_add_participant_to_mission(
    mission_id: uuid.UUID, participant_in: ParticipantCreate, session: Session = Depends(get_session)
):
    """Adds a user as a participant to a mission."""
    if not session.get(Mission, mission_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    if not session.get(User, participant_in.user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    existing = session.get(MissionParticipant, (mission_id, participant_in.user_id))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already a participant")
    
    new_participant = MissionParticipant(mission_id=mission_id, user_id=participant_in.user_id)
    session.add(new_participant)
    session.commit()
    session.refresh(new_participant)
    return new_participant

@router.get("/{mission_id}/leaderboard", response_model=List[MissionParticipantReadWithUser])
def handle_get_mission_leaderboard(mission_id: uuid.UUID, session: Session = Depends(get_session)):
    """Gets the leaderboard for a mission, sorted by points."""
    statement = select(MissionParticipant).where(MissionParticipant.mission_id == mission_id).order_by(MissionParticipant.total_points.desc())
    participants = session.exec(statement).all()
    if not participants and not session.get(Mission, mission_id):
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")
    return participants