'use client';

import { X, CheckCircle, Circle, Target, TrendingUp, BookOpen } from 'lucide-react';

interface Competency {
  id: string;
  competency_id: string;
  name: string;
  level: string;
  progress_percentage: number;
  verification_source: string;
  last_evaluate: string;
}

interface CompetencyDetailModalProps {
  competency: Competency;
  userId: string;
  onClose: () => void;
}

export function CompetencyDetailModal({ competency, onClose }: CompetencyDetailModalProps) {
  // Mock data for skills - in a real app, this would come from the API
  const skills = [
    { id: '1', name: 'Planning & Scheduling', verified: true, type: 'L3' },
    { id: '2', name: 'Risk Assessment', verified: true, type: 'L3' },
    { id: '3', name: 'Stakeholder Communication', verified: false, type: 'L3' },
    { id: '4', name: 'Agile Reporting', verified: false, type: 'L4' },
    { id: '5', name: 'Budget Management', verified: true, type: 'L3' },
    { id: '6', name: 'Team Leadership', verified: false, type: 'L2' },
  ];

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

  const verifiedSkills = skills.filter(skill => skill.verified);
  const missingSkills = skills.filter(skill => !skill.verified);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary-800 rounded-xl border border-secondary-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-700">
          <div>
            <h2 className="text-xl font-bold text-secondary-100">{competency.name}</h2>
            <div className="flex items-center space-x-3 mt-2">
              {getLevelBadge(competency.level)}
              <span className="text-sm text-secondary-400">
                {Math.round(competency.progress_percentage)}% Complete
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Overview */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-100">Progress Overview</h3>
                
              </div>
              
            

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success-500">{verifiedSkills.length}</div>
                  <div className="text-sm text-secondary-400">Verified Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-error-500">{missingSkills.length}</div>
                  <div className="text-sm text-secondary-400">Missing Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-500">{skills.length}</div>
                  <div className="text-sm text-secondary-400">Total Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verified Skills */}
            <div>
              <h3 className="font-semibold text-secondary-100 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                Verified Skills ({verifiedSkills.length})
              </h3>
              <div className="space-y-2">
                {verifiedSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-success-500/10 border border-success-500/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-secondary-100">{skill.name}</p>
                      <p className="text-xs text-secondary-400">{skill.type}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-success-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h3 className="font-semibold text-secondary-100 mb-3 flex items-center">
                <Circle className="w-4 h-4 text-error-500 mr-2" />
                Missing Skills ({missingSkills.length})
              </h3>
              <div className="space-y-2">
                {missingSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-error-500/10 border border-error-500/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-secondary-100">{skill.name}</p>
                      <p className="text-xs text-secondary-400">{skill.type}</p>
                    </div>
                    <Circle className="w-4 h-4 text-error-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          

          {/* Target Level */}
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-secondary-100 mb-3 flex items-center">
                <Target className="w-4 h-4 text-warning-500 mr-2" />
                Target Level
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-300">Current: {competency.level}</p>
                  <p className="text-sm text-secondary-300">Target: Expert</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-400">Progress to Expert</p>
                  <p className="text-lg font-bold text-warning-500">
                    {Math.round((competency.progress_percentage / 90) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-700">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

