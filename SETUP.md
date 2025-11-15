# Skills Engine - Setup Guide

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Git
- npm or yarn

---

## 🔧 Environment Setup

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/skills_engine
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skills_engine
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Authentication & Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
API_KEY=your_api_key_here

# Microservice Integration Tokens
# Each microservice requires its own authentication token
DIRECTORY_SERVICE_TOKEN=your_directory_service_token
ASSESSMENT_SERVICE_TOKEN=your_assessment_service_token
CONTENT_STUDIO_TOKEN=your_content_studio_token
COURSE_BUILDER_TOKEN=your_course_builder_token
LEARNER_AI_TOKEN=your_learner_ai_token
LEARNING_ANALYTICS_TOKEN=your_learning_analytics_token
RAG_CHATBOT_TOKEN=your_rag_chatbot_token

# Microservice Base URLs
DIRECTORY_SERVICE_URL=http://localhost:3001
ASSESSMENT_SERVICE_URL=http://localhost:3002
CONTENT_STUDIO_URL=http://localhost:3003
COURSE_BUILDER_URL=http://localhost:3004
LEARNER_AI_URL=http://localhost:3005
LEARNING_ANALYTICS_URL=http://localhost:3006
RAG_CHATBOT_URL=http://localhost:3007

# Redis Configuration (if using caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_FLASH_MODEL=gemini-flash
GEMINI_DEEP_SEARCH_MODEL=gemini-deep-search

# Logging
LOG_LEVEL=info
LOG_FILE=logs/skills-engine.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Environment File Template

Copy `backend/env.example` to `backend/.env` and fill in the values:

```bash
cp backend/env.example backend/.env
# Edit backend/.env with your configuration
```

---

## 🚀 Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd Skills_Engine_dev
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb skills_engine

# Run migrations
cd ../backend
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 5. Configure Environment Variables

```bash
# Copy example environment file
cp env.example .env

# Edit .env file with your configuration
# Make sure to set all required tokens and URLs
```

### 6. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔐 Security Configuration

### Token Management

Each microservice integration requires its own authentication token. Store tokens securely:

1. **Development:** Use `.env` file (never commit to git)
2. **Production:** Use environment variables or secure secret management
3. **Token Rotation:** Implement token refresh/rotation mechanism

### Required Tokens

- `DIRECTORY_SERVICE_TOKEN` - For Directory microservice integration
- `ASSESSMENT_SERVICE_TOKEN` - For Assessment microservice integration
- `CONTENT_STUDIO_TOKEN` - For Content Studio microservice integration
- `COURSE_BUILDER_TOKEN` - For Course Builder microservice integration
- `LEARNER_AI_TOKEN` - For Learner AI microservice integration
- `LEARNING_ANALYTICS_TOKEN` - For Learning Analytics microservice integration
- `RAG_CHATBOT_TOKEN` - For RAG/Chatbot microservice integration

---

## 📁 Project Structure

```
Skills_Engine_dev/
├── backend/              # Node.js + Express backend
│   ├── src/
│   ├── dist/
│   ├── .env              # Environment variables (not in git)
│   ├── env.example        # Environment template
│   └── package.json
├── frontend/             # React frontend
│   ├── src/
│   └── package.json
├── database/             # PostgreSQL schemas and migrations
├── docs/                 # Documentation
├── tests/                # Test files
├── scripts/              # Setup and deployment scripts
├── .github/              # CI/CD pipelines
└── customize/            # Project customization and change logs
```

---

## 🧪 Testing Setup

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 🐳 Docker Setup (Optional)

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: skills_engine
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

Run with:
```bash
docker-compose up -d
```

---

## 📝 Development Workflow

1. **Start Database:** Ensure PostgreSQL is running
2. **Set Environment Variables:** Configure `.env` file
3. **Install Dependencies:** Run `npm install` in backend and frontend
4. **Run Migrations:** Set up database schema
5. **Start Servers:** Run backend and frontend in development mode
6. **Verify Integration:** Test microservice connections with tokens

---

## 🔍 Verification Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Database created (`skills_engine`)
- [ ] Environment variables configured (`.env` file)
- [ ] All microservice tokens configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database migrations run successfully
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Microservice integrations tested

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb skills_engine`

**Token Authentication Failures:**
- Verify all microservice tokens are set in `.env`
- Check token format and validity
- Ensure microservice URLs are correct

**Port Already in Use:**
- Change `PORT` in `.env` file
- Or stop the process using the port

---

## 📚 Additional Resources

- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [API Documentation](../docs/API.md)
- [Development Guide](../docs/DEVELOPMENT.md)

---

**Last Updated:** 2025-01-27

