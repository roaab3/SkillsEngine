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
import userRoutes from './routes/users';
import assessmentRoutes from './routes/assessment';
import skillRoutes from './routes/skill';
import gapAnalysisRoutes from './routes/gap-analysis';
import directoryRoutes from './routes/directory';
import learnerAiRoutes from './routes/learner-ai';
import learningAnalyticsRoutes from './routes/learning-analytics';
import ragRoutes from './routes/rag';

dotenv.config();

const app: Application = express();

// CORS configuration
// Must be configured BEFORE other middleware to handle preflight requests

const nodeEnv = process.env.NODE_ENV || 'development';
const frontendUrl = process.env.FRONTEND_URL || 'https://skills-engine-psjm-fwddomzeu-roaas-projects-70865844.vercel.app';
const corsMode = nodeEnv === 'production' ? 'production' : 'development';

// Log environment detection and configuration
logger.info(`NODE_ENV detected: ${nodeEnv}`);
logger.info(`CORS mode: ${corsMode}`);
logger.info(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);

if (nodeEnv === 'production') {
  logger.info('CORS Configuration: PRODUCTION mode');
  logger.info(`Allowed origin: ${frontendUrl}`);
} else {
  logger.info('CORS Configuration: DEVELOPMENT mode - allowing all origins');
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (nodeEnv === 'production') {
      // Production: Check if origin matches allowed frontend URL
      if (origin === frontendUrl) {
        return callback(null, true);
      } else {
        logger.warn(`CORS: Blocked origin ${origin}. Allowed: ${frontendUrl}`);
        return callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: Allow all origins
      return callback(null, true);
    }
  },
  credentials: nodeEnv === 'production', // Only allow credentials in production
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
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/gap-analysis', gapAnalysisRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/learner-ai', learnerAiRoutes);
app.use('/api/learning-analytics', learningAnalyticsRoutes);
app.use('/api/rag', ragRoutes);

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
  const port = parseInt(process.env.PORT || '3001', 10);
  
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
