import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GitHubModal from '../GitHubModal';

describe('GitHubModal Component', () => {
    const mockOnClose = vi.fn();
    const mockOnImport = vi.fn();

    it('renders modal when isOpen is true', () => {
        render(
            <GitHubModal 
                isOpen={true} 
                onClose={mockOnClose} 
                onImport={mockOnImport} 
                isLoading={false} 
            />
        );

        expect(screen.getByText(/Import Source/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/github\.com/i)).toBeInTheDocument();
    });

    it('shows error message for non-github URLs', () => {
        render(
            <GitHubModal 
                isOpen={true} 
                onClose={mockOnClose} 
                onImport={mockOnImport} 
                isLoading={false} 
            />
        );

        const input = screen.getByPlaceholderText(/github\.com/i);
        fireEvent.change(input, { target: { value: 'https://gitlab.com/repo' } });
        
        const submitBtn = screen.getByRole('button', { name: /Fetch Source Bundle/i });
        fireEvent.click(submitBtn);

        expect(screen.getByText(/Please provide a valid GitHub URL/i)).toBeInTheDocument();
        expect(mockOnImport).not.toHaveBeenCalled();
    });

    it('calls onImport for valid GitHub URLs', () => {
        render(
            <GitHubModal 
                isOpen={true} 
                onClose={mockOnClose} 
                onImport={mockOnImport} 
                isLoading={false} 
            />
        );

        const input = screen.getByPlaceholderText(/github\.com/i);
        fireEvent.change(input, { target: { value: 'https://github.com/user/repo/file.js' } });
        
        const submitBtn = screen.getByRole('button', { name: /Fetch Source Bundle/i });
        fireEvent.click(submitBtn);

        expect(mockOnImport).toHaveBeenCalledWith('https://github.com/user/repo/file.js');
    });

    it('shows loading state and disables button during fetch', () => {
        render(
            <GitHubModal 
                isOpen={true} 
                onClose={mockOnClose} 
                onImport={mockOnImport} 
                isLoading={true} 
            />
        );

        expect(screen.getByText(/Fetching Cluster\.\.\./i)).toBeInTheDocument();
        const submitBtn = screen.getByRole('button', { name: /Fetching Cluster\.\.\./i });
        expect(submitBtn).toBeDisabled();
    });

    it('closes when X button is clicked', () => {
        render(
            <GitHubModal 
                isOpen={true} 
                onClose={mockOnClose} 
                onImport={mockOnImport} 
                isLoading={false} 
            />
        );

        const closeBtn = screen.getByRole('button', { name: '' }); // The X icon has no text but we can find by close implementation or label if added
        // Alternatively find by svg/icon if needed, but the button call is standard.
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
