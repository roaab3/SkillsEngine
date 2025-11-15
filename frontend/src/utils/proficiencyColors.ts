import type { ProficiencyLevel } from '../types';

export const getProficiencyColor = (level: ProficiencyLevel): string => {
  const colors = {
    BEGINNER: 'bg-amber-500',
    INTERMEDIATE: 'bg-green-500',
    ADVANCED: 'bg-blue-500',
    EXPERT: 'bg-emerald-600',
  };
  return colors[level] || colors.BEGINNER;
};

export const getProficiencyTextColor = (level: ProficiencyLevel): string => {
  const colors = {
    BEGINNER: 'text-amber-700 dark:text-amber-400',
    INTERMEDIATE: 'text-green-700 dark:text-green-400',
    ADVANCED: 'text-blue-700 dark:text-blue-400',
    EXPERT: 'text-emerald-700 dark:text-emerald-400',
  };
  return colors[level] || colors.BEGINNER;
};

export const getProficiencyBadgeColor = (level: ProficiencyLevel): string => {
  const colors = {
    BEGINNER: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    INTERMEDIATE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    ADVANCED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    EXPERT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return colors[level] || colors.BEGINNER;
};

