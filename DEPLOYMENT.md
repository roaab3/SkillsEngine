# Skills Engine - Deployment Guide

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 🚀 Deployment Overview

Skills Engine is deployed using:
- **Backend:** Railway (Node.js + Express)
- **Frontend:** Vercel (React)
- **Database:** Supabase (PostgreSQL)
- **CI/CD:** GitHub Actions

---

## 📋 Prerequisites

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Railway account for backend hosting
- [ ] Vercel account for frontend hosting
- [ ] Supabase account for database hosting

### Required Secrets

Configure the following secrets in your GitHub repository:

#### Railway Secrets
- `RAILWAY_TOKEN` - Railway deployment token
- `RAILWAY_BACKEND_SERVICE_ID` - Railway backend service ID
- `RAILWAY_BACKEND_URL` - Railway backend URL (for health checks)

#### Vercel Secrets
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID (optional)
- `VERCEL_PROJECT_ID` - Vercel project ID (optional)

---

## 🔧 GitHub Actions Setup

### Workflows

The project includes three GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push to `main` or `develop` branches
   - Runs on pull requests
   - Tests backend and frontend
   - Runs linters and type checks
   - Security scans

2. **Backend Deployment** (`.github/workflows/deploy-backend.yml`)
   - Deploys backend to Railway
   - Runs on push to `main` branch (backend changes only)
   - Runs database migrations
   - Performs health checks

3. **Frontend Deployment** (`.github/workflows/deploy-frontend.yml`)
   - Deploys frontend to Vercel
   - Runs on push to `main` branch (frontend changes only)

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret listed above

---

## 🚂 Railway Backend Deployment

### Initial Setup

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Create new project
   railway init
   ```

2. **Configure Environment Variables**

   In Railway dashboard, add the following environment variables:

   ```env
   # Server
   NODE_ENV=production
   PORT=3000
   
   # Database
   DATABASE_URL=your_supabase_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   
   # Microservice Tokens
   DIRECTORY_SERVICE_TOKEN=your_token
   ASSESSMENT_SERVICE_TOKEN=your_token
   CONTENT_STUDIO_TOKEN=your_token
   COURSE_BUILDER_TOKEN=your_token
   LEARNER_AI_TOKEN=your_token
   LEARNING_ANALYTICS_TOKEN=your_token
   RAG_CHATBOT_TOKEN=your_token
   
   # Microservice URLs
   DIRECTORY_SERVICE_URL=https://directory.educora.ai
   ASSESSMENT_SERVICE_URL=https://assessment.educora.ai
   CONTENT_STUDIO_URL=https://content-studio.educora.ai
   COURSE_BUILDER_URL=https://course-builder.educora.ai
   LEARNER_AI_URL=https://learner-ai.educora.ai
   LEARNING_ANALYTICS_URL=https://learning-analytics.educora.ai
   RAG_CHATBOT_URL=https://rag.educora.ai
   
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key
   
   # Redis (if using)
   REDIS_URL=your_redis_url
   ```

3. **Configure Railway Service**

   The `railway.json` file in the backend directory configures:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
   - Restart policy: On failure

### Manual Deployment

```bash
cd backend
railway up
```

### Automated Deployment

Deployment happens automatically via GitHub Actions when:
- Code is pushed to `main` branch
- Changes are made to `backend/` directory

---

## ▲ Vercel Frontend Deployment

### Initial Setup

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click **Add New Project**
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset:** Next.js (or React)
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next` (for Next.js) or `dist` (for Vite)

2. **Configure Environment Variables**

   In Vercel dashboard, add:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
   NEXT_PUBLIC_API_VERSION=v1
   
   # Environment
   NODE_ENV=production
   ```

3. **Configure Vercel Project**

   The `vercel.json` file in the frontend directory configures:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm ci --prefer-offline --no-audit`

### Manual Deployment

```bash
cd frontend
vercel --prod
```

### Automated Deployment

Deployment happens automatically via GitHub Actions when:
- Code is pushed to `main` branch
- Changes are made to `frontend/` directory

---

## 🗄️ Database Setup (Supabase)

### Initial Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com)
   - Create new project
   - Note the connection string

2. **Run Migrations**

   ```bash
   # Set database URL
   export DATABASE_URL=your_supabase_connection_string
   
   # Run migrations
   cd backend
   npm run migrate
   ```

3. **Seed Database (Optional)**

   ```bash
   npm run seed
   ```

---

## 🔍 Health Checks

### Backend Health Check

The backend exposes a health check endpoint:

```bash
curl https://your-railway-backend.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T00:00:00Z",
  "uptime": 12345
}
```

### Frontend Health Check

The frontend should be accessible at your Vercel URL.

---

## 🔄 Deployment Workflow

### Standard Deployment Flow

1. **Development**
   - Make changes in feature branch
   - Test locally
   - Create pull request

2. **CI Pipeline**
   - GitHub Actions runs tests
   - Linters and type checks
   - Security scans

3. **Merge to Main**
   - Pull request approved and merged
   - Triggers deployment workflows

4. **Automated Deployment**
   - Backend deploys to Railway
   - Frontend deploys to Vercel
   - Migrations run automatically
   - Health checks verify deployment

### Rollback Procedure

**Railway:**
```bash
railway rollback
```

**Vercel:**
- Go to Vercel dashboard
- Navigate to Deployments
- Click on previous deployment
- Click "Promote to Production"

---

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use GitHub Secrets for CI/CD
- Use Railway/Vercel environment variables for production
- Rotate tokens regularly

### API Security
- All microservice integrations use token-based authentication
- Tokens stored securely in environment variables
- API endpoints protected with authentication middleware

### Database Security
- Use connection pooling
- Enable SSL for database connections
- Regular backups
- Access restricted to necessary services only

---

## 📊 Monitoring

### Railway Monitoring
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for errors

### Vercel Monitoring
- View analytics in Vercel dashboard
- Monitor build times
- Track deployment status

### Application Monitoring
- Health check endpoints
- Error logging
- Performance metrics

---

## 🐛 Troubleshooting

### Backend Deployment Issues

**Build Failures:**
- Check Railway logs
- Verify Node.js version
- Ensure all dependencies are in `package.json`

**Database Connection Issues:**
- Verify `DATABASE_URL` is correct
- Check Supabase connection settings
- Ensure database is accessible

**Token Authentication Failures:**
- Verify all microservice tokens are set
- Check token format and validity
- Ensure microservice URLs are correct

### Frontend Deployment Issues

**Build Failures:**
- Check Vercel build logs
- Verify environment variables
- Ensure all dependencies are installed

**API Connection Issues:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings
- Ensure backend is accessible

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Secrets configured in GitHub
- [ ] Railway/Vercel accounts connected

### Deployment
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Database migrations run
- [ ] Health checks passing
- [ ] Environment variables set

### Post-Deployment
- [ ] Verify backend is accessible
- [ ] Verify frontend is accessible
- [ ] Test API endpoints
- [ ] Test microservice integrations
- [ ] Monitor logs for errors

---

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated:** 2025-01-27


