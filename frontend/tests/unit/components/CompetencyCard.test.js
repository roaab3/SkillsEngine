/**
 * Unit Tests for CompetencyCard Component
 */

import { render, screen } from '@testing-library/react';
import CompetencyCard from '@/components/CompetencyCard';

describe('CompetencyCard', () => {
  const mockUserCompetency = {
    competency_id: 'comp_123',
    coverage_percentage: 75,
    proficiency_level: 'ADVANCED',
    verifiedSkills: [
      { skill_id: 'skill_1', verified: true },
      { skill_id: 'skill_2', verified: true },
      { skill_id: 'skill_3', verified: false },
    ],
  };

  it('should render competency card', () => {
    render(<CompetencyCard userCompetency={mockUserCompetency} onClick={() => {}} />);
    
    expect(screen.getByText(/competency/i)).toBeInTheDocument();
  });

  it('should display coverage percentage', () => {
    render(<CompetencyCard userCompetency={mockUserCompetency} onClick={() => {}} />);
    
    // Check if progress bar exists
    const progressBar = document.querySelector('.h-3');
    expect(progressBar).toBeInTheDocument();
  });

  it('should display skills count', () => {
    render(<CompetencyCard userCompetency={mockUserCompetency} onClick={() => {}} />);
    
    expect(screen.getByText(/2\/3 skills mastered/i)).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CompetencyCard userCompetency={mockUserCompetency} onClick={handleClick} />);
    
    const card = screen.getByText(/competency/i).closest('div[class*="cursor-pointer"]');
    card.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

