import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodeReviewer from '../CodeReviewer';

// 🧪 MOCK ARCHITECTURE
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, className }) => (
        <button label={children} onClick={onClick} disabled={disabled} className={className}>
            {children}
        </button>
    )
}));
vi.mock('@/components/ui/textarea', () => ({
    Textarea: ({ value, onChange, placeholder, className }) => (
        <textarea 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            className={className} 
        />
    )
}));
vi.mock('@/components/ui/card', () => ({
    Card: ({ children }) => <div data-testid="card-mock">{children}</div>,
    CardContent: ({ children }) => <div>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
}));
vi.mock('@/components/ui/badge', () => ({
    Badge: ({ children }) => <span>{children}</span>
}));
vi.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }) => <div style={{ overflow: 'auto' }}>{children}</div>
}));

// Mock URL and Clipboard
global.URL.createObjectURL = vi.fn();
navigator.clipboard = {
    writeText: vi.fn(),
};

describe('CodeReviewer (Legacy) Component', () => {
    const mockUser = { email: 'legacy@codepilot.ai' };
    const mockOnSignOut = vi.fn();
    const mockToken = 'test-token';

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('renders the legacy review portal identity', () => {
        render(<CodeReviewer user={mockUser} token={mockToken} onSignOut={mockOnSignOut} />);

        expect(screen.getByText(/Sentia Review/i)).toBeInTheDocument();
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Paste your code here/i)).toBeInTheDocument();
    });

    it('orchestrates a full analysis lifecycle via the legacy API endpoint', async () => {
        const mockIssues = [
            { id: '1', category: 'Security', severity: 'high', title: 'Injection Vulnerability', message: 'Potential SQL injection detected', recommendation: 'Use parameterized queries', line_number: 10 }
        ];

        global.fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ issues: mockIssues })
            })
        );

        render(<CodeReviewer user={mockUser} token={mockToken} onSignOut={mockOnSignOut} />);

        const textarea = screen.getByPlaceholderText(/Paste your code here/i);
        fireEvent.change(textarea, { target: { value: 'const query = "SELECT * FROM users WHERE id=" + id;' } });

        const reviewBtn = screen.getByRole('button', { name: /Review Code/i });
        fireEvent.click(reviewBtn);

        // Verify loading state
        expect(screen.getByText(/Analyzing\.\.\./i)).toBeInTheDocument();

        // Verify results display
        await waitFor(() => {
            expect(screen.getByText('Injection Vulnerability')).toBeInTheDocument();
            // Use specific check for the metric to avoid conflict with sidebar '1'
            const criticalMetric = screen.getByText(/Critical/i).previousSibling;
            expect(criticalMetric).toHaveTextContent('1');
        }, { timeout: 3000 });

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/review', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('javascript')
        }));
    });

    it('triggers the legacy sign-out callback', () => {
        render(<CodeReviewer user={mockUser} token={mockToken} onSignOut={mockOnSignOut} />);

        const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
        fireEvent.click(signOutBtn);

        expect(mockOnSignOut).toHaveBeenCalled();
    });

    it('handles analysis failures with internal fail-safes', async () => {
        global.fetch.mockImplementation(() => 
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Kernel Panic: Analysis overflow' })
            })
        );

        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<CodeReviewer user={mockUser} token={mockToken} onSignOut={mockOnSignOut} />);

        const textarea = screen.getByPlaceholderText(/Paste your code here/i);
        fireEvent.change(textarea, { target: { value: 'err' } });

        const reviewBtn = screen.getByRole('button', { name: /Review Code/i });
        fireEvent.click(reviewBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Kernel Panic: Analysis overflow');
        });

        alertSpy.mockRestore();
    });
});
