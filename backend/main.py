from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from agents import Agent, Runner, function_tool, SQLiteSession, OpenAIProvider, OpenAIChatCompletionsModel
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os
import uuid
import asyncio
import logging
from typing import Optional

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG (Retrieval-Augmented Generation) Chatbot that answers questions about physical AI humanoid robotics textbook content",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI-compatible client for Gemini
openai_client = OpenAIProvider(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

# Chat model for the agent
chat_model = OpenAIChatCompletionsModel(model="gemini-1.5-flash-latest", provider=openai_client)

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

COLLECTION_NAME = "textbook_content"
EMBEDDING_MODEL = "models/embedding-001"
RETRIEVAL_LIMIT = 5

# Retrieval tool
@function_tool
def retrieve_context(query: str) -> str:
    """Retrieve relevant context from the textbook content in Qdrant."""
    embedding_response = openai_client.embeddings.create(input=query, model=EMBEDDING_MODEL)
    embedding = embedding_response.data[0].embedding
    search_results = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=embedding,
        limit=RETRIEVAL_LIMIT,
        with_payload=True
    )
    contexts = [hit.payload["text"] for hit in search_results if hit.score > 0.5]
    return "\n\n".join(contexts) if contexts else "No relevant context found."

class ChatRequest(BaseModel):
    question: str
    selected_text: Optional[str] = None
    session_id: Optional[str] = None

@app.post("/chat")
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    session = SQLiteSession(session_id)

    if request.selected_text:
        instructions = (
            "You are a helpful assistant answering questions strictly based on the provided selected text. "
            "Do not use any external knowledge or retrieval. "
            f"Selected text: {request.selected_text}"
        )
        agent = Agent(
            name="SelectedTextAgent",
            instructions=instructions,
            model=chat_model
        )
    else:
        instructions = (
            "You are a helpful assistant answering questions about the textbook content on physical AI humanoid robotics. "
            "Always use the retrieve_context tool to get relevant information before answering."
        )
        agent = Agent(
            name="TextbookRAGAgent",
            instructions=instructions,
            tools=[retrieve_context],
            model=chat_model
        )

    try:
        result = await Runner.run(agent, input=request.question, session=session)
        return {
            "response": result.final_output,
            "session_id": session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to the RAG Chatbot API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-chatbot-api"}

# Request/response validation middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logging.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Response status: {response.status_code}")
    return response

# Error handling
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors and return user-friendly messages"""
    logging.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Invalid request data",
            "details": exc.errors()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logging.error(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "http_error",
            "message": str(exc.detail)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logging.error(f"General error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)