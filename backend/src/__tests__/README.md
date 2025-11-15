# Backend Tests

Comprehensive test suite for Skills Engine backend following Test-Driven Development (TDD) principles.

## Test Structure

```
__tests__/
├── setup.ts              # Test configuration and setup
├── mocks/                # Mock implementations
│   └── database.ts      # Database mocks
├── repositories/         # Repository layer tests
│   ├── TaxonomyRepository.test.ts
│   └── ProfileRepository.test.ts
├── services/             # Service layer tests
│   ├── TaxonomyService.test.ts
│   ├── ProfileService.test.ts
│   └── GapAnalysisService.test.ts
├── routes/               # Route/API tests
│   ├── health.test.ts
│   ├── webhooks.test.ts
│   └── frontend.test.ts
├── utils/                # Utility tests
│   └── errors.test.ts
└── integration/          # Integration tests
    └── app.test.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration
```

## Test Coverage

The test suite covers:

- **Repositories**: Database operations, error handling, data retrieval
- **Services**: Business logic, AI integration, calculations
- **Routes**: API endpoints, authentication, validation
- **Utilities**: Error classes, helper functions
- **Integration**: End-to-end flows, error handling

## Coverage Thresholds

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Mocking Strategy

- **Database**: Mocked using `mockPool` to avoid actual database connections
- **External Services**: AI services and repositories are mocked in service tests
- **Authentication**: Mocked in route tests

## Writing New Tests

1. Create test file in appropriate directory
2. Import necessary mocks and dependencies
3. Use `describe` and `it` blocks for organization
4. Mock external dependencies
5. Test both success and error cases
6. Ensure tests are isolated and independent

## Example Test

```typescript
import { MyService } from '../../services/MyService';
import { MyRepository } from '../../repositories/MyRepository';

jest.mock('../../repositories/MyRepository');

describe('MyService', () => {
  let service: MyService;
  let mockRepository: jest.Mocked<MyRepository>;

  beforeEach(() => {
    mockRepository = {
      getData: jest.fn(),
    } as any;
    (MyRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new MyService();
  });

  it('should return data successfully', async () => {
    mockRepository.getData.mockResolvedValueOnce({ id: '123' });
    const result = await service.getData('123');
    expect(result).toEqual({ id: '123' });
  });
});
```

