from app.database import get_connection

def get_schema(table_name: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(f"PRAGMA table_info({table_name})")
    schema = cursor.fetchall()

    conn.close()
    return schema
if __name__ == "__main__":
    print(get_schema())
