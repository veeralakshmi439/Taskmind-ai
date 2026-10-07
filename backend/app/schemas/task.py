from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Todo"
    priority: Optional[str] = "Medium"
    labels: Optional[str] = None
    due_date: Optional[date] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    labels: Optional[str] = None
    due_date: Optional[date] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True