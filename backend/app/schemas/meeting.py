from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class MeetingBase(BaseModel):
    title: str
    agenda: Optional[str] = None
    date: date
    time: str
    duration: Optional[str] = "30m"
    participants: Optional[str] = None
    status: Optional[str] = "Scheduled"

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    agenda: Optional[str] = None
    date: Optional[date] = None
    time: Optional[str] = None
    duration: Optional[str] = None
    participants: Optional[str] = None
    status: Optional[str] = None
    transcript: Optional[str] = None
    action_items: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    owner_id: int
    transcript: Optional[str] = None
    action_items: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True