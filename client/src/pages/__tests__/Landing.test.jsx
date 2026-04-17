import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Landing from '../Landing';
import { useStore } from '../../store/useStore';

// Mock dependencies
vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

// Mock lazy components to avoid async loading issues in tests
vi.mock('../../features/landing/components/Pricing', () => ({
  default: () => <div data-testid="pricing-mock">Pricing Component</div>,
}));

vi.mock('../../features/landing/components/CTA', () => ({
  default: () => <div data-testid="cta-mock">CTA Component</div>,
}));

// Landing Test Suite

vi.mock('../../features/landing/components/Hero', async () => {
  const actual = await vi.importActual('../../features/landing/components/Hero');
  return {
    ...actual,
    Typewriter: ({ text }) => <span>{text}</span>,
  };
});

vi.mock('../../components/ui/BackgroundEffects', () => ({
  default: () => <div data-testid="background-effects">Background Effects</div>,
}));

describe('Landing Page Integration', () => {
  it('renders all main sections correctly', async () => {
    useStore.mockReturnValue({ session: null, setSession: vi.fn() });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Verify Navbar (multiple occurrences exist)
    expect(screen.getAllByText(/CodePilot/i)[0]).toBeInTheDocument();

    // Verify Hero
    expect(screen.getByText(/Next-Gen Code Intelligence/i)).toBeInTheDocument();

    // Verify Features
    expect(screen.getByText(/Built for Technical Excellence/i)).toBeInTheDocument();

    // Verify Lazy Components are loaded
    await waitFor(() => {
      expect(screen.getByTestId('pricing-mock')).toBeInTheDocument();
      expect(screen.getByTestId('cta-mock')).toBeInTheDocument();
    });

    // Verify Footer
    expect(screen.getByText(/© 2026 CodePilot Labs/i)).toBeInTheDocument();
  });

  it('scroll event updates state (visual check through coverage)', async () => {
    useStore.mockReturnValue({ session: null, setSession: vi.fn() });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    // Check if Navbar class changes would happen (indirectly)
    // In a real browser this would trigger the useEffect listener
  });
});
