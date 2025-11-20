#!/bin/bash

# Run all tests script

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Running All Tests"
echo "===================="
echo ""

# Backend tests
echo -e "${YELLOW}Backend Tests${NC}"
cd backend
npm test
cd ..

echo ""

# Frontend tests
echo -e "${YELLOW}Frontend Tests${NC}"
cd frontend
npm test
cd ..

echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"

