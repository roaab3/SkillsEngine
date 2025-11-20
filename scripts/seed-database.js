/**
 * Database Seeding Script
 * 
 * Seeds the database with initial test data
 */

require('dotenv').config();
const { query } = require('../backend/config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Seed skills
    console.log('📚 Seeding skills...');
    const skills = [
      {
        skill_id: 'skill_js_001',
        skill_name: 'JavaScript',
        parent_skill_id: null,
        description: 'Programming language for web development'
      },
      {
        skill_id: 'skill_js_002',
        skill_name: 'React',
        parent_skill_id: 'skill_js_001',
        description: 'JavaScript library for building user interfaces'
      },
      {
        skill_id: 'skill_js_003',
        skill_name: 'Node.js',
        parent_skill_id: 'skill_js_001',
        description: 'JavaScript runtime for server-side development'
      },
      {
        skill_id: 'skill_py_001',
        skill_name: 'Python',
        parent_skill_id: null,
        description: 'High-level programming language'
      },
      {
        skill_id: 'skill_py_002',
        skill_name: 'Django',
        parent_skill_id: 'skill_py_001',
        description: 'Python web framework'
      }
    ];

    for (const skill of skills) {
      await query(
        `INSERT INTO skills (skill_id, skill_name, parent_skill_id, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (skill_id) DO NOTHING`,
        [skill.skill_id, skill.skill_name, skill.parent_skill_id, skill.description]
      );
    }

    // Seed competencies
    console.log('🎯 Seeding competencies...');
    const competencies = [
      {
        competency_id: 'comp_web_001',
        competency_name: 'Web Development',
        description: 'Full-stack web development competency',
        parent_competency_id: null
      },
      {
        competency_id: 'comp_web_002',
        competency_name: 'Frontend Development',
        description: 'Client-side development',
        parent_competency_id: 'comp_web_001'
      },
      {
        competency_id: 'comp_web_003',
        competency_name: 'Backend Development',
        description: 'Server-side development',
        parent_competency_id: 'comp_web_001'
      }
    ];

    for (const comp of competencies) {
      await query(
        `INSERT INTO competencies (competency_id, competency_name, description, parent_competency_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (competency_id) DO NOTHING`,
        [comp.competency_id, comp.competency_name, comp.description, comp.parent_competency_id]
      );
    }

    // Link skills to competencies
    console.log('🔗 Linking skills to competencies...');
    await query(
      `INSERT INTO competency_skill (competency_id, skill_id)
       VALUES 
         ('comp_web_002', 'skill_js_001'),
         ('comp_web_002', 'skill_js_002'),
         ('comp_web_003', 'skill_js_001'),
         ('comp_web_003', 'skill_js_003'),
         ('comp_web_003', 'skill_py_001'),
         ('comp_web_003', 'skill_py_002')
       ON CONFLICT (competency_id, skill_id) DO NOTHING`
    );

    // Seed test user
    console.log('👤 Seeding test user...');
    await query(
      `INSERT INTO users (user_id, user_name, company_id, employee_type, relevance_score)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO NOTHING`,
      ['user_test_001', 'Test User', 'company_001', 'regular', 0.00]
    );

    console.log('✅ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

