# /routers/auth.py
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

import services
from config import settings
from database import get_session
from schemas import LoginResponse, UserRead # Import LoginResponse and UserRead
from security import create_access_token

router = APIRouter()

@router.post("/login", response_model=LoginResponse) # Update the response_model
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session)
):
    """
    Provides a JWT token and user info for valid user credentials.
    """
    user = services.authenticate_user(
        session=session, username=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # Return the new response object, including the user
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user  # Add the user object here
    }