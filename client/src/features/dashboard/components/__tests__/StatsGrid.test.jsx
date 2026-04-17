import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatsGrid from '../StatsGrid';

// StatsGrid Component Test Suite

describe('StatsGrid Component', () => {
  it('renders correctly with given review count', () => {
    render(<StatsGrid reviewsCount={10} />);
    
    // Total Analyses
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/Total Analyses/i)).toBeInTheDocument();
    
    // Derived stats (check if math works as expected in the component)
    // Bugs: 10 * 2.4 = 24
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('handles zero reviews gracefully', () => {
    render(<StatsGrid reviewsCount={0} />);
    
    // All numeric values should be 0 or placeholders
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Total Analyses/i)).toBeInTheDocument();
  });
});
