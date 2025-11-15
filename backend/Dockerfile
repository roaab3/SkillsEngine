# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies (will generate package-lock.json if missing)
# Use npm install instead of npm ci to handle lock file sync issues
RUN npm install --omit=dev

# Copy package-lock.json if it exists (optional)
COPY package-lock.json* ./

# Copy source code (exclude test files and node_modules)
COPY src ./src
COPY tsconfig.json ./
COPY package.json ./

# Build the application (excludes __tests__ via tsconfig.json)
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]

