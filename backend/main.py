from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    set_tracing_disabled,
    Runner,
)
from openai import AsyncOpenAI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from dotenv import load_dotenv
from typing import Optional
import os

# Load env
load_dotenv()
# it is important to disable when using external model!
set_tracing_disabled(disabled=True)

# this is neccesary
gemini_client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

# this is requird when setting up external model
model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-120b:free", openai_client=gemini_client
)

app = FastAPI(
    title="Physical AI Humanoid Robotics RAG Chatbot",
    description="Ask questions about your textbook powered by Hugging Face + Qdrant",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the same embedding model as in ingest.py (384-dim)
print("Loading embedding model for queries...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model ready!")

# Qdrant client
qdrant_client = QdrantClient(
    host=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY")
)

COLLECTION_NAME = "physical-ai-book"
RETRIEVAL_LIMIT = 3


class ChatRequest(BaseModel):
    question: str
    selected_text: Optional[str] = None  # Optional: answer only from pasted text


@app.get("/")
async def root():
    return {"message": "Your RAG chatbot is alive! Go to /docs to test."}


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        if request.selected_text and request.selected_text.strip():
            # Selected-text mode (no retrieval)
            prompt = (
                "You are a helpful assistant. Answer the question using ONLY the text below."
                "If the answer is not in the text, say you don't know.\n\n"
                f"Text:\n{request.selected_text[:2000]}\n\n"
                f"Question: {request.question}"
            )
        else:
            # RAG mode
            query_vector = embed_model.encode(
                request.question, normalize_embeddings=True
            ).tolist()

            search_results = qdrant_client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_vector,
                limit=RETRIEVAL_LIMIT,
                search_params={"hnsw_ef": 128},  # Great recall + fast
                with_payload=True,
            )

            # Build context
            contexts = [hit.payload["text"] for hit in search_results]
            source_urls = [hit.payload.get("url", "unknown") for hit in search_results]
            context_str = "\n\n".join(contexts)

            prompt = (
                "You are an expert on Physical AI & Humanoid Robotics."
                "Answer the question using only the context below."
                "Be precise and helpful.\n\n"
                f"Context:\n{context_str}\n\n"
                f"Question: {request.question}"
            )

        PhysicalAIAgent = Agent(
            name="PhysicalAIAgent",
            instructions=prompt,
            model=model,
        )

        answer = await Runner.run(
            PhysicalAIAgent,
            input=request.question,
        )

        # Optional: return sources
        return {
            "response": answer.final_output,
            "sources": source_urls if not request.selected_text else None,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
