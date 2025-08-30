#!/bin/bash

echo "🚀 Starting WorkSpace AI Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting backend server on port 5001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment is ready!"
echo "📊 Frontend: http://localhost:8080 (or next available port)"
echo "🔧 Backend:  http://localhost:5001"
echo "📝 API Health: http://localhost:5001/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait 