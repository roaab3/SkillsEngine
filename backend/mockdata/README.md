# Mock Data

This directory contains mock data files for development and testing.

## Files

- `users.json` - Sample user data
- `competencies.json` - Sample competency data
- `skills.json` - Sample skill data
- `userProfile.json` - Complete user profile with competencies and skills
- `seed_mockdata.sql` - SQL script to load all mock data into Supabase

## Loading Data into Supabase

To load the mock data into your Supabase database:

### 1. Via Supabase SQL Editor (Recommended)
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `seed_mockdata.sql`
   - Click **Run** to execute the script

### 2. Via psql command line
   ```bash
   psql -h your-supabase-host -U postgres -d postgres -f backend/mockdata/seed_mockdata.sql
   ```

### 3. Via Railway CLI
   ```bash
   railway run psql < backend/mockdata/seed_mockdata.sql
   ```

## Data Structure

The seed script will insert:
- **2 users** (user_123, user_456)
- **5 competencies** (comp_123, comp_456, comp_789, comp_1, comp_2)
- **10 skills** (skill_123, skill_456, skill_789, skill_101, skill_102, skill_1-5)
- **User competency relationships** with verified skills
- **Hierarchy relationships** (parent-child for competencies and skills)
- **Competency-skill mappings**

## Notes

- The script uses `ON CONFLICT` clauses to handle duplicate inserts gracefully
- All timestamps are set to `CURRENT_TIMESTAMP`
- The script can be run multiple times safely (idempotent)
- To clear existing mock data before seeding, uncomment the DELETE statements at the top of the script

## Usage as API Fallback

When an external API call fails, the system automatically falls back to these mock data files to ensure the system remains operational.

Backend services implement fallback logic like:

```typescript
try {
  // Call real API
  const data = await externalAPI.getData();
  return data;
} catch (error) {
  // Fallback to mock data
  const mockData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../mockdata/data.json'), 'utf-8')
  );
  logger.warn('Using mock data due to API failure', { error });
  return mockData;
}
```
