import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillsGapPanel from '../../components/SkillsGapPanel';
import type { GapAnalysis } from '../../types';

describe('SkillsGapPanel', () => {
  it('should display loading state', () => {
    render(<SkillsGapPanel isLoading={true} />);
    // Loading state shows skeleton
    const panel = document.querySelector('.animate-pulse');
    expect(panel).toBeInTheDocument();
  });

  it('should display empty state when no gaps', () => {
    const gapAnalysis: GapAnalysis = {
      user_id: 'user_123',
      user_name: 'John Doe',
      gap_analysis_type: 'broad',
      missing_skills_map: {},
    };

    render(<SkillsGapPanel gapAnalysis={gapAnalysis} />);
    expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
    expect(screen.getByText(/All skills covered/i)).toBeInTheDocument();
  });

  it('should display missing skills when gaps exist', () => {
    const gapAnalysis: GapAnalysis = {
      user_id: 'user_123',
      user_name: 'John Doe',
      gap_analysis_type: 'broad',
      missing_skills_map: {
        comp_123: {
          competency_id: 'comp_123',
          competency_name: 'Frontend Development',
          missing_mgs: [
            { skill_id: 'skill_1', skill_name: 'React Hooks' },
            { skill_id: 'skill_2', skill_name: 'Redux' },
          ],
        },
      },
    };

    render(<SkillsGapPanel gapAnalysis={gapAnalysis} />);
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('React Hooks')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
  });
});
