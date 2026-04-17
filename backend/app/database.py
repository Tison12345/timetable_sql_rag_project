import sqlite3
from app.config import DB_PATH

# DB_PATH = "timetable.db"

def get_connection():
    return sqlite3.connect(DB_PATH)
