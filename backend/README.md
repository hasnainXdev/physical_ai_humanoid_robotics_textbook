# RAG Chatbot for Physical AI Humanoid Robotics Textbook

This project implements a Retrieval-Augmented Generation (RAG) chatbot that answers questions about the physical AI humanoid robotics textbook content. The solution uses OpenAI Agents SDKs with Google Gemini API, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud.

## Features

- Query the physical AI humanoid robotics textbook content via a chat interface
- Multi-turn conversations with context management
- Source citations for all responses
- Knowledge base management for indexing textbook content

## Tech Stack

- **Language**: Python 3.11+
- **Web Framework**: FastAPI
- **Vector Database**: Qdrant Cloud
- **Relational Database**: Neon Serverless Postgres
- **LLM Integration**: OpenAI Agents SDKs with Google Gemini API
- **Testing**: pytest

## Setup

### Prerequisites

- Python 3.11 or higher
- Access to Google Gemini API (API key)
- Access to Neon Serverless Postgres account
- Access to Qdrant Cloud account

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install python3-venv (Ubuntu/Debian systems)
   ```bash
   sudo apt update
   sudo apt install python3.12-venv
   ```

3. Set up virtual environment
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install --upgrade pip
   ```

4. Install dependencies using pip or uv
   Using pip:
   ```bash
   pip install -e .
   ```

   Using uv (faster installation):
   ```bash
   # Install uv first if not available
   pip install uv

   # Install dependencies with uv
   uv pip install -e .
   ```

4. Configure environment variables
   Create a `.env` file in the project root with the required API keys and configuration.

### Environment Configuration

Create a `.env` file in the project root with the following:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_API_KEY=your_qdrant_api_key_here

# Qdrant Configuration
QDRANT_HOST=your-qdrant-cluster-url
QDRANT_COLLECTION_NAME=textbook_knowledge_base

# Database Configuration
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# Application Settings
APP_ENV=development  # or production
LOG_LEVEL=INFO
```

## Running the Application

### Local Development
```bash
# Activate virtual environment
source venv/bin/activate

# Install project in development mode
pip install -e .
# Or using uv for faster installation:
# uv pip install -e .

# Run the application
uvicorn rag_chatbot.main:app --reload --host 0.0.0.0 --port 8000
```

## API Usage

### Submit a Query
```bash
curl -X POST "http://localhost:8000/v1/chat/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain the principles of humanoid locomotion",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Submit a Query with User-Selected Text
```bash
curl -X POST "http://localhost:8000/v1/chat/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain this concept further",
    "selected_text": "According to the textbook, humanoid locomotion is achieved through...",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Continue a Multi-Turn Conversation
```bash
curl -X POST "http://localhost:8000/v1/chat/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How does this relate to the previous concept?",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "conversation_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
  }'
```

### Get Conversation History
```bash
curl -X GET "http://localhost:8000/v1/chat/conversation/550e8400-e29b-41d4-a716-446655440000"
```

## Knowledge Base Operations

### Index Your Textbook Content
```bash
curl -X POST "http://localhost:8000/v1/knowledge/index" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your textbook content here...",
    "source_document": "physical_ai_humanoid_robotics_textbook.pdf",
    "metadata": {
      "title": "Physical AI and Humanoid Robotics",
      "author": "Textbook Author",
      "version": "1.0"
    }
  }'
```

### Search Knowledge Base Directly
```bash
curl -X POST "http://localhost:8000/v1/knowledge/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "humanoid locomotion",
    "top_k": 5
  }'
```

### Or use the CLI tool to index from a file
```bash
python -m backend.rag_chatbot.cli.index_textbook --file path/to/textbook.pdf
```

## Authentication & Rate Limiting

The API includes authentication via API key and rate limiting to prevent abuse:

### Using API Key Authentication
```bash
curl -X POST "http://localhost:8000/v1/chat/query" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain the principles of humanoid locomotion",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

## Additional Features

### Caching
The system implements intelligent caching for frequently asked questions to improve response times.

### Logging
Comprehensive logging is implemented for monitoring queries and responses. Set LOG_LEVEL in your environment to adjust verbosity.

## Testing

### Run Unit Tests
```bash
python -m pytest tests/unit/
```

### Run Integration Tests
```bash
python -m pytest tests/integration/
```

## API Documentation

The API documentation is automatically available at:
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Architecture

The application follows a modular architecture with distinct layers:

- **Models**: Data models and Pydantic schemas
- **Services**: Business logic and processing
- **API**: FastAPI routes and request/response handling
- **VectorDB**: Vector database operations
- **Database**: Relational database operations
- **CLI**: Command-line tools for administration

## Contributing

Please read our contributing guidelines before submitting pull requests.