import os

RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "active-jobs-db.p.rapidapi.com")
RAPIDAPI_KEY = os.getenv(
    "RAPIDAPI_KEY", "")

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY", "")

CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "chroma_db")

JOBS_ENDPOINT = (
    f"https://{RAPIDAPI_HOST}/active-ats-7d?title_filter=%22Data%20Engineer%22&location_filter=%22United%20States%22"
)

MAX_JOBS_TO_FETCH = 200
