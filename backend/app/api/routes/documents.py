from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Document(BaseModel):
    id: int
    name: str
    date: str
    description: str
    category: str
    size: str
    owner: str

# Mock data
mock_documents = [
    {
        "id": 1,
        "name": "Atlas routing contract.md",
        "date": "Dec 30, 1969",
        "description": "Nested layout rules, route naming conventions",
        "category": "Specs",
        "size": "42 KB",
        "owner": "Noah Bishop"
    },
    {
        "id": 2,
        "name": "Design tokens v2.sheet",
        "date": "Dec 31, 1969",
        "description": "Preview rendering arrives with real file storage",
        "category": "Design",
        "size": "1.2 MB",
        "owner": "Diego Salas"
    }
]

@router.get("/")
async def get_documents():
    return mock_documents

@router.get("/{category}")
async def get_documents_by_category(category: str):
    filtered = [d for d in mock_documents if d["category"].lower() == category.lower()]
    return filtered