const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'development',
    uptime: process.uptime(),
    services: {
      database: 'sqlite',
      kafka: 'not_configured',
      redis: 'not_configured'
    }
  });
});

// Mock API endpoints for demo
app.get('/api/skills', (req, res) => {
  res.json({
    data: [
      {
        id: 'skill-1',
        name: 'JavaScript',
        type: 'L3',
        code: 'JS',
        description: 'JavaScript programming language',
        company_id: 'company-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'skill-2',
        name: 'React',
        type: 'L3',
        code: 'REACT',
        description: 'React library for building user interfaces',
        company_id: 'company-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    }
  });
});

app.get('/api/competencies', (req, res) => {
  res.json({
    data: [
      {
        id: 'comp-1',
        name: 'Frontend Development',
        behavioral_definition: 'Ability to create user interfaces using modern web technologies',
        category: 'Technical',
        description: 'Frontend development competency',
        company_id: 'company-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      pages: 1
    }
  });
});

app.get('/api/users/:id/profile', (req, res) => {
  const { id } = req.params;
  res.json({
    data: {
      user_id: id,
      name: 'John Doe',
      company_id: 'company-123',
      competencies: [
        {
          id: 'uc-1',
          competency_id: 'comp-1',
          name: 'Frontend Development',
          level: 'Advanced',
          progress_percentage: 75,
          verification_source: 'Assessment',
          last_evaluate: new Date().toISOString()
        }
      ],
      skills: [
        {
          id: 'us-1',
          skill_id: 'skill-1',
          name: 'JavaScript',
          verified: true,
          verification_source: 'Assessment',
          last_evaluate: new Date().toISOString()
        },
        {
          id: 'us-2',
          skill_id: 'skill-2',
          name: 'React',
          verified: true,
          verification_source: 'Assessment',
          last_evaluate: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });
});

app.get('/api/users/:id/gaps', (req, res) => {
  const { id } = req.params;
  res.json({
    data: {
      user_id: id,
      gaps: [
        {
          competency_id: 'comp-1',
          competency_name: 'Frontend Development',
          missing_skills: [
            {
              skill_id: 'skill-3',
              name: 'CSS Grid',
              type: 'L3',
              priority: 'High'
            },
            {
              skill_id: 'skill-4',
              name: 'TypeScript',
              type: 'L3',
              priority: 'Medium'
            }
          ],
          gap_percentage: 25,
          recommendations: [
            {
              type: 'course',
              title: 'CSS Grid Fundamentals',
              provider: 'Skills Engine Learning',
              estimated_duration: '4 hours'
            },
            {
              type: 'course',
              title: 'TypeScript Basics',
              provider: 'Skills Engine Learning',
              estimated_duration: '6 hours'
            }
          ]
        }
      ],
      overall_gap_percentage: 25,
      generated_at: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Skills Engine API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: development`);
});

module.exports = app;

