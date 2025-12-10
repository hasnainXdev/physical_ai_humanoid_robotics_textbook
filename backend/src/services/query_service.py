from src.services.embedding_service import EmbeddingService
from src.models.query import Query
from typing import List, Tuple


class QueryService:
    """
    Service to handle user queries and coordinate with embedding service
    """

    def __init__(self, embedding_service: EmbeddingService):
        self.embedding_service = embedding_service

    def process(self, query: Query) -> Tuple[str, List[dict]]:
        """
        Process a query independently without maintaining context or history
        """
        # Validate query format and content
        if not query.content.strip():
            return "Query content cannot be empty.", []

        # Limit the query length to 200 words
        if len(query.content.split()) > 200:
            return "Query is too long, must be less than 200 words.", []

        # Search for similar documents in the knowledge base
        # Each query is processed independently without considering previous queries
        similar_docs = self.embedding_service.search_similar(
            query.content,
            limit=3  # Retrieve top 3 similar documents
        )

        if not similar_docs:
            # If no documents found, return a fallback response
            return "I couldn't find any relevant information in the book to answer your query.", []

        # Return the first document's content as the response (simplified approach)
        response_content = similar_docs[0]["content"]

        return response_content, similar_docs