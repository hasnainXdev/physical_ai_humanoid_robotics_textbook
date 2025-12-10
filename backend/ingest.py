import os
import uuid
from typing import List
import requests
from bs4 import BeautifulSoup
from agents import OpenAIProvider
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv
import argparse
import gc

# Load environment variables
load_dotenv()

# Configure OpenAI-compatible client for Gemini
openai_client = OpenAIProvider(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

COLLECTION_NAME = "book_content"
EMBEDDING_MODEL = "models/embedding-001"
EMBEDDING_DIM = 768
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
BATCH_SIZE = 100  # For memory efficiency

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY")
)


def extract_text_from_url(url: str) -> str:
    """Extract clean text from a URL."""
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for element in soup(["script", "style", "header", "footer", "nav"]):
            element.decompose()
        main_content = soup.find("main") or soup.find("article") or soup.body
        text = main_content.get_text(separator="\n", strip=True) if main_content else ""
        return text
    except Exception as e:
        print(f"Error extracting from {url}: {e}")
        return ""


def chunk_text_generator(text: str):
    """Generator for memory-efficient chunking."""
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        yield text[start:end]
        start = end - CHUNK_OVERLAP


def ingest_textbook(urls: List[str]):
    """Ingest content from provided URLs into Qdrant."""
    if not qdrant_client.get_collection(COLLECTION_NAME):
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )

    total_chunks = 0
    for url in urls:
        text = extract_text_from_url(url)
        if not text:
            continue

        batch_points = []
        for chunk in chunk_text_generator(text):
            embedding = (
                openai_client.embeddings.create(input=chunk, model=EMBEDDING_MODEL)
                .data[0]
                .embedding
            )
            batch_points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={"text": chunk, "source_url": url},
                )
            )
            total_chunks += 1

            if len(batch_points) >= BATCH_SIZE:
                qdrant_client.upsert(
                    collection_name=COLLECTION_NAME, points=batch_points
                )
                batch_points = []
                gc.collect()

        if batch_points:
            qdrant_client.upsert(collection_name=COLLECTION_NAME, points=batch_points)
            gc.collect()

        del text
        gc.collect()

    print(f"Ingested {total_chunks} chunks from {len(urls)} URLs into Qdrant.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest textbook site into Qdrant.")
    parser.add_argument(
        "--url",
        type=str,
        required=True,
        help="Comma-separated URLs (e.g., https://yoursite.com/page1,https://yoursite.com/page2)",
    )
    args = parser.parse_args()
    urls = [u.strip() for u in args.url.split(",")]
    ingest_textbook(urls)
