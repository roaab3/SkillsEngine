import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-teal-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile/:userId" element={<ProfileDetail />} />
          {/* Catch-all route - redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;

