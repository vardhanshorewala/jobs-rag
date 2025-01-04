import sqlite3
from datetime import datetime

DB_PATH = "query_history.db"


def initialize_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS query_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_query TEXT NOT NULL,
                response TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()


def add_query_to_history(user_query: str, response: str):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO query_history (user_query, response) VALUES (?, ?)
        """, (user_query, response))
        conn.commit()


def get_query_history(limit: int = 10):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT user_query, response, timestamp
            FROM query_history
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        return cursor.fetchall()


initialize_db()
