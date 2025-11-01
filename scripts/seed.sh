#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
MONGO_USER=${MONGO_USER:-admin}
MONGO_PASSWORD=${MONGO_PASSWORD:-admin123}
MONGO_DB=${MONGO_DB:-accounts-service}
MONGO_HOST=${MONGO_HOST:-localhost:27018}

# MongoDB connection string
MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?authSource=admin"

echo "🌱 Starting database seeding..."
echo ""

# Check if mongosh is available
if ! command -v mongosh &> /dev/null; then
    echo "❌ mongosh is not installed. Please install MongoDB Shell."
    echo "   Visit: https://www.mongodb.com/docs/mongodb-shell/install/"
    exit 1
fi

# Test connection
echo "📡 Connecting to MongoDB at ${MONGO_HOST}..."
if ! mongosh "${MONGO_URI}" --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "❌ Failed to connect to MongoDB. Please check:"
    echo "   - MongoDB is running (docker-compose ps)"
    echo "   - Connection settings in .env file"
    exit 1
fi

echo "✅ Connected to MongoDB"
echo ""

# Execute seed script
mongosh "${MONGO_URI}" --quiet <<EOF

echo ""
echo "🎉 Seeding completed successfully!"
echo ""
echo "👋 Done!"
