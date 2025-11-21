/**
 * Header Component
 */

import { Upload, Sun, Moon, Bell } from 'lucide-react';
import { useState } from 'react';
import CSVUploadModal from './CSVUploadModal';

/**
 * @param {{user: any, isDarkMode: boolean, setIsDarkMode: function}} props
 */
export default function Header({ user, isDarkMode, setIsDarkMode }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isTrainer = user?.employee_type === 'trainer';
  const userName = user?.user_name || 'Guest';

  return (
    <header className="sticky top-0 z-50 glass dark:glass-dark h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
      {/* Left: EduCora logo / brand */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-semibold shadow-md">
          EC
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">EduCora</span>
          <span className="text-xs text-gray-500 dark:text-slate-400">Skills & Competency Engine</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-4">
        {/* CSV Upload Button - Trainer Only */}
        {isTrainer && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-teal-500 text-white rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            <span>Upload CSV</span>
          </button>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-slate-700 hover:scale-110 transition-transform"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-700 dark:text-slate-100" />
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User name */}
        <div className="hidden sm:flex flex-col items-start text-right mr-1">
          <span className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate max-w-[140px]">
            {userName}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-slate-700 hover:scale-110 transition-transform"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <CSVUploadModal
          onClose={() => setShowUploadModal(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </header>
  );
}

