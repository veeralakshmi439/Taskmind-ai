from datetime import datetime

from app.core.database import SessionLocal
from app import crud


def main():
    db = SessionLocal()

    try:
        print("\n========== CREATE USER ==========")

        test_email = "crud_test@example.com"

        # Avoid duplicate test user
        existing_user = crud.get_user_by_email(
            db,
            test_email
        )

        if existing_user:
            user = existing_user
            print(f"Using existing test user: {user.user_id}")
        else:
            user = crud.create_user(
                db=db,
                email=test_email,
                full_name="CRUD Test User",
                hashed_password="test_password",
                role="Member",
            )

            print(
                f"✅ User created: {user.user_id}"
            )

        print("\n========== READ USER ==========")

        user = crud.get_user(
            db,
            user.user_id
        )

        print(
            f"✅ User found: "
            f"{user.full_name}"
        )

        print("\n========== UPDATE USER ==========")

        updated_user = crud.update_user(
            db=db,
            user_id=user.user_id,
            full_name="Updated CRUD User",
        )

        print(
            f"✅ User updated: "
            f"{updated_user.full_name}"
        )

        print("\n========== CREATE MEETING ==========")

        meeting = crud.create_meeting(
            db=db,
            title="CRUD Test Meeting",
            agenda="Testing database CRUD",
            meeting_date=datetime.now(),
            meeting_time="10:00:00",
            duration="30 minutes",
            transcript="Test transcript",
        )

        print(
            f"✅ Meeting created: "
            f"{meeting.meeting_id}"
        )

        print("\n========== READ MEETING ==========")

        found_meeting = crud.get_meeting(
            db,
            meeting.meeting_id
        )

        print(
            f"✅ Meeting found: "
            f"{found_meeting.title}"
        )

        print("\n========== CREATE TRANSCRIPT ==========")

        transcript = crud.create_transcript(
            db=db,
            meeting_id=meeting.meeting_id,
            transcript_text="This is a CRUD test transcript.",
        )

        print(
            f"✅ Transcript created: "
            f"{transcript.transcript_id}"
        )

        print("\n========== CREATE SUMMARY ==========")

        summary = crud.create_summary(
            db=db,
            meeting_id=meeting.meeting_id,
            summary="This is a CRUD test summary.",
        )

        print(
            f"✅ Summary created: "
            f"{summary.summary_id}"
        )

        print("\n========== CREATE ACTION ITEM ==========")

        action_item = crud.create_action_item(
            db=db,
            meeting_id=meeting.meeting_id,
            action_item="Complete CRUD testing",
        )

        print(
            f"✅ Action item created: "
            f"{action_item.action_item_id}"
        )

        print("\n========== READ RELATED DATA ==========")

        transcripts = crud.get_transcripts_by_meeting(
            db,
            meeting.meeting_id
        )

        summaries = crud.get_summaries_by_meeting(
            db,
            meeting.meeting_id
        )

        action_items = crud.get_action_items(
            db,
            meeting.meeting_id
        )

        print(
            f"✅ Transcripts: {len(transcripts)}"
        )

        print(
            f"✅ Summaries: {len(summaries)}"
        )

        print(
            f"✅ Action items: {len(action_items)}"
        )

        print("\n========== DELETE ACTION ITEM ==========")

        deleted_item = crud.delete_action_item(
            db,
            action_item.action_item_id
        )

        if deleted_item:
            print("✅ Action item deleted")

        print("\n========== DELETE TRANSCRIPT ==========")

        deleted_transcript = crud.delete_transcript(
            db,
            transcript.transcript_id
        )

        if deleted_transcript:
            print("✅ Transcript deleted")

        print("\n========== DELETE SUMMARY ==========")

        deleted_summary = crud.delete_summary(
            db,
            summary.summary_id
        )

        if deleted_summary:
            print("✅ Summary deleted")

        print("\n========== DELETE MEETING ==========")

        deleted_meeting = crud.delete_meeting(
            db,
            meeting.meeting_id
        )

        if deleted_meeting:
            print("✅ Meeting deleted")

        print("\n========== CRUD TEST COMPLETE ==========")
        print("✅ All CRUD operations completed successfully")

    except Exception as e:
        db.rollback()

        print("\n❌ CRUD TEST FAILED")
        print(e)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()