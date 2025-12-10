# Data Model: RAG Chatbot

## Core Entities

### Query
- **id**: string (auto-generated UUID)
- **content**: string (user's natural language question)
- **timestamp**: datetime (when the query was submitted)
- **userId**: string (optional, for tracking if implemented later)
- **metadata**: object (additional query parameters or options)

### Document (Knowledge Base Entry)
- **id**: string (auto-generated UUID)
- **content**: string (text content from the book)
- **source**: string (reference to original location in book)
- **embedding**: array<float> (vector representation of the content)
- **metadata**: object (additional document metadata like chapter, section)

### Response
- **id**: string (auto-generated UUID)
- **queryId**: string (reference to the original query)
- **content**: string (generated response to the user)
- **sourceCitations**: array<SourceCitation> (references to documents used)
- **timestamp**: datetime (when the response was generated)
- **relevanceScore**: float (confidence score for the response)

### SourceCitation
- **documentId**: string (reference to the document used)
- **sourceReference**: string (specific reference to location in book)
- **quotedText**: string (relevant excerpt from the source)

## Relationships

- A Query generates exactly one Response (1:1)
- A Response references multiple Documents through SourceCitations (1:Many)
- SourceCitations link to specific Documents (Many:1)

## Validation Rules

- Query content must not be empty or only whitespace
- Query content must be less than 200 words (based on clarification decision)
- Document embedding must be a valid vector array
- Response must include at least one source citation
- Relevance score must be between 0.0 and 1.0

## State Transitions

None required for this simple implementation - each query-response is independent with no maintained state between interactions.