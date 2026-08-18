from app.core.database import Base, engine
from app.models import Meeting, MeetingActionItem, MeetingSummary, MeetingTranscript, User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully.")


if __name__ == "__main__":
    init_db()
