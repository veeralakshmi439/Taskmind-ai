from sqlalchemy import text

from app.core.database import engine

required_tables = [
    "users",
    "meetings",
    "meeting_transcripts",
    "meeting_summaries",
    "meeting_action_items",
]


def verify_tables() -> None:
    with engine.connect() as conn:
        tables = conn.execute(
            text("SHOW TABLES")
        ).scalars().all()

        print("✅ Connected database: taskmind_ai")
        print("SHOW TABLES:", tables)

        for table_name in required_tables:
            if table_name not in tables:
                raise RuntimeError(f"{table_name} table is missing")
            print(f"✅ {table_name} table exists")

            rows = conn.execute(text(f"DESCRIBE {table_name}"))
            print(f"--- {table_name} schema ---")
            for row in rows:
                print(row)

        fk_sql = "SHOW CREATE TABLE meeting_action_items"
        fk_result = conn.execute(text(fk_sql)).fetchone()
        print("--- SHOW CREATE TABLE meeting_action_items ---")
        print(fk_result)

        print("✅ Database verification completed successfully")


if __name__ == "__main__":
    verify_tables()
