from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List

from backend.indexing import index_jobs
from backend.vector_store import create_chroma_client, query_similar
from backend.openai_utils import get_embedding, generate_llm_response
from backend.query_history import add_query_to_history, get_query_history

app = FastAPI()

chroma_client = create_chroma_client()
COLLECTION_NAME = "jobs_collection"


class QueryRequest(BaseModel):
    user_query: str
    top_k: int = 3


@app.on_event("startup")
def startup_event():
    index_jobs(collection_name=COLLECTION_NAME)


@app.post("/query")
def query_jobs(payload: QueryRequest):
    query_embedding = get_embedding(payload.user_query)

    results = query_similar(chroma_client, COLLECTION_NAME,
                            query_embedding, k=payload.top_k)

    context_chunks = []
    for metadata, distance in results:
        context_chunks.append(
            f"Title: {metadata['title']}\n"
            f"Organization: {metadata['organization']}\n"
            f"Location: {', '.join(metadata['location'])}\n"
            f"URL: {metadata['url']}\n"
            f"Score: {distance}\n\n"
        )
    context_text = "\n".join(context_chunks)

    prompt = f"""
        You are a highly intelligent and helpful job assistant. A user has asked:
        "{payload.user_query}"

        Below is a list of relevant job postings, including their title, organization, location, URL, and relevance score:
        
        {context_text}

        Your task is to:
        1. Summarize the key information about the job postings relevant to the user's query.
        2. Provide an easy-to-understand response that highlights a few top job postings and explains why they might be of interest to the user.
        3. If applicable, offer additional suggestions or insights based on the user's query, such as nearby locations, related roles, or tips for applying.

        Structure your response to be clear, engaging, and informative. Use bullet points or paragraphs to organize your answer, and include URLs for direct application links where available.
    """

    answer = generate_llm_response(prompt)
    add_query_to_history(payload.user_query, answer)
    return {"answer": answer, "context": context_text}


@app.get("/query/history")
def query_history(limit: int = 10):
    history = get_query_history(limit)
    return {"history": [{"query": q[0], "response": q[1], "timestamp": q[2]} for q in history]}
