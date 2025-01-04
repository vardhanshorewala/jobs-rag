import chromadb
from typing import List, Tuple
import os
from backend.config import CHROMA_DB_DIR


def create_chroma_client() -> chromadb.Client:
    return chromadb.PersistentClient(
        path=os.path.join(os.path.dirname(__file__), CHROMA_DB_DIR)
    )


def upsert_documents(
    client: chromadb.Client,
    collection_name: str,
    doc_texts: List[str],
    doc_embeddings: List[List[float]],
    metadatas: List[dict],
    ids: List[str]
) -> None:
    collection = client.get_or_create_collection(name=collection_name)
    collection.add(
        documents=doc_texts,
        embeddings=doc_embeddings,
        metadatas=metadatas,
        ids=ids
    )


def query_similar(
    client: chromadb.Client,
    collection_name: str,
    query_embedding: List[float],
    k: int = 3
) -> List[Tuple[dict, float]]:
    collection = client.get_collection(collection_name)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )
    zipped = zip(results["metadatas"][0], results["distances"][0])
    return list(zipped)
