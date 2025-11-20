# Setup Guide - Skills Engine

Complete step-by-step guide to set up and run the Skills Engine microservice.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL** database (or Supabase account)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **Git** for version control

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd Skills_Engine_dev
```

---

## Step 2: Database Setup

### Option A: Using Supabase (Recommended)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for database to be provisioned

2. **Get Connection String**
   - Go to Project Settings > Database
   - Copy the connection string (URI format)

3. **Run Migrations**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `database/migrations/000_initial_schema.sql`
   - Paste and run in SQL Editor

### Option B: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu
   sudo apt-get install postgresql
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   createdb skills_engine
   ```

3. **Run Migrations**
   ```bash
   psql -d skills_engine -f database/migrations/000_initial_schema.sql
   ```

---

## Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   ```

4. **Edit `.env` file**
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/database
   
   # Server
   PORT=8080
   NODE_ENV=development
   
   # Authentication
   JWT_SECRET=your-secret-key-change-in-production
   
   # AI (Gemini)
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_FLASH_MODEL=gemini-1.5-flash
   GEMINI_DEEP_SEARCH_MODEL=gemini-1.5-pro
   ```

5. **Test database connection**
   ```bash
   # Create a test script or use psql
   node -e "require('./config/database').query('SELECT 1').then(() => console.log('✅ Connected'))"
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Backend should be running on `http://localhost:8080`

7. **Verify health endpoint**
   ```bash
   curl http://localhost:8080/health
   ```

---

## Step 4: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local` file**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend should be running on `http://localhost:3000`

6. **Open in browser**
   - Navigate to `http://localhost:3000`
   - You should see the Dashboard

---

## Step 5: Verify Installation

### Backend Health Check

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T...",
  "service": "skills-engine-backend",
  "version": "1.0.0"
}
```

### Frontend Check

1. Open `http://localhost:3000` in browser
2. You should see the Dashboard (may show empty state if no data)

### API Test

```bash
# Get root skills
curl http://localhost:8080/api/skills/roots

# Get parent competencies
curl http://localhost:8080/api/competencies/parents
```

---

## Step 6: Run Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Verify database exists
- Check firewall settings

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::8080`

**Solutions:**
- Change `PORT` in `.env` to a different port
- Kill process using port: `lsof -ti:8080 | xargs kill`

### Missing Dependencies

**Error:** `Cannot find module`

**Solutions:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Gemini API Errors

**Error:** `API key invalid`

**Solutions:**
- Verify API key in `.env`
- Check API key has proper permissions
- Verify billing is enabled in Google Cloud Console

---

## Next Steps

1. **Seed Database** (optional)
   - Create initial competencies and skills
   - Add test users

2. **Configure Authentication**
   - Set up JWT token generation
   - Configure token expiration

3. **Set Up CI/CD**
   - Connect to GitHub Actions
   - Configure deployment pipelines

4. **Production Deployment**
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Configure production environment variables

---

## Development Workflow

1. **Make changes** to code
2. **Run tests** to verify changes
3. **Test locally** with `npm run dev`
4. **Commit changes** with descriptive messages
5. **Push to repository**
6. **CI/CD** automatically runs tests and deploys

---

## Support

For issues or questions:
- Check documentation in `docs/` directory
- Review error logs
- Check GitHub Issues (if applicable)

---

**Happy Coding! 🚀**

