/**
 * Competency Card Component
 */

import { ArrowRight } from 'lucide-react';
import { getCoverageColor } from '@/lib/utils';

/**
 * @param {{userCompetency: any, onClick: function}} props
 */
export default function CompetencyCard({ userCompetency, onClick }) {
  const coverage = userCompetency.coverage_percentage || 0;
  const color = getCoverageColor(coverage);
  const verifiedCount = userCompetency.verifiedSkills?.filter(s => s.verified).length || 0;
  const totalSkills = userCompetency.verifiedSkills?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Accent Strip */}
      <div className={`h-1 ${color}`} />

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-teal-900 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          {userCompetency.proficiency_level && (
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {userCompetency.proficiency_level}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
          Competency {userCompetency.competency_id}
        </h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} transition-all duration-700`}
              style={{ width: `${coverage}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {verifiedCount}/{totalSkills} skills mastered
          </span>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-teal-500 font-medium">
            <span>View details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

