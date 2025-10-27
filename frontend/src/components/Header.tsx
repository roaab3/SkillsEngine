'use client';

import { User, Settings, LogOut, Bell } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface User {
  user_id: string;
  name: string;
  company_id: string;
}

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-secondary-700 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-emerald rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <h1 className="text-xl font-bold text-gradient">Skills Engine</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-600 dark:text-secondary-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              Skills
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="p-2 text-gray-500 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full text-xs"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-secondary-100">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-secondary-400">Company ID: {user?.company_id}</p>
              </div>
              
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-secondary-400 hover:text-error-500 dark:hover:text-error-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

