# Railway Deployment Flow

## How Railway Deploys

Railway can use **two different build methods**:

1. **Docker** (if `Dockerfile` is present)
2. **NIXPACKS** (if `railway.json` is present and no Dockerfile, or if configured)

Currently, your project has **both**, so Railway will use **Docker** (it takes priority).

---

## Deployment Flow

### 1. **Detection Phase**
Railway detects the `Dockerfile` in the `backend/` directory and uses it for building.

### 2. **Build Phase** (Docker)
Railway runs these commands automatically:

```bash
# Railway runs this internally:
docker build -t skills-engine-backend ./backend

# Which executes the Dockerfile steps:
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY package-lock.json* ./
COPY src ./src
COPY tsconfig.json ./
COPY package.json ./
RUN npm run build
EXPOSE 3000
```

### 3. **Deploy Phase**
Railway starts the container with:

```bash
# Railway runs:
docker run -p $PORT:3000 skills-engine-backend

# Which executes:
CMD ["npm", "start"]
# Which runs: node dist/index.js
```

---

## Manual Docker Commands

If you want to test the Docker build locally:

### Build the Docker Image

```bash
cd backend
docker build -t skills-engine-backend .
```

### Run the Docker Container

```bash
# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e GEMINI_API_KEY="your-api-key" \
  -e NODE_ENV="production" \
  -e PORT=3000 \
  skills-engine-backend
```

### Run with .env file

```bash
# Create a .env file with your variables
docker run -p 3000:3000 --env-file .env skills-engine-backend
```

### Run in detached mode (background)

```bash
docker run -d -p 3000:3000 --env-file .env --name skills-engine skills-engine-backend
```

### View logs

```bash
docker logs skills-engine
docker logs -f skills-engine  # Follow logs
```

### Stop container

```bash
docker stop skills-engine
docker rm skills-engine
```

---

## Railway Configuration

### Current Setup

**railway.json** (used if Dockerfile is not present):
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

**Dockerfile** (takes priority):
- Builds the application
- Runs `npm start` which executes `node dist/index.js`

### Railway Build Process

1. **Git Push** → Railway detects changes
2. **Docker Build** → Railway runs `docker build` using your Dockerfile
3. **Image Creation** → Creates a Docker image
4. **Container Start** → Runs the container with `npm start`
5. **Health Check** → Checks `/health` endpoint every 30s

---

## Build Commands Breakdown

### In Dockerfile:

```dockerfile
# Step 1: Install dependencies (production only)
RUN npm install --omit=dev
# This installs only production dependencies (no devDependencies)

# Step 2: Build TypeScript to JavaScript
RUN npm run build
# This runs: tsc (TypeScript compiler)
# Output: dist/index.js and other compiled files

# Step 3: Start the server
CMD ["npm", "start"]
# This runs: node dist/index.js
```

### What `npm start` does:

From `package.json`:
```json
"start": "node dist/index.js"
```

This runs the compiled JavaScript file that contains your Express server.

---

## Environment Variables in Railway

Railway automatically injects environment variables into the Docker container:

1. Go to Railway Dashboard → Your Service → Variables
2. Add variables (e.g., `DATABASE_URL`, `GEMINI_API_KEY`)
3. Railway injects them as environment variables in the container
4. Your app accesses them via `process.env.VARIABLE_NAME`

---

## Deployment Checklist

- [ ] `Dockerfile` exists in `backend/` directory
- [ ] `package.json` has `build` and `start` scripts
- [ ] `tsconfig.json` excludes test files
- [ ] Environment variables set in Railway
- [ ] Database URL configured
- [ ] CORS configured (currently allows all origins)

---

## Troubleshooting

### Check if Docker is being used:
- Railway logs will show: `Using Detected Dockerfile`

### Check build logs:
- Railway Dashboard → Your Service → Deployments → View Logs

### Test Docker locally:
```bash
cd backend
docker build -t test-build .
docker run -p 3000:3000 test-build
```

### Common Issues:

1. **Build fails** → Check TypeScript errors, missing dependencies
2. **Container won't start** → Check `npm start` command, port configuration
3. **Database connection fails** → Check `DATABASE_URL` environment variable
4. **CORS errors** → Check CORS configuration in `src/index.ts`

---

## Summary

**Railway Deployment Flow:**
1. Git push → Railway detects changes
2. Docker build → Runs `docker build` using `Dockerfile`
3. Container start → Runs `docker run` with `CMD ["npm", "start"]`
4. Server runs → `node dist/index.js` starts Express server
5. Health check → Railway monitors `/health` endpoint

**Manual Docker Commands:**
```bash
# Build
docker build -t skills-engine-backend ./backend

# Run
docker run -p 3000:3000 --env-file .env skills-engine-backend
```

