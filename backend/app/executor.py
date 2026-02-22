import pandas as pd
from app.database import get_connection


def run_sql(sql_query: str):
    conn = get_connection()

    try:
        df = pd.read_sql_query(sql_query, conn)
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


if __name__ == "__main__":
    test_query = "SELECT * FROM timetable WHERE Day = 'Monday'"
    print(run_sql(test_query))