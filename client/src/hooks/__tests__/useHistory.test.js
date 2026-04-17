import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';
import { useDashboard } from '../useDashboard';

// 🔍 MOCKING DEPENDENCIES
vi.mock('../useDashboard');

describe('useHistory Audit Hook', () => {
  const mockReviews = [
    { id: '1', language: 'javascript', score: 85, createdAt: '2023-01-01T10:00:00Z' },
    { id: '2', language: 'python', score: 45, createdAt: '2023-01-02T10:00:00Z' },
    { id: '3', language: 'javascript', score: 95, createdAt: '2023-01-03T10:00:00Z' }
  ];

  const baseMock = {
    reviews: mockReviews,
    isLoading: false,
    isDeleting: false,
    purgeReview: vi.fn(),
    refresh: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDashboard.mockReturnValue(baseMock);
  });

  it('calculates statistics correctly', () => {
    const { result } = renderHook(() => useHistory());
    
    expect(result.current.stats.total).toBe(3);
    expect(result.current.stats.avgScore).toBe('75.0');
    expect(result.current.stats.languages).toContain('javascript');
    expect(result.current.stats.languages).toContain('python');
  });

  it('filters reviews by language', () => {
    const { result } = renderHook(() => useHistory());
    
    act(() => {
      result.current.setFilterLang('python');
    });

    expect(result.current.historyReviews).toHaveLength(1);
    expect(result.current.historyReviews[0].id).toBe('2');
  });

  it('sorts reviews by score descending', () => {
    const { result } = renderHook(() => useHistory());
    
    act(() => {
      result.current.setSortBy('score-desc');
    });

    expect(result.current.historyReviews[0].score).toBe(95);
    expect(result.current.historyReviews[2].score).toBe(45);
  });

  it('sorts reviews by date descending (default)', () => {
    const { result } = renderHook(() => useHistory());
    
    expect(result.current.historyReviews[0].id).toBe('3'); // Most recent
    expect(result.current.historyReviews[2].id).toBe('1'); // Oldest
  });

  it('handles empty reviews gracefully', () => {
    useDashboard.mockReturnValue({ ...baseMock, reviews: [] });
    const { result } = renderHook(() => useHistory());
    
    expect(result.current.stats.total).toBe(0);
    expect(result.current.historyReviews).toHaveLength(0);
  });
});
