'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggleWithLabel } from './ThemeToggle';

export function ThemeDemo() {
  const { theme } = useTheme();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-100">
          Theme Demo
        </h3>
        <ThemeToggleWithLabel />
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-secondary-100 mb-2">
            Current Theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-secondary-300">
            This component demonstrates how the theme system works across different UI elements.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-ghost">Ghost Button</button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="badge-beginner">Beginner</span>
          <span className="badge-intermediate">Intermediate</span>
          <span className="badge-advanced">Advanced</span>
          <span className="badge-expert">Expert</span>
        </div>
        
        <div className="space-y-2">
          <div className="progress-bar">
            <div className="progress-fill bg-gradient-to-r from-primary-500 to-primary-600" style={{ width: '75%' }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-secondary-400">Progress: 75%</p>
        </div>
      </div>
    </div>
  );
}
