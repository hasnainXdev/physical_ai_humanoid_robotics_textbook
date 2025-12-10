from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Query(BaseModel):
    """
    Query entity representing user queries
    """
    id: str
    content: str
    timestamp: datetime
    user_id: Optional[str] = None
    metadata: Optional[dict] = None