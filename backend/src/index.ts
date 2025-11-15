import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { pool } from './config/database';
import logger from './utils/logger';

// Import routes
import healthRoutes from './routes/health';
import webhookRoutes from './routes/webhooks';
import frontendRoutes from './routes/frontend';
import competencyRoutes from './routes/competency';
import trainerRoutes from './routes/trainer';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - support multiple origins for Vercel deployments
// Must be configured BEFORE other middleware to handle preflight requests
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [
      'http://localhost:3001',
      'http://localhost:5173',
      'https://skills-engine-psjm-7ii6dw848-roaas-projects-70865844.vercel.app',
      'https://*.vercel.app',
    ];

// Log CORS configuration on startup
logger.info('CORS Configuration:', {
  allowedOrigins,
  nodeEnv: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL || 'not set (using defaults)',
});

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      logger.debug('CORS: Allowing request with no origin');
      return callback(null, true);
    }

    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Support wildcard patterns (e.g., *.vercel.app)
      if (allowedOrigin.includes('*')) {
        // Escape dots and convert * to .*
        const pattern = allowedOrigin
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        const matches = regex.test(origin);
        if (matches) {
          logger.debug(`CORS: Origin ${origin} matched pattern ${allowedOrigin}`);
        }
        return matches;
      }
      const exactMatch = origin === allowedOrigin;
      if (exactMatch) {
        logger.debug(`CORS: Origin ${origin} matched exactly`);
      }
      return exactMatch;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        logger.debug(`CORS: Allowing ${origin} in development mode`);
        callback(null, true);
      } else {
        logger.warn(`CORS: Blocked origin ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
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
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    logger.info('Database connection successful');

    app.listen(PORT, () => {
      logger.info(`Skills Engine server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

export default app;
