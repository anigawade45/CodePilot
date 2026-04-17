import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { useStore } from '../../../../store/useStore';
import { supabase } from '../../../../lib/supabase';

// Mock dependencies
vi.mock('../../../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Component', () => {
  it('renders correctly with logo and links', () => {
    useStore.mockReturnValue({ session: null, setSession: vi.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('CodePilot')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('shows "Sign In" button when user is not logged in', () => {
    useStore.mockReturnValue({ session: null, setSession: vi.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Sign In')[0]).toBeInTheDocument();
  });

  it('shows "Log Out" button when user is logged in', () => {
    useStore.mockReturnValue({ 
      session: { user: { email: 'test@example.com' } }, 
      setSession: vi.fn() 
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Log Out')[0]).toBeInTheDocument();
  });

  it('navigates to home when logo is clicked', () => {
    useStore.mockReturnValue({ session: null, setSession: vi.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('CodePilot'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls signOut and clears session on logout', async () => {
    const setSessionMock = vi.fn();
    useStore.mockReturnValue({ 
      session: { user: { email: 'test@example.com' } }, 
      setSession: setSessionMock 
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getAllByText('Log Out')[0];
    fireEvent.click(logoutButton);

    await vi.waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(setSessionMock).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
