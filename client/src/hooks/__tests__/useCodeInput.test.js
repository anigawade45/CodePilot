import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCodeInput } from '../useCodeInput';
import { useStore } from '../../store/useStore';
import { reviewService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🔍 MOCKING DEPENDENCIES
vi.mock('../../store/useStore');
vi.mock('../../services/api');
vi.mock('react-router-dom');
vi.mock('axios');

// Mock FileReader
class MockFileReader {
  readAsText() {
    setTimeout(() => {
      this.onload({ target: { result: 'file content' } });
    }, 0);
  }
}
vi.stubGlobal('FileReader', MockFileReader);

describe('useCodeInput Logic Hook', () => {
  const mockSetLoading = vi.fn();
  const mockSetCurrentReview = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({
      setLoading: mockSetLoading,
      setCurrentReview: mockSetCurrentReview,
      currentReview: null,
      isLoading: false,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useCodeInput());
    
    expect(result.current.view).toBe('selection');
    expect(result.current.language).toBe('javascript');
    expect(result.current.code).toContain('Hello CodePilot');
  });

  it('validates code length before analysis', async () => {
    const { result } = renderHook(() => useCodeInput());
    
    act(() => {
        result.current.setCode('short');
    });

    await act(async () => {
        await result.current.handleAnalyze();
    });

    expect(result.current.toast.isOpen).toBe(true);
    expect(result.current.toast.message).toContain('too small');
    expect(reviewService.createReview).not.toHaveBeenCalled();
  });

  it('calls reviewService and navigates on successful analysis', async () => {
    const mockReviewId = 'test-id';
    reviewService.createReview.mockResolvedValue({ reviewId: mockReviewId });
    
    const { result } = renderHook(() => useCodeInput());
    
    act(() => {
        result.current.setCode('function test() { return true; }');
    });

    await act(async () => {
        await result.current.handleAnalyze();
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(reviewService.createReview).toHaveBeenCalledWith(
        'function test() { return true; }',
        'javascript',
        null
    );
    expect(mockNavigate).toHaveBeenCalledWith(`/review/${mockReviewId}`);
  });

  it('handles analysis failure gracefully', async () => {
    reviewService.createReview.mockRejectedValue({ 
        response: { data: { error: 'Cloud Overload' } } 
    });
    
    const { result } = renderHook(() => useCodeInput());
    
    act(() => {
        result.current.setCode('function test() { return true; }');
    });

    await act(async () => {
        await result.current.handleAnalyze();
    });

    expect(result.current.toast.isOpen).toBe(true);
    expect(result.current.toast.message).toContain('Cloud Overload');
  });

  it('syncs from store if currentReview exists', () => {
    const mockRev = { code: 'existing code', language: 'python' };
    useStore.mockReturnValue({
        setLoading: mockSetLoading,
        setCurrentReview: mockSetCurrentReview,
        currentReview: mockRev,
    });

    const { result } = renderHook(() => useCodeInput());
    
    expect(result.current.code).toBe(mockRev.code);
    expect(result.current.language).toBe(mockRev.language);
    expect(result.current.view).toBe('editor');
  });
});
