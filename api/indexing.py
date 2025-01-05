import requests
import json
from typing import List
from api.config import RAPIDAPI_HOST, RAPIDAPI_KEY, JOBS_ENDPOINT, MAX_JOBS_TO_FETCH
from api.openai_utils import get_embedding
from api.vector_store import create_chroma_client, upsert_documents
from api.query_history import add_query_to_history


def fetch_jobs() -> List[dict]:
    headers = {
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "X-RapidAPI-Key": RAPIDAPI_KEY,
    }
    resp = requests.get(JOBS_ENDPOINT, headers=headers)
    resp.raise_for_status()
    data = resp.json()

    return data[:MAX_JOBS_TO_FETCH]


def prepare_text_content(job: dict) -> str:

    title = job.get("title", "")
    org = job.get("organization", "")
    location = ", ".join(job.get("locations_derived", []))
    text = f"Job Title: {title}\nOrganization: {org}\nLocation: {location}"
    return text


def index_jobs(collection_name: str = "jobs_collection"):

    jobs_data = fetch_jobs()

    if not jobs_data:
        print("No jobs fetched.")
        return

    client = create_chroma_client()

    doc_texts = []
    doc_embeddings = []
    metadatas = []
    ids = []

    for idx, job in enumerate(jobs_data):
        text_content = prepare_text_content(job)
        embedding = get_embedding(text_content)

        doc_texts.append(text_content)
        doc_embeddings.append(embedding)

        location = ", ".join(job.get("locations_derived", []))

        metadata = {
            "title": job.get("title", ""),
            "organization": job.get("organization", ""),
            "location": location,
            "url": job.get("url", ""),
        }
        metadatas.append(metadata)

        job_id = str(job.get("id", f"temp_{idx}"))
        ids.append(job_id)

    upsert_documents(
        client=client,
        collection_name=collection_name,
        doc_texts=doc_texts,
        doc_embeddings=doc_embeddings,
        metadatas=metadatas,
        ids=ids
    )


if __name__ == "__main__":
    index_jobs()
