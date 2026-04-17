import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Auth from '../Auth';
import { useOAuthLogin } from '../../../../hooks/useOAuthLogin';
import { useEmailAuth } from '../../../../hooks/useEmailAuth';

// Mock the hooks
vi.mock('../../../../hooks/useOAuthLogin', () => ({
  useOAuthLogin: vi.fn(),
}));

vi.mock('../../../../hooks/useEmailAuth', () => ({
  useEmailAuth: vi.fn(),
}));

// Auth Test Suite

describe('Auth Component', () => {
  const mockHandleMagicLink = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useOAuthLogin.mockReturnValue({
      login: mockLogin,
      loadingProvider: null,
      error: null,
    });

    useEmailAuth.mockReturnValue({
      handleMagicLink: mockHandleMagicLink,
      loading: false,
      error: null,
    });
  });

  it('renders auth options correctly', () => {
    render(<Auth />);
    expect(screen.getByText(/Access via GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue with OTP/i)).toBeInTheDocument();
  });

  it('calls login function when GitHub button is clicked', () => {
    render(<Auth />);
    const button = screen.getByText(/Access via GitHub/i);
    fireEvent.click(button);
    expect(mockLogin).toHaveBeenCalledWith('github');
  });

  it('calls handleMagicLink when the form is submitted', async () => {
    render(<Auth />);
    
    const input = screen.getByPlaceholderText(/name@company.com/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    const button = screen.getByRole('button', { name: /Continue with OTP/i });
    fireEvent.click(button);

    expect(mockHandleMagicLink).toHaveBeenCalledWith('test@example.com');
  });

  it('shows loading state for GitHub', () => {
    useOAuthLogin.mockReturnValue({
      login: mockLogin,
      loadingProvider: 'github',
      error: null,
    });

    render(<Auth />);
    expect(screen.getByText('Authorizing...')).toBeInTheDocument();
  });
});
