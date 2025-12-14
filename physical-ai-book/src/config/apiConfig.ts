// API Configuration for Docusaurus frontend
// This file provides the backend URL configuration for the frontend to connect to the backend API

// Default fallback URL - this should be changed based on your deployment environment
const DEFAULT_BACKEND_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000';

// Function to get backend URL with fallback
export const getBackendUrl = (): string => {
  // Check for window object to ensure we're in browser context
  if (typeof window !== 'undefined') {
    // Try to get from a global variable set by Docusaurus (if configured in docusaurus.config.ts)
    const url = (window as any).__BACKEND_URL__;
    if (url && typeof url === 'string') {
      return url;
    }
  }
  
  // Fallback to environment variable or default
  return DEFAULT_BACKEND_URL;
};

// Export the backend URL
export default getBackendUrl();