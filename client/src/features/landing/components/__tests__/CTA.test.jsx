import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CTA from '../CTA';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('CTA Component', () => {
    it('renders the call-to-action title and description', () => {
        render(
            <BrowserRouter>
                <CTA />
            </BrowserRouter>
        );

        expect(screen.getByText(/Ready to ship/i)).toBeInTheDocument();
        expect(screen.getByText(/better code\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Join thousands of engineers/i)).toBeInTheDocument();
    });

    it('navigates to dashboard when Get Started button is clicked', () => {
        render(
            <BrowserRouter>
                <CTA />
            </BrowserRouter>
        );

        const startedBtn = screen.getByRole('button', { name: /Get Started for Free/i });
        fireEvent.click(startedBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
