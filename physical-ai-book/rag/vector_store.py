import numpy as np

class VectorStore:
    def __init__(self):
        self.vectors = {'en': {}, 'ur': {}}
        self.documents = {'en': {}, 'ur': {}}
        self.next_id = 0

    def add(self, documents: list, vectors: list, language: str = 'en'):
        """Adds documents and vectors for a specific language."""
        if language not in self.vectors:
            self.vectors[language] = {}
            self.documents[language] = {}
            
        for doc, vec in zip(documents, vectors):
            doc_id = str(self.next_id)
            self.documents[language][doc_id] = doc
            self.vectors[language][doc_id] = np.array(vec)
            self.next_id += 1

    def search(self, query_vector: np.ndarray, k: int = 5, language: str = 'en') -> list:
        """Searches for the k most similar vectors in a specific language."""
        lang_vectors = self.vectors.get(language, {})
        if not lang_vectors:
            return []

        similarities = {
            doc_id: np.dot(query_vector, vec) / (np.linalg.norm(query_vector) * np.linalg.norm(vec))
            for doc_id, vec in lang_vectors.items()
        }

        sorted_ids = sorted(similarities, key=similarities.get, reverse=True)
        top_k_ids = sorted_ids[:k]

        return [self.documents[language][doc_id] for doc_id in top_k_ids]

if __name__ == '__main__':
    from loaders.mdx_loader import MDXLoader
    from generate_embeddings import EmbeddingGenerator

    # Setup
    store = VectorStore()
    embedder = EmbeddingGenerator()

    # English documents
    en_loader = MDXLoader("../../docs")
    en_docs = en_loader.load_documents()
    en_embeddings = embedder.generate(en_docs, language='en')
    store.add(en_docs, en_embeddings, language='en')

    # Urdu documents (assuming they exist for demonstration)
    # ur_loader = MDXLoader("../../docs_ur")
    # ur_docs = ur_loader.load_documents()
    # ur_embeddings = embedder.generate(ur_docs, language='ur')
    # store.add(ur_docs, ur_embeddings, language='ur')

    # English search
    en_query = "What is ROS 2?"
    en_query_embedding = embedder.generate([{"content": en_query}], language='en')[0]
    en_results = store.search(np.array(en_query_embedding), language='en')
    print(f"Found {len(en_results)} English results for '{en_query}':")
    for result in en_results:
        print(f"- {result['source']}")

    # Urdu search
    # ur_query = "ROS 2 کیا ہے؟" # "What is ROS 2?" in Urdu
    # ur_query_embedding = embedder.generate([{"content": ur_query}], language='ur')[0]
    # ur_results = store.search(np.array(ur_query_embedding), language='ur')
    # print(f"\nFound {len(ur_results)} Urdu results for '{ur_query}':")
    # for result in ur_results:
    #     print(f"- {result['source']}")
