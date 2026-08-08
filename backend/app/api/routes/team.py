from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter()

class TeamMember(BaseModel):
    initials: str
    name: str
    role: str
    email: str
    tasks: int
    contribution: int

# Mock data
mock_team = [
    {"initials": "AM", "name": "Ava Mercer", "role": "Product Lead", "email": "ava@taskmind.ai", "tasks": 12, "contribution": 24},
    {"initials": "NB", "name": "Noah Bishop", "role": "Engineering Manager", "email": "noah@taskmind.ai", "tasks": 9, "contribution": 19},
    {"initials": "PR", "name": "Priya Raman", "role": "Senior Engineer", "email": "priya@taskmind.ai", "tasks": 14, "contribution": 22},
    {"initials": "DS", "name": "Diego Salas", "role": "Design Lead", "email": "diego@taskmind.ai", "tasks": 7, "contribution": 16},
    {"initials": "MT", "name": "Mei Tanaka", "role": "Data Analyst", "email": "mei@taskmind.ai", "tasks": 6, "contribution": 11},
    {"initials": "LO", "name": "Liam Okafor", "role": "QA Engineer", "email": "liam@taskmind.ai", "tasks": 5, "contribution": 8},
]

@router.get("/")
async def get_team():
    return mock_team

@router.get("/{email}")
async def get_member(email: str):
    member = next((m for m in mock_team if m["email"] == email), None)
    return member or {"error": "Member not found"}