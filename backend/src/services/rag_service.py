import time
import logging
from src.services.query_service import QueryService
from src.services.embedding_service import EmbeddingService
from src.models.response import Response
from src.models.source_citation import SourceCitation
from src.models.query import Query
from datetime import datetime
import uuid
from typing import List


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RAGService:
    """
    Service to process queries using Retrieval-Augmented Generation
    """

    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.query_service = QueryService(self.embedding_service)

    def process_query(self, query_content: str) -> Response:
        """
        Process a user query independently without maintaining history or context
        Each query is processed as a standalone request
        """
        start_time = time.time()

        # Log the incoming query
        logger.info(f"Processing query: {query_content[:50]}...")

        # Generate a unique ID for this query
        query_id = str(uuid.uuid4())

        # Create a Query object
        query = Query(
            id=query_id,
            content=query_content,
            timestamp=datetime.utcnow()
        )

        # Process the query using the query service
        # Each query is processed independently without considering previous queries
        response_content, source_docs = self.query_service.process(query)

        # Create source citations from the retrieved documents
        source_citations = []
        for doc in source_docs:
            citation = SourceCitation(
                document_id=doc["id"],
                source_reference=doc["source"],
                quoted_text=doc["content"]
            )
            source_citations.append(citation)

        # Create and return the response
        response = Response(
            id=str(uuid.uuid4()),
            query_id=query_id,
            content=response_content,
            source_citations=source_citations,
            timestamp=datetime.utcnow()
        )

        # Calculate and log response time (just for monitoring purposes)
        response_time = time.time() - start_time

        # Optional: Add additional check if response time exceeds threshold
        if response_time > 5.0:  # 5 seconds
            logger.warning(f"Response time exceeded 5 seconds: {response_time:.2f}s")

        # Log completion
        logger.info(f"Query processed in {response_time:.2f}s")

        return response