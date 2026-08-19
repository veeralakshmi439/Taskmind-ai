from datetime import datetime

from sqlalchemy.orm import Session

from app.models import (
    User,
    Meeting,
    MeetingTranscript,
    MeetingSummary,
    MeetingActionItem,
)


# =========================================================
# USER CRUD
# =========================================================

def create_user(
    db: Session,
    email: str,
    full_name: str,
    hashed_password: str = "",
    role: str = "Member",
):
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user(db: Session, user_id: int):
    return (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )


def get_user_by_email(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_users(db: Session):
    return db.query(User).all()


def update_user(
    db: Session,
    user_id: int,
    email: str | None = None,
    full_name: str | None = None,
    role: str | None = None,
):
    user = get_user(db, user_id)

    if user is None:
        return None

    if email is not None:
        user.email = email

    if full_name is not None:
        user.full_name = full_name

    if role is not None:
        user.role = role

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)

    if user is None:
        return None

    db.delete(user)
    db.commit()

    return user


# =========================================================
# MEETING CRUD
# =========================================================

def create_meeting(
    db: Session,
    title: str,
    agenda: str | None = None,
    meeting_date: datetime | None = None,
    meeting_time: str | None = None,
    duration: str | None = None,
    transcript: str | None = None,
):
    meeting = Meeting(
        title=title,
        agenda=agenda,
        meeting_date=meeting_date,
        meeting_time=meeting_time,
        duration=duration,
        transcript=transcript,
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


def get_meeting(db: Session, meeting_id: int):
    return (
        db.query(Meeting)
        .filter(Meeting.meeting_id == meeting_id)
        .first()
    )


def get_meetings(db: Session):
    return db.query(Meeting).all()


def update_meeting(
    db: Session,
    meeting_id: int,
    title: str | None = None,
    agenda: str | None = None,
    meeting_date: datetime | None = None,
    meeting_time: str | None = None,
    duration: str | None = None,
    transcript: str | None = None,
):
    meeting = get_meeting(db, meeting_id)

    if meeting is None:
        return None

    if title is not None:
        meeting.title = title

    if agenda is not None:
        meeting.agenda = agenda

    if meeting_date is not None:
        meeting.meeting_date = meeting_date

    if meeting_time is not None:
        meeting.meeting_time = meeting_time

    if duration is not None:
        meeting.duration = duration

    if transcript is not None:
        meeting.transcript = transcript

    db.commit()
    db.refresh(meeting)

    return meeting


def delete_meeting(db: Session, meeting_id: int):
    meeting = get_meeting(db, meeting_id)

    if meeting is None:
        return None

    db.delete(meeting)
    db.commit()

    return meeting


# =========================================================
# MEETING TRANSCRIPT CRUD
# =========================================================

def create_transcript(
    db: Session,
    meeting_id: int,
    transcript_text: str,
):
    transcript = MeetingTranscript(
        meeting_id=meeting_id,
        transcript_text=transcript_text,
    )

    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return transcript


def get_transcript(db: Session, transcript_id: int):
    return (
        db.query(MeetingTranscript)
        .filter(
            MeetingTranscript.transcript_id == transcript_id
        )
        .first()
    )


def get_transcripts_by_meeting(
    db: Session,
    meeting_id: int,
):
    return (
        db.query(MeetingTranscript)
        .filter(
            MeetingTranscript.meeting_id == meeting_id
        )
        .all()
    )


def update_transcript(
    db: Session,
    transcript_id: int,
    transcript_text: str,
):
    transcript = get_transcript(db, transcript_id)

    if transcript is None:
        return None

    transcript.transcript_text = transcript_text

    db.commit()
    db.refresh(transcript)

    return transcript


def delete_transcript(
    db: Session,
    transcript_id: int,
):
    transcript = get_transcript(db, transcript_id)

    if transcript is None:
        return None

    db.delete(transcript)
    db.commit()

    return transcript


# =========================================================
# MEETING SUMMARY CRUD
# =========================================================

def create_summary(
    db: Session,
    meeting_id: int,
    summary: str,
):
    meeting_summary = MeetingSummary(
        meeting_id=meeting_id,
        summary=summary,
    )

    db.add(meeting_summary)
    db.commit()
    db.refresh(meeting_summary)

    return meeting_summary


def get_summary(
    db: Session,
    summary_id: int,
):
    return (
        db.query(MeetingSummary)
        .filter(
            MeetingSummary.summary_id == summary_id
        )
        .first()
    )


def get_summaries_by_meeting(
    db: Session,
    meeting_id: int,
):
    return (
        db.query(MeetingSummary)
        .filter(
            MeetingSummary.meeting_id == meeting_id
        )
        .all()
    )


def update_summary(
    db: Session,
    summary_id: int,
    summary: str,
):
    meeting_summary = get_summary(db, summary_id)

    if meeting_summary is None:
        return None

    meeting_summary.summary = summary

    db.commit()
    db.refresh(meeting_summary)

    return meeting_summary


def delete_summary(
    db: Session,
    summary_id: int,
):
    meeting_summary = get_summary(db, summary_id)

    if meeting_summary is None:
        return None

    db.delete(meeting_summary)
    db.commit()

    return meeting_summary


# =========================================================
# ACTION ITEM CRUD
# =========================================================

def create_action_item(
    db: Session,
    meeting_id: int,
    action_item: str,
):
    item = MeetingActionItem(
        meeting_id=meeting_id,
        action_item=action_item,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_action_item(
    db: Session,
    action_item_id: int,
):
    return (
        db.query(MeetingActionItem)
        .filter(
            MeetingActionItem.action_item_id
            == action_item_id
        )
        .first()
    )


def get_action_items(
    db: Session,
    meeting_id: int,
):
    return (
        db.query(MeetingActionItem)
        .filter(
            MeetingActionItem.meeting_id == meeting_id
        )
        .all()
    )


def update_action_item(
    db: Session,
    action_item_id: int,
    action_item: str,
):
    item = get_action_item(db, action_item_id)

    if item is None:
        return None

    item.action_item = action_item

    db.commit()
    db.refresh(item)

    return item


def delete_action_item(
    db: Session,
    action_item_id: int,
):
    item = get_action_item(db, action_item_id)

    if item is None:
        return None

    db.delete(item)
    db.commit()

    return item