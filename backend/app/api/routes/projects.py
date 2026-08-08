from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class Project(BaseModel):
    id: int
    name: str
    description: str
    status: str
    progress: int
    tasks_done: int
    tasks_total: int
    due_date: str
    priority: str

# Mock data
mock_projects = [
    {
        "id": 1,
        "name": "Q2 Reporting Suite",
        "description": "Executive dashboards covering delivery velocity, meeting load and team capacity.",
        "status": "Completed",
        "progress": 100,
        "tasks_done": 30,
        "tasks_total": 30,
        "due_date": "Dec 20, 1969",
        "priority": "High"
    },
    {
        "id": 2,
        "name": "Design System 2.0",
        "description": "Token-driven theming, dark mode parity and accessible component variants.",
        "status": "Active",
        "progress": 82,
        "tasks_done": 21,
        "tasks_total": 26,
        "due_date": "Jan 5, 1970",
        "priority": "Medium"
    },
    {
        "id": 3,
        "name": "Meeting Intelligence Beta",
        "description": "Foundation work for converting structured, assignable execution plans.",
        "status": "Active",
        "progress": 41,
        "tasks_done": 13,
        "tasks_total": 31,
        "due_date": "Jan 10, 1970",
        "priority": "Urgent"
    }
]

@router.get("/", response_model=List[Project])
async def get_projects():
    return mock_projects

@router.get("/{project_id}")
async def get_project(project_id: int):
    project = next((p for p in mock_projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/")
async def create_project(project: Project):
    new_project = project.dict()
    new_project["id"] = len(mock_projects) + 1
    mock_projects.append(new_project)
    return new_project