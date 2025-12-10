from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .source_citation import SourceCitation


class Response(BaseModel):
    """
    Response entity representing system responses
    """
    id: str
    query_id: str
    content: str
    source_citations: List[SourceCitation]
    timestamp: datetime
    relevance_score: Optional[float] = None