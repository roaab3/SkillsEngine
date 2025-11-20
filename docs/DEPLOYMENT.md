# Deployment Guide

Complete guide for deploying Skills Engine to production.

---

## Overview

Skills Engine consists of three main components:
1. **Backend API** - Deployed on Railway
2. **Frontend** - Deployed on Vercel
3. **Database** - Hosted on Supabase

---

## Prerequisites

- GitHub repository connected
- Railway account
- Vercel account
- Supabase account
- Domain name (optional)

---

## Step 1: Database Deployment (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for provisioning (2-3 minutes)
4. Note your project URL and API keys

### 1.2 Run Migrations

1. Go to SQL Editor in Supabase dashboard
2. Open `database/migrations/000_initial_schema.sql`
3. Copy and paste into SQL Editor
4. Click "Run" to execute
5. Verify tables were created in Table Editor

### 1.3 Get Connection String

1. Go to Project Settings > Database
2. Copy the connection string (URI format)
3. Save for backend configuration

---

## Step 2: Backend Deployment (Railway)

### 2.1 Connect Repository

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` directory as root

### 2.2 Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
# Database
DATABASE_URL=<your-supabase-connection-string>

# Server
PORT=8080
NODE_ENV=production

# Authentication
JWT_SECRET=<generate-strong-secret-key>

# AI (Gemini)
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_FLASH_MODEL=gemini-1.5-flash
GEMINI_DEEP_SEARCH_MODEL=gemini-1.5-pro
```

### 2.3 Deploy

1. Railway will automatically detect Node.js
2. It will run `npm install` and `npm start`
3. Wait for deployment to complete
4. Note your Railway URL: `https://{project-name}.up.railway.app`

### 2.4 Verify Deployment

```bash
curl https://{project-name}.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "skills-engine-backend"
}
```

### 2.5 Configure Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 3.2 Configure Environment Variables

In Vercel dashboard, add:

```env
NEXT_PUBLIC_API_URL=https://{your-railway-url}.up.railway.app
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Vercel will provide a URL: `https://{project-name}.vercel.app`

### 3.4 Verify Deployment

1. Open the Vercel URL in browser
2. Check browser console for errors
3. Test API connection

### 3.5 Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## Step 4: CI/CD Setup

### 4.1 GitHub Secrets

Add these secrets to your GitHub repository:

**Railway:**
- `RAILWAY_TOKEN` - Get from Railway dashboard > Settings > Tokens

**Vercel:**
- `VERCEL_TOKEN` - Get from Vercel dashboard > Settings > Tokens
- `VERCEL_ORG_ID` - Get from Vercel dashboard > Settings
- `VERCEL_PROJECT_ID` - Get from Vercel project settings

### 4.2 Enable GitHub Actions

1. Push code to `main` branch
2. GitHub Actions will automatically:
   - Run tests
   - Deploy backend to Railway
   - Deploy frontend to Vercel

---

## Step 5: Post-Deployment

### 5.1 Verify All Services

**Backend Health:**
```bash
curl https://{railway-url}/health
```

**Frontend:**
- Open Vercel URL
- Check for console errors
- Test user login/profile

**Database:**
- Check Supabase dashboard
- Verify tables exist
- Test a simple query

### 5.2 Monitor Logs

**Railway:**
- Go to project > Deployments > View logs

**Vercel:**
- Go to project > Deployments > View logs

**Supabase:**
- Go to Logs section in dashboard

### 5.3 Set Up Monitoring

1. **Error Tracking:** Consider Sentry or similar
2. **Analytics:** Add analytics to frontend
3. **Uptime Monitoring:** Use UptimeRobot or similar

---

## Environment-Specific Configuration

### Development

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Database: Local PostgreSQL or Supabase dev project

### Staging

- Backend: Railway staging environment
- Frontend: Vercel preview deployments
- Database: Supabase staging project

### Production

- Backend: Railway production
- Frontend: Vercel production
- Database: Supabase production

---

## Rollback Procedure

### Backend (Railway)

1. Go to Railway dashboard
2. Navigate to Deployments
3. Find previous successful deployment
4. Click "Redeploy"

### Frontend (Vercel)

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous deployment
4. Click "Promote to Production"

---

## Troubleshooting

### Backend Not Starting

- Check Railway logs
- Verify environment variables
- Check database connection
- Verify PORT is set correctly

### Frontend Build Fails

- Check Vercel build logs
- Verify `NEXT_PUBLIC_API_URL` is set
- Check for TypeScript/ESLint errors
- Verify all dependencies are installed

### Database Connection Issues

- Verify connection string format
- Check Supabase project is active
- Verify network access
- Check firewall rules

---

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] JWT secret is strong and unique
- [ ] Database connection uses SSL
- [ ] API endpoints require authentication
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive info

---

## Performance Optimization

1. **Database:**
   - Enable connection pooling
   - Add indexes for frequent queries
   - Monitor query performance

2. **Backend:**
   - Enable caching where appropriate
   - Optimize API responses
   - Monitor response times

3. **Frontend:**
   - Enable Next.js optimizations
   - Use image optimization
   - Enable static generation where possible

---

## Maintenance

### Regular Tasks

- **Weekly:** Review error logs
- **Monthly:** Update dependencies
- **Quarterly:** Review and optimize database queries
- **As needed:** Scale resources based on usage

---

**Deployment Complete! 🚀**

For issues, check logs and documentation.

