import React from 'react';
import { Upload, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../hooks/useUserProfile';
import CSVUpload from './CSVUpload';
import { cn } from '../utils/cn';

interface HeaderProps {
  userId: string;
}

const Header: React.FC<HeaderProps> = ({ userId }) => {
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useUserProfile(userId);
  // Check if user is trainer (would come from profile or auth context)
  const employeeType = localStorage.getItem('employee_type');
  const isTrainer = employeeType === 'trainer';

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Competency Dashboard
          </h1>
          {profile && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {profile.user_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isTrainer && <CSVUpload />}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

