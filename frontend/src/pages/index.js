/**
 * Home Page - Dashboard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '@/components/Dashboard';
import mockUserProfile from '../../public/mockdata/userProfile.json';

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userId from query params or localStorage
    const defaultUserId = mockUserProfile?.user_id || 'default-user';
    const id = router.query.userId || localStorage.getItem('userId') || defaultUserId;
    setUserId(id);
    if (id) {
      localStorage.setItem('userId', id);
    }
    setLoading(false);
  }, [router.query]);

  if (loading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <Dashboard userId={userId} />;
}

