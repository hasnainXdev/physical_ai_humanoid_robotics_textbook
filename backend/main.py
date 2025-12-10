from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi
from config import settings
from logging_config import setup_logging
from rate_limiting import setup_rate_limiting, limiter
import logging

# Initialize logging
logger = setup_logging(settings.log_level)

# Create FastAPI app instance
app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG (Retrieval-Augmented Generation) Chatbot that answers questions about physical AI humanoid robotics textbook content",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup rate limiting
setup_rate_limiting(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(APIRouter)

@app.get("/")
async def root():
    return {"message": "Welcome to the RAG Chatbot API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-chatbot-api"}

# Request/response validation middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logging.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Response status: {response.status}")
    return response

# Error handling
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors and return user-friendly messages"""
    logging.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Invalid request data",
            "details": exc.errors()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logging.error(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "http_error",
            "message": str(exc.detail)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logging.error(f"General error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred"
        }
    )

# Additional routes can be added here as needed
# For example, version endpoint, system info, etc.