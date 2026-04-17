import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CodeInput from '../CodeInput';
import { useCodeInput } from '../../hooks/useCodeInput';
import { useStore } from '../../store/useStore';

// 🔍 MOCKING ARCHITECTURAL LAYERS
vi.mock('../../hooks/useCodeInput');
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

describe('CodeInput Ingestion Page', () => {
  const mockHandlers = {
    view: 'selection',
    setView: vi.fn(),
    code: 'initial code',
    language: 'javascript',
    setLanguage: vi.fn(),
    isGithubModalOpen: false,
    setIsGithubModalOpen: vi.fn(),
    isAiSettingsOpen: false,
    setIsAiSettingsOpen: vi.fn(),
    aiConfig: {},
    setAiConfig: vi.fn(),
    toast: { isOpen: false },
    closeToast: vi.fn(),
    isLoading: false,
    handleGithubImport: vi.fn(),
    handleFileUpload: vi.fn(),
    handleAnalyze: vi.fn(),
    onCodeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({ 
      isLoading: false,
      session: { user: { email: 'test@example.com', id: '123' } },
      searchQuery: '',
      setSearchQuery: vi.fn()
    });
  });

  it('renders selection view initially', async () => {
    useCodeInput.mockReturnValue(mockHandlers);
    renderWithRouter(<CodeInput />);
    
    expect(await screen.findByText(/Initiate/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Source Cluster/i })).toBeInTheDocument();
  });

  it('transitions to editor view when Manual Ingest is clicked', async () => {
    useCodeInput.mockReturnValue(mockHandlers);
    renderWithRouter(<CodeInput />);
    
    const manualHeading = await screen.findByRole('heading', { name: /Manual Ingest/i });
    fireEvent.click(manualHeading.closest('.cursor-pointer'));
    
    expect(mockHandlers.setView).toHaveBeenCalledWith('editor');
  });

  it('renders editor view with CodeMirror when view is "editor"', async () => {
    useCodeInput.mockReturnValue({ ...mockHandlers, view: 'editor', code: 'console.log("test")' });
    renderWithRouter(<CodeInput />);
    
    expect(await screen.findByRole('button', { name: /Execute Analysis/i })).toBeInTheDocument();
  });

  it('opens GitHub modal when GitHub Sync is clicked', async () => {
    useCodeInput.mockReturnValue(mockHandlers);
    renderWithRouter(<CodeInput />);
    
    const githubBtn = await screen.findByRole('button', { name: /GitHub Sync/i });
    fireEvent.click(githubBtn);
    
    expect(mockHandlers.setIsGithubModalOpen).toHaveBeenCalledWith(true);
  });

  it('triggers analysis when Execute button is clicked', async () => {
    useCodeInput.mockReturnValue({ ...mockHandlers, view: 'editor', code: 'valid code block' });
    renderWithRouter(<CodeInput />);
    
    const analyzeBtn = await screen.findByRole('button', { name: /Execute Analysis/i });
    fireEvent.click(analyzeBtn);
    
    expect(mockHandlers.handleAnalyze).toHaveBeenCalled();
  });

  it('shows loading state during analysis', async () => {
    useCodeInput.mockReturnValue({ ...mockHandlers, view: 'editor', isLoading: true });
    renderWithRouter(<CodeInput />);
    
    expect(await screen.findByText(/Analyzing.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyzing/i })).toBeDisabled();
  });
});
