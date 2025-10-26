import React from 'react';
import './CompetencyCard.css';

interface Skill {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

interface CompetencyWithSkills {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  external_source?: string;
  updated_at: string;
  skills: Skill[];
  userLevel: string;
  progressPercentage: number;
  verifiedSkills: Skill[];
  missingSkills: Skill[];
}

interface CompetencyCardProps {
  competency: CompetencyWithSkills;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({ competency }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return '#10b981'; // Green
      case 'advanced':
        return '#3b82f6'; // Blue
      case 'intermediate':
        return '#f59e0b'; // Orange
      case 'beginner':
        return '#ef4444'; // Red
      default:
        return '#64748b'; // Gray
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return '🏆';
      case 'advanced':
        return '⭐';
      case 'intermediate':
        return '📈';
      case 'beginner':
        return '🌱';
      default:
        return '📚';
    }
  };

  return (
    <div className="competency-card">
      <div className="competency-header">
        <div className="competency-icon">
          {competency.code}
        </div>
        <div className="competency-info">
          <h3 className="competency-title">{competency.name}</h3>
          <div className="competency-level" style={{ color: getLevelColor(competency.userLevel) }}>
            {getLevelIcon(competency.userLevel)} {competency.userLevel}
          </div>
        </div>
      </div>

      <p className="competency-description">
        {competency.description}
      </p>

      {/* Skills Section */}
      <div className="skills-section">
        <h4 className="skills-title">Skills ({competency.verifiedSkills.length}/{competency.skills.length})</h4>
        <div className="skills-list">
          {competency.verifiedSkills.map((skill) => (
            <span key={skill.id} className="skill-tag verified">
              <i>✅</i>
              {skill.name}
            </span>
          ))}
          {competency.missingSkills.map((skill) => (
            <span key={skill.id} className="skill-tag missing">
              <i>❌</i>
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span>{competency.progressPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${competency.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Competency Stats */}
      <div className="competency-stats">
        <div className="stat">
          <span className="stat-number">{competency.verifiedSkills.length}</span>
          <span className="stat-label">Verified</span>
        </div>
        <div className="stat">
          <span className="stat-number">{competency.missingSkills.length}</span>
          <span className="stat-label">Missing</span>
        </div>
        <div className="stat">
          <span className="stat-number">{competency.skills.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
    </div>
  );
};

export default CompetencyCard;

