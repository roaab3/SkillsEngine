#!/bin/bash

# Frontend-Backend Connection Test Script
# Usage: ./scripts/test-connection.sh

echo "🔍 Testing Frontend-Backend Connection..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

BACKEND_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8080}"

echo -e "${BLUE}📡 Backend URL: ${BACKEND_URL}${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Testing: Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}  ✅ Health Check: SUCCESS (200)${NC}"
    HEALTH_DATA=$(curl -s "${BACKEND_URL}/health")
    echo -e "${BLUE}     Response: ${HEALTH_DATA}${NC}"
else
    echo -e "${RED}  ❌ Health Check: FAILED (${HEALTH_RESPONSE})${NC}"
    echo -e "${YELLOW}     💡 Backend might not be running${NC}"
fi
echo ""

# Test 2: Root Endpoint
echo -e "${YELLOW}Testing: Root Endpoint...${NC}"
ROOT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/")
if [ "$ROOT_RESPONSE" = "200" ]; then
    echo -e "${GREEN}  ✅ Root Endpoint: SUCCESS (200)${NC}"
else
    echo -e "${RED}  ❌ Root Endpoint: FAILED (${ROOT_RESPONSE})${NC}"
fi
echo ""

# Test 3: API Endpoint
echo -e "${YELLOW}Testing: Competencies API...${NC}"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/competencies")
if [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}  ✅ Competencies API: SUCCESS (200)${NC}"
else
    echo -e "${RED}  ❌ Competencies API: FAILED (${API_RESPONSE})${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}📊 Connection Test Complete${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}🎉 Backend is running and accessible!${NC}"
    echo -e "${GREEN}✅ Frontend-Backend connection is working!${NC}"
else
    echo -e "${RED}❌ Backend is not accessible${NC}"
    echo -e "${YELLOW}💡 Make sure backend is running:${NC}"
    echo -e "${YELLOW}   cd backend && npm run dev${NC}"
fi

