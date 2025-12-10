import os
from typing import Optional
from pydantic import BaseSettings


class Settings(BaseSettings):
    """
    Configuration settings for the RAG chatbot application
    """
    qdrant_url: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key: Optional[str] = os.getenv("QDRANT_API_KEY")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    class Config:
        env_file = ".env"


settings = Settings()