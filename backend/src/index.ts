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

// Middleware
app.use(helmet());

// CORS configuration - support multiple origins for Vercel deployments
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [
      'http://localhost:3001',
      'http://localhost:5173',
      'https://*.vercel.app',
    ];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
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
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

app.use(cors(corsOptions));
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
