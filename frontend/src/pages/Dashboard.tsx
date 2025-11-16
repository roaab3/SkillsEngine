import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CompetencyCard from '../components/CompetencyCard';
import SkillsGapPanel from '../components/SkillsGapPanel';
import CompetencyDetailModal from '../components/CompetencyDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSkillGaps } from '../hooks/useSkillGaps';
import { api } from '../services/api';
import type { CompetencyDetail } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  // Get userId from URL or localStorage
  const { userId: urlUserId } = useParams<{ userId: string }>();
  const userId = urlUserId || localStorage.getItem('user_id') || 'user_123'; // Default for demo

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const { data: gapAnalysis, isLoading: gapsLoading } = useSkillGaps(userId, 'broad');

  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCompetencyClick = async (competencyId: string) => {
    setLoadingDetail(true);
    try {
      const detail = await api.getCompetencyDetail(competencyId);
      setSelectedCompetency(detail);
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to load competency details');
    } finally {
      setLoadingDetail(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Failed to load profile
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {profileError instanceof Error ? profileError.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header userId={userId} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Relevance Score Banner */}
        <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Career Path Relevance</p>
              <p className="text-3xl font-bold">
                {typeof profile.relevance_score === 'number' 
                  ? profile.relevance_score.toFixed(1) 
                  : 'N/A'}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm mb-1">Career Goal</p>
              <p className="text-lg font-semibold">
                {profile.competencies?.[0]?.competency_name || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex gap-6">
          {/* Left Panel - Competency Cards */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Your Competencies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.competencies.map((competency) => (
                <CompetencyCard
                  key={competency.competency_id}
                  competency={competency}
                  onClick={() => handleCompetencyClick(competency.competency_id)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Skills Gap Sidebar */}
          <SkillsGapPanel gapAnalysis={gapAnalysis} isLoading={gapsLoading} />
        </div>
      </main>

      {/* Competency Detail Modal */}
      {isModalOpen && selectedCompetency && (
        <CompetencyDetailModal
          competency={selectedCompetency}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompetency(null);
          }}
        />
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

