/**
 * Home Page - Dashboard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userId from query params or localStorage
    const id = router.query.userId || localStorage.getItem('userId') || 'default-user';
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

