from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Task(BaseModel):
    id: int
    title: str
    description: str
    status: str
    labels: List[str]

# Mock data
mock_tasks = {
    "backlog": [
        {"id": 1, "title": "Onboarding checklist", "description": "Write the six first-run steps", "status": "backlog", "labels": ["copy"]},
    ],
    "todo": [
        {"id": 2, "title": "Action item extraction", "description": "Draft the JSON contract", "status": "todo", "labels": ["schema"]},
    ],
    "in-progress": [
        {"id": 3, "title": "Sidebar collapse", "description": "Icon-rail state with keyboard shortcut", "status": "in-progress", "labels": ["ui"]},
    ],
    "review": [
        {"id": 4, "title": "Dark mode token audit", "description": "Check contract ratios", "status": "review", "labels": ["design"]},
    ],
    "done": [
        {"id": 5, "title": "Define routing contract", "description": "Document nested layout rules", "status": "done", "labels": ["architecture"]},
    ],
}

@router.get("/")
async def get_tasks():
    return mock_tasks

@router.post("/")
async def create_task(task: Task):
    tasks_list = mock_tasks.get(task.status, [])
    new_task = task.dict()
    new_task["id"] = len(tasks_list) + 1
    tasks_list.append(new_task)
    mock_tasks[task.status] = tasks_list
    return new_task