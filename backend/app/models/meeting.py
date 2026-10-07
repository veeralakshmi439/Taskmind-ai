from sqlalchemy import Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    agenda = Column(String, nullable=True)
    date = Column(Date, nullable=False)
    time = Column(String, nullable=False)
    duration = Column(String, default="30m")
    participants = Column(String, nullable=True)  # comma-separated emails
    transcript = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)  # JSON string
    status = Column(String, default="Scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")