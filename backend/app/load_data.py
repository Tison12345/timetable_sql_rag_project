import os
import pandas as pd
import sqlite3
from config import DB_PATH

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FOLDER = os.path.abspath(os.path.join(BASE_DIR, "..", "data"))
DB_PATH = os.path.join(BASE_DIR, "timetable.db")

def load_all_csvs():
    conn = sqlite3.connect(DB_PATH)

    for file in os.listdir(DATA_FOLDER):
        if file.endswith(".csv"):
            file_path = os.path.join(DATA_FOLDER, file)

            # table name = filename without .csv
            table_name = file.replace(".csv", "").lower()

            print(f"Loading {file} → {table_name}")

            df = pd.read_csv(file_path)

            # Clean column names (important)
            df.columns = [col.strip() for col in df.columns]

            # Insert into SQLite
            df.to_sql(table_name, conn, if_exists="replace", index=False)

    conn.close()
    print("✅ All timetables loaded successfully!")


if __name__ == "__main__":
    load_all_csvs()