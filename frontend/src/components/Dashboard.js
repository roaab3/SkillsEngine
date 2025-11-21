/**
 * Main Dashboard Component
 */

import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import CompetencyCard from './CompetencyCard';
import SkillsGapSidebar from './SkillsGapSidebar';
import CompetencyModal from './CompetencyModal';
import Header from './Header';
import CSVUploadModal from './CSVUploadModal';
import { Loader2, Upload } from 'lucide-react';

/**
 * @param {{userId: string}} props
 */
export default function Dashboard({ userId }) {
  const { profile, loading, error } = useUserProfile(userId);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const hasProfile = !!profile;
  const user = hasProfile
    ? profile.user
    : { user_name: 'Guest User', employee_type: 'regular' };
  const competencies = hasProfile ? profile.competencies || [] : [];
  const isTrainer = user.employee_type === 'trainer';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      <Header
        user={user}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* Hero / greeting section */}
          <section className="space-y-2">
            <p className="text-sm font-medium text-emerald-500 uppercase tracking-wide">
              Skills Engine
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50">
              Welcome back, {user.user_name || 'Learner'}!
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              Track your skills progress, identify competency gaps, and discover
              recommended learning to reach your goals.
            </p>
          </section>

          {/* Competencies header + search, filter and upload action bar */}
          <section className="space-y-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Your Competencies
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your progress across different skill areas.
              </p>
            </div>

            <div
              className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border px-4 py-3 shadow-sm ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-700'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="w-full md:max-w-xl relative">
                <input
                  type="text"
                  placeholder="Search competencies..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm pl-9 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-slate-400 text-xs">
                  🔍
                </span>
              </div>

              <div className="flex items-stretch gap-2 w-full md:w-auto justify-end">
                <select
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  defaultValue="all"
                >
                  <option value="all">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                {isTrainer && (
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-md hover:bg-emerald-400 hover:shadow-lg transition"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Error / empty states shown inline but layout remains */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              Unable to load live profile data from the backend. You can still
              browse the dashboard, but data may be incomplete.
            </div>
          )}

          {!error && !hasProfile && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 px-4 py-3 text-sm">
              No profile data found yet for this user.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competencies.length === 0 && hasProfile && !error && (
              <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                No competencies available yet for this profile.
              </div>
            )}

            {competencies.map((userComp) => (
              <CompetencyCard
                key={userComp.competency_id}
                userCompetency={userComp}
                onClick={() => setSelectedCompetency(userComp.competency_id)}
              />
            ))}
          </div>
        </div>

        {/* Skills Gap Sidebar (separate column) */}
        <div className="w-full lg:w-[380px]">
          <SkillsGapSidebar profile={profile} isDarkMode={isDarkMode} />
        </div>
      </div>

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

