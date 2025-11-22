/**
 * Competency Modal Component
 */

import { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

/**
 * @param {{competencyId: string, onClose: function, isDarkMode: boolean, hierarchyData: object}} props
 */
export default function CompetencyModal({ competencyId, onClose, isDarkMode, hierarchyData: initialHierarchyData }) {
  const [competency, setCompetency] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(initialHierarchyData);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const compRes = await api.getCompetencyById(competencyId);

        if (compRes.success) {
          setCompetency(compRes.data);
        }

        // If hierarchy wasn't passed in props, fetch it
        if (!initialHierarchyData) {
          const hierarchyRes = await api.getCompetencyCompleteHierarchy(competencyId);
          if (hierarchyRes.success) {
            setHierarchyData(hierarchyRes.data);
          }
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
  }, [competencyId, initialHierarchyData]);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderSkillTree = (skill, level = 0, parentPath = '') => {
    const nodeId = `${parentPath}skill-${skill.skill_id}`;
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = skill.children && skill.children.length > 0;
    const indent = level * 24;

    return (
      <div key={nodeId} style={{ marginLeft: `${indent}px` }}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
            level === 0 ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : ''
          }`}
          onClick={() => hasChildren && toggleNode(nodeId)}
        >
          {hasChildren && (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          )}
          {!hasChildren && (
            <>
              <div className="w-4 h-4" />
              <FileText className="w-4 h-4 text-slate-400" />
            </>
          )}
          <span className="text-sm text-slate-800 dark:text-slate-200">
            {skill.skill_name}
          </span>
          {skill.proficiency_level && (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {skill.proficiency_level}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {skill.children.map(child => renderSkillTree(child, level + 1, `${nodeId}-`))}
          </div>
        )}
      </div>
    );
  };

  const renderCompetencySection = (comp, isChild = false) => {
    const nodeId = `comp-${comp.competency_id}`;
    const isExpanded = expandedNodes.has(nodeId);
    const hasSkills = comp.skills && comp.skills.length > 0;

    return (
      <div key={nodeId} className="mb-4">
        <div
          className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer transition-colors ${
            isChild
              ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
              : 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30'
          }`}
          onClick={() => toggleNode(nodeId)}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {comp.competency_name || `Competency ${comp.competency_id}`}
          </span>
          {hasSkills && (
            <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {comp.skills.length} {comp.skills.length === 1 ? 'skill' : 'skills'}
            </span>
          )}
        </div>

        {isExpanded && hasSkills && (
          <div className="mt-2 ml-4 space-y-1">
            {comp.skills.map(skill => renderSkillTree(skill, 0, `${nodeId}-`))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 flex items-center gap-3`}>
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          <div className="text-lg text-slate-800 dark:text-slate-200">Loading hierarchy...</div>
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
              {competency?.competency_name || hierarchyData?.competency_name || 'Competency Details'}
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

        {/* Tree Content  */}
        <div className="p-6">
          {!hierarchyData ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No hierarchy data available for this competency.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Parent Competency */}
              {renderCompetencySection(hierarchyData, false)}

              {/* Child Competencies  */}
              {hierarchyData.children && hierarchyData.children.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Sub-Competencies
                  </h3>
                  {hierarchyData.children.map(child => renderCompetencySection(child, true))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className={`p-4 mt-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} rounded-lg`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900 rounded"></div>
              <span className="dark:text-gray-400">Parent Competency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
              <span className="dark:text-gray-400">Sub-Competency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900 rounded"></div>
              <span className="dark:text-gray-400">Root Skill (L1)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="dark:text-gray-400">Expandable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

