import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { pool, getPool } from './config/database';
import logger from './utils/logger';

// Import routes
import healthRoutes from './routes/health';
import webhookRoutes from './routes/webhooks';
import frontendRoutes from './routes/frontend';
import competencyRoutes from './routes/competency';
import trainerRoutes from './routes/trainer';

dotenv.config();

const app: Application = express();

// CORS configuration - Allow all origins (for development/testing)
// WARNING: This allows requests from any origin. For production, restrict to specific origins.
// Must be configured BEFORE other middleware to handle preflight requests

logger.info('CORS Configuration: Allowing all origins');

const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS BEFORE helmet to ensure headers are set correctly
app.use(cors(corsOptions));

// Middleware
// Configure Helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/frontend', frontendRoutes);
app.use('/api/competency', competencyRoutes);
app.use('/api/trainer', trainerRoutes);

// Error handling (must be last)
app.use(errorHandler);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Skills Engine',
    version: '1.0.0',
    status: 'running',
  });
});

// Start server
const startServer = async () => {
  const port = parseInt(process.env.PORT || '8080', 10);
  
  // Start server immediately - don't block on database connection
  // This ensures health endpoint is available for Railway healthchecks
  app.listen(port, '0.0.0.0', () => {
    logger.info(`Skills Engine server running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Health check available at http://0.0.0.0:${port}/health`);
  });

  // Test database connection asynchronously (non-blocking)
  if (pool) {
    try {
      await pool.query('SELECT NOW()');
      logger.info('Database connection successful');
    } catch (error) {
      logger.warn('Database connection failed on startup, but server is running:', error);
      logger.warn('Server will continue running - database may connect later');
    }
  } else {
    logger.info('Server running without database connection');
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (pool) {
    try {
      await pool.end();
    } catch (error) {
      logger.error('Error closing database pool:', error);
    }
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  if (pool) {
    try {
      await pool.end();
    } catch (error) {
      logger.error('Error closing database pool:', error);
    }
  }
  process.exit(0);
});

export default app;
