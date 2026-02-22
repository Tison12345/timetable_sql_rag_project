from app.database import get_connection

def get_schema():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(timetable)")
    schema = cursor.fetchall()

    conn.close()

    return schema
if __name__ == "__main__":
    print(get_schema())
