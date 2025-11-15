# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for TypeScript build)
RUN npm install

# Copy source code and config files
COPY src ./src
COPY tsconfig.json ./

# Build the application (TypeScript -> JavaScript)
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --omit=dev

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]

