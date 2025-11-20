#!/bin/bash

# Start Backend Server Script
# Usage: ./start-backend.sh

echo "🚀 Starting Skills Engine Backend..."
echo ""

cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from env.example..."
    cp env.example .env
    echo "✅ .env created. Please update DATABASE_URL in backend/.env"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check database connection
echo "🔍 Checking database connection..."
node check-connection.js
DB_STATUS=$?

if [ $DB_STATUS -eq 0 ]; then
    echo ""
    echo "✅ Database connection OK"
    echo ""
    echo "🚀 Starting backend server..."
    echo "📡 Server will run on: http://localhost:8080"
    echo "📊 Health check: http://localhost:8080/health"
    echo ""
    npm run dev
else
    echo ""
    echo "⚠️  Database connection failed!"
    echo "💡 You can still run the server, but database operations will fail."
    echo "💡 To fix: Update DATABASE_URL in backend/.env"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting backend server anyway..."
        npm run dev
    else
        echo "❌ Aborted. Please fix database connection first."
        exit 1
    fi
fi

