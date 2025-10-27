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
     
    

      
    </div>
  );
}

