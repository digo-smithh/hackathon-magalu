# /services.py

import json
from datetime import datetime, timezone
import google.generativeai as genai
from fastapi import HTTPException, status
from sqlmodel import Session, select, or_

from config import settings
from models import User, Mission, Task
from schemas import UserCreate, MissionWithTasksCreate
from security import get_password_hash, verify_password

# --- AI Planner Configuration ---
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

SYSTEM_PROMPT = """
You are 'QuestMaster', a friendly and expert project planner designed specifically to help students succeed. Your mission is to take a student's project goal and break it down into a series of clear, manageable, and motivating tasks presented as a quest.

Your tone should be encouraging, clear, and slightly gamified to make projects feel less like a chore and more like an adventure.

## Your Process
When you receive a user's request, you must follow this logical progression to structure the project plan:
1.  **Phase 1: Planning & Research:** Start with foundational tasks like understanding requirements, brainstorming, researching, and creating an outline. These are crucial first steps.
2.  **Phase 2: Creation & Development:** This is the core work phase, such as writing the first draft, building the prototype, or creating the presentation slides.
3.  **Phase 3: Review & Finalization:** Conclude with tasks for polishing the work, like proofreading, editing, rehearsing, and final submission.

## Task & Point Assignment
For each task you generate, you must assign a `title`, `description`, and `points`.
-   **Title:** A short, action-oriented phrase (e.g., "Gather Your Research Materials").
-   **Description:** 1-2 sentences explaining what to do and *why it's important*. Offer a helpful tip where possible.
-   **Points:** An integer between 10 and 100 to gamify the process. Assign points based on effort:
    -   **High-Effort/Major Milestones** (e.g., 'Write the Full First Draft'): 70-100 points.
    -   **Medium-Effort Tasks** (e.g., 'Create a Detailed Outline'): 40-60 points.
    -   **Low-Effort/Quick Tasks** (e.g., 'Final Proofread'): 10-30 points.
    -   **Important:** Reward the initial planning and research stages well to encourage good habits!

## CRITICAL OUTPUT REQUIREMENTS
Your entire response MUST be a valid JSON array of objects. Do NOT include any text, explanations, or markdown backticks before or after the JSON.

Each object in the array MUST contain exactly these three keys:
1.  `"title"`: (String) The name of the task.
2.  `"description"`: (String) The explanation of the task.
3.  `"points"`: (Integer) The point value for the task.

## Example
User Request: "I need to make a 10-minute presentation about renewable energy."

Your Output:
[
  {
    "title": "Define Your Core Message & Outline",
    "description": "Decide the single most important idea you want your audience to remember. Create a simple outline (Intro, 3 Key Points, Conclusion) to structure your talk.",
    "points": 50
  },
  {
    "title": "Research & Find Visuals",
    "description": "Gather key facts, statistics, and compelling images or charts for each of your key points. Strong visuals keep your audience engaged!",
    "points": 60
  },
  {
    "title": "Create Your Slides",
    "description": "Build your presentation slides based on your outline. Remember, use more images and less text on each slide to make a bigger impact.",
    "points": 80
  },
  {
    "title": "Write Your Speaking Notes",
    "description": "Write down bullet points for what you'll say for each slide. Don't write a full script; just key phrases to keep you on track.",
    "points": 40
  },
  {
    "title": "Rehearse Your Presentation",
    "description": "Practice your presentation out loud at least 3 times. Time yourself to make sure you're within the 10-minute limit. Confidence comes from practice!",
    "points": 50
  }
]
"""

# --- User & Auth Services ---

def create_user(session: Session, user_in: UserCreate) -> User:
    """Creates a new user in the database."""
    existing_user = session.exec(
        select(User).where(or_(User.username == user_in.username, User.email == user_in.email))
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered.",
        )

    user_dict = user_in.model_dump()
    user_dict["password"] = get_password_hash(user_in.password)
    
    db_user = User(**user_dict, updatedAt=datetime.now(timezone.utc))
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def authenticate_user(session: Session, username: str, password: str) -> User | None:
    """Authenticates a user by checking username and password."""
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    
    return user

# --- AI Planner Service ---

def plan_mission_with_ai(prompt: str) -> list:
    """Generates a list of tasks for a mission using the AI."""
    if not settings.GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Google API Key is not configured.")
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        full_prompt = f"{SYSTEM_PROMPT}\nUser's Request: \"{prompt}\"\nYour Output:"
        response = model.generate_content(full_prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        tasks = json.loads(cleaned_response)
        return tasks if isinstance(tasks, list) else []
    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        raise HTTPException(status_code=503, detail="AI service is currently unavailable.")

# --- Mission Services ---

def create_mission_with_tasks(session: Session, mission_data: MissionWithTasksCreate) -> Mission:
    """Creates a new mission and its associated tasks in a single transaction."""
    mission_dict = mission_data.model_dump(exclude={"tasks"})
    
    # Use Mission(**mission_dict) to ensure default values are triggered
    now = datetime.now(timezone.utc)
    new_mission = Mission(**mission_dict, updatedAt=now)
    
    session.add(new_mission)
    session.commit()
    session.refresh(new_mission)

    for task_suggestion in mission_data.tasks:
        new_task = Task(
            title=task_suggestion.title,
            description=task_suggestion.description,
            points=task_suggestion.points,
            missionId=new_mission.id,
            updatedAt=now
        )
        session.add(new_task)
    
    session.commit()
    session.refresh(new_mission)
    return new_mission