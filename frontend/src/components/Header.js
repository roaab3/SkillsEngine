/**
 * Header Component
 */

import { Upload, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import CSVUploadModal from './CSVUploadModal';

/**
 * @param {{user: any, isDarkMode: boolean, setIsDarkMode: function}} props
 */
export default function Header({ user, isDarkMode, setIsDarkMode }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isTrainer = user?.employee_type === 'trainer';

  return (
    <header className="sticky top-0 z-50 glass dark:glass-dark h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
      <h1 className="text-2xl font-bold">Competency Dashboard</h1>
      
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

