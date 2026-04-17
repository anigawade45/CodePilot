import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReviewResult } from '../useReviewResult';
import { useStore } from '../../store/useStore';
import { reviewService } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

// 🔍 MOCKING DEPENDENCIES
vi.mock('../../store/useStore');
vi.mock('../../services/api');
vi.mock('react-router-dom');

describe('useReviewResult View Hook', () => {
    const mockId = 'test-rev-123';
    const mockReview = {
        id: mockId,
        code: 'console.log("hello world");',
        language: 'javascript',
        createdAt: new Date().toISOString(),
        issues: [
            { id: '1', category: 'security', severity: 'high', line_number: 1, message: 'Bad bug', suggestion: 'Fix it' }
        ]
    };

    const mockNavigate = vi.fn();
    const mockSetLoading = vi.fn();
    const mockSetCurrentReview = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useParams.mockReturnValue({ id: mockId });
        useNavigate.mockReturnValue(mockNavigate);
        useStore.mockReturnValue({
            currentReview: mockReview,
            setCurrentReview: mockSetCurrentReview,
            setLoading: mockSetLoading,
            isLoading: false
        });
    });

    it('initializes and computes filtered issues', () => {
        const { result } = renderHook(() => useReviewResult());
        
        expect(result.current.id).toBe(mockId);
        expect(result.current.issues).toHaveLength(1);
        expect(result.current.filteredIssues).toHaveLength(1);
    });

    it('filters issues based on active tab', () => {
        const { result } = renderHook(() => useReviewResult());
        
        act(() => {
            result.current.setActiveTab('performance');
        });

        expect(result.current.filteredIssues).toHaveLength(0);
        
        act(() => {
            result.current.setActiveTab('security');
        });
        expect(result.current.filteredIssues).toHaveLength(1);
    });

    it('handles sharing via reviewService', async () => {
        const mockPublicToken = 'public-123';
        reviewService.shareReview.mockResolvedValue({ public_token: mockPublicToken });
        
        // Mock clipboard API
        const mockClipboard = { writeText: vi.fn().mockResolvedValue() };
        vi.stubGlobal('navigator', { clipboard: mockClipboard });

        const { result } = renderHook(() => useReviewResult());
        
        await act(async () => {
            await result.current.handleShare();
        });

        expect(reviewService.shareReview).toHaveBeenCalledWith(mockId);
        expect(mockClipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(mockPublicToken));
        expect(result.current.toast.message).toContain('Copied to clipboard');
    });

    it('scrolling to line updates highlightedLine', () => {
        const mockView = {
            state: {
                doc: {
                    line: vi.fn().mockReturnValue({ from: 10 })
                }
            },
            dispatch: vi.fn()
        };
        
        const { result } = renderHook(() => useReviewResult());
        
        act(() => {
            result.current.setEditorView(mockView);
        });

        act(() => {
            result.current.scrollToLine(5);
        });

        expect(result.current.highlightedLine).toBe(5);
        expect(mockView.dispatch).toHaveBeenCalled();
    });

    it('handles deletion and navigation', async () => {
        vi.useFakeTimers();
        reviewService.deleteReview.mockResolvedValue();
        
        const { result } = renderHook(() => useReviewResult());
        
        await act(async () => {
            await result.current.handleDelete();
        });

        expect(reviewService.deleteReview).toHaveBeenCalledWith(mockId);
        expect(result.current.toast.message).toContain('deleted');
        
        act(() => {
            vi.runAllTimers();
        });
        
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        vi.useRealTimers();
    });
});
