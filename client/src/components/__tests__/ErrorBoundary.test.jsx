import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// 🧨 SIMULATION COMPONENTS
const Healthy = () => <div>Safe Content</div>;
const Crashing = () => {
  throw new Error('Explosion');
};

describe('ErrorBoundary Component', () => {
  // Prevent console.error from polluting the test output when we deliberately crash components
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <Healthy />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component crashes', () => {
    render(
      <ErrorBoundary>
        <Crashing />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Systems Critical/i)).toBeInTheDocument();
    expect(screen.getByText(/unexpected runtime failure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Restart Application/i })).toBeInTheDocument();
  });

  it('triggers page reload when Restart Application is clicked', () => {
    // Mock window.location.reload
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <Crashing />
      </ErrorBoundary>
    );

    const restartBtn = screen.getByRole('button', { name: /Restart Application/i });
    fireEvent.click(restartBtn);

    expect(reloadSpy).toHaveBeenCalled();
  });
});
