from loaders.mdx_loader import MDXLoader
from generate_embeddings import EmbeddingGenerator
from vector_store import VectorStore
import numpy as np

class Retriever:
    def __init__(self, en_docs_path: str, ur_docs_path: str = None):
        self.embedder = EmbeddingGenerator()
        self.store = VectorStore()
        
        self._initialize(en_docs_path, 'en')
        if ur_docs_path:
            self._initialize(ur_docs_path, 'ur')

    def _initialize(self, docs_path: str, language: str):
        """Loads, embeds, and stores documents for a given language."""
        print(f"Initializing retriever for '{language}'...")
        loader = MDXLoader(docs_path)
        docs = loader.load_documents()
        if docs:
            embeddings = self.embedder.generate(docs, language=language)
            self.store.add(docs, embeddings, language=language)
            print(f"Retriever initialized for '{language}'.")
        else:
            print(f"No documents found for '{language}'.")

    def query(self, question: str, k: int = 5, language: str = 'en') -> list:
        """Queries the vector store for relevant documents in a specific language."""
        query_embedding = self.embedder.generate([{"content": question}], language=language)[0]
        results = self.store.search(np.array(query_embedding), k=k, language=language)
        return results

if __name__ == '__main__':
    retriever = Retriever(en_docs_path="../../docs", ur_docs_path="../../docs_ur")
    
    # English query
    en_question = "How do I use launch files in ROS 2?"
    en_results = retriever.query(en_question, language='en')
    print(f"\nTop English results for '{en_question}':")
    for result in en_results:
        print(f"- {result['source']}")

    # Urdu query (assuming urdu docs and model support)
    # ur_question = "ROS 2 لانچ فائلیں کیسے استعمال کروں؟"
    # ur_results = retriever.query(ur_question, language='ur')
    # print(f"\nTop Urdu results for '{ur_question}':")
    # for result in ur_results:
    #     print(f"- {result['source']}")
