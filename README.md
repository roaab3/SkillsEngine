# Skills Engine Microservice

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Status:** Development

---

## 🚀 Quick Start

```bash
# Run the setup script
./setup.sh

# Or manually:
cd backend && npm install && cp env.example .env
cd ../frontend && npm install && cp .env.local.example .env.local
```

For detailed setup instructions, see [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

---

## 📋 Overview

Skills Engine is a microservice that manages skills and competencies taxonomy, user profiles, gap analysis, and AI-powered extraction. It serves as the central skills management system for the EduCora AI platform.

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Lucide Icons

**Backend:**
- Node.js 18+
- Express.js
- PostgreSQL (Supabase)

**Database:**
- PostgreSQL
- Supabase (hosting)

**AI Integration:**
- Google Gemini API (Flash & Pro models)

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- Database: Supabase

## 📁 Project Structure

```
Skills_Engine_dev/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access layer
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── handlers/      # Microservice handlers
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── config/            # Configuration files
│   ├── tests/             # Test files
│   └── package.json
│
├── frontend/              # Frontend (Next.js)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities & API client
│   │   └── styles/        # CSS files
│   └── package.json
│
├── database/              # Database migrations
│   └── migrations/
│       └── 000_initial_schema.sql
│
├── docs/                  # Documentation
│   ├── step_2_requirements_document.md
│   ├── step_3_feature_specifications.md
│   ├── step_4_ux_user_flow_design.md
│   ├── step_5_database_schema_design.md
│   ├── step_6_api_design_contracts.md
│   └── architecture_design.md
│
├── tests/                 # Integration & E2E tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/               # Deployment & utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL (or Supabase account)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Skills_Engine_dev
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Database Setup**
   ```bash
   # Connect to your PostgreSQL database (Supabase)
   # Run the migration file:
   psql -h <host> -U <user> -d <database> -f database/migrations/000_initial_schema.sql
   ```

### Running Locally

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests
npm run test:coverage # Generate coverage report
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

## 📚 API Documentation

### Base URL

- **Development:** `http://localhost:8080`
- **Production:** `https://{project-name}.up.railway.app`

### Key Endpoints

**User Profile:**
- `GET /api/user/{userId}/profile` - Get user profile with competencies and skills

**Competencies:**
- `GET /api/competencies/parents` - Get all parent competencies
- `GET /api/competencies/{id}` - Get competency by ID
- `POST /api/competencies/import` - Import CSV (Trainer only)

**Skills:**
- `GET /api/skills/roots` - Get all root (L1) skills
- `GET /api/skills/{id}` - Get skill by ID
- `GET /api/skills/{id}/tree` - Get skill hierarchy tree

**Unified Data Exchange Protocol:**
- `POST /api/fill-content-metrics/` - Single endpoint for all microservice communications

See `docs/step_6_api_design_contracts.md` for complete API documentation.

## 🔐 Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer <token>
```

## 🌐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=8080
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key

# AI (Gemini)
GEMINI_API_KEY=your-api-key
GEMINI_FLASH_MODEL=gemini-1.5-flash
GEMINI_DEEP_SEARCH_MODEL=gemini-1.5-pro
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
# Optional: Set to true to force the frontend to use mock data from public/mockdata
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## 📖 Documentation

- **Requirements:** `docs/step_2_requirements_document.md`
- **Features:** `docs/step_3_feature_specifications.md`
- **UI/UX Design:** `docs/step_4_ux_user_flow_design.md`
- **Database Schema:** `docs/step_5_database_schema_design.md`
- **API Contracts:** `docs/step_6_api_design_contracts.md`
- **Architecture:** `docs/architecture_design.md`

## 🚢 Deployment

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy on push to main branch

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel will automatically deploy on push to main branch

### Database (Supabase)

1. Create a new Supabase project
2. Run migrations via Supabase SQL editor or CLI
3. Get connection string from Supabase dashboard

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 License

MIT

## 👥 Team

Skills Engine Team

---

For more details, see the documentation in the `docs/` directory.

