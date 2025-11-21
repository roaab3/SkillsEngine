/**
 * Stats Overview Component
 * Displays key metrics at a glance
 */

import { TrendingUp, Target, Award } from 'lucide-react';

/**
 * @param {{competencies: array}} props
 */
export default function StatsOverview({ competencies = [] }) {
  // Calculate stats
  const totalCompetencies = competencies.length;
  const completedCompetencies = competencies.filter(c => c.coverage_percentage >= 100).length;
  const averageCoverage = totalCompetencies > 0
    ? Math.round(competencies.reduce((sum, c) => sum + (c.coverage_percentage || 0), 0) / totalCompetencies)
    : 0;
  const totalSkills = competencies.reduce((sum, c) => sum + (c.verifiedSkills?.length || 0), 0);
  const masteredSkills = competencies.reduce(
    (sum, c) => sum + (c.verifiedSkills?.filter(s => s.verified).length || 0),
    0
  );

  const stats = [
    {
      label: 'Average Progress',
      value: `${averageCoverage}%`,
      description: 'Across all competencies',
      icon: TrendingUp,
      gradient: 'from-primary-500 to-accent-500',
      bgGradient: 'from-primary-50 to-accent-50',
      darkBgGradient: 'from-primary-950 to-accent-950',
    },
    {
      label: 'Competencies',
      value: `${completedCompetencies}/${totalCompetencies}`,
      description: 'Completed',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'from-blue-950 to-cyan-950',
    },
    {
      label: 'Skills Mastered',
      value: `${masteredSkills}/${totalSkills}`,
      description: 'Verified skills',
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-950 to-pink-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon className="w-full h-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {stat.description}
                </p>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
