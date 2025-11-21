# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src ./src
COPY config ./config
COPY docs ./docs

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "src/index.js"]

