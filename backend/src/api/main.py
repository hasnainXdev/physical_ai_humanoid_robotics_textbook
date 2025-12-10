import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
import logging

# Import models
from src.models.query import Query
from src.models.response import Response
from src.models.source_citation import SourceCitation

# Import services
from src.services.rag_service import RAGService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    description="API for the RAG-based chatbot that answers queries based on book content",
    version="1.0.0"
)

# Initialize services
rag_service = RAGService()


class QueryRequest(BaseModel):
    content: str


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime


def sanitize_input(content: str) -> str:
    """
    Basic input sanitization to prevent injection attacks
    """
    # Remove potentially dangerous characters/sequences
    # This is a basic implementation - in production, use a more robust sanitization library
    sanitized = re.sub(r'<script.*?>.*?</script>', '', content, flags=re.IGNORECASE | re.DOTALL)
    sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'vbscript:', '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'on\w+\s*=', '', sanitized, flags=re.IGNORECASE)  # Remove event handlers

    return sanitized.strip()


@app.get("/health", response_model=HealthResponse)
def health_check():
    """
    Health check endpoint to verify the service is running
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow()
    )


@app.post("/query", response_model=Response)
def query_endpoint(request: QueryRequest):
    """
    Submit a query to the RAG system
    """
    try:
        # Sanitize input to prevent injection attacks
        sanitized_content = sanitize_input(request.content)

        # Validate query content is not empty
        if not sanitized_content.strip():
            raise HTTPException(status_code=400, detail="Query content cannot be empty")

        # Validate query length (less than 200 words)
        if len(sanitized_content.split()) > 200:
            raise HTTPException(status_code=400, detail="Query is too long, must be less than 200 words")

        # Process the query using the RAG service
        response = rag_service.process_query(sanitized_content)

        return response
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error occurred while processing your query")