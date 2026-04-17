import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { useStore } from '../../store/useStore';
import { reviewService } from '../../services/api';

// 🧪 MOCK ORCHESTRATION
vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  reviewService: {
    getReviews: vi.fn(),
    deleteReview: vi.fn(),
  },
}));

// Mock sub-components to isolate page logic
vi.mock('../../layouts/DashboardLayout', () => ({
    default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));

vi.mock('../../features/dashboard/components/DashboardHeader', () => ({
    default: () => <div data-testid="dashboard-header">Header</div>,
}));

vi.mock('../../features/dashboard/components/StatsGrid', () => ({
    default: ({ reviewsCount }) => <div data-testid="stats-grid">Stats: {reviewsCount}</div>,
}));

vi.mock('../../features/dashboard/components/ReviewList', () => ({
    default: ({ reviews }) => (
        <div data-testid="review-list">
            {reviews.map(r => <div key={r.id}>{r.language}</div>)}
        </div>
    ),
}));

vi.mock('../../features/dashboard/components/EmptyState', () => ({
    default: () => <div data-testid="empty-state">No Investigations</div>,
}));

vi.mock('../../components/ui/ConfirmModal', () => ({
    default: () => <div data-testid="confirm-modal">Modal</div>,
}));

// Dashboard Test Suite

describe('Dashboard Component Logic', () => {
  const mockSetReviews = vi.fn();
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Proper import path for useStore was incorrect in previous attempt
    useStore.mockReturnValue({
      reviews: [],
      setReviews: mockSetReviews,
      setLoading: mockSetLoading,
      isLoading: false,
      searchQuery: '',
      session: { user: { email: 'dev@codepilot.ai' } },
    });
  });

  it('syncs data with the backend on initialization', async () => {
    const mockData = [{ id: 'rev-1', language: 'rust', code: 'fn main() {}' }];
    reviewService.getReviews.mockResolvedValue(mockData);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetReviews).toHaveBeenCalledWith(mockData);
    });
  });

  it('displays the empty state when the investigation log is clear', () => {
    useStore.mockReturnValue({
      reviews: [],
      setReviews: mockSetReviews,
      setLoading: mockSetLoading,
      isLoading: false,
      searchQuery: '',
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('applies the current search filter to the review list', () => {
    const reviews = [
      { id: '1', language: 'javascript', code: 'x' },
      { id: '2', language: 'python', code: 'y' }
    ];
    
    useStore.mockReturnValue({
      reviews,
      setReviews: mockSetReviews,
      setLoading: mockSetLoading,
      isLoading: false,
      searchQuery: 'python',
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('python')).toBeInTheDocument();
    expect(screen.queryByText('javascript')).not.toBeInTheDocument();
  });
});
