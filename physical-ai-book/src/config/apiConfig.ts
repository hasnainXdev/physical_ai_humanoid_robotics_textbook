// API Configuration for Docusaurus frontend
// This file provides the backend URL configuration for the frontend to connect to the backend API

// Default fallback URL - this should be changed based on your deployment environment
const DEFAULT_BACKEND_URL = process.env.FASTAPI_BASE_URL;

// Function to get backend URL with fallback
export const getBackendUrl = (): string => {
  // Check for window object to ensure we're in browser context
  if (typeof window !== 'undefined') {

    // Fallback to environment variable or default
    return DEFAULT_BACKEND_URL;
  };
}

// Export the backend URL
export default getBackendUrl();