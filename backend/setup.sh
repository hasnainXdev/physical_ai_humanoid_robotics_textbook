#!/bin/bash
# Setup script for RAG Chatbot development environment

set -e  # Exit on any error

echo "Setting up RAG Chatbot development environment..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | grep -oP '\d+\.\d+' | head -1)
if (( $(echo "$PYTHON_VERSION < 3.11" | bc -l) )); then
    echo "Error: Python 3.11 or higher is required. Found: $PYTHON_VERSION"
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
source venv/bin/activate
echo "Virtual environment activated."

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install the package in development mode
echo "Installing rag-chatbot in development mode..."
# Option to use uv for faster installation - install if available
if command -v uv &> /dev/null; then
    echo "Using uv for faster installation..."
    uv pip install -e .
else
    echo "Using pip for installation..."
    pip install -e .
    echo "Note: Install uv for faster dependency installation: pip install uv"
fi

echo "Setup complete!"
echo ""
echo "To activate the virtual environment in the future, run:"
echo "  source venv/bin/activate"
echo ""
echo "To start the application, run:"
echo "  uvicorn rag_chatbot.main:app --reload --host 0.0.0.0 --port 8000"