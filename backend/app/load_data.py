import pandas as pd
import sqlite3
import os

DB_PATH = "timetable.db"
CSV_PATH = "data/Golden_Timetable_6th_Sem.csv"

def load_csv_to_db():
    if not os.path.exists(CSV_PATH):
        print("❌ CSV file not found.")
        return

    df = pd.read_csv(CSV_PATH)

    # 🔥 Remove unnamed columns
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

    conn = sqlite3.connect(DB_PATH)
    df.to_sql("timetable", conn, if_exists="replace", index=False)
    conn.close()

    print("✅ Timetable cleaned and loaded successfully!")

if __name__ == "__main__":
    load_csv_to_db()
