'use client';

import { useState } from 'react';
import CompetencyDashboard from '../components/CompetencyDashboard';
import SkillGapsPanel from '../components/SkillGapsPanel';
import Header from '../components/Header';

const mockProfile = {
  user_id: 'user-123',
  name: 'John Doe',
  company_id: 'company-123',
  competencies: [
    {
      id: 'uc-1',
      competency_id: 'comp-1',
      name: 'Frontend Development',
      level: 'Advanced',
      progress_percentage: 75,
      verification_source: 'Assessment',
      last_evaluate: new Date().toISOString()
    },
    {
      id: 'uc-2',
      competency_id: 'comp-2',
      name: 'Backend Development',
      level: 'Beginner',
      progress_percentage: 25,
      verification_source: 'User Claims',
      last_evaluate: new Date().toISOString()
    }
  ],
  skills: [
    {
      id: 'us-1',
      skill_id: 'skill-1',
      name: 'JavaScript',
      verified: true,
      verification_source: 'Assessment',
      last_evaluate: new Date().toISOString()
    },
    {
      id: 'us-2',
      skill_id: 'skill-2',
      name: 'React',
      verified: true,
      verification_source: 'Assessment',
      last_evaluate: new Date().toISOString()
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockGaps = {
  user_id: 'user-123',
  gaps: [
    {
      competency_id: 'comp-1',
      competency_name: 'Frontend Development',
      missing_skills: [
        {
          skill_id: 'skill-3',
          name: 'CSS Grid',
          type: 'L3'
        },
        {
          skill_id: 'skill-4',
          name: 'TypeScript',
          type: 'L3'
        }
      ],
      gap_percentage: 25
    },
    {
      competency_id: 'comp-2',
      competency_name: 'Backend Development',
      missing_skills: [
        {
          skill_id: 'skill-5',
          name: 'Node.js',
          type: 'L2'
        },
        {
          skill_id: 'skill-6',
          name: 'Express.js',
          type: 'L2'
        },
        {
          skill_id: 'skill-7',
          name: 'MongoDB',
          type: 'L3'
        },
        {
          skill_id: 'skill-8',
          name: 'RESTful API Design',
          type: 'L3'
        },
        {
          skill_id: 'skill-9',
          name: 'Authentication & Authorization',
          type: 'L3'
        }
      ],
      gap_percentage: 60
    }
  ],
  overall_gap_percentage: 42,
  generated_at: new Date().toISOString()
};

export default function HomePage() {
  const [userId] = useState('user-123');

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-200">
      <Header user={mockProfile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, {mockProfile.name}!
          </h1>
          <p className="text-gray-600 dark:text-secondary-400">
            Track your skills progress and identify areas for growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competency Dashboard - Takes up 2/3 of the width */}
          <div className="lg:col-span-2">
            <CompetencyDashboard 
              competencies={mockProfile.competencies} 
              userId={userId}
            />
          </div>

          {/* Skill Gaps Panel - Takes up 1/3 of the width */}
          <div className="lg:col-span-1">
            <SkillGapsPanel 
              gaps={mockGaps.gaps}
              overallGapPercentage={mockGaps.overall_gap_percentage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

