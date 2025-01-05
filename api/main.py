from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List

from api.indexing import index_jobs
from api.vector_store import create_chroma_client, query_similar
from api.openai_utils import get_embedding, generate_llm_response
from api.query_history import add_query_to_history, get_query_history
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # Replace with your frontend origin
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (e.g., GET, POST, OPTIONS)
    # Allow all headers (e.g., Content-Type, Authorization)
    allow_headers=["*"],
)
chroma_client = create_chroma_client()
COLLECTION_NAME = "jobs_collection"


class QueryRequest(BaseModel):
    user_query: str
    top_k: int = 3


# @app.on_event("startup")
# def startup_event():
#     index_jobs(collection_name=COLLECTION_NAME)

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

        Your task is to provide a structured response in the following JSON format:

        {{
            "summary": "A brief summary of the job search results",
            "top_jobs": [
                {{
                    "title": "Job Title",
                    "organization": "Company Name",
                    "location": "Job Location",
                    "url": "Application URL",
                    "highlights": [
                        "Key point about the job",
                        "Another important aspect"
                    ]
                }}
            ],
            "additional_insights": [
                "Insight or suggestion related to the search",
                "Another helpful tip or observation"
            ]
        }}

        Ensure that:
        1. The summary is concise and relevant to the user's query.
        2. You include 2-3 top job postings in the "top_jobs" array.
        3. Each job in "top_jobs" has 2-3 highlights that make it appealing.
        4. You provide 2-3 additional insights or suggestions in the "additional_insights" array.

        Format your response as valid JSON that can be parsed by the frontend.
    """

    answer = generate_llm_response(prompt)
    add_query_to_history(payload.user_query, answer)
    return {"answer": answer, "context": context_chunks}


@app.get("/query/history")
def query_history(limit: int = 10):
    history = get_query_history(limit)
    return {"history": [{"query": q[0], "response": q[1], "timestamp": q[2]} for q in history]}
