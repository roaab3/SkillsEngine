const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration
const FRONTEND_URL = process.env.FRONTEND_URL;
let corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Configure CORS for production with specific frontend URLs
if (FRONTEND_URL && process.env.NODE_ENV === 'production') {
  const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim());
  
  corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin matches any allowed origin
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        // Support wildcard patterns like https://*.vercel.app
        if (allowedOrigin.includes('*')) {
          const pattern = allowedOrigin.replace('*', '.*');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(origin);
        }
        return origin === allowedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  console.log(`🔒 CORS configured for: ${allowedOrigins.join(', ')}`);
} else {
  console.log(`⚠️  CORS: Allowing all origins (development mode or FRONTEND_URL not set)`);
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api', apiLimiter);

// Health check endpoint (required by Railway)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'skills-engine-backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Skills Engine Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      skills: '/api/skills',
      competencies: '/api/competencies',
      user: '/api/user'
    }
  });
});

// API Routes
const skillsRoutes = require('./routes/api/skills');
const competenciesRoutes = require('./routes/api/competencies');
const userRoutes = require('./routes/api/user');
const userCompetencyRoutes = require('./routes/api/user-competency');
const userSkillRoutes = require('./routes/api/user-skill');
const competencySkillRoutes = require('./routes/api/competency-skill');
const competencySubCompetencyRoutes = require('./routes/api/competency-subcompetency');
const unifiedEndpointHandler = require('./handlers/unifiedEndpointHandler');

app.use('/api/skills', skillsRoutes);
app.use('/api/competencies', competenciesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user-competency', userCompetencyRoutes);
app.use('/api/user-skill', userSkillRoutes);
app.use('/api/competency-skill', competencySkillRoutes);
app.use('/api/competency-subcompetency', competencySubCompetencyRoutes);

// Unified Data Exchange Protocol endpoint
app.post('/api/fill-content-metrics/', unifiedEndpointHandler.handle.bind(unifiedEndpointHandler));

// Error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Skills Engine Backend running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 API endpoints:`);
  console.log(`   - Skills: http://localhost:${PORT}/api/skills`);
  console.log(`   - Competencies: http://localhost:${PORT}/api/competencies`);
  console.log(`   - User: http://localhost:${PORT}/api/user`);
  console.log(`\n💡 If you see database connection errors, check:`);
  console.log(`   1. DATABASE_URL in backend/.env`);
  console.log(`   2. Supabase project is active`);
  console.log(`   3. Run: node check-connection.js`);
});

module.exports = app;



