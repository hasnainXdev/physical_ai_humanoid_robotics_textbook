import { ChatRequest, ChatResponse } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/v1';

// Define custom error types for better error handling
export class APIError extends Error {
  public statusCode: number;
  public details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Function to get the authentication token (could be from localStorage, context, or other storage)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('chatbot-auth-token');
  }
  return null;
};

// Validation functions
const validateChatRequest = (request: ChatRequest): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate query
  if (!request.query || typeof request.query !== 'string') {
    errors.push('Query is required and must be a string');
  } else if (request.query.trim().length === 0) {
    errors.push('Query cannot be empty');
  } else if (request.query.length > 10000) {
    errors.push('Query is too long (max 10,000 characters)');
  }

  // Validate selected_text if provided
  if (request.selected_text && typeof request.selected_text !== 'string') {
    errors.push('Selected text must be a string if provided');
  } else if (request.selected_text && request.selected_text.length > 50000) {
    errors.push('Selected text is too long (max 50,000 characters)');
  }

  // Validate session_id
  if (!request.session_id || typeof request.session_id !== 'string') {
    errors.push('Session ID is required and must be a string');
  }

  // Validate conversation_id if provided
  if (request.conversation_id && typeof request.conversation_id !== 'string') {
    errors.push('Conversation ID must be a string if provided');
  }

  return { isValid: errors.length === 0, errors };
};

const validateChatResponse = (response: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required fields exist
  if (typeof response.response !== 'string') {
    errors.push('Response must contain a string response field');
  }
  if (typeof response.conversation_id !== 'string') {
    errors.push('Response must contain a string conversation_id field');
  }
  if (!Array.isArray(response.citations)) {
    errors.push('Response must contain a citations array');
  }

  // Validate optional fields
  if (response.confidence_score !== undefined &&
      (typeof response.confidence_score !== 'number' ||
      response.confidence_score < 0 ||
      response.confidence_score > 1)) {
    errors.push('Confidence score must be a number between 0 and 1');
  }

  if (response.model_used !== undefined && typeof response.model_used !== 'string') {
    errors.push('Model used must be a string if provided');
  }

  return { isValid: errors.length === 0, errors };
};

// Comprehensive logging function
const logError = (error: any, context: string, details?: any) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    details,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };

  // Log to console
  console.error(`[${context}]`, error, details || '');

  // In a real implementation, this might send logs to an external service
  // For example:
  // sendLogToService(errorLog);
};

// Rate limiting: track requests and implement client-side throttling
interface RequestTracker {
  timestamp: number;
  endpoint: string;
}

const REQUEST_LIMIT = 10; // Max 10 requests
const TIME_WINDOW = 60000; // Per minute (60,000 ms)
let requestHistory: RequestTracker[] = [];

// Function to check if a request should be allowed based on rate limits
const isRequestAllowed = (endpoint: string): boolean => {
  const now = Date.now();

  // Clean up old requests outside the time window
  requestHistory = requestHistory.filter(req => now - req.timestamp < TIME_WINDOW);

  // Count requests to the same endpoint in the time window
  const endpointRequests = requestHistory.filter(req => req.endpoint === endpoint);

  // Check if we're over the limit
  if (endpointRequests.length >= REQUEST_LIMIT) {
    logError('Rate limit exceeded', `API_RATE_LIMIT`, { endpoint, limit: REQUEST_LIMIT, timeWindow: TIME_WINDOW });
    return false;
  }

  // Add this request to the history
  requestHistory.push({ timestamp: now, endpoint });
  return true;
};

// Define a timeout for API requests
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Cache implementation for frequently accessed responses
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private store: Map<string, CacheEntry> = new Map();

  public get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    // Check if the entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  public set(key: string, data: any, ttl: number = 300000): void { // Default TTL: 5 minutes
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  public clear(): void {
    this.store.clear();
  }

  public remove(key: string): void {
    this.store.delete(key);
  }
}

const CACHE = new SimpleCache();

// Function to generate cache key for a request
const generateCacheKey = (url: string, body?: string): string => {
  if (body) {
    // For POST requests, include the body in the cache key
    return `${url}_${btoa(body).substring(0, 32)}`; // Using first 32 chars of base64 encoded body
  }
  return url;
};

// Performance monitoring: Track API response times
interface PerformanceTracker {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: number;
}

// Function to record performance metrics
const recordPerformance = (tracker: PerformanceTracker) => {
  // Log performance for monitoring
  console.info(`API Performance: ${tracker.method} ${tracker.url} took ${tracker.duration}ms (Status: ${tracker.status})`);

  // In a real implementation, this might send metrics to an external service
  // For example:
  // sendMetricsToService(tracker);

  // Flag if request is taking too long
  if (tracker.duration > 5000) { // More than 5 seconds
    logError(
      `Slow API request detected`,
      'PERFORMANCE_WARNING',
      { ...tracker, message: 'API request took more than 5 seconds' }
    );
  }
};

/**
 * Wrapper function to perform API requests with timeout, authentication, rate limiting, performance monitoring, and caching
 */
const apiRequest = async (url: string, options: RequestInit): Promise<Response> => {
  // Generate cache key
  const cacheKey = generateCacheKey(url, options.body as string);

  // Try to get response from cache first
  const cachedResult = CACHE.get(cacheKey);
  if (cachedResult && options.method === 'GET') {
    // Create a Response object from cached data
    return new Response(JSON.stringify(cachedResult.data), {
      status: cachedResult.status,
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Cache-Hit': 'true'
      })
    });
  }

  const startTime = Date.now();

  // Extract the endpoint for rate limiting purposes
  const endpoint = new URL(url).pathname;

  // Check if the request should be allowed based on rate limiting
  if (!isRequestAllowed(endpoint)) {
    throw new APIError(
      'Rate limit exceeded: Too many requests. Please slow down.',
      429,
      { type: 'rate_limit', retry_after: TIME_WINDOW / 1000 }
    );
  }

  // Get the auth token
  const authToken = getAuthToken();

  // Create options with auth header if token exists
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    }
  };

  // Create a timeout promise
  const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, REQUEST_TIMEOUT);
  });

  // Race between the actual request and the timeout
  const response = await Promise.race([
    fetch(url, requestOptions),
    timeoutPromise
  ]) as Response;

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Record performance metrics
  const tracker: PerformanceTracker = {
    url,
    method: options.method || 'GET',
    startTime,
    endTime,
    duration,
    status: response.status
  };

  recordPerformance(tracker);

  // If the request was successful and it's a GET request, cache the response
  if (response.ok && options.method === 'GET') {
    const responseClone = response.clone();
    const responseData = await responseClone.json();

    // Cache the response data with a TTL (time to live)
    CACHE.set(cacheKey, {
      data: responseData,
      status: response.status
    }, 300000); // Cache for 5 minutes
  }

  // Check if the response status indicates an error
  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch (e) {
      // If we can't parse the error body, use the status text
      errorDetails = { message: response.statusText };
    }

    // If authentication failed, we might want to clear the token
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('chatbot-auth-token');
    }

    // Log the API error with comprehensive details
    logError(
      `API request failed: ${response.statusText}`,
      'API_ERROR',
      {
        url,
        method: options.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        errorDetails,
        duration  // Also log the duration when there's an error
      }
    );

    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
      errorDetails
    );
  }

  return response;
};

/**
 * Submits a query to the RAG chatbot API
 */
export const submitQuery = async (request: ChatRequest): Promise<ChatResponse> => {
  // Validate the request before making the API call
  const validation = validateChatRequest(request);
  if (!validation.isValid) {
    const validationError = new APIError(
      `Invalid request: ${validation.errors.join(', ')}`,
      400,
      { type: 'validation_error', errors: validation.errors }
    );
    logError(validationError, 'SUBMIT_QUERY_VALIDATION_ERROR', { request, validationErrors: validation.errors });
    throw validationError;
  }

  try {
    const response = await apiRequest(`${API_BASE_URL}/chat/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const responseData = await response.json();

    // Validate the response from the API
    const responseValidation = validateChatResponse(responseData);
    if (!responseValidation.isValid) {
      const validationError = new APIError(
        `Invalid API response: ${responseValidation.errors.join(', ')}`,
        500,
        { type: 'response_validation_error', errors: responseValidation.errors }
      );
      logError(validationError, 'SUBMIT_QUERY_RESPONSE_VALIDATION_ERROR', {
        request,
        response: responseData,
        validationErrors: responseValidation.errors
      });
      throw validationError;
    }

    return responseData;
  } catch (error) {
    if (error instanceof APIError) {
      logError(error, 'SUBMIT_QUERY_API_ERROR', { request });
      throw error;
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      logError(error, 'SUBMIT_QUERY_NETWORK_ERROR', { request });
      throw new APIError('Network error: Unable to connect to the server', 0, { type: 'network' });
    } else {
      logError(error, 'SUBMIT_QUERY_UNEXPECTED_ERROR', { request, originalError: error });
      throw new APIError('An unexpected error occurred while processing your request', 0, error);
    }
  }
};

/**
 * Fetches conversation history by conversation ID
 */
export const getConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await apiRequest(`${API_BASE_URL}/chat/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      logError(error, 'GET_CONVERSATION_API_ERROR', { conversationId });
      throw error;
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      logError(error, 'GET_CONVERSATION_NETWORK_ERROR', { conversationId });
      throw new APIError('Network error: Unable to connect to the server', 0, { type: 'network' });
    } else {
      logError(error, 'GET_CONVERSATION_UNEXPECTED_ERROR', { conversationId, originalError: error });
      throw new APIError('An unexpected error occurred while fetching conversation', 0, error);
    }
  }
};

/**
 * Performs a direct knowledge search
 */
export const searchKnowledge = async (query: string, topK: number = 5): Promise<any> => {
  try {
    const response = await apiRequest(`${API_BASE_URL}/knowledge/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, top_k: topK }),
    });

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      logError(error, 'SEARCH_KNOWLEDGE_API_ERROR', { query, topK });
      throw error;
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      logError(error, 'SEARCH_KNOWLEDGE_NETWORK_ERROR', { query, topK });
      throw new APIError('Network error: Unable to connect to the server', 0, { type: 'network' });
    } else {
      logError(error, 'SEARCH_KNOWLEDGE_UNEXPECTED_ERROR', { query, topK, originalError: error });
      throw new APIError('An unexpected error occurred while searching knowledge', 0, error);
    }
  }
};