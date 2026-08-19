from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    print("=== Database Verification ===\n")

    # Count users
    users_count = db.execute(text("SELECT COUNT(*) FROM users")).scalar()
    print(f"Total users: {users_count}")

    # Count meetings
    meetings_count = db.execute(text("SELECT COUNT(*) FROM meetings")).scalar()
    print(f"Total meetings: {meetings_count}")

    # Count transcripts
    transcripts_count = db.execute(text("SELECT COUNT(*) FROM meeting_transcripts")).scalar()
    print(f"Total meeting_transcripts: {transcripts_count}")

    # Count summaries
    summaries_count = db.execute(text("SELECT COUNT(*) FROM meeting_summaries")).scalar()
    print(f"Total meeting_summaries: {summaries_count}")

    # Count action items
    actions_count = db.execute(text("SELECT COUNT(*) FROM meeting_action_items")).scalar()
    print(f"Total meeting_action_items: {actions_count}")

    print("\n=== Test Data Check ===\n")

    # Check for test user
    test_user = db.execute(
        text("SELECT user_id, full_name FROM users WHERE email = :email"),
        {"email": "crud_test_user_taskmind@example.com"},
    ).first()
    print(f"Test user exists: {test_user is not None}")
    if test_user:
        print(f"  User ID: {test_user[0]}, Name: {test_user[1]}")

    # Check for test meeting
    test_meeting = db.execute(
        text("SELECT meeting_id, title FROM meetings WHERE title = :title"),
        {"title": "CRUD Verification Meeting"},
    ).first()
    print(f"Test meeting exists: {test_meeting is not None}")
    if test_meeting:
        print(f"  Meeting ID: {test_meeting[0]}, Title: {test_meeting[1]}")

    print("\n✅ Database verification completed")
finally:
    db.close()
