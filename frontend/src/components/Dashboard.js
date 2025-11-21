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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No profile found</div>
      </div>
    );
  }

  const user = profile.user;
  const competencies = profile.competencies || [];

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <SkillsGapSidebar 
          profile={profile}
          isDarkMode={isDarkMode}
        />
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

