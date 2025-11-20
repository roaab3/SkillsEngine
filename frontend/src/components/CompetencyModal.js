/**
 * Competency Modal Component
 */

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPercentage } from '@/lib/utils';

/**
 * @param {{competencyId: string, onClose: function, isDarkMode: boolean}} props
 */
export default function CompetencyModal({ competencyId, onClose, isDarkMode }) {
  const [competency, setCompetency] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, hierRes] = await Promise.all([
          api.getCompetencyById(competencyId),
          api.getCompetencyHierarchy(competencyId),
        ]);

        if (compRes.success) {
          setCompetency(compRes.data);
        }
        if (hierRes.success) {
          setHierarchy(hierRes.data);
        }
      } catch (error) {
        console.error('Failed to load competency data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (competencyId) {
      fetchData();
    }
  }, [competencyId]);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8`}>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-3xl overflow-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className={`sticky top-0 z-10 p-6 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold dark:text-gray-100">
              {competency?.competency_name || 'Competency Details'}
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {competency?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {competency.description}
            </p>
          )}
        </div>

        {/* Tree Content */}
        <div className="p-6">
          {/* TODO: Render tree structure based on hierarchy data */}
          <div className="text-gray-600 dark:text-gray-400">
            Tree structure will be rendered here
          </div>
        </div>

        {/* Legend */}
        <div className={`p-4 mt-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} rounded-lg`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900 rounded"></div>
              <span className="dark:text-gray-400">Competency Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
              <span className="dark:text-gray-400">Category Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900 rounded"></div>
              <span className="dark:text-gray-400">Skill Group</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="dark:text-gray-400">Mastered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

