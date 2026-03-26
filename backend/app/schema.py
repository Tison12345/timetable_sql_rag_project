from app.database import get_connection


def get_schema(table_name: str):
    """
    Returns schema (column info) of a specific table
    """

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # 🔥 Check if table exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name=?
        """, (table_name,))
        
        table_exists = cursor.fetchone()

        if not table_exists:
            raise ValueError(f"Table '{table_name}' does not exist")

        # 🔥 Get schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        schema = cursor.fetchall()

        return schema

    finally:
        conn.close()


# ✅ Debug / Test
if __name__ == "__main__":
    try:
        test_table = "timetable_sem6_ds"
        schema = get_schema(test_table)

        print(f"Schema for {test_table}:")
        for col in schema:
            print(col)

    except Exception as e:
        print("Error:", e)