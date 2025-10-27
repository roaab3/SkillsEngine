'use client';

import { AlertTriangle } from 'lucide-react';

interface SkillGap {
  competency_id: string;
  competency_name: string;
  missing_skills: Array<{
    skill_id: string;
    name: string;
    type: string;
  }>;
  gap_percentage: number;
}

interface SkillGapsPanelProps {
  gaps: SkillGap[];
  overallGapPercentage: number;
}

export default function SkillGapsPanel({ gaps, overallGapPercentage }: SkillGapsPanelProps) {

  const getGapStatusColor = (percentage: number) => {
    if (percentage >= 50) return 'text-error-500';
    if (percentage >= 25) return 'text-warning-500';
    return 'text-success-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-secondary-100 mb-2">Skills Profile</h2>
        <p className="text-gray-600 dark:text-secondary-400">View your competencies and identify missing skills</p>
      </div>

      {/* Overall Gap Summary */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-secondary-100">Skills Overview</h3>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
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
      {gaps.length > 0 ? (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <div key={gap.competency_id} className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-secondary-100">
                    {gap.competency_name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getGapStatusColor(gap.gap_percentage)}`}>
                      {Math.round(gap.gap_percentage)}% gap
                    </span>
                    <AlertTriangle className="w-4 h-4 text-warning-500" />
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Missing Skills List */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-secondary-300 mb-2">
                    Missing Skills ({gap.missing_skills.length})
                  </h5>
                  
                  <div className="space-y-2">
                    {gap.missing_skills.map((skill) => (
                      <div 
                        key={skill.skill_id}
                        className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-secondary-600 bg-gray-50 dark:bg-secondary-700"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-secondary-100">
                              {skill.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-secondary-400 ml-2">
                              ({skill.type})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-8">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-secondary-100 mb-2">
              Complete Skills Profile
            </h3>
            <p className="text-gray-500 dark:text-secondary-400">
              All required skills are present in your profile
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

