from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    meetings = relationship("Meeting", back_populates="user", cascade="all, delete-orphan")


class Meeting(Base):
    __tablename__ = "meetings"

    meeting_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    meeting_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    user = relationship("User", back_populates="meetings")
    transcripts = relationship(
        "MeetingTranscript",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )
    summaries = relationship(
        "MeetingSummary",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )
    action_items = relationship(
        "MeetingActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )


class MeetingTranscript(Base):
    __tablename__ = "meeting_transcripts"

    transcript_id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(
        Integer,
        ForeignKey("meetings.meeting_id", ondelete="CASCADE"),
        nullable=False,
    )
    transcript_text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    meeting = relationship("Meeting", back_populates="transcripts")


class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"

    summary_id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(
        Integer,
        ForeignKey("meetings.meeting_id", ondelete="CASCADE"),
        nullable=False,
    )
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    meeting = relationship("Meeting", back_populates="summaries")


class MeetingActionItem(Base):
    __tablename__ = "meeting_action_items"

    action_item_id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(
        Integer,
        ForeignKey("meetings.meeting_id", ondelete="CASCADE"),
        nullable=False,
    )
    action_item = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    meeting = relationship("Meeting", back_populates="action_items")
