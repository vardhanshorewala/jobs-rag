import sqlite3
from datetime import datetime
import uuid
from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# ... (keep your existing imports)

DB_PATH = "query_history.db"


def initialize_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS query_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                user_query TEXT NOT NULL,
                response TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()


def generate_session_id():
    return str(uuid.uuid4())


def add_query_to_history(session_id: str, user_query: str, response: str):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO query_history (session_id, user_query, response)
            VALUES (?, ?, ?)
        """, (session_id, user_query, response))
        conn.commit()


def get_query_history(limit: int = 10):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT session_id, user_query, response, timestamp
            FROM query_history
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        return cursor.fetchall()


initialize_db()
