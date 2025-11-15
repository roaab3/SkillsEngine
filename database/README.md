# Skills Engine Database

This directory contains database schema, migrations, and related files for the Skills Engine microservice.

## Structure

- `migrations/` - SQL migration files
- `seeds/` - Seed data files (optional)
- `README.md` - This file

## Migrations

### Running Migrations

**Using psql:**
```bash
psql -h <host> -U <user> -d <database> -f migrations/001_create_initial_schema.sql
```

**Using Supabase:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the migration SQL
3. Run the query

**Using Node.js (if using a migration tool):**
```bash
cd backend
npm run migrate:dev
```

## Database Schema

The database consists of 9 core tables:

1. **skills** - Hierarchical skill taxonomy
2. **competencies** - Competency definitions
3. **competency_skill** - Junction table (competencies ↔ skills)
4. **skill_subSkill** - Skill hierarchy (parent-child relationships)
5. **competency_subCompetency** - Competency hierarchy
6. **users** - User information
7. **userCompetency** - User competency profiles
8. **userSkill** - User skill tracking
9. **official_sources** - Official sources for taxonomy

### Views

- **competency_leaf_skills** - Pre-computed view for efficient MGS retrieval

## Connection

The database connection string should be set in the `DATABASE_URL` environment variable:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

## Indexes

The schema includes:
- B-TREE indexes for range queries and LIKE searches
- Indexes on all foreign keys
- Indexes on frequently queried fields (user_id, competency_id, skill_id)

Note: Hash indexes using Polynomial Rolling Hash are implemented at the application level for optimal performance.

