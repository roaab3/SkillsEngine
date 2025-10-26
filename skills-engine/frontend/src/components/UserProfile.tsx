import React, { useState, useEffect } from 'react';
import CompetencyCard from './CompetencyCard';
import MissingSkills from './MissingSkills';
import './UserProfile.css';

interface User {
  id: number;
  external_id: string;
  name: string;
  company_id: number;
}

interface Competency {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  external_source?: string;
  updated_at: string;
}

interface Skill {
  id: number;
  code: string;
  name: string;
  description: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

interface UserCompetency {
  id_user: number;
  id_competency: number;
  level: string;
  update_date: string;
}

interface UserSkill {
  id_user: number;
  id_skill: number;
  value: string;
  update_date: string;
}

interface CompetencyWithSkills extends Competency {
  skills: Skill[];
  userLevel: string;
  progressPercentage: number;
  verifiedSkills: Skill[];
  missingSkills: Skill[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [competencies, setCompetencies] = useState<CompetencyWithSkills[]>([]);
  const [missingSkills, setMissingSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userData = await fetchUserProfile(1); // Using user ID 1 for demo
      setUser(userData);

      // Fetch competencies with their skills
      const competenciesData = await fetchCompetencies();
      const competenciesWithSkills: CompetencyWithSkills[] = [];

      for (const competency of competenciesData) {
        // Get skills for this competency
        const skills = await fetchSkills();
        const competencySkills = skills.filter(skill => 
          // This would normally come from the competency_skills relationship
          // For demo purposes, we'll show all skills
          true
        );

        // Calculate user's progress for this competency
        const userCompetencies = await fetchUserCompetencies(userData.id);
        const userSkills = await fetchUserSkills(userData.id);
        
        const userCompetency = userCompetencies.find(uc => uc.id_competency === competency.id);
        const verifiedSkills = competencySkills.filter(skill => 
          userSkills.some(us => us.id_skill === skill.id && us.value === 'verified')
        );
        
        const progressPercentage = competencySkills.length > 0 
          ? Math.round((verifiedSkills.length / competencySkills.length) * 100)
          : 0;

        competenciesWithSkills.push({
          ...competency,
          skills: competencySkills,
          userLevel: userCompetency?.level || 'Beginner',
          progressPercentage,
          verifiedSkills,
          missingSkills: competencySkills.filter(skill => 
            !userSkills.some(us => us.id_skill === skill.id && us.value === 'verified')
          )
        });
      }

      setCompetencies(competenciesWithSkills);

      // Collect all missing skills
      const allMissingSkills = competenciesWithSkills.flatMap(comp => comp.missingSkills);
      setMissingSkills(allMissingSkills);

    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('night-mode');
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <span style={{ marginLeft: '1rem' }}>Loading your skills profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="error">
            <div className="error-icon">⚠️</div>
            <div className="error-message">Oops! Something went wrong</div>
            <div className="error-details">{error}</div>
            <button 
              onClick={loadUserProfile}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'var(--gradient-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div className="header">
        <div className="nav-container">
          <div className="logo">Skills Engine</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Welcome, {user?.name || 'User'}
            </span>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <h1 className="profile-title">Your Skills & Competencies Profile</h1>
          <p className="profile-subtitle">
            Track your progress, identify gaps, and achieve your learning goals
          </p>
        </div>

        {/* Competency Cards */}
        <div className="competency-grid">
          {competencies.map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
            />
          ))}
        </div>

        {/* Missing Skills Section */}
        {missingSkills.length > 0 && (
          <MissingSkills skills={missingSkills} />
        )}
      </div>
    </div>
  );
};

// Mock API functions - these would normally call your backend
const fetchUserProfile = async (userId: number): Promise<User> => {
  // Mock user data
  return {
    id: userId,
    external_id: `user_${userId}`,
    name: 'John Doe',
    company_id: 1
  };
};

const fetchCompetencies = async (): Promise<Competency[]> => {
  // Mock competencies data
  return [
    {
      id: 1,
      code: 'SWE',
      name: 'Software Development',
      description: 'Core software development competencies',
      external_id: 'SWE_001',
      external_source: 'SFIA',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      code: 'ML',
      name: 'Machine Learning',
      description: 'AI and machine learning competencies',
      external_id: 'ML_001',
      external_source: 'ESCO',
      updated_at: '2024-01-15T10:00:00Z'
    }
  ];
};

const fetchSkills = async (): Promise<Skill[]> => {
  // Mock skills data
  return [
    {
      id: 1,
      code: 'JS',
      name: 'JavaScript',
      description: 'JavaScript programming language',
      external_id: 'JS_001',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      code: 'REACT',
      name: 'React',
      description: 'React.js framework',
      external_id: 'REACT_001',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 3,
      code: 'PYTHON',
      name: 'Python',
      description: 'Python programming language',
      external_id: 'PYTHON_001',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 4,
      code: 'TENSORFLOW',
      name: 'TensorFlow',
      description: 'TensorFlow machine learning framework',
      external_id: 'TF_001',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    }
  ];
};

const fetchUserCompetencies = async (userId: number): Promise<UserCompetency[]> => {
  // Mock user competencies data
  return [
    {
      id_user: userId,
      id_competency: 1,
      level: 'Intermediate',
      update_date: '2024-01-15T10:00:00Z'
    },
    {
      id_user: userId,
      id_competency: 2,
      level: 'Beginner',
      update_date: '2024-01-15T10:00:00Z'
    }
  ];
};

const fetchUserSkills = async (userId: number): Promise<UserSkill[]> => {
  // Mock user skills data
  return [
    {
      id_user: userId,
      id_skill: 1,
      value: 'verified',
      update_date: '2024-01-15T10:00:00Z'
    },
    {
      id_user: userId,
      id_skill: 2,
      value: 'verified',
      update_date: '2024-01-15T10:00:00Z'
    }
    // Skills 3 and 4 are missing (not verified)
  ];
};

export default UserProfile;