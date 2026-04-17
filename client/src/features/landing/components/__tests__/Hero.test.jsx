import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../Hero';
import { useStore } from '../../../../store/useStore';

// Mock dependencies
vi.mock('../../../../store/useStore', () => ({
  useStore: vi.fn(),
}));

// Hero Component Test Suite

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Typewriter
vi.mock('../Hero', async () => {
  const actual = await vi.importActual('../Hero');
  return {
    ...actual,
    Typewriter: ({ text }) => <span>{text}</span>,
  };
});

describe('Hero Component', () => {
  it('renders correctly with title and description', () => {
    useStore.mockReturnValue({ session: null });

    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByText(/Next-Gen Code Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Excellence/i)).toBeInTheDocument();
    expect(screen.getByText(/CodePilot is the intelligent layer for your development workflow/i)).toBeInTheDocument();
  });

  it('shows "Start Free Review" when user is not logged in', () => {
    useStore.mockReturnValue({ session: null });

    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByText(/Start Free Review/i)).toBeInTheDocument();
  });

  it('shows "Go to Dashboard" when user is logged in', () => {
    useStore.mockReturnValue({ session: { user: { id: '123' } } });

    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByText(/Go to Dashboard/i)).toBeInTheDocument();
  });

  it('navigates to dashboard when button is clicked', () => {
    useStore.mockReturnValue({ session: null });

    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    const button = screen.getByText(/Start Free Review/i);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
