/**
 * Stats Overview Component
 * Displays average progress metric
 */

import { TrendingUp } from 'lucide-react';

/**
 * @param {{competencies: array, relevanceScore?: number | null, pathCareer?: string | null}} props
 */
export default function StatsOverview({ competencies = [], relevanceScore = null, pathCareer = null }) {
  // Calculate average coverage (fallback if relevanceScore is not available)
  const totalCompetencies = competencies.length;
  const averageCoverage = totalCompetencies > 0
    ? Math.round(competencies.reduce((sum, c) => sum + (c.coverage_percentage || 0), 0) / totalCompetencies)
    : 0;

  const displayValue = typeof relevanceScore === 'number'
    ? Math.round(relevanceScore)
    : averageCoverage;

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default animate-slide-up">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Relevance Score
          </p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
            {displayValue}%
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Based on your current competency profile
          </p>
          {pathCareer && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Career path: <span className="font-semibold">{pathCareer}</span>
            </p>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
