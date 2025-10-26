# Skills Engine Deployment Guide

## Overview

This guide covers the deployment of the Skills Engine microservice across different environments (development, staging, production) using Docker and Kubernetes.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for production)
- PostgreSQL database
- Redis cache
- Apache Kafka
- Monitoring stack (Prometheus, Grafana, ELK)

## Environment Setup

### Development Environment

1. **Clone the repository**
```bash
git clone <repository-url>
cd skills-engine
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start services with Docker Compose**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Start the application**
```bash
npm run dev
```

### Staging Environment

1. **Build Docker image**
```bash
docker build -t skills-engine:staging .
```

2. **Deploy to staging**
```bash
kubectl apply -f k8s/staging/
```

3. **Verify deployment**
```bash
kubectl get pods -n skills-engine-staging
kubectl get services -n skills-engine-staging
```

### Production Environment

1. **Build production image**
```bash
docker build -t skills-engine:production .
```

2. **Deploy to production**
```bash
kubectl apply -f k8s/production/
```

3. **Verify deployment**
```bash
kubectl get pods -n skills-engine-production
kubectl get services -n skills-engine-production
```

## Docker Configuration

### Dockerfile

The application uses a multi-stage Docker build for optimization:

```dockerfile
# Multi-stage build for Skills Engine
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 skillsengine
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p /app/logs && chown -R skillsengine:nodejs /app/logs
USER skillsengine
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
CMD ["node", "dist/index.js"]
```

### Docker Compose

The `docker-compose.yml` file includes all necessary services:

- **Skills Engine**: Main application
- **PostgreSQL**: Database
- **Redis**: Cache
- **Kafka**: Message broker
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Elasticsearch**: Log storage
- **Kibana**: Log analysis

## Kubernetes Configuration

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: skills-engine
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: skills-engine-config
  namespace: skills-engine
data:
  NODE_ENV: "production"
  PORT: "3000"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  KAFKA_BROKERS: "kafka-service:9092"
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: skills-engine-secrets
  namespace: skills-engine
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
  JWT_SECRET: <base64-encoded-jwt-secret>
  AI_MODEL_API_KEY: <base64-encoded-api-key>
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skills-engine
  namespace: skills-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: skills-engine
  template:
        metadata:
          labels:
            app: skills-engine
        spec:
          containers:
          - name: skills-engine
            image: skills-engine:latest
            ports:
            - containerPort: 3000
            env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: skills-engine-config
                  key: NODE_ENV
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: skills-engine-secrets
                  key: DB_PASSWORD
            resources:
              requests:
                memory: "256Mi"
                cpu: "250m"
              limits:
                memory: "512Mi"
                cpu: "500m"
            livenessProbe:
              httpGet:
                path: /health
                port: 3000
              initialDelaySeconds: 30
              periodSeconds: 10
            readinessProbe:
              httpGet:
                path: /health
                port: 3000
              initialDelaySeconds: 5
              periodSeconds: 5
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: skills-engine-service
  namespace: skills-engine
spec:
  selector:
    app: skills-engine
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: skills-engine-ingress
  namespace: skills-engine
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - skills-engine.company.com
    secretName: skills-engine-tls
  rules:
  - host: skills-engine.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: skills-engine-service
            port:
              number: 80
```

## Database Deployment

### PostgreSQL Setup

1. **Create database**
```sql
CREATE DATABASE skills_engine;
CREATE USER skills_engine_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE skills_engine TO skills_engine_user;
```

2. **Run migrations**
```bash
npm run migrate
```

3. **Seed initial data**
```bash
npm run seed
```

### Redis Setup

1. **Start Redis**
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

2. **Configure Redis**
```bash
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Kafka Setup

1. **Start Kafka**
```bash
docker-compose up -d kafka zookeeper
```

2. **Create topics**
```bash
kafka-topics --create --topic user-created --bootstrap-server localhost:9092
kafka-topics --create --topic assessment-completed --bootstrap-server localhost:9092
kafka-topics --create --topic skill-verified --bootstrap-server localhost:9092
```

## Monitoring Deployment

### Prometheus

1. **Deploy Prometheus**
```bash
kubectl apply -f monitoring/prometheus/
```

2. **Configure scraping**
```yaml
# prometheus-config.yml
global:
  scrape_interval: 15s
scrape_configs:
- job_name: 'skills-engine'
  static_configs:
  - targets: ['skills-engine-service:80']
```

### Grafana

1. **Deploy Grafana**
```bash
kubectl apply -f monitoring/grafana/
```

2. **Import dashboards**
```bash
kubectl cp monitoring/grafana/dashboards/ grafana-pod:/var/lib/grafana/dashboards/
```

### ELK Stack

1. **Deploy Elasticsearch**
```bash
kubectl apply -f monitoring/elasticsearch/
```

2. **Deploy Kibana**
```bash
kubectl apply -f monitoring/kibana/
```

3. **Configure log shipping**
```yaml
# filebeat-config.yml
filebeat.inputs:
- type: container
  paths:
  - /var/log/containers/skills-engine*.log
output.elasticsearch:
  hosts: ["elasticsearch-service:9200"]
```

## CI/CD Pipeline

### GitHub Actions

The CI/CD pipeline includes:

1. **Code Quality Checks**
   - Linting (ESLint)
   - Formatting (Prettier)
   - Type checking (TypeScript)
   - Security scanning (Snyk)

2. **Testing**
   - Unit tests (Jest)
   - Integration tests (Supertest)
   - E2E tests (Playwright)
   - Performance tests (Artillery)

3. **Build and Deploy**
   - Docker image build
   - Kubernetes deployment
   - Health checks
   - Rollback on failure

### Deployment Strategy

1. **Blue-Green Deployment**
   - Deploy to green environment
   - Switch traffic after validation
   - Rollback to blue if issues

2. **Canary Deployment**
   - Deploy to subset of users
   - Monitor metrics
   - Gradual rollout or rollback

3. **Rolling Deployment**
   - Gradual replacement of instances
   - Zero-downtime deployment
   - Automatic rollback on failure

## Health Checks

### Application Health

The application provides health check endpoints:

- **Liveness**: `/health` - Application is running
- **Readiness**: `/health/ready` - Application is ready to serve traffic
- **Startup**: `/health/startup` - Application is starting up

### Kubernetes Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3

startupProbe:
  httpGet:
    path: /health/startup
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check database credentials
   - Verify network connectivity
   - Check database logs

2. **Redis Connection Issues**
   - Check Redis service status
   - Verify Redis configuration
   - Check memory usage

3. **Kafka Connection Issues**
   - Check Kafka service status
   - Verify topic configuration
   - Check message processing

4. **Performance Issues**
   - Check resource usage
   - Verify scaling configuration
   - Monitor application metrics

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n skills-engine

# Check pod logs
kubectl logs -f deployment/skills-engine -n skills-engine

# Check service status
kubectl get services -n skills-engine

# Check ingress status
kubectl get ingress -n skills-engine

# Check resource usage
kubectl top pods -n skills-engine

# Check events
kubectl get events -n skills-engine
```

## Rollback Procedures

### Automatic Rollback

The deployment includes automatic rollback on:
- Health check failures
- High error rates
- Performance degradation
- Security issues

### Manual Rollback

1. **Rollback deployment**
```bash
kubectl rollout undo deployment/skills-engine -n skills-engine
```

2. **Rollback to specific version**
```bash
kubectl rollout undo deployment/skills-engine --to-revision=2 -n skills-engine
```

3. **Check rollback status**
```bash
kubectl rollout status deployment/skills-engine -n skills-engine
```

## Security Considerations

### Container Security

- Use non-root user
- Scan images for vulnerabilities
- Keep base images updated
- Use minimal base images

### Network Security

- Use TLS for all communications
- Implement network policies
- Use service mesh for security
- Monitor network traffic

### Data Security

- Encrypt data at rest
- Encrypt data in transit
- Implement access controls
- Regular security audits

## Performance Optimization

### Resource Optimization

- Right-size containers
- Use resource limits
- Implement horizontal pod autoscaling
- Monitor resource usage

### Database Optimization

- Use connection pooling
- Implement query optimization
- Use read replicas
- Monitor database performance

### Caching Strategy

- Implement Redis caching
- Use CDN for static content
- Cache frequently accessed data
- Monitor cache hit rates
