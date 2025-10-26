# Skills Engine API Documentation

## Overview

The Skills Engine provides a comprehensive REST API for managing skills, competencies, and user profiles. This API follows RESTful principles and uses JSON for data exchange.

## Base URL

```
Production: https://api.skills-engine.com
Staging: https://staging-api.skills-engine.com
Development: http://localhost:3001
```

## Authentication

The API uses OAuth 2.0 with JWT tokens for authentication.

### Getting an Access Token

```bash
POST /oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

### Using the Access Token

Include the access token in the Authorization header:

```bash
Authorization: Bearer your_access_token
```

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per client
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 Too Many Requests

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Endpoints

### Skills

#### List Skills
```bash
GET /api/skills
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search term for skill names
- `type` (optional): Filter by skill type (L1, L2, L3, L4)
- `company_id` (optional): Filter by company-specific skills

**Response:**
```json
{
  "data": [
    {
      "id": "skill_123",
      "name": "JavaScript",
      "type": "L3",
      "code": "JS",
      "description": "Programming language for web development",
      "external_id": "ESCO_123",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Get Skill
```bash
GET /api/skills/{id}
```

**Response:**
```json
{
  "data": {
    "id": "skill_123",
    "name": "JavaScript",
    "type": "L3",
    "code": "JS",
    "description": "Programming language for web development",
    "external_id": "ESCO_123",
    "parent_skills": [
      {
        "id": "skill_456",
        "name": "Programming Languages",
        "type": "L2"
      }
    ],
    "child_skills": [
      {
        "id": "skill_789",
        "name": "ES6+ Features",
        "type": "L4"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Create Skill
```bash
POST /api/skills
Content-Type: application/json

{
  "name": "React",
  "type": "L3",
  "code": "REACT",
  "description": "JavaScript library for building user interfaces",
  "parent_skill_id": "skill_123",
  "company_id": "company_456"
}
```

#### Update Skill
```bash
PUT /api/skills/{id}
Content-Type: application/json

{
  "name": "React.js",
  "description": "JavaScript library for building user interfaces"
}
```

#### Delete Skill
```bash
DELETE /api/skills/{id}
```

### Competencies

#### List Competencies
```bash
GET /api/competencies
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search term
- `category` (optional): Filter by category
- `company_id` (optional): Filter by company

**Response:**
```json
{
  "data": [
    {
      "id": "comp_123",
      "name": "Frontend Development",
      "behavioral_definition": "Ability to create user interfaces using modern web technologies",
      "category": "Technical",
      "description": "Frontend development competency",
      "standard_id": "SFIA_123",
      "related_skills": ["skill_123", "skill_456"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Get Competency
```bash
GET /api/competencies/{id}
```

#### Create Competency
```bash
POST /api/competencies
Content-Type: application/json

{
  "name": "Backend Development",
  "behavioral_definition": "Ability to create server-side applications and APIs",
  "category": "Technical",
  "description": "Backend development competency",
  "related_skills": ["skill_789", "skill_101"]
}
```

### User Profiles

#### Get User Profile
```bash
GET /api/users/{user_id}/profile
```

**Response:**
```json
{
  "data": {
    "user_id": "user_123",
    "name": "John Doe",
    "company_id": "company_456",
    "competencies": [
      {
        "competency_id": "comp_123",
        "name": "Frontend Development",
        "level": "Advanced",
        "progress_percentage": 75,
        "verification_source": "Assessment",
        "last_evaluate": "2024-01-15T10:30:00Z"
      }
    ],
    "skills": [
      {
        "skill_id": "skill_123",
        "name": "JavaScript",
        "verified": true,
        "verification_source": "Assessment",
        "last_evaluate": "2024-01-15T10:30:00Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Update User Skills
```bash
PUT /api/users/{user_id}/skills
Content-Type: application/json

{
  "skills": [
    {
      "skill_id": "skill_123",
      "verified": true,
      "verification_source": "Manual",
      "last_evaluate": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Gap Analysis

#### Get Skill Gaps
```bash
GET /api/users/{user_id}/gaps
```

**Query Parameters:**
- `target_competency_id` (optional): Filter gaps for specific competency
- `include_recommendations` (optional): Include learning recommendations

**Response:**
```json
{
  "data": {
    "user_id": "user_123",
    "gaps": [
      {
        "competency_id": "comp_123",
        "competency_name": "Frontend Development",
        "missing_skills": [
          {
            "skill_id": "skill_456",
            "name": "CSS Grid",
            "type": "L3",
            "priority": "High"
          }
        ],
        "gap_percentage": 25,
        "recommendations": [
          {
            "type": "course",
            "title": "CSS Grid Fundamentals",
            "provider": "Course Provider",
            "estimated_duration": "4 hours"
          }
        ]
      }
    ],
    "overall_gap_percentage": 15,
    "generated_at": "2024-01-15T10:30:00Z"
  }
}
```

### Assessment Integration

#### Process Assessment Results
```bash
POST /api/assessments/results
Content-Type: application/json

{
  "user_id": "user_123",
  "assessment_id": "assessment_456",
  "results": [
    {
      "skill_id": "skill_123",
      "score": 85,
      "max_score": 100,
      "completed_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "user_id": "user_123",
    "assessment_id": "assessment_456",
    "processed_skills": [
      {
        "skill_id": "skill_123",
        "verified": true,
        "verification_source": "Assessment",
        "last_evaluate": "2024-01-15T10:30:00Z"
      }
    ],
    "updated_competencies": [
      {
        "competency_id": "comp_123",
        "new_level": "Advanced",
        "progress_percentage": 80
      }
    ],
    "processed_at": "2024-01-15T10:30:00Z"
  }
}
```

### Health Check

#### System Health
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "kafka": "healthy",
    "openai": "healthy"
  },
  "uptime": "7d 12h 30m"
}
```

## Webhooks

### Webhook Events

The Skills Engine can send webhooks for important events:

#### Skill Gap Detected
```json
{
  "event": "skill_gap_detected",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "user_id": "user_123",
    "competency_id": "comp_123",
    "missing_skills": ["skill_456"],
    "gap_percentage": 25
  }
}
```

#### Profile Updated
```json
{
  "event": "profile_updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "user_id": "user_123",
    "updated_competencies": ["comp_123"],
    "updated_skills": ["skill_456"]
  }
}
```

### Webhook Configuration

```bash
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/skills-engine",
  "events": ["skill_gap_detected", "profile_updated"],
  "secret": "your_webhook_secret"
}
```

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install @skills-engine/sdk
```

```javascript
import { SkillsEngineClient } from '@skills-engine/sdk';

const client = new SkillsEngineClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.skills-engine.com'
});

// Get user profile
const profile = await client.users.getProfile('user_123');

// Get skill gaps
const gaps = await client.users.getGaps('user_123');
```

### Python
```bash
pip install skills-engine-sdk
```

```python
from skills_engine import SkillsEngineClient

client = SkillsEngineClient(
    api_key='your_api_key',
    base_url='https://api.skills-engine.com'
)

# Get user profile
profile = client.users.get_profile('user_123')

# Get skill gaps
gaps = client.users.get_gaps('user_123')
```

## Rate Limits and Quotas

| Endpoint Type | Rate Limit | Burst Limit |
|---------------|------------|-------------|
| Read Operations | 1000/hour | 100/minute |
| Write Operations | 500/hour | 50/minute |
| Webhooks | 100/hour | 10/minute |

## Support

For API support:
- **Documentation**: [API Docs](https://docs.skills-engine.com)
- **Support Email**: api-support@skills-engine.com
- **Status Page**: [status.skills-engine.com](https://status.skills-engine.com)

