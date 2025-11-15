# Mock Data for API Fallback

This directory contains mock data files used when external APIs are unavailable or fail.

## Files

- `users.json` - Mock user data
- `competencies.json` - Mock competency data
- `skills.json` - Mock skill data

## Usage

When an external API call fails, the system automatically falls back to these mock data files to ensure the system remains operational.

## Implementation

Backend services should implement fallback logic like:

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

