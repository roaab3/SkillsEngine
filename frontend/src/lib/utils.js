/**
 * Utility Functions
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format percentage
 * @param {number} value
 * @returns {string}
 */
export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

/**
 * Get proficiency level color
 * @param {string} [level]
 * @returns {string}
 */
export function getProficiencyColor(level) {
  switch (level) {
    case 'EXPERT':
      return 'bg-purple-500';
    case 'ADVANCED':
      return 'bg-blue-500';
    case 'INTERMEDIATE':
      return 'bg-green-500';
    case 'BEGINNER':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get coverage color based on percentage
 * @param {number} percentage
 * @returns {string}
 */
export function getCoverageColor(percentage) {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-teal-500';
  if (percentage >= 40) return 'bg-amber-500';
  if (percentage > 0) return 'bg-orange-500';
  return 'bg-gray-500';
}

/**
 * Format date
 * @param {string} [dateString]
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime
 * @param {string} [dateString]
 * @returns {string}
 */
export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

