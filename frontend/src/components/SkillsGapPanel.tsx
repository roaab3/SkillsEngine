import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import type { GapAnalysis, MissingSkillGroup } from '../types';

interface SkillsGapPanelProps {
  gapAnalysis?: GapAnalysis;
  isLoading?: boolean;
}

const SkillsGapPanel: React.FC<SkillsGapPanelProps> = ({ gapAnalysis, isLoading }) => {
  if (isLoading) {
    return (
      <aside className="w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </aside>
    );
  }

  const missingSkillsCount = gapAnalysis
    ? Object.values(gapAnalysis.missing_skills_map).reduce(
        (sum, group) => sum + group.missing_mgs.length,
        0
      )
    : 0;

  const hasGaps = missingSkillsCount > 0;

  return (
    <aside className="w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Sticky Header */}
      <div className="gradient-emerald-dark p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-6 h-6" />
          <h2 className="text-xl font-bold">Skills Gap</h2>
        </div>
        <p className="text-emerald-100 text-sm">
          {hasGaps ? `${missingSkillsCount} skills to develop` : 'All skills covered!'}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!hasGaps ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              You've covered all required skills for your career path.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(gapAnalysis!.missing_skills_map).map((group: MissingSkillGroup, idx) => (
              <div
                key={group.competency_id}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {idx + 1}. {group.competency_name}
                </h3>
                <ul className="space-y-1">
                  {group.missing_mgs.map((skill) => (
                    <li
                      key={skill.skill_id}
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {skill.skill_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SkillsGapPanel;

