import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import type { CompetencyDetail, SkillHierarchy } from '../types';
import { cn } from '../utils/cn';

interface CompetencyDetailModalProps {
  competency: CompetencyDetail;
  onClose: () => void;
}

const SkillNode: React.FC<{
  skill: SkillHierarchy;
  level: number;
}> = ({ skill, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const hasChildren = skill.children && skill.children.length > 0;
  const levelColors = [
    'text-amber-600 dark:text-amber-400',
    'text-green-600 dark:text-green-400',
    'text-blue-600 dark:text-blue-400',
    'text-emerald-600 dark:text-emerald-400',
  ];

  return (
    <div className="ml-4">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
          skill.verified && 'bg-emerald-50 dark:bg-emerald-900/20'
        )}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <span className={cn('font-medium', levelColors[level] || levelColors[0])}>
          {skill.skill_name}
        </span>
        {skill.verified && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded">
            Verified
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l-2 border-slate-200 dark:border-slate-700">
          {skill.children!.map((child) => (
            <SkillNode key={child.skill_id} skill={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CompetencyDetailModal: React.FC<CompetencyDetailModalProps> = ({
  competency,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {competency.competency_name}
            </h2>
            {competency.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {competency.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Skills Hierarchy
            </h3>
            <div className="space-y-1">
              <SkillNode skill={competency.skills} level={0} />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Legend
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400">●</span>
                <span className="text-slate-600 dark:text-slate-400">Level 1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">●</span>
                <span className="text-slate-600 dark:text-slate-400">Level 2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">●</span>
                <span className="text-slate-600 dark:text-slate-400">Level 3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">●</span>
                <span className="text-slate-600 dark:text-slate-400">MGS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyDetailModal;

