#!/bin/sh

# Set up the environment variables for the frontend build
# You can pass your server's public IP as an argument: ./deploy.sh 34.123.45.67
PUBLIC_IP=${1:-"localhost"}

echo "--- Building and deploying to Google Cloud (VM/Docker) ---"
echo "--- Using Public IP: $PUBLIC_IP ---"

# Step 1: Ensure we have the latest backend .env
if [ ! -f "tas-backend/.env" ]; then
    echo "ERROR: tas-backend/.env not found! Please create it with DATABASE_URL."
    exit 1
fi

# Step 2: Build and start with Docker Compose
# We pass the VITE_API_URL build argument for the React app to know where the backend is
VITE_API_URL="http://$PUBLIC_IP:3000" docker compose up -d --build

echo "--------------------------------------------------------"
echo "Deployment started!"
echo "Backend should be available at http://$PUBLIC_IP:3000"
echo "Frontend should be available at http://$PUBLIC_IP"
echo "--------------------------------------------------------"
