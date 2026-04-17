import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReviewResult from '../ReviewResult';
import { useReviewResult } from '../../hooks/useReviewResult';
import { useStore } from '../../store/useStore';

// 🔍 MOCKING ARCHITECTURAL LAYERS
vi.mock('../../hooks/useReviewResult');
vi.mock('../../store/useStore');
vi.mock('../../layouts/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout-mock">{children}</div>
}));

// 🔍 MOCKING ARCHITECTURAL LAYERS

// 🛡️ WRAPPER FOR NAVIGATION & CONTEXT
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Review Result (Analysis) Page', () => {
    const mockReview = {
        id: 'rev-789',
        code: 'const x = 1;',
        language: 'javascript',
        createdAt: new Date().toISOString()
    };

    const mockIssues = [
        { id: '1', category: 'security', severity: 'high', line_number: 1, message: 'Malicious code', suggestion: 'Remove it' }
    ];

    const mockHandlers = {
        id: 'rev-789',
        currentReview: mockReview,
        issues: mockIssues,
        filteredIssues: mockIssues,
        isLoading: false,
        activeTab: 'all',
        setActiveTab: vi.fn(),
        toast: { isOpen: false },
        setToast: vi.fn(),
        isDeleteModalOpen: false,
        setIsDeleteModalOpen: vi.fn(),
        highlightedLine: null,
        scrollToLine: vi.fn(),
        setEditorView: vi.fn(),
        handleShare: vi.fn(),
        handleDelete: vi.fn(),
        navigate: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useStore.mockReturnValue({ isLoading: false });
    });

    it('renders analysis report header and metrics', async () => {
        useReviewResult.mockReturnValue(mockHandlers);
        renderWithRouter(<ReviewResult />);
        
        expect(await screen.findByText(/Report:/i)).toBeInTheDocument();
        expect(screen.getByText(/Intelligence Hub/i)).toBeInTheDocument();
    });

    it('displays the source code explorer and findings', async () => {
        useReviewResult.mockReturnValue(mockHandlers);
        renderWithRouter(<ReviewResult />);
        
        expect(await screen.findByText(/analysis_snapshot/i)).toBeInTheDocument();
        expect(screen.getByText(/Malicious code/i)).toBeInTheDocument();
    });

    it('switches tabs when clicked', async () => {
        useReviewResult.mockReturnValue(mockHandlers);
        renderWithRouter(<ReviewResult />);
        
        const perfTab = await screen.findByRole('button', { name: /performance findings/i });
        fireEvent.click(perfTab);
        
        expect(mockHandlers.setActiveTab).toHaveBeenCalledWith('performance');
    });

    it('triggers scrollToLine when a finding is clicked', async () => {
        useReviewResult.mockReturnValue(mockHandlers);
        renderWithRouter(<ReviewResult />);
        
        const findingCard = await screen.findByText(/Malicious code/i);
        fireEvent.click(findingCard.closest('.cursor-pointer'));
        
        expect(mockHandlers.scrollToLine).toHaveBeenCalledWith(1);
    });

    it('opens delete confirmation via purge button', async () => {
        useReviewResult.mockReturnValue(mockHandlers);
        renderWithRouter(<ReviewResult />);
        
        const purgeBtn = screen.getByLabelText(/Purge Investigation/i);
        fireEvent.click(purgeBtn);
        
        expect(mockHandlers.setIsDeleteModalOpen).toHaveBeenCalledWith(true);
    });
});
