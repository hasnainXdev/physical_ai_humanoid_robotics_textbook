from typing import List
from qdrant_client import QdrantClient
from qdrant_client.http import models
from src.config.settings import settings
from src.models.document import Document
import uuid
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings


class EmbeddingService:
    """
    Service to manage document embeddings in Qdrant vector database
    """
    
    def __init__(self):
        # Initialize Qdrant client
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )
        
        # Initialize embedding model based on settings
        if settings.embedding_model == "text-embedding-ada-002":
            self.embeddings: Embeddings = OpenAIEmbeddings(
                openai_api_key=settings.openai_api_key
            )
        else:
            # Placeholder for other embedding models
            raise ValueError(f"Unsupported embedding model: {settings.embedding_model}")
        
        # Define collection name
        self.collection_name = "book_content"
        
        # Initialize the collection if it doesn't exist
        self._initialize_collection()
    
    def _initialize_collection(self):
        """
        Initialize the Qdrant collection for storing document embeddings
        """
        try:
            # Check if collection exists
            self.client.get_collection(self.collection_name)
        except:
            # Create collection if it doesn't exist
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=1536,  # Default size for OpenAI embeddings
                    distance=models.Distance.COSINE
                ),
            )
    
    def add_document(self, content: str, source: str, metadata: dict = None) -> str:
        """
        Add a document to the vector database and return its ID
        """
        # Generate embedding for the content
        embedding = self.embeddings.embed_query(content)
        
        # Generate a unique ID for the document
        doc_id = str(uuid.uuid4())
        
        # Prepare the document for storage
        document = Document(
            id=doc_id,
            content=content,
            source=source,
            embedding=embedding,
            metadata=metadata or {}
        )
        
        # Store the document in Qdrant
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=doc_id,
                    vector=embedding,
                    payload={
                        "content": content,
                        "source": source,
                        "metadata": metadata or {}
                    }
                )
            ]
        )
        
        return doc_id
    
    def add_documents(self, documents: List[Document]) -> List[str]:
        """
        Add multiple documents to the vector database
        """
        ids = []
        for doc in documents:
            # Generate embedding for the content
            embedding = self.embeddings.embed_query(doc.content)
            
            # Prepare the document for storage
            doc.embedding = embedding
            
            # Store the document in Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=doc.id,
                        vector=embedding,
                        payload={
                            "content": doc.content,
                            "source": doc.source,
                            "metadata": doc.metadata
                        }
                    )
                ]
            )
            
            ids.append(doc.id)
        
        return ids
    
    def search_similar(self, query: str, limit: int = 5) -> List[dict]:
        """
        Search for documents similar to the query
        """
        # Generate embedding for the query
        query_embedding = self.embeddings.embed_query(query)
        
        # Search for similar vectors in Qdrant
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        
        # Extract the payloads from the search results
        results = []
        for result in search_results:
            results.append({
                "id": result.id,
                "content": result.payload["content"],
                "source": result.payload["source"],
                "metadata": result.payload["metadata"],
                "score": result.score
            })
        
        return results