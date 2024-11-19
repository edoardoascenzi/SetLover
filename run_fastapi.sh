#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Pulling the latest changes from the repository..."
git pull

# Navigate to the FastAPI directory
cd FastAPI

echo "Setting up the virtual environment and installing dependencies..."

# Check if a virtual environment already exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists. Skipping creation."
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip to the latest version
echo "Upgrading pip..."
pip install --upgrade pip

# Install the required packages
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Skipping package installation."
fi

echo "Setup completed. Virtual environment is ready."

# Return to the parent directory (SetLover) to run uvicorn
cd ..

# Run the FastAPI application with uvicorn
echo "Starting FastAPI application..."
uvicorn FastAPI.main:app --host 127.0.0.1 --port 8000

