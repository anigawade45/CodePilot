import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

// 🧪 MOCK ARCHITECTURE
vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
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

describe('DashboardLayout Component', () => {
  const mockSetSession = vi.fn();
  const mockSetSearchQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({
      session: { user: { email: 'dev@codepilot.ai', id: '123' } },
      setSession: mockSetSession,
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
    });
  });

  it('renders the investigation dashboard shell with children', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardLayout>
          <div data-testid="child-content">Sovereign Content</div>
        </DashboardLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText(/Intelligence Dashboard/i)).toBeInTheDocument();
  });

  it('orchestrates navigation via the sidebar cluster', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardLayout />
      </MemoryRouter>
    );

    const historyBtn = screen.getByRole('button', { name: /Analysis History/i });
    fireEvent.click(historyBtn);

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('executes a debounced search logic on user input', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardLayout />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'rust' } });

    // Should not call immediately (debounced)
    expect(mockSetSearchQuery).not.toHaveBeenCalledWith('rust');

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('rust');
    }, { timeout: 1000 });
  });

  it('triggers the core logout protocol', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardLayout />
      </MemoryRouter>
    );

    const logoutBtns = screen.getAllByRole('button', { name: /Log out/i });
    fireEvent.click(logoutBtns[0]); // Desktop version

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockSetSession).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays pro branding for verified engineering clusters', () => {
    useStore.mockReturnValue({
        session: { user: { email: 'pro@codepilot.ai', user_metadata: { plan: 'pro' } } },
        setSession: mockSetSession,
        searchQuery: '',
        setSearchQuery: mockSetSearchQuery,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.getByText(/PRO HUB/i)).toBeInTheDocument();
  });
});
