# Skills Engine - Deployment Guide

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 🚀 Deployment Overview

Skills Engine is deployed using:
- **Backend:** Railway (Node.js + Express)
- **Frontend:** Vercel (React + Vite)
- **Database:** PostgreSQL (Railway)

---

## 📋 Prerequisites

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Railway account for backend hosting
- [ ] Vercel account for frontend hosting

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
   PORT=8080
   
   # Database (PostgreSQL from Railway)
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # Frontend URL (for CORS)
   FRONTEND_URL=https://your-frontend.vercel.app
   
   # Gemini API (optional)
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Configure Railway Service**

   The `railway.json` file in the backend directory configures:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
   - Restart policy: On failure

   **Note:** Railway uses Docker (if `Dockerfile` exists) or NIXPACKS (if `railway.json` exists).
   Currently, the project uses Docker for deployment.

### Manual Deployment

```bash
cd backend
railway up
```

### Automated Deployment

Deployment happens automatically when:
- Code is pushed to `main` branch (if Railway is connected to GitHub)
- Manual deployment via Railway CLI or dashboard

---

## ▲ Vercel Frontend Deployment

### Initial Setup

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click **Add New Project**
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Node.js Version:** 22.x (matches `package.json` engines)

2. **Configure Environment Variables**

   In Vercel dashboard, add:

   ```env
   # API Configuration
   VITE_API_URL=https://your-railway-backend.railway.app
   VITE_APP_NAME=Skills Engine
   
   # Environment
   NODE_ENV=production
   ```

3. **Configure Vercel Project**

   The `vercel.json` file in the frontend directory configures:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci --prefer-offline --no-audit`
   - SPA rewrites for client-side routing

### Manual Deployment

```bash
cd frontend
vercel --prod
```

### Automated Deployment

Deployment happens automatically when:
- Code is pushed to `main` branch (if Vercel is connected to GitHub)
- Manual deployment via Vercel CLI or dashboard

---

## 🗄️ Database Setup (PostgreSQL on Railway)

### Initial Setup

1. **Create PostgreSQL Service in Railway**
   - Go to Railway Dashboard
   - Add a new PostgreSQL service
   - Railway will automatically provide the `DATABASE_URL` connection string

2. **Configure Database Connection**

   The backend automatically:
   - Connects to PostgreSQL using `DATABASE_URL` environment variable
   - Enables SSL for production connections (required by Railway)
   - Uses connection pooling for better performance

3. **Run Migrations (if needed)**

   ```bash
   # Set database URL
   export DATABASE_URL=postgresql://user:password@host:port/database
   
   # Run migrations (if migration scripts exist)
   cd backend
   npm run migrate:dev
   ```

4. **Seed Database (Optional)**

   ```bash
   npm run seed:dev
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
- Check Railway PostgreSQL connection settings
- Ensure database is accessible
- Verify SSL is enabled for production (automatic in code)

**CORS Issues:**
- Verify `FRONTEND_URL` is set correctly
- Check that Vercel URL matches the allowed origin
- Ensure CORS middleware is configured before other middleware

### Frontend Deployment Issues

**Build Failures:**
- Check Vercel build logs
- Verify environment variables
- Ensure all dependencies are installed

**API Connection Issues:**
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is accessible
- Check browser console for CORS errors

**TypeScript Build Errors:**
- Verify `tsconfig.json` has `jsx: "react-jsx"`
- Ensure `@types/react` and `@types/react-dom` are installed
- Check that `vite-env.d.ts` includes React type references
- Verify Node.js version matches `engines.node` in `package.json` (22.x)

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
- [ ] Test CORS configuration
- [ ] Monitor logs for errors

---

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vite.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Last Updated:** 2025-01-27  
**Framework:** Vite + React (Frontend), Express + TypeScript (Backend)  
**Database:** PostgreSQL (Railway)


