# Skills Engine - Complete Implementation

A comprehensive skills and competency intelligence system that helps organizations and individuals identify skill gaps, map competencies to real-world job roles, and guide personalized upskilling based on data-driven insights.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/skills-engine.git
   cd skills-engine
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   cd backend
   npm run migrate:dev
   npm run seed:dev
   ```

5. **Start the development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **Skills & Competency Management**: Four-layer skill taxonomy (L1-L4) with hierarchical relationships
- **User Skill Profiles**: Track user skills and proficiency levels with verification status
- **Gap Analysis**: Automated identification of missing skills for target competencies
- **Multi-Tenant Support**: Company-specific competencies with global skill taxonomy
- **Assessment Integration**: Real-time skill verification from assessment results
- **AI-Powered Extraction**: Automatic skill extraction from resumes and job descriptions

### User Experience
- **Competency Dashboard**: Visual grid of competency cards with progress tracking
- **Skill Gap Visualization**: Clear identification of missing skills and learning paths
- **Real-Time Updates**: Live updates when assessment results arrive
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation support

### Integration Capabilities
- **REST APIs**: Comprehensive API for external service integration
- **Event-Driven Architecture**: Kafka-based event processing for real-time updates
- **Microservice Integration**: Seamless integration with Directory, Assessment, Course Builder, and Learning Analytics services

## 🏗️ Architecture

### System Architecture
The Skills Engine follows an **Onion Architecture** pattern with clear separation of concerns:

- **Domain Layer**: Core entities (Skill, Competency, UserSkill) and domain services
- **Application Layer**: Business use cases (Profile Initialization, Verification Processing, Gap Analysis)
- **Infrastructure Layer**: Database access, Kafka, OpenAI API, and external integrations
- **Presentation Layer**: REST Controllers and API Gateway

### Key Workflows
1. **Profile Initialization**: UserCreatedEvent → AI skill extraction → taxonomy mapping → assessment generation
2. **Verification & Recalculation**: AssessmentResultAvailableEvent → skill updates → competency recalculation → gap analysis
3. **Skill Discovery**: Course Builder request → semantic search → external framework query → normalized results

### Database Schema
- **Core Tables**: user, user_competency, user_skill, competency, skill
- **Relationship Tables**: competency_skill, skill_subskill, competency_subcompetency
- **Multi-Tenant**: Company isolation via id_company with data segregation
- **Verification System**: Audit trail with verification sources and evaluation tracking

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with pgvector for semantic search
- **Messaging**: Kafka for event-driven architecture
- **AI Integration**: OpenAI API for skill extraction and normalization
- **Testing**: Jest for unit and integration tests

### Frontend
- **Framework**: React with Next.js
- **Language**: JavaScript with JSX
- **Build Tool**: Vite
- **Styling**: CSS with Dark Emerald theme
- **Testing**: Vitest for component testing

### Infrastructure
- **Backend Hosting**: Railway
- **Frontend Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: OpenTelemetry, Prometheus, Grafana, Jaeger
- **Error Tracking**: Sentry
- **Logging**: ELK/EFK stack

## 🚀 Development

### Development Setup
See [Development Guide](docs/DEVELOPMENT.md) for detailed setup instructions.

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety for backend
- **Testing**: 85%+ code coverage requirement

### Git Workflow
1. Create feature branch from `develop`
2. Make changes with tests
3. Submit pull request
4. Code review and approval
5. Merge to `develop`
6. Deploy to staging for testing
7. Merge to `main` for production deployment

## 🚀 Deployment

### Environments
- **Development**: Local development with Docker containers
- **Staging**: Staging environment for testing and validation
- **Production**: Production environment with monitoring and alerts

### Deployment Process
See [Deployment Guide](DEPLOYMENT.md) for comprehensive deployment instructions.

### CI/CD Pipeline
- **Trigger**: Push to main branch
- **Jobs**: Unit tests → Integration tests → Security scan → Performance tests → E2E tests → Deploy
- **Quality Gates**: All tests must pass before deployment

## 📚 API Documentation

### REST API
- **Base URL**: `https://api.skills-engine.com`
- **Authentication**: OAuth 2.0 / JWT
- **Documentation**: [OpenAPI Specification](docs/API.md)

### Key Endpoints
- `GET /api/skills` - List skills with filtering
- `GET /api/competencies` - List competencies
- `GET /api/users/{id}/profile` - Get user skill profile
- `POST /api/assessments/results` - Process assessment results
- `GET /api/users/{id}/gaps` - Get skill gap analysis

### Event-Driven APIs
- **Kafka Topics**: UserCreatedEvent, AssessmentResultAvailableEvent, SkillGapDetectedEvent
- **Event Schema**: [Event Documentation](docs/EVENTS.md)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend Testing
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### E2E Testing
```bash
npm run test:e2e      # Run end-to-end tests
```

## 📊 Monitoring & Observability

### SLOs (Service Level Objectives)
- **Availability**: 99.9% uptime (monthly)
- **Latency**: 95th percentile < 300ms, 99th percentile < 1s
- **Error Rate**: < 0.5% 5xx errors
- **Gap Analysis**: End-to-end ≤ 1s for typical loads

### Monitoring Stack
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger with OpenTelemetry
- **Logging**: ELK/EFK stack
- **Error Tracking**: Sentry
- **Uptime**: Synthetic monitoring

### Dashboards
- Service Overview, Pipeline Health, Database Performance
- Business Metrics, SLO/Error Budget, Release Health

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
5. Address review feedback
6. Merge when approved

### Code Review Process
- All code must be reviewed by at least one team member
- Tests must pass with 85%+ coverage
- Security scan must pass
- Performance benchmarks must be met

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Technical Documentation](docs/)
- [API Reference](docs/API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/your-org/skills-engine/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/skills-engine/discussions)
- **Email**: support@skills-engine.com

### Team Contacts
- **Product Owner**: [Contact Information]
- **Tech Lead**: [Contact Information]
- **DevOps**: [Contact Information]

## 🗺️ Roadmap

### Current Version: v1.0.0
- ✅ Core skills and competency management
- ✅ Multi-tenant support
- ✅ Assessment integration
- ✅ Basic gap analysis
- ✅ REST API and event-driven architecture

### Upcoming Features
- 🔄 Advanced AI-powered skill extraction
- 🔄 Learning path recommendations
- 🔄 Enhanced analytics and reporting
- 🔄 Mobile application

### Long-term Vision
- 🔮 Industry-specific skill frameworks
- 🔮 Predictive skill analytics
- 🔮 Global skill marketplace integration
- 🔮 Advanced personalization with ML

---

**Skills Engine** - Empowering organizations and individuals to understand, measure, and develop workforce skills effectively.