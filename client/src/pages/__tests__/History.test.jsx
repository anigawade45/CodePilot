import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../History';
import { useHistory } from '../../hooks/useHistory';
import { useStore } from '../../store/useStore';

// 🔍 MOCKING ARCHITECTURAL LAYERS
vi.mock('../../hooks/useHistory');
vi.mock('../../store/useStore');
vi.mock('../../layouts/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout-mock">{children}</div>
}));

// 🛡️ WRAPPER FOR NAVIGATION & CONTEXT

// 🛡️ WRAPPER FOR NAVIGATION & CONTEXT
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Analysis History Page', () => {
  const mockStats = {
    total: 2,
    avgScore: '85.0',
    languages: ['javascript', 'python']
  };

  const mockReviews = [
    { id: 'rev1', language: 'javascript', score: 90, createdAt: new Date().toISOString() },
    { id: 'rev2', language: 'python', score: 80, createdAt: new Date().toISOString() }
  ];

  const mockHandlers = {
    historyReviews: mockReviews,
    stats: mockStats,
    isLoading: false,
    isDeleting: false,
    sortBy: 'date-desc',
    setSortBy: vi.fn(),
    filterLang: 'all',
    setFilterLang: vi.fn(),
    purgeReview: vi.fn(),
    refresh: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({ 
        session: { user: { name: 'test' } },
        isLoading: false
    });
  });

  it('renders history archive title and stats', async () => {
    useHistory.mockReturnValue(mockHandlers);
    renderWithRouter(<History />);
    
    expect(await screen.findByText(/Archive/i)).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });

  it('displays the list of past reviews', async () => {
    useHistory.mockReturnValue(mockHandlers);
    renderWithRouter(<History />);
    
    // Find absolute score which is a clear unique identifier
    expect(await screen.findByText('90')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });

  it('changes language filter when select is updated', async () => {
    useHistory.mockReturnValue(mockHandlers);
    renderWithRouter(<History />);
    
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'javascript' } });
    
    expect(mockHandlers.setFilterLang).toHaveBeenCalledWith('javascript');
  });

  it('opens confirmation modal when purge is clicked', async () => {
    useHistory.mockReturnValue(mockHandlers);
    renderWithRouter(<History />);
    
    const purgeBtn = await screen.findAllByLabelText(/Purge Entry/i);
    fireEvent.click(purgeBtn[0]);
    
    expect(screen.getByText(/Purge Intelligence Log/i)).toBeInTheDocument();
  });
});
