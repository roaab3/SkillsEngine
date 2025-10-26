# Skills Engine Deployment Guide

## Overview
This guide covers the deployment process for the Skills Engine, including both backend (Railway) and frontend (Vercel) deployments.

## Prerequisites
- GitHub repository with the Skills Engine code
- Railway account for backend hosting
- Vercel account for frontend hosting
- Required GitHub Secrets configured

## GitHub Secrets Configuration

### Required Secrets
Add the following secrets to your GitHub repository:

```
RAILWAY_TOKEN          # Railway deployment token
VERCEL_TOKEN           # Vercel deployment token
DATABASE_URL           # PostgreSQL connection string
OPENAI_API_KEY         # OpenAI API key for AI features
KAFKA_BROKER_URL       # Kafka broker connection string
BACKEND_URL            # Backend API URL for health checks
FRONTEND_URL           # Frontend URL for health checks
```

### How to Add Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

## Deployment Process

### Automatic Deployment
The deployment is triggered automatically on every push to the `main` branch through GitHub Actions.

### Manual Deployment Steps

#### Backend Deployment (Railway)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Deploy to Railway:
   ```bash
   npx @railway/cli@latest deploy --token $RAILWAY_TOKEN
   ```

#### Frontend Deployment (Vercel)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy to Vercel:
   ```bash
   npx vercel --token $VERCEL_TOKEN --prod
   ```

## Environment Configuration

### Backend Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_openai_api_key
KAFKA_BROKER_URL=kafka://broker:9092
PORT=3000
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_ENVIRONMENT=production
```

## Health Checks

### Backend Health Check
- Endpoint: `GET /health`
- Expected response: `200 OK` with health status
- Timeout: 3 seconds
- Retries: 3

### Frontend Health Check
- Endpoint: Root URL
- Expected response: `200 OK` with application content
- Timeout: 10 seconds

## Rollback Procedures

### Backend Rollback (Railway)
1. Go to Railway dashboard
2. Navigate to your project
3. Go to Deployments tab
4. Select a previous successful deployment
5. Click "Redeploy"

### Frontend Rollback (Vercel)
1. Go to Vercel dashboard
2. Navigate to your project
3. Go to Deployments tab
4. Select a previous successful deployment
5. Click "Promote to Production"

### Database Rollback
```bash
cd backend
npm run migrate:rollback
```

## Monitoring and Logs

### Railway Logs
- Access through Railway dashboard
- Real-time log streaming
- Log retention: 30 days

### Vercel Logs
- Access through Vercel dashboard
- Function logs and build logs
- Log retention: 7 days (free), 30 days (pro)

## Troubleshooting

### Common Issues

#### Backend Deployment Fails
1. Check Railway logs for error details
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check database connectivity

#### Frontend Deployment Fails
1. Check Vercel build logs
2. Verify build command is correct
3. Check for TypeScript/ESLint errors
4. Ensure all environment variables are set

#### Health Checks Fail
1. Verify the application is running
2. Check if the health endpoint is accessible
3. Verify network connectivity
4. Check application logs for errors

### Support
- Railway Support: https://railway.app/help
- Vercel Support: https://vercel.com/help
- GitHub Actions: https://docs.github.com/en/actions

## Security Considerations

### Secrets Management
- Never commit secrets to the repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use least privilege principle

### Network Security
- Use HTTPS for all communications
- Implement proper CORS policies
- Use environment-specific configurations
- Monitor for security vulnerabilities

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Frontend Optimization
- Enable static generation where possible
- Implement image optimization
- Use CDN for static assets
- Minimize bundle size

## Backup and Recovery

### Database Backups
- Railway provides automatic daily backups
- Manual backup commands available
- Point-in-time recovery supported

### Application Backups
- Code is version controlled in GitHub
- Deployment history maintained
- Configuration backups recommended

