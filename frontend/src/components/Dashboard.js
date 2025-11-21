/**
 * Main Dashboard Component
 * Two-column layout with Skills Gap on the right side
 */

import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import CompetencyCard from './CompetencyCard';
import SkillsGapSidebar from './SkillsGapSidebar';
import CompetencyModal from './CompetencyModal';
import Header from './Header';
import CSVUploadModal from './CSVUploadModal';
import StatsOverview from './StatsOverview';
import LoadingSkeleton from './LoadingSkeleton';
import { Upload, Search, Filter, Sparkles } from 'lucide-react';

/**
 * @param {{userId: string}} props
 */
export default function Dashboard({ userId }) {
  const { profile, loading, error } = useUserProfile(userId);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const hasProfile = !!profile;
  const user = hasProfile
    ? profile.user
    : { user_name: 'Guest User', employee_type: 'regular' };
  const competencies = hasProfile ? profile.competencies || [] : [];
  const isTrainer = user.employee_type === 'trainer';

  // Filter competencies based on search and filter
  const filteredCompetencies = competencies.filter(comp => {
    const matchesSearch = !searchQuery ||
      comp.competency_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.competency_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterLevel === 'all' ||
      comp.proficiency_level?.toLowerCase() === filterLevel.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <Header
        user={user}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl animate-fade-in">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Skills Engine Dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Welcome back, {user.user_name || 'Learner'}!
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              Track your skills progress, identify competency gaps, and discover
              recommended learning paths to reach your professional goals.
            </p>
          </div>
        </section>

        {/* Error / empty states */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl px-6 py-4 text-red-700 dark:text-red-400 text-sm animate-slide-down">
            <strong>Unable to load live profile data.</strong> You can still browse the dashboard, but data may be incomplete.
          </div>
        )}

        {!error && !hasProfile && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl px-6 py-4 text-amber-700 dark:text-amber-400 text-sm animate-slide-down">
            <strong>No profile data found yet.</strong> Upload data or connect an account to get started.
          </div>
        )}

        {/* Stats Overview */}
        {hasProfile && !error && (
          <StatsOverview competencies={competencies} />
        )}

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Competencies */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Your Competencies
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    Track your progress across {competencies.length} skill areas
                  </p>
                </div>

                {isTrainer && (
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="hidden sm:inline">Upload CSV</span>
                  </button>
                )}
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search competencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter */}
                <div className="relative sm:w-48">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Competency Cards Grid */}
            {filteredCompetencies.length === 0 && hasProfile && !error ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {searchQuery || filterLevel !== 'all'
                    ? 'No competencies match your search criteria.'
                    : 'No competencies available yet for this profile.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCompetencies.map((userComp) => (
                  <CompetencyCard
                    key={userComp.competency_id}
                    userCompetency={userComp}
                    onClick={() => setSelectedCompetency(userComp.competency_id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Skills Gap Sidebar */}
          {hasProfile && (
            <div className="w-full lg:w-96">
              <SkillsGapSidebar profile={profile} isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
      </main>

      {/* Competency Modal */}
      {selectedCompetency && (
        <CompetencyModal
          competencyId={selectedCompetency}
          onClose={() => setSelectedCompetency(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* CSV Upload Modal (Trainer only) */}
      {isTrainer && showUploadModal && (
        <CSVUploadModal
          onClose={() => setShowUploadModal(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
