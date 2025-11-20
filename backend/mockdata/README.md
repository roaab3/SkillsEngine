# Mock Data Directory

This directory contains realistic JSON mock data files for all external microservice APIs.

## Purpose

When external APIs are unavailable (timeout, 5xx errors, network issues), the system automatically falls back to these mock files to ensure continued operation.

## Files

- **users.json** - Mock user data
- **skills.json** - Mock skills taxonomy data
- **competencies.json** - Mock competencies taxonomy data
- **directory_ms_response.json** - Mock response from Directory MS
- **assessment_ms_exam_results.json** - Mock exam results from Assessment MS
- **course_builder_response.json** - Mock response from Course Builder MS
- **content_studio_response.json** - Mock response from Content Studio MS
- **learner_ai_response.json** - Mock gap analysis response from Learner AI MS
- **analytics_response.json** - Mock user profile data for Learning Analytics MS
- **rag_response.json** - Mock search results for RAG/Chatbot MS

## How It Works

1. **API Client** (`backend/src/utils/apiClient.js`) attempts to call the real API
2. If the call fails (timeout, 5xx, network error), it automatically loads the corresponding mock file
3. All fallbacks are logged to `customize/change_log.json` with `change_type: "api_fallback"`

## Usage

Mock data is automatically used when:
- API connection is refused (`ECONNREFUSED`)
- Request times out (`ETIMEDOUT`)
- DNS lookup fails (`ENOTFOUND`)
- Server returns 5xx error
- Network error occurs

## Updating Mock Data

To update mock data:
1. Edit the corresponding JSON file
2. Ensure the structure matches the expected API response format
3. Test with the API client to verify fallback behavior

## Logging

All API fallbacks are automatically logged to `customize/change_log.json` with:
- `change_type: "api_fallback"`
- Timestamp
- API name
- Error message
- Mock file used

