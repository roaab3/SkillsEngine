import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Competency } from '../types';
import { getProficiencyBadgeColor, getProficiencyColor } from '../utils/proficiencyColors';
import { cn } from '../utils/cn';

interface CompetencyCardProps {
  competency: Competency;
  onClick: () => void;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({ competency, onClick }) => {
  const proficiencyColor = getProficiencyColor(competency.proficiency_level);
  const badgeColor = getProficiencyBadgeColor(competency.proficiency_level);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer card-hover overflow-hidden"
    >
      {/* Accent strip */}
      <div className={cn('h-1 w-full', proficiencyColor)} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {competency.competency_name}
            </h3>
            {competency.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {competency.description}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn('px-3 py-1 rounded-full text-xs font-medium', badgeColor)}>
            {competency.proficiency_level}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Coverage</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {typeof competency.coverage_percentage === 'number' 
                ? competency.coverage_percentage.toFixed(1) 
                : '0.0'}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500', proficiencyColor)}
              style={{ width: `${typeof competency.coverage_percentage === 'number' 
                ? competency.coverage_percentage 
                : 0}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        {competency.verified_skills_count !== undefined && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Verified Skills
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {competency.verified_skills_count} / {competency.total_required_mgs || 0}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetencyCard;

