const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
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
const unifiedEndpointHandler = require('./handlers/unifiedEndpointHandler');

app.use('/api/skills', skillsRoutes);
app.use('/api/competencies', competenciesRoutes);
app.use('/api/user', userRoutes);

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
});

module.exports = app;



