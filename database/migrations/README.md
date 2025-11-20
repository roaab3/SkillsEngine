# Database Migrations

This directory contains the database migration file for the Skills Engine microservice.

## Migration File

- `000_initial_schema.sql` - Complete initial database schema (all tables, indexes, triggers, and functions)

This single file contains:
- Polynomial Rolling Hash function (`POLYNOMIAL_HASH`)
- All 9 database tables in dependency order
- All indexes (B-TREE, Hash, and GIN)
- All triggers for auto-updating `updated_at` fields

## Running Migrations

### Using psql (PostgreSQL CLI)

```bash
# Connect to database
psql $DATABASE_URL

# Run complete schema
\i database/migrations/000_initial_schema.sql
```

### Using psql from command line

```bash
# Run migration directly
psql $DATABASE_URL -f database/migrations/000_initial_schema.sql
```

### Using Node.js Script

```bash
# Run all migrations
npm run migrate:dev

# Run specific migration
node scripts/run-migration.js 001_create_skills_table.sql
```

### Using Supabase CLI

```bash
# If using Supabase CLI
supabase db push
```

## Notes

- **Hash Indexes**: The migration includes a custom `POLYNOMIAL_HASH()` function implemented in PostgreSQL (plpgsql). This function implements Polynomial Rolling Hash with:
  - Prime: `p = 31`
  - Modulus: `M = 1,000,000,009`
  - Normalization: `LOWER(TRIM())` applied before hashing
  - Hash indexes are created on string keys (skill_id, user_id, competency_id, etc.) for O(1) average lookup time

- **JSONB vs JSON**: All JSON fields use `JSONB` type for better performance and indexing support in PostgreSQL.

- **Timestamps**: All `updated_at` fields are managed by triggers that automatically update on row modification.

- **Cascade Deletes**: Foreign keys are set to `ON DELETE CASCADE` to maintain referential integrity.

- **Index Types**:
  - **B-TREE indexes**: Used for competencies table (for LIKE searches, sorting, ORDER BY)
  - **Hash indexes**: Used for string primary/foreign keys (equality lookups)
  - **GIN indexes**: Used for JSONB fields (efficient JSON queries)

## Verification

After running migrations, verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Verify indexes:

```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

