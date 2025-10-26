import React from 'react';
import './MissingSkills.css';

interface Skill {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

interface MissingSkillsProps {
  skills: Skill[];
}

const MissingSkills: React.FC<MissingSkillsProps> = ({ skills }) => {
  if (skills.length === 0) {
    return null;
  }

  const getSkillCategory = (skill: Skill) => {
    // Simple categorization based on skill name
    const name = skill.name.toLowerCase();
    if (name.includes('javascript') || name.includes('react') || name.includes('node')) {
      return 'Frontend Development';
    } else if (name.includes('python') || name.includes('tensorflow') || name.includes('machine')) {
      return 'AI/ML';
    } else if (name.includes('docker') || name.includes('kubernetes') || name.includes('devops')) {
      return 'DevOps';
    } else if (name.includes('sql') || name.includes('database') || name.includes('data')) {
      return 'Data Management';
    } else {
      return 'General Skills';
    }
  };

  const getSkillIcon = (skill: Skill) => {
    const name = skill.name.toLowerCase();
    if (name.includes('javascript') || name.includes('react')) {
      return '⚛️';
    } else if (name.includes('python') || name.includes('tensorflow')) {
      return '🐍';
    } else if (name.includes('docker') || name.includes('kubernetes')) {
      return '🐳';
    } else if (name.includes('sql') || name.includes('database')) {
      return '🗄️';
    } else {
      return '📚';
    }
  };

  const getPriorityLevel = (skill: Skill) => {
    // Simple priority based on skill name patterns
    const name = skill.name.toLowerCase();
    if (name.includes('javascript') || name.includes('react') || name.includes('python')) {
      return 'high';
    } else if (name.includes('docker') || name.includes('kubernetes')) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // Red
      case 'medium':
        return '#f59e0b'; // Orange
      case 'low':
        return '#64748b'; // Gray
      default:
        return '#64748b';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Priority';
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = getSkillCategory(skill);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="missing-skills">
      <div className="missing-skills-header">
        <h2 className="missing-skills-title">
          <span className="missing-skills-icon">🎯</span>
          Skills to Develop
        </h2>
        <p className="missing-skills-subtitle">
          Focus on these skills to advance your career and achieve your goals
        </p>
        <div className="missing-skills-stats">
          <div className="stat">
            <span className="stat-number">{skills.length}</span>
            <span className="stat-label">Missing Skills</span>
          </div>
          <div className="stat">
            <span className="stat-number">{Object.keys(skillsByCategory).length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div className="missing-skills-content">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="skill-category">
            <h3 className="category-title">
              <span className="category-icon">📁</span>
              {category}
              <span className="category-count">({categorySkills.length})</span>
            </h3>
            
            <div className="skills-grid">
              {categorySkills.map((skill) => {
                const priority = getPriorityLevel(skill);
                return (
                  <div 
                    key={skill.id} 
                    className="missing-skill-item"
                    style={{ borderLeftColor: getPriorityColor(priority) }}
                  >
                    <div className="skill-icon">
                      {getSkillIcon(skill)}
                    </div>
                    
                    <div className="skill-content">
                      <div className="skill-header">
                        <h4 className="skill-name">{skill.name}</h4>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(priority) }}
                        >
                          {getPriorityLabel(priority)}
                        </span>
                      </div>
                      
                      <p className="skill-description">
                        {skill.description}
                      </p>
                      
                      <div className="skill-meta">
                        <span className="skill-code">Code: {skill.code}</span>
                        {skill.external_id && (
                          <span className="external-id">ID: {skill.external_id}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="skill-actions">
                      <button className="action-btn primary">
                        Find Courses
                      </button>
                      <button className="action-btn secondary">
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="missing-skills-footer">
        <div className="recommendation-box">
          <h4>💡 Recommendation</h4>
          <p>
            Start with high-priority skills that align with your career goals. 
            Focus on one skill at a time for better learning outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissingSkills;

