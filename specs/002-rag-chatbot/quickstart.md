# Quickstart Guide: RAG Chatbot

## Overview
This guide provides instructions to quickly set up and run the RAG chatbot that answers queries based on book content.

## Prerequisites
- Python 3.11+
- Docker (for running Qdrant vector database)
- Access to embedding model (OpenAI API key or local model)

## Setup Steps

### 1. Clone the project
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Set up the backend environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables
Create a `.env` file in the backend directory:
```bash
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key  # if required
EMBEDDING_MODEL=text-embedding-ada-002  # or local model identifier
OPENAI_API_KEY=your-openai-api-key  # if using OpenAI embeddings
```

### 4. Start the Qdrant vector database
```bash
docker run -p 6333:6333 --name rag-qdrant qdrant/qdrant
```

### 5. Index the book content
```bash
# Run the embedding generation script to convert book content to embeddings
python src/scripts/generate_embeddings.py --book-path path/to/book --output-path embeddings/
```

### 6. Start the backend service
```bash
python src/api/main.py
# Service will be available at http://localhost:8000
```

### 7. Integrate with Docusaurus frontend
```bash
# Navigate to your Docusaurus project
cd frontend  # or wherever your Docusaurus project is located

# Build and start the Docusaurus site
npm install
npm run start
```

## API Usage
Once running, you can test the API directly:

```bash
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"content": "What are the principles of humanoid robotics?"}'
```

## Testing
Run the backend tests:
```bash
cd backend
python -m pytest tests/
```

## Troubleshooting
- If you encounter issues with embedding generation, ensure your API keys are correct
- Check that Qdrant is running at the configured address
- Review the logs for specific error messages