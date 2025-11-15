'use client';

import { useState } from 'react';
import CompetencyDashboard from '../components/CompetencyDashboard';
import SkillGapsPanel from '../components/SkillGapsPanel';
import Header from '../components/Header';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSkillGaps } from '@/hooks/useSkillGaps';

export default function HomePage() {
  const [userId] = useState('user-123');
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: gapsData, isLoading: gapsLoading } = useSkillGaps(userId);

  if (profileLoading || gapsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-200">
        <main className="container mx-auto px-4 py-8">
          <div className="text-gray-600 dark:text-secondary-400">Loading...</div>
        </main>
      </div>
    );
  }

  if (!profile || !gapsData) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-200">
        <main className="container mx-auto px-4 py-8">
          <div className="text-red-600 dark:text-red-400">Failed to load data.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-200">
      <Header user={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-gray-600 dark:text-secondary-400">
            Track your skills progress and identify areas for growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competency Dashboard - Takes up 2/3 of the width */}
          <div className="lg:col-span-2">
            <CompetencyDashboard 
              competencies={profile.competencies} 
              userId={userId}
            />
          </div>

          {/* Skill Gaps Panel - Takes up 1/3 of the width */}
          <div className="lg:col-span-1">
            <SkillGapsPanel 
              gaps={gapsData.gaps}
              overallGapPercentage={gapsData.overall_gap_percentage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

