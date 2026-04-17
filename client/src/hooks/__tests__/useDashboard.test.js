import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDashboard } from '../useDashboard';
import { useStore } from '../../store/useStore';
import { reviewService } from '../../services/api';

// 🧪 MOCK ARCHITECTURE
vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  reviewService: {
    getReviews: vi.fn(),
    deleteReview: vi.fn(),
  },
}));

describe('useDashboard Hook', () => {
  const mockSetReviews = vi.fn();
  const mockSetLoading = vi.fn();
  const mockReviews = [
    { id: '1', language: 'javascript', code: 'const x = 1;' },
    { id: '2', language: 'python', code: 'print("hi")' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({
      reviews: mockReviews,
      setReviews: mockSetReviews,
      setLoading: mockSetLoading,
      isLoading: false,
      searchQuery: '',
    });
  });

  it('hydrates investigation cluster on mount', async () => {
    reviewService.getReviews.mockResolvedValue(mockReviews);
    
    renderHook(() => useDashboard());

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
        expect(reviewService.getReviews).toHaveBeenCalled();
        expect(mockSetReviews).toHaveBeenCalledWith(mockReviews);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it('performs surgical search filtering at the memory layer', () => {
    useStore.mockReturnValue({
      reviews: mockReviews,
      setReviews: mockSetReviews,
      setLoading: mockSetLoading,
      isLoading: false,
      searchQuery: 'python',
    });

    const { result } = renderHook(() => useDashboard());

    expect(result.current.filteredReviews).toHaveLength(1);
    expect(result.current.filteredReviews[0].language).toBe('python');
  });

  it('orchestrates atomic purge operations', async () => {
    reviewService.deleteReview.mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useDashboard());

    let success;
    await act(async () => {
        success = await result.current.purgeReview('1');
    });

    expect(success).toBe(true);
    expect(reviewService.deleteReview).toHaveBeenCalledWith('1');
    expect(mockSetReviews).toHaveBeenCalled();
  });

  it('mitigates network interference with graceful error states', async () => {
    reviewService.getReviews.mockRejectedValue(new Error('Network Failure'));
    
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});
