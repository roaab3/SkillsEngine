# Skills Engine Backend

Backend API for the Skills Engine microservice built with Node.js, Express.js, TypeScript, and PostgreSQL.

## Structure

```
backend/
├── src/
│   ├── config/          # Configuration (database, etc.)
│   ├── middleware/       # Express middleware (auth, error handling, validation)
│   ├── repositories/     # Data access layer
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (logger, errors)
│   └── index.ts         # Application entry point
├── mockdata/            # Mock data for API fallback
├── dist/                # Compiled JavaScript (generated)
└── package.json
```

## Services

- **TaxonomyService** - Manages skills and competencies taxonomy
- **ProfileService** - Manages user profiles and skill verification
- **GapAnalysisService** - Performs gap analysis (narrow and broad)
- **AIService** - Handles Google Gemini API integration
- **CSVProcessingService** - Processes CSV uploads from trainers

## Repositories

- **TaxonomyRepository** - Database operations for taxonomy
- **ProfileRepository** - Database operations for user profiles
- **SourceRepository** - Database operations for official sources

## API Routes

- `/health` - Health check endpoint
- `/api/webhooks/*` - Webhook endpoints (user creation, assessment results)
- `/api/frontend/*` - Frontend endpoints (profile, gap analysis)
- `/api/competency/*` - Competency retrieval endpoints
- `/api/trainer/*` - Trainer-specific endpoints (CSV upload)

## Environment Variables

See `env.example` for required environment variables.

## Running

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Tests
npm test
```

## Database

Run migrations from `database/migrations/` directory.

