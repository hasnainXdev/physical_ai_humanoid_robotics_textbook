import os
import uuid
from typing import List
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv
import argparse
import gc

load_dotenv()


print("Loading embedding model... (takes 10–20 seconds first time)")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded!")

COLLECTION_NAME = "physical-ai-book"
EMBEDDING_DIM = 384
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
BATCH_SIZE = 64  # Safe for 16 GB RAM

qdrant_client = QdrantClient(
    host=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY")
)


# Rest of functions same as before...
def extract_text_from_url(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "nav", "header", "footer"]):
            tag.decompose()
        text = (
            soup.find("main") or soup.find("article") or soup.body or soup
        ).get_text(separator="\n", strip=True)
        return text
    except Exception as e:
        print(f"Error {url}: {e}")
        return ""


def chunk_text(text: str):
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        yield text[start:end]
        start = end - CHUNK_OVERLAP
        if start >= len(text):
            break


def ingest(urls: List[str]):
    # Create collection with correct dimension
    if not qdrant_client.get_collection(COLLECTION_NAME):
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )

    total = 0
    batch = []

    for url in urls:
        text = extract_text_from_url(url)
        if not text:
            continue

        for chunk in chunk_text(text):
            embedding = model.encode(
                chunk, normalize_embeddings=True
            ).tolist()  # ← super fast
            batch.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={"text": chunk, "url": url},
                )
            )
            total += 1

            if len(batch) >= BATCH_SIZE:
                qdrant_client.upsert(COLLECTION_NAME, batch)
                batch.clear()
                gc.collect()

        # Clear memory after each page
        del text
        gc.collect()

    if batch:
        qdrant_client.upsert(COLLECTION_NAME, batch)

    print(f"Done! Ingested {total} chunks using all-MiniLM-L6-v2")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", type=str, required=True, help="Comma-separated URLs")
    args = parser.parse_args()
    urls = [u.strip() for u in args.url.split(",")]
    ingest(urls)
