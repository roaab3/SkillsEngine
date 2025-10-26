'use client';

import { AlertTriangle, BookOpen, Clock, ExternalLink } from 'lucide-react';

interface SkillGap {
  competency_id: string;
  competency_name: string;
  missing_skills: Array<{
    skill_id: string;
    name: string;
    type: string;
    priority: string;
  }>;
  gap_percentage: number;
  recommendations?: Array<{
    type: string;
    title: string;
    provider: string;
    estimated_duration: string;
  }>;
}

interface SkillGapsPanelProps {
  gaps: SkillGap[];
  overallGapPercentage: number;
}

export default function SkillGapsPanel({ gaps, overallGapPercentage }: SkillGapsPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-error-500 bg-error-500/10 border-error-500/20';
      case 'medium':
        return 'text-warning-500 bg-warning-500/10 border-warning-500/20';
      case 'low':
        return 'text-secondary-400 bg-secondary-700 border-secondary-600';
      default:
        return 'text-secondary-400 bg-secondary-700 border-secondary-600';
    }
  };

  const getGapStatusColor = (percentage: number) => {
    if (percentage >= 50) return 'text-error-500';
    if (percentage >= 25) return 'text-warning-500';
    return 'text-success-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-100 mb-2">Skill Gaps</h2>
        <p className="text-secondary-400">Identify areas for improvement</p>
      </div>

      {/* Overall Gap Summary */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-100">Overall Gap Analysis</h3>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getGapStatusColor(overallGapPercentage)}`}>
              {Math.round(overallGapPercentage)}%
            </div>
            <p className="text-secondary-400 text-sm">
              {overallGapPercentage >= 50 
                ? 'Significant gaps detected' 
                : overallGapPercentage >= 25 
                ? 'Moderate gaps identified'
                : 'Minimal gaps found'
              }
            </p>
          </div>

          <div className="mt-4">
            <div className="progress-bar">
              <div 
                className="progress-fill bg-gradient-to-r from-warning-500 to-error-500"
                style={{ width: `${overallGapPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Individual Gaps */}
      <div className="space-y-4">
        <h3 className="font-semibold text-secondary-100">Competency Gaps</h3>
        
        {gaps.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-8">
              <div className="w-12 h-12 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-success-500" />
              </div>
              <h4 className="font-medium text-secondary-100 mb-2">No skill gaps found!</h4>
              <p className="text-secondary-400 text-sm">
                You're on track with all your competencies.
              </p>
            </div>
          </div>
        ) : (
          gaps.map((gap) => (
            <div key={gap.competency_id} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-secondary-100 truncate">
                    {gap.competency_name}
                  </h4>
                  <span className={`text-sm font-medium ${getGapStatusColor(gap.gap_percentage)}`}>
                    {Math.round(gap.gap_percentage)}% gap
                  </span>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2 mb-4">
                  {gap.missing_skills.slice(0, 3).map((skill) => (
                    <div 
                      key={skill.skill_id}
                      className={`flex items-center justify-between p-2 rounded-lg border ${getPriorityColor(skill.priority)}`}
                    >
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs uppercase tracking-wide">
                        {skill.priority}
                      </span>
                    </div>
                  ))}
                  
                  {gap.missing_skills.length > 3 && (
                    <p className="text-xs text-secondary-500">
                      +{gap.missing_skills.length - 3} more skills
                    </p>
                  )}
                </div>

                {/* Recommendations */}
                {gap.recommendations && gap.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-secondary-200">Recommended Learning</h5>
                    {gap.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary-700 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-100">{rec.title}</p>
                          <p className="text-xs text-secondary-400">{rec.provider}</p>
                        </div>
                        <div className="flex items-center text-xs text-secondary-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {rec.estimated_duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full mt-3 btn-secondary text-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Learning Path
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold text-secondary-100 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Find Learning Resources
            </button>
            <button className="w-full btn-secondary text-sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Schedule Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

