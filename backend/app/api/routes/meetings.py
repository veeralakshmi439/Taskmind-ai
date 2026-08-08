from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Comment out the meeting service import for now
# from app.services.meeting_service import MeetingService
# meeting_service = MeetingService()

class Meeting(BaseModel):
    id: int
    title: str
    agenda: str
    date: str
    time: str
    duration: str
    participants: List[str]
    transcript: str = ""
    action_items: List[str] = []

# Mock data storage
mock_meetings = [
    {
        "id": 1,
        "title": "Quarterly delivery review",
        "agenda": "velocity trends, meeting load and capacity planning",
        "date": "Jan 10, 1970",
        "time": "09:30 PM",
        "duration": "1h 30m",
        "participants": ["Ava", "Noah", "Priya"],
        "transcript": "",
        "action_items": []
    }
]

@router.get("/")
async def get_meetings():
    return mock_meetings

@router.post("/")
async def create_meeting(meeting: Meeting):
    meeting_dict = meeting.dict()
    meeting_dict["id"] = len(mock_meetings) + 1
    mock_meetings.append(meeting_dict)
    return meeting_dict

@router.post("/upload-audio")
async def upload_meeting_audio(file: UploadFile = File(...)):
    """
    Upload meeting audio for automatic transcription and scheduling
    """
    # For now, return a mock response
    return {
        "message": "Audio upload received. AI features coming soon!",
        "filename": file.filename,
        "meeting_id": len(mock_meetings) + 1,
        "title": "Meeting from audio",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M"),
        "participants": []
    }