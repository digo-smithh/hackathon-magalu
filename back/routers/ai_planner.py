# /routers/ai_planner.py

from typing import List
from fastapi import APIRouter, HTTPException, status
import services
from schemas import AIPlannerRequest, TaskSuggestion

router = APIRouter()

@router.post("/plan-mission", response_model=List[TaskSuggestion])
def handle_plan_mission(request: AIPlannerRequest):
    """
    Receives a user prompt and uses the AI service to generate a list of task suggestions.
    """
    if not request.prompt or len(request.prompt) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must be at least 10 characters long."
        )
    return services.plan_mission_with_ai(prompt=request.prompt)