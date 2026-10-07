from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate, MeetingUpdate, MeetingResponse
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

# ============ CREATE MEETING ============
@router.post("/", response_model=MeetingResponse)
async def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_meeting = Meeting(**meeting.dict(), owner_id=current_user.id)
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

# ============ GET ALL MEETINGS ============
@router.get("/", response_model=List[MeetingResponse])
async def get_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meetings = db.query(Meeting).filter(
        Meeting.owner_id == current_user.id
    ).order_by(Meeting.date.desc()).all()
    return meetings

# ============ GET SINGLE MEETING ============
@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

# ============ UPDATE MEETING ============
@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: int,
    meeting_update: MeetingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    for key, value in meeting_update.dict(exclude_unset=True).items():
        setattr(meeting, key, value)

    db.commit()
    db.refresh(meeting)
    return meeting

# ============ DELETE MEETING ============
@router.delete("/{meeting_id}")
async def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    db.delete(meeting)
    db.commit()
    return {"message": "Meeting deleted successfully"}

# ============ UPLOAD AUDIO (Mock for now) ============
@router.post("/upload-audio")
async def upload_meeting_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "Audio upload received. AI features coming soon!",
        "filename": file.filename,
        "title": "Meeting from audio",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M"),
        "participants": []
    }