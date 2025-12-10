// Type for messages in the UI
export interface FrontendMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: Citation[];
  confidence_score?: number;
  status: 'sent' | 'pending' | 'error';
  conversationId: string;
}

// Type for context management in conversations
export interface ConversationContext {
  conversationSummary?: string;
  lastQuery?: string;
  lastResponse?: string;
  topic?: string;
  followUpContext?: string;
}

// Type for conversations in the UI
export interface FrontendConversation {
  id: string;
  title: string;
  messages: FrontendMessage[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

// Type for conversation list item in the UI
export interface ConversationListItem {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Type for API requests
export interface ChatRequest {
  query: string;
  selected_text?: string;
  conversation_id?: string;
  session_id: string;
}

// Type for API responses
export interface ChatResponse {
  response: string;
  conversation_id: string;
  citations: Citation[];
  confidence_score?: number;
  model_used?: string;
}

// Type for citations
export interface Citation {
  text_snippet: string;
  source_location: string;
  knowledge_chunk_id?: string;
}

// Type for query history
export interface QueryHistory {
  query: string;
  response: string;
  timestamp: string; // ISO date-time format
  citations: Citation[];
}

// Type for conversation responses
export interface ConversationResponse {
  conversation_id: string;
  title: string;
  queries: QueryHistory[];
}