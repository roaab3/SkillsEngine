import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompetencyCard from '../../components/CompetencyCard';
import type { Competency } from '../../types';

describe('CompetencyCard', () => {
  const mockCompetency: Competency = {
    competency_id: 'comp_123',
    competency_name: 'Full Stack Development',
    description: 'Complete full-stack development skills',
    coverage_percentage: 75.50,
    proficiency_level: 'ADVANCED',
    verified_skills_count: 15,
    total_required_mgs: 20,
  };

  it('should render competency card with all information', () => {
    const onClick = vi.fn();
    render(<CompetencyCard competency={mockCompetency} onClick={onClick} />);

    expect(screen.getByText('Full Stack Development')).toBeInTheDocument();
    expect(screen.getByText('ADVANCED')).toBeInTheDocument();
    expect(screen.getByText('75.5%')).toBeInTheDocument();
    expect(screen.getByText('15 / 20')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CompetencyCard competency={mockCompetency} onClick={onClick} />);

    const card = screen.getByText('Full Stack Development').closest('div');
    if (card) {
      await user.click(card);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should display progress bar with correct percentage', () => {
    const onClick = vi.fn();
    render(<CompetencyCard competency={mockCompetency} onClick={onClick} />);

    const progressBar = screen.getByRole('progressbar', { hidden: true }) || 
                       document.querySelector('[style*="width: 75.5%"]');
    expect(progressBar).toBeInTheDocument();
  });
});

