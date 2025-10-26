# Development Guide

## Getting Started

This guide will help you set up a local development environment for the Skills Engine.

## Prerequisites

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **Git**: Latest version
- **Docker**: Optional, for containerized development

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/skills-engine.git
cd skills-engine
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/skills_engine_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skills_engine_dev
DB_USER=username
DB_PASSWORD=password

# Server
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# External Services
OPENAI_API_KEY=your_openai_api_key
KAFKA_BROKER_URL=localhost:9092

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
```

#### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4. Database Setup

#### Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name skills-engine-db \
  -e POSTGRES_DB=skills_engine_dev \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14

# Start Redis (optional)
docker run --name skills-engine-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

#### Manual PostgreSQL Setup

```bash
# Create database
createdb skills_engine_dev

# Run migrations
cd backend
npm run migrate:dev

# Seed development data
npm run seed:dev
```

### 5. Start Development Servers

#### Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3001`

#### Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Project Structure

```
skills-engine/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── domain/         # Domain layer (entities, services)
│   │   ├── application/    # Application layer (use cases)
│   │   ├── infrastructure/ # Infrastructure layer (database, external APIs)
│   │   └── presentation/   # Presentation layer (controllers, routes)
│   ├── tests/              # Test files
│   ├── migrations/         # Database migrations
│   └── package.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   └── package.json
├── database/               # Database scripts and documentation
├── docs/                   # Documentation
└── .github/               # GitHub Actions workflows
```

## Development Workflow

### 1. Feature Development

```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Make your changes
# ... code changes ...

# Run tests
npm test

# Commit your changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature
```

### 2. Code Quality

#### Linting and Formatting

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

#### Type Checking

```bash
# Backend (TypeScript)
cd backend
npm run type-check

# Frontend (JavaScript with JSDoc)
cd frontend
npm run type-check
```

### 3. Testing

#### Unit Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

#### Integration Tests

```bash
# Backend
cd backend
npm run test:integration
```

#### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e
```

### 4. Database Operations

#### Migrations

```bash
# Create a new migration
cd backend
npm run migrate:create -- --name add_new_table

# Run migrations
npm run migrate:dev

# Rollback migrations
npm run migrate:rollback
```

#### Seeding

```bash
# Seed development data
cd backend
npm run seed:dev

# Clear and reseed
npm run seed:reset
```

## Coding Standards

### Backend (TypeScript)

#### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Maximum line length: 100 characters

#### Naming Conventions
- **Files**: kebab-case (`user-service.ts`)
- **Classes**: PascalCase (`UserService`)
- **Functions/Variables**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Example Code Structure

```typescript
// user-service.ts
import { User } from '../domain/entities/user';
import { UserRepository } from '../infrastructure/repositories/user-repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserProfile(userId: string): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.userRepository.findById(userId);
  }
}
```

### Frontend (React/JavaScript)

#### Code Style
- Use functional components with hooks
- Follow ESLint configuration
- Use Prettier for formatting
- Maximum line length: 100 characters

#### Naming Conventions
- **Files**: PascalCase (`UserProfile.jsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

#### Example Component Structure

```jsx
// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../services/user-service';

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      {/* Component content */}
    </div>
  );
};
```

## Testing Guidelines

### Unit Tests

#### Backend Testing

```typescript
// user-service.test.ts
import { UserService } from '../user-service';
import { UserRepository } from '../repositories/user-repository';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    } as any;
    userService = new UserService(mockUserRepository);
  });

  it('should get user profile successfully', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUserProfile('1');

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
  });
});
```

#### Frontend Testing

```jsx
// UserProfile.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

describe('UserProfile', () => {
  it('should render user name', () => {
    const mockUser = { id: '1', name: 'John Doe' };
    
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// user-api.test.ts
import request from 'supertest';
import { app } from '../app';

describe('User API', () => {
  it('should get user profile', async () => {
    const response = await request(app)
      .get('/api/users/1/profile')
      .expect(200);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name');
  });
});
```

## Debugging

### Backend Debugging

#### Using VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeArgs": ["-r", "ts-node/register"]
    }
  ]
}
```

#### Logging

```typescript
import { logger } from '../utils/logger';

// Debug logging
logger.debug('Processing user request', { userId, requestId });

// Error logging
logger.error('Failed to process request', { error, userId });
```

### Frontend Debugging

#### React Developer Tools
- Install React Developer Tools browser extension
- Use `console.log` for debugging
- Use React DevTools Profiler for performance debugging

#### Network Debugging
- Use browser DevTools Network tab
- Check API requests and responses
- Monitor WebSocket connections

## Performance Optimization

### Backend Optimization

#### Database Queries
- Use database indexes
- Optimize N+1 queries
- Use connection pooling
- Monitor slow queries

#### Caching
```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache user profile
const cacheKey = `user:${userId}`;
const cachedUser = await redis.get(cacheKey);

if (cachedUser) {
  return JSON.parse(cachedUser);
}

const user = await userRepository.findById(userId);
await redis.setex(cacheKey, 3600, JSON.stringify(user));
return user;
```

### Frontend Optimization

#### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
```

#### Memoization
```jsx
import { memo, useMemo } from 'react';

const UserCard = memo(({ user }) => {
  const fullName = useMemo(() => {
    return `${user.firstName} ${user.lastName}`;
  }, [user.firstName, user.lastName]);

  return <div>{fullName}</div>;
});
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
pg_ctl status

# Check connection
psql -h localhost -U username -d skills_engine_dev
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- **Documentation**: Check this guide and API documentation
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: Ask in team Slack/Discord channels

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit pull request
6. Address review feedback
7. Merge when approved

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

