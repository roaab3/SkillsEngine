# Contributing to Skills Engine

Thank you for your interest in contributing to the Skills Engine! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- Basic understanding of the Skills Engine architecture

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/skills-engine.git
   cd skills-engine
   ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/your-org/skills-engine.git
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

4. **Set up environment**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   
   # Configure your environment variables
   ```

5. **Set up database**
   ```bash
   cd backend
   npm run migrate:dev
   npm run seed:dev
   ```

See [Development Guide](docs/DEVELOPMENT.md) for detailed setup instructions.

## Development Process

### Branch Strategy

We use Git Flow with the following branches:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation branches

### Creating a Feature Branch

```bash
# Start from develop
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Push to your fork
git push origin feature/your-feature-name
```

### Naming Conventions

- **Branches**: `feature/description`, `hotfix/description`, `release/version`
- **Commits**: Use conventional commit format
- **Pull Requests**: Descriptive title with issue number

## Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   
   # Integration tests
   npm run test:integration
   ```

2. **Check code quality**
   ```bash
   # Linting
   npm run lint
   
   # Formatting
   npm run format
   
   # Type checking
   npm run type-check
   ```

3. **Update documentation**
   - Update relevant documentation
   - Add/update API documentation if needed
   - Update README if necessary

### Submitting a Pull Request

1. **Create Pull Request**
   - Use descriptive title
   - Reference related issues
   - Provide detailed description

2. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

3. **Review Process**
   - Automated checks must pass
   - At least one team member review required
   - Address all feedback before merging

### Merge Requirements

- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Branch is up to date with target

## Coding Standards

### General Guidelines

- **Code Quality**: Write clean, readable, and maintainable code
- **Performance**: Consider performance implications
- **Security**: Follow security best practices
- **Accessibility**: Ensure accessibility compliance
- **Testing**: Write comprehensive tests

### Backend (TypeScript)

#### Code Style
```typescript
// Use TypeScript strict mode
// Follow ESLint configuration
// Use Prettier for formatting

// Example service
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    try {
      const user = await this.userRepository.findById(userId);
      this.logger.info('User profile retrieved', { userId });
      return user;
    } catch (error) {
      this.logger.error('Failed to get user profile', { userId, error });
      throw new ServiceError('Failed to retrieve user profile');
    }
  }
}
```

#### Naming Conventions
- **Files**: kebab-case (`user-service.ts`)
- **Classes**: PascalCase (`UserService`)
- **Functions/Variables**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase with `I` prefix (`IUserRepository`)

### Frontend (React/JavaScript)

#### Code Style
```jsx
// Use functional components with hooks
// Follow ESLint configuration
// Use Prettier for formatting

// Example component
import React, { useState, useEffect } from 'react';
import { userService } from '../services/user-service';

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      {/* Component content */}
    </div>
  );
};
```

#### Naming Conventions
- **Files**: PascalCase (`UserProfile.jsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

## Testing Requirements

### Test Coverage

- **Unit Tests**: 85%+ coverage required
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user journeys covered

### Writing Tests

#### Backend Unit Tests
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

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      // Arrange
      const mockUser = { id: '1', name: 'John Doe' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserProfile('1');

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error for invalid user ID', async () => {
      // Act & Assert
      await expect(userService.getUserProfile('')).rejects.toThrow('User ID is required');
    });
  });
});
```

#### Frontend Component Tests
```jsx
// UserProfile.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import { userService } from '../services/user-service';

jest.mock('../services/user-service');

describe('UserProfile', () => {
  it('should render user name', async () => {
    // Arrange
    const mockUser = { id: '1', name: 'John Doe' };
    userService.getUser.mockResolvedValue(mockUser);

    // Act
    render(<UserProfile userId="1" />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Test Guidelines

- **Arrange-Act-Assert**: Structure tests clearly
- **Descriptive Names**: Use descriptive test names
- **Single Responsibility**: Test one thing per test
- **Mock External Dependencies**: Mock external services
- **Test Edge Cases**: Include error scenarios

## Documentation

### Code Documentation

#### Backend (TypeScript)
```typescript
/**
 * Service for managing user profiles and skill data
 */
export class UserService {
  /**
   * Retrieves a user's complete profile including skills and competencies
   * @param userId - The unique identifier of the user
   * @returns Promise<User> - The user profile data
   * @throws {ValidationError} When userId is invalid
   * @throws {ServiceError} When profile retrieval fails
   */
  async getUserProfile(userId: string): Promise<User> {
    // Implementation
  }
}
```

#### Frontend (JSDoc)
```jsx
/**
 * UserProfile component displays user information and skill data
 * @param {Object} props - Component props
 * @param {string} props.userId - The user ID to display
 * @param {boolean} props.showSkills - Whether to display skills section
 * @returns {JSX.Element} The rendered user profile
 */
export const UserProfile = ({ userId, showSkills = true }) => {
  // Implementation
};
```

### API Documentation

- Update OpenAPI specification for new endpoints
- Include request/response examples
- Document error codes and handling
- Update API documentation in `docs/API.md`

### README Updates

- Update setup instructions if needed
- Add new features to feature list
- Update technology stack if changed
- Update deployment instructions

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

### Security Issues

For security vulnerabilities, please email security@skills-engine.com instead of creating a public issue.

## Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Security review completed

## Community

### Getting Help

- **Documentation**: Check existing documentation
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Team Chat**: Join our community Slack

### Recognition

Contributors are recognized in:
- Release notes
- Contributors section in README
- Annual contributor appreciation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, please:
1. Check existing documentation
2. Search existing issues and discussions
3. Create a new discussion
4. Contact the maintainers

Thank you for contributing to the Skills Engine! 🚀

