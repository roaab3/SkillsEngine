-- Skills Engine Database Schema
-- Migration: 001_create_initial_schema.sql
-- Description: Creates all core tables, indexes, and views for Skills Engine

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- 1. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    skill_id VARCHAR(255) PRIMARY KEY,
    skill_name VARCHAR(500) NOT NULL,
    parent_skill_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 2. Competencies Table
CREATE TABLE IF NOT EXISTS competencies (
    competency_id VARCHAR(255) PRIMARY KEY,
    competency_name VARCHAR(500) NOT NULL,
    description TEXT,
    parent_competency_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE
);

-- 3. Competency-Skill Junction Table
CREATE TABLE IF NOT EXISTS competency_skill (
    competency_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (competency_id, skill_id),
    FOREIGN KEY (competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 4. Skill Hierarchy Junction Table
CREATE TABLE IF NOT EXISTS skill_subSkill (
    parent_skill_id VARCHAR(255) NOT NULL,
    child_skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_skill_id, child_skill_id),
    FOREIGN KEY (parent_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    FOREIGN KEY (child_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 5. Competency Hierarchy Junction Table
CREATE TABLE IF NOT EXISTS competency_subCompetency (
    parent_competency_id VARCHAR(255) NOT NULL,
    child_competency_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_competency_id, child_competency_id),
    FOREIGN KEY (parent_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    FOREIGN KEY (child_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE
);

-- 6. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    employee_type VARCHAR(100),
    path_career VARCHAR(500),
    raw_data TEXT,
    relevance_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Competency Table
CREATE TABLE IF NOT EXISTS userCompetency (
    user_id VARCHAR(255) NOT NULL,
    competency_id VARCHAR(255) NOT NULL,
    coverage_percentage DECIMAL(5,2) DEFAULT 0.00,
    proficiency_level VARCHAR(50),
    verifiedSkills JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, competency_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE
);

-- 8. User Skill Table
CREATE TABLE IF NOT EXISTS userSkill (
    user_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    skill_name VARCHAR(500) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(100),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 9. Official Sources Table
CREATE TABLE IF NOT EXISTS official_sources (
    source_id VARCHAR(255) PRIMARY KEY,
    source_name VARCHAR(500) NOT NULL,
    reference_index_url VARCHAR(1000) NOT NULL,
    reference_type VARCHAR(100),
    access_method VARCHAR(100),
    hierarchy_support BOOLEAN DEFAULT FALSE,
    provides TEXT,
    topics_covered TEXT,
    skill_focus TEXT,
    notes TEXT,
    last_checked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_parent_skill_id ON skills(parent_skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_skill_id ON skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_skill_name ON skills(skill_name);

-- Competencies indexes
CREATE INDEX IF NOT EXISTS idx_competencies_parent_competency_id ON competencies(parent_competency_id);
CREATE INDEX IF NOT EXISTS idx_competencies_competency_id ON competencies(competency_id);
CREATE INDEX IF NOT EXISTS idx_competencies_competency_name ON competencies(competency_name);

-- Junction table indexes
CREATE INDEX IF NOT EXISTS idx_competency_skill_competency_id ON competency_skill(competency_id);
CREATE INDEX IF NOT EXISTS idx_competency_skill_skill_id ON competency_skill(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_subskill_parent ON skill_subSkill(parent_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_subskill_child ON skill_subSkill(child_skill_id);
CREATE INDEX IF NOT EXISTS idx_competency_subcomp_parent ON competency_subCompetency(parent_competency_id);
CREATE INDEX IF NOT EXISTS idx_competency_subcomp_child ON competency_subCompetency(child_competency_id);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_usercompetency_user_id ON userCompetency(user_id);
CREATE INDEX IF NOT EXISTS idx_usercompetency_competency_id ON userCompetency(competency_id);
CREATE INDEX IF NOT EXISTS idx_userskill_user_id ON userSkill(user_id);
CREATE INDEX IF NOT EXISTS idx_userskill_skill_id ON userSkill(skill_id);

-- Official sources indexes
CREATE INDEX IF NOT EXISTS idx_official_sources_reference_type ON official_sources(reference_type);
CREATE INDEX IF NOT EXISTS idx_official_sources_last_checked ON official_sources(last_checked);

-- ============================================
-- VIEWS
-- ============================================

-- Competency Leaf Skills View (MGS)
CREATE OR REPLACE VIEW competency_leaf_skills AS
SELECT 
    c.competency_id,
    c.competency_name,
    s.skill_id,
    s.skill_name
FROM competency_skill cs
JOIN competencies c ON cs.competency_id = c.competency_id
JOIN skills s ON cs.skill_id = s.skill_id
LEFT JOIN skill_subSkill ss ON s.skill_id = ss.parent_skill_id
WHERE ss.parent_skill_id IS NULL;

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competencies_updated_at BEFORE UPDATE ON competencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usercompetency_updated_at BEFORE UPDATE ON userCompetency
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_official_sources_updated_at BEFORE UPDATE ON official_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

