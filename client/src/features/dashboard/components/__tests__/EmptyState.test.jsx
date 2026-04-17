import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmptyState from '../EmptyState';
import { ROUTES } from '../../../../constants/routes';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('EmptyState Component', () => {
    it('renders empty state message and conversion copy', () => {
        render(
            <BrowserRouter>
                <EmptyState />
            </BrowserRouter>
        );

        expect(screen.getByText(/No analysis history found/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload your source fragments/i)).toBeInTheDocument();
    });

    it('navigates to ingestion page when Initiate button is clicked', () => {
        render(
            <BrowserRouter>
                <EmptyState />
            </BrowserRouter>
        );

        const initiateBtn = screen.getByRole('button', { name: /Start your first code analysis investigation/i });
        fireEvent.click(initiateBtn);

        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NEW_ANALYSIS);
    });
});
