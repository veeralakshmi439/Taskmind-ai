from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "Planning"
    priority: Optional[str] = "Medium"
    due_date: Optional[date] = None
    progress: Optional[int] = 0
    tasks_done: Optional[int] = 0
    tasks_total: Optional[int] = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True