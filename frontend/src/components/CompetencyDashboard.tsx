'use client';

import { useState } from 'react';
import { CompetencyCard } from './CompetencyCard';
import { CompetencyDetailModal } from './CompetencyDetailModal';
import { Plus, Filter, Search } from 'lucide-react';

interface Competency {
  id: string;
  competency_id: string;
  name: string;
  level: string;
  progress_percentage: number;
  verification_source: string;
  last_evaluate: string;
}

interface CompetencyDashboardProps {
  competencies: Competency[];
  userId: string;
}

export default function CompetencyDashboard({ competencies, userId }: CompetencyDashboardProps) {
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Filter competencies based on search and level
  const filteredCompetencies = competencies.filter(competency => {
    const matchesSearch = competency.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || competency.level.toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const handleCompetencyClick = (competency: Competency) => {
    setSelectedCompetency(competency);
  };

  const closeModal = () => {
    setSelectedCompetency(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-secondary-100">Profile Competentecies</h2>
          <p className="text-gray-600 dark:text-secondary-400">Track your progress across different skill areas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-secondary-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search competencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-secondary-400 w-4 h-4" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="form-input pl-10 pr-8"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Competency Grid */}
      {filteredCompetencies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-700 dark:text-secondary-300 mb-2">No competencies found</h3>
          <p className="text-gray-500 dark:text-secondary-500 mb-4">
            {searchTerm || levelFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : ''
            }
          </p>
    
        </div>
      ) : (
        <div className="competency-grid">
          {filteredCompetencies.map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              onClick={() => handleCompetencyClick(competency)}
            />
          ))}
        </div>
      )}

      {/* Competency Detail Modal */}
      {selectedCompetency && (
        <CompetencyDetailModal
          competency={selectedCompetency}
          userId={userId}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

