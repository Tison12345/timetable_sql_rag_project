import pandas as pd
from app.database import get_connection
from app.config import DB_PATH

def run_sql(sql_query: str):
    conn = get_connection()

    try:
        df = pd.read_sql_query(sql_query, conn)
        print(df)
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


if __name__ == "__main__":
    test_query = "SELECT * FROM timetable WHERE Day = 'wed'"
    print(run_sql(test_query))