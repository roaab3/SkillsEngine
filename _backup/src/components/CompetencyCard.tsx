'use client';

import { CheckCircle, Circle, Target, TrendingUp } from 'lucide-react';

interface Competency {
  id: string;
  competency_id: string;
  name: string;
  level: string;
  progress_percentage: number;
  verification_source: string;
  last_evaluate: string;
}

interface CompetencyCardProps {
  competency: Competency;
  onClick: () => void;
}

export function CompetencyCard({ competency, onClick }: CompetencyCardProps) {
  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return <span className="badge-expert">Expert</span>;
      case 'advanced':
        return <span className="badge-advanced">Advanced</span>;
      case 'intermediate':
        return <span className="badge-intermediate">Intermediate</span>;
      case 'beginner':
      default:
        return <span className="badge-beginner">Beginner</span>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'from-success-500 to-success-600';
    if (percentage >= 70) return 'from-primary-500 to-primary-600';
    if (percentage >= 40) return 'from-warning-500 to-warning-600';
    return 'from-secondary-500 to-secondary-600';
  };

  return (
    <div className="competency-card" onClick={onClick}>
      <div className="competency-card-header">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-gray-900 dark:text-secondary-100 truncate">{competency.name}</h3>
          {getLevelBadge(competency.level)}
        </div>
      </div>

      <div className="competency-card-body">
        {/* Skills Summary - Based on competency type */}
        <div className="space-y-2">
          {competency.name === 'Frontend Development' ? (
            <>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">JavaScript</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">React</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">HTML/CSS</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">CSS Grid</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">TypeScript</span>
              </div>
            </>
          ) : competency.name === 'Backend Development' ? (
            <>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">Git</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">Node.js</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">Express.js</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">MongoDB</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">RESTful API Design</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">Core Skills</span>
              </div>
              <div className="flex items-center text-sm">
                <Circle className="w-4 h-4 text-warning-500 mr-2" />
                <span className="text-gray-600 dark:text-secondary-300">Advanced Skills</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="competency-card-footer">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-secondary-400">Progress</span>
            <span className="text-gray-700 dark:text-secondary-300 font-medium">
              {Math.round(competency.progress_percentage)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill bg-gradient-to-r ${getProgressColor(competency.progress_percentage)}`}
              style={{ width: `${competency.progress_percentage}%` }}
            />
          </div>
        </div>



        {/* Last Updated */}
        <div className="mt-2 text-xs text-gray-400 dark:text-secondary-500">
          Last updated: {new Date(competency.last_evaluate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

