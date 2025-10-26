# Skills Engine - Full-Stack Application

A comprehensive full-stack application for managing skills and competencies with a React frontend and Node.js backend.

## 🏗️ Project Structure

```
skills-engine/
├── backend/                 # Node.js/TypeScript API
│   ├── src/                # Backend source code
│   ├── database/           # Database migrations
│   ├── docs/              # API documentation
│   ├── monitoring/        # Monitoring configurations
│   └── package.json       # Backend dependencies
├── frontend/               # React.js/TypeScript UI
│   ├── src/               # Frontend source code
│   └── package.json       # Frontend dependencies
├── package.json           # Monorepo configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skills-engine.git
   cd skills-engine
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start both backend and frontend**
   ```bash
   npm run dev
   ```

### Individual Services

**Backend only:**
```bash
cd backend
npm install
npm run dev
# API runs on http://localhost:3000
```

**Frontend only:**
```bash
cd frontend
npm install
npm start
# UI runs on http://localhost:3001
```

## 🎯 Features

### Backend (Node.js/TypeScript)
- ✅ RESTful API with hierarchical skills system
- ✅ 4-level skill taxonomy (L1-L4) with dynamic level calculation
- ✅ Mock database with comprehensive skill data
- ✅ Competency and skill management
- ✅ User profile tracking
- ✅ Docker configuration
- ✅ CI/CD pipeline

### Frontend (React.js/TypeScript)
- ✅ Responsive user interface
- ✅ Competency cards with progress tracking
- ✅ Skill gap analysis with priority recommendations
- ✅ Dark/Light theme toggle
- ✅ Mobile-responsive design
- ✅ Professional Dark Emerald color palette

## 📊 API Endpoints

### Competencies
- `GET /api/v1/competencies` - List all competencies
- `GET /api/v1/competencies/:id` - Get specific competency
- `GET /api/v1/competencies/:id/skills` - Get skills for competency
- `GET /api/v1/competencies/:id/tree` - Get competency tree

### Skills
- `GET /api/v1/skills` - List all skills
- `GET /api/v1/skills/:id` - Get specific skill
- `GET /api/v1/skills/:id/competencies` - Get competencies for skill
- `GET /api/v1/skills/:id/tree` - Get skill hierarchy tree

### Users
- `GET /api/v1/users/:id` - Get user profile
- `GET /api/v1/users/:id/competencies` - Get user competencies
- `GET /api/v1/users/:id/skills` - Get user skills

## 🛠️ Development

### Available Scripts

**Monorepo Commands:**
- `npm run dev` - Start both backend and frontend
- `npm run build` - Build both applications
- `npm run test` - Run all tests
- `npm run install:all` - Install all dependencies

**Backend Commands:**
- `npm run dev:backend` - Start backend only
- `npm run build:backend` - Build backend
- `npm run test:backend` - Test backend

**Frontend Commands:**
- `npm run dev:frontend` - Start frontend only
- `npm run build:frontend` - Build frontend
- `npm run test:frontend` - Test frontend

### Docker Support

```bash
# Build and run with Docker
npm run docker:build
npm run docker:up

# Stop Docker containers
npm run docker:down
```

## 🎨 UI Features

### User Profile Dashboard
- **Competency Cards**: Visual representation of user's competencies
- **Progress Tracking**: Animated progress bars showing completion percentage
- **Skill Verification**: ✅ Verified skills, ❌ Missing skills
- **Responsive Design**: Works on desktop, tablet, and mobile

### Theme Support
- **Dark/Light Mode**: Toggle between themes
- **Professional Design**: Dark Emerald color palette
- **Smooth Animations**: Enhanced user experience

### Missing Skills Analysis
- **Categorized Skills**: Grouped by skill type (Frontend, AI/ML, DevOps, etc.)
- **Priority Levels**: High, Medium, Low priority skills
- **Action Buttons**: "Find Courses" and "Learn More" for each skill

## 📈 Data Structure

### Hierarchical Skills System
```
JavaScript (Level 1)
├── Core Fundamentals (Level 2)
│   ├── Variables & Data Types (Level 3)
│   ├── Operators (Level 3)
│   └── Control Structures (Level 3)
├── Functions (Level 2)
├── Data Structures (Level 2)
└── Modern JavaScript (Level 2)
    ├── ES6+ Features (Level 3)
    └── Async/Await (Level 3)
```

**Dynamic Level Calculation**: The system automatically determines levels based on hierarchy depth - no fixed level count!

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skills_engine
DB_USER=postgres
DB_PASSWORD=password
REDIS_URL=redis://localhost:6379
KAFKA_BROKER=localhost:9092
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker-compose up -d
```

### Individual Services
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start
```

## 📚 Documentation

- [Backend API Documentation](backend/docs/api.md)
- [Architecture Guide](backend/docs/architecture.md)
- [Deployment Guide](backend/docs/deployment.md)
- [Frontend Documentation](frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- React.js for the frontend framework
- Node.js for the backend runtime
- TypeScript for type safety
- All the amazing open-source libraries used in this project

---

**Skills Engine** - Empowering organizations with intelligent skills management! 🚀