/**
 * Competency Card Component
 * Completely redesigned with modern styling and animations
 */

import { ArrowRight, TrendingUp, BookOpen, Star } from 'lucide-react';
import { getCoverageColor, getProficiencyColor } from '@/lib/utils';

/**
 * @param {{userCompetency: any, onClick: function}} props
 */
export default function CompetencyCard({ userCompetency, onClick }) {
  const coverage = userCompetency.coverage_percentage || 0;
  const colorClass = getCoverageColor(coverage);
  const verifiedCount = userCompetency.verifiedSkills?.filter(s => s.verified).length || 0;
  const totalSkills = userCompetency.verifiedSkills?.length || 0;
  const proficiency = userCompetency.proficiency_level || 'beginner';

  // Determine gradient based on coverage
  const getGradientColors = (coverage) => {
    if (coverage >= 80) return 'from-primary-500 to-accent-500';
    if (coverage >= 50) return 'from-blue-500 to-cyan-500';
    if (coverage >= 25) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };

  const gradient = getGradientColors(coverage);

  // Get proficiency badge style
  const getProficiencyStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'intermediate':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover-lift cursor-pointer overflow-hidden animate-scale-in"
    >
      {/* Gradient accent bar at top */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`} />
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Proficiency Badge */}
          {proficiency && (
            <div className={`px-3 py-1.5 text-xs font-bold uppercase rounded-full ${getProficiencyStyle(proficiency)} shadow-md group-hover:scale-105 transition-transform`}>
              {proficiency}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {userCompetency.competency_name || `Competency ${userCompetency.competency_id}`}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ID: {userCompetency.competency_id}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress percentage and trend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                {Math.round(coverage)}%
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                <TrendingUp className="w-4 h-4" />
                <span>Progress</span>
              </div>
            </div>

            {/* Skills count badge */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {verifiedCount}/{totalSkills}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out animate-progress-fill relative`}
              style={{ width: `${coverage}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {verifiedCount} of {totalSkills} skills mastered
          </p>
        </div>

        {/* Footer CTA */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            View detailed breakdown
          </span>
          <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
            <span className="text-sm">Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10 pointer-events-none">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full blur-3xl`} />
      </div>
    </div>
  );
}
