from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="Todo")
    priority = Column(String, default="Medium")
    labels = Column(String, nullable=True)  # comma-separated
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    project = relationship("Project", foreign_keys=[project_id])
    assignee = relationship("User", foreign_keys=[assignee_id])
    owner = relationship("User", foreign_keys=[owner_id])