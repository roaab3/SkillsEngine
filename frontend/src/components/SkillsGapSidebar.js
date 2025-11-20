/**
 * Skills Gap Sidebar Component
 */

import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * @param {{profile: any, isDarkMode: boolean}} props
 */
export default function SkillsGapSidebar({ profile, isDarkMode }) {
  const gapAnalysis = profile.gap_analysis || {};
  const allMissingMGS = [];

  // Collect all missing MGS from all competencies
  Object.values(gapAnalysis).forEach((gap) => {
    if (gap.missing_mgs) {
      Object.entries(gap.missing_mgs).forEach(([competencyName, skills]) => {
        skills.forEach((skill) => {
          allMissingMGS.push({
            ...skill,
            competencyName,
          });
        });
      });
    }
  });

  return (
    <div className={`w-96 fixed right-0 top-20 bottom-0 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-l border-gray-200 dark:border-slate-700 shadow-2xl overflow-y-auto`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-10 p-4 ${isDarkMode ? 'bg-gradient-to-r from-red-900 to-orange-900' : 'bg-gradient-to-r from-red-50 to-orange-50'} border-b border-gray-200 dark:border-slate-700`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-gray-100">Skills Gap</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {allMissingMGS.length} missing skills
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {allMissingMGS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
              All skills mastered!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Congratulations! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allMissingMGS.map((skill, index) => (
              <div
                key={`${skill.skill_id}-${index}`}
                className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-red-50 border-red-200'} shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 dark:bg-red-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1 dark:text-gray-100">
                      {skill.skill_name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {skill.competencyName}
                    </div>
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                      Progress: 0%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

