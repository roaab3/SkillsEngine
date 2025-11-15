# Railway Deployment Guide

## Environment Variables

Set the following environment variables in your Railway project:

### Required Variables

1. **DATABASE_URL**
   - Your PostgreSQL connection string from Railway's PostgreSQL service
   - Format: `postgresql://user:password@host:port/database`

2. **FRONTEND_URL**
   - Comma-separated list of allowed frontend origins
   - For Vercel deployments, include:
     - Your production URL: `https://your-app.vercel.app`
     - Vercel preview URLs: `https://*.vercel.app`
   - Example: `https://skills-engine.vercel.app,https://*.vercel.app`

3. **GEMINI_API_KEY**
   - Your Google Gemini API key for AI features

4. **NODE_ENV**
   - Set to `production` for production deployments

### Optional Variables

- `PORT` - Server port (default: 3000)
- `LOG_LEVEL` - Logging level (default: info)
- `JWT_SECRET` - Secret for JWT tokens
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 1000)

## CORS Configuration

The backend supports:
- Multiple origins (comma-separated in `FRONTEND_URL`)
- Wildcard patterns (e.g., `https://*.vercel.app`)
- Automatic localhost support in development

### Setting FRONTEND_URL in Railway

1. Go to your Railway project
2. Navigate to **Variables** tab
3. Add `FRONTEND_URL` with your Vercel URLs:
   ```
   https://your-production-url.vercel.app,https://*.vercel.app
   ```

This allows:
- Your production Vercel deployment
- All Vercel preview deployments (PR previews, branch previews)

## Health Check

The backend exposes a health check endpoint at `/health` which Railway uses for monitoring.

## Database Migrations

Run migrations manually after deployment:
```bash
npm run migrate:prod
```

Or set up a migration script in Railway's deployment configuration.

