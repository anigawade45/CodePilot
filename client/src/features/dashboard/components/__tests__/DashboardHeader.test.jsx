import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardHeader from '../DashboardHeader';
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

describe('DashboardHeader Component', () => {
    it('renders overview title and description', () => {
        render(
            <BrowserRouter>
                <DashboardHeader />
            </BrowserRouter>
        );

        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/System metrics & investigative logs/i)).toBeInTheDocument();
    });

    it('navigates to new analysis page when button is clicked', () => {
        render(
            <BrowserRouter>
                <DashboardHeader />
            </BrowserRouter>
        );

        const actionBtn = screen.getByRole('button', { name: /Initialize a new sovereign code analysis/i });
        fireEvent.click(actionBtn);

        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NEW_ANALYSIS);
    });
});
