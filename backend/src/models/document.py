from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Document(BaseModel):
    """
    Document entity representing knowledge base entries
    """
    id: str
    content: str
    source: str
    embedding: List[float]
    metadata: Optional[dict] = None