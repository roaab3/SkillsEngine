import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUserProfileDetail } from '../hooks/useUserProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import CompetencyCard from '../components/CompetencyCard';

const ProfileDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return <div>User ID required</div>;
  }

  const { data: profile, isLoading, error } = useUserProfileDetail(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load profile</h2>
          <Link to="/" className="text-emerald-600 hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {profile.user_name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Relevance Score: {typeof profile.relevance_score === 'number' 
              ? profile.relevance_score.toFixed(1) 
              : 'N/A'}%
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.competencies.map((competency) => (
              <CompetencyCard
                key={competency.competency_id}
                competency={competency}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;

