/**
 * Main Dashboard Component
 */

import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import CompetencyCard from './CompetencyCard';
import SkillsGapSidebar from './SkillsGapSidebar';
import CompetencyModal from './CompetencyModal';
import Header from './Header';
import { Loader2 } from 'lucide-react';

/**
 * @param {{userId: string}} props
 */
export default function Dashboard({ userId }) {
  const { profile, loading, error } = useUserProfile(userId);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const hasProfile = !!profile;
  const user = hasProfile
    ? profile.user
    : { user_name: 'Guest User', employee_type: 'regular' };
  const competencies = hasProfile ? profile.competencies || [] : [];

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

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Competency Dashboard</h1>

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

        {/* Skills Gap Sidebar */}
        <SkillsGapSidebar profile={profile} isDarkMode={isDarkMode} />
      </div>

      {/* Competency Modal */}
      {selectedCompetency && (
        <CompetencyModal
          competencyId={selectedCompetency}
          onClose={() => setSelectedCompetency(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

