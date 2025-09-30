# /routers/users.py

from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, or_

import services
from database import get_session
from models import User, Mission, MissionParticipant
from schemas import UserCreate, UserRead, MissionRead

router = APIRouter()

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def handle_create_user(user_in: UserCreate, session: Session = Depends(get_session)):
    """API endpoint to create a user by calling the service layer."""
    return services.create_user(session=session, user_in=user_in)

@router.get("/", response_model=List[UserRead])
def handle_list_users(session: Session = Depends(get_session)):
    """API endpoint to retrieve a list of all users."""
    users = session.exec(select(User)).all()
    return users

@router.get("/{user_id}", response_model=UserRead)
def handle_get_user(user_id: uuid.UUID, session: Session = Depends(get_session)):
    """API endpoint to retrieve a single user by their ID."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/{user_id}/missions/", response_model=List[MissionRead])
def handle_get_user_missions(user_id: uuid.UUID, session: Session = Depends(get_session)):
    """
    Retrieves a list of all missions a user is involved in (either created or participates in).
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

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