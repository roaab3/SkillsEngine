import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from '@/presentation/middleware/error-handler';
import { notFoundHandler } from '@/presentation/middleware/not-found-handler';
import { logger } from '@/infrastructure/logger/logger';
import { connectDatabase } from '@/infrastructure/database/connection';
import { connectKafka } from '@/infrastructure/messaging/kafka';
import { connectRedis } from '@/infrastructure/cache/redis';

// Routes
import { skillRoutes } from '@/presentation/routes/skill-routes';
import { competencyRoutes } from '@/presentation/routes/competency-routes';
import { userRoutes } from '@/presentation/routes/user-routes';
import { assessmentRoutes } from '@/presentation/routes/assessment-routes';
import { healthRoutes } from '@/presentation/routes/health-routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Simple health check endpoint (always responds)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Detailed health check endpoint
app.use('/health/detailed', healthRoutes);

// API routes
app.use('/api/skills', skillRoutes);
app.use('/api/competencies', competencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services
async function initializeApp() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Connect to Kafka
    await connectKafka();
    logger.info('Kafka connected successfully');

    // Connect to Redis (optional)
    if (process.env.REDIS_URL) {
      await connectRedis();
      logger.info('Redis connected successfully');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Skills Engine API server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API Base URL: ${process.env.API_BASE_URL}`);
    });

  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Initialize the application
initializeApp();

export default app;

