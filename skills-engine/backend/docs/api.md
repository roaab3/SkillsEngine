# Skills Engine API Documentation

## Overview

The Skills Engine API provides endpoints for managing skills, competencies, and user profiles in the corporate learning ecosystem.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Competencies

#### GET /competencies
Get all competencies with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for competency name
- `level` (string): Filter by competency level (L1, L2, L3, L4)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SOFTWARE_DEVELOPMENT",
      "name": "Software Development",
      "description": "Core software development competencies",
      "level": "L1",
      "parent_id": null,
      "external_id": "SFIA_SDEV",
      "external_source": "SFIA",
      "metadata": {},
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /competencies/:id
Get a specific competency by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SOFTWARE_DEVELOPMENT",
    "name": "Software Development",
    "description": "Core software development competencies",
    "level": "L1",
    "parent_id": null,
    "external_id": "SFIA_SDEV",
    "external_source": "SFIA",
    "metadata": {},
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /competencies
Create a new competency.

**Request Body:**
```json
{
  "code": "NEW_COMPETENCY",
  "name": "New Competency",
  "description": "Description of the new competency",
  "level": "L2",
  "parent_id": 1,
  "external_id": "EXT_001",
  "external_source": "CUSTOM",
  "metadata": {}
}
```

#### PUT /competencies/:id
Update an existing competency.

#### DELETE /competencies/:id
Delete a competency.

### Skills

#### GET /skills
Get all skills with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for skill name
- `level` (string): Filter by skill level (L1, L2, L3, L4)
- `competency_id` (number): Filter by competency ID

#### GET /skills/:id
Get a specific skill by ID.

#### POST /skills
Create a new skill.

#### PUT /skills/:id
Update an existing skill.

#### DELETE /skills/:id
Delete a skill.

#### POST /skills/normalize
Normalize skills using AI.

**Request Body:**
```json
{
  "skills": [
    "JavaScript",
    "Python",
    "React"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "original": "JavaScript",
      "normalized": "javascript",
      "confidence": 0.95,
      "suggestions": ["JavaScript", "JS", "ECMAScript"]
    }
  ]
}
```

### Users

#### GET /users/:id/profile
Get user competency profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "Software Developer",
    "competencies": [
      {
        "competency_id": 1,
        "name": "Software Development",
        "level": "Advanced",
        "completion_percentage": 75.5,
        "is_verified": true,
        "verified_at": "2024-01-01T00:00:00Z"
      }
    ],
    "skills": [
      {
        "skill_id": 1,
        "name": "JavaScript",
        "level": "Expert",
        "proficiency_score": 90.0,
        "is_verified": true,
        "verified_at": "2024-01-01T00:00:00Z"
      }
    ],
    "progress_summary": {
      "total_competencies": 5,
      "completed_competencies": 3,
      "total_skills": 20,
      "verified_skills": 15,
      "overall_progress": 65.5
    }
  }
}
```

#### GET /users/:id/competencies
Get user competencies.

#### GET /users/:id/skills
Get user skills.

#### GET /users/:id/gaps
Get user skill gaps.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "skill_id": 5,
      "skill_name": "Python",
      "competency_id": 1,
      "competency_name": "Software Development",
      "required_level": "Intermediate",
      "current_level": "Beginner",
      "priority": "High",
      "recommendations": [
        {
          "type": "course",
          "title": "Python Fundamentals",
          "url": "https://learning.company.com/python-fundamentals"
        }
      ]
    }
  ]
}
```

### Gap Analysis

#### GET /gaps/:user_id
Get skill gaps for a user.

#### POST /gaps/analyze
Perform gap analysis.

**Request Body:**
```json
{
  "user_id": 1,
  "competency_id": 1,
  "target_level": "Expert"
}
```

#### GET /gaps/:user_id/summary
Get gap analysis summary.

### Events

#### POST /events/user-created
Handle user created event.

#### POST /events/assessment-completed
Handle assessment completed event.

#### POST /events/skill-verified
Handle skill verified event.

### AI

#### POST /ai/normalize-skills
Normalize skills using AI.

#### POST /ai/extract-skills
Extract skills from text using AI.

#### POST /ai/semantic-similarity
Find semantically similar skills.

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00Z",
    "path": "/api/v1/competencies",
    "method": "GET"
  }
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

API requests are rate limited to 100 requests per 15-minute window per IP address.

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## Filtering and Search

Many endpoints support filtering and search:
- `search`: Text search across relevant fields
- `level`: Filter by skill/competency level
- `verified`: Filter by verification status
- `active`: Filter by active status

## Examples

### Get all competencies
```bash
curl -X GET "http://localhost:3000/api/v1/competencies" \
  -H "Authorization: Bearer <token>"
```

### Create a new skill
```bash
curl -X POST "http://localhost:3000/api/v1/skills" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "REACT",
    "name": "React",
    "description": "React JavaScript library",
    "level": "L3",
    "parent_id": 1
  }'
```

### Get user profile
```bash
curl -X GET "http://localhost:3000/api/v1/users/1/profile" \
  -H "Authorization: Bearer <token>"
```
