import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReviewList from '../ReviewList';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('ReviewList Component', () => {
    const mockReviews = [
        { 
            id: 'audit-1', 
            code: 'const x = 5;', 
            language: 'javascript', 
            created_at: '2024-04-17T10:00:00Z' 
        },
        { 
            id: 'audit-2', 
            code: 'print("hello")', 
            language: 'python', 
            created_at: 'invalid-date' 
        }
    ];

    it('renders loading skeletons when isLoading is true', () => {
        const { container } = render(
            <BrowserRouter>
                <ReviewList reviews={[]} onDelete={vi.fn()} isLoading={true} />
            </BrowserRouter>
        );

        // Check for skeleton elements
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders list of review cards correctly', () => {
        render(
            <BrowserRouter>
                <ReviewList reviews={mockReviews} onDelete={vi.fn()} isLoading={false} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Log-AUDIT-1/i)).toBeInTheDocument();
        expect(screen.getByText(/javascript/i)).toBeInTheDocument();
        expect(screen.getByText(/python/i)).toBeInTheDocument();
    });

    it('handles malformed dates gracefully', () => {
        render(
            <BrowserRouter>
                <ReviewList reviews={mockReviews} onDelete={vi.fn()} isLoading={false} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Unstable Temporal Signal/i)).toBeInTheDocument();
    });

    it('triggers navigation when a card is clicked', () => {
        render(
            <BrowserRouter>
                <ReviewList reviews={mockReviews} onDelete={vi.fn()} isLoading={false} />
            </BrowserRouter>
        );

        const card = screen.getByLabelText(/View analysis report for investigation audit-1/i);
        fireEvent.click(card);

        expect(mockNavigate).toHaveBeenCalled();
    });

    it('triggers onDelete when delete button is clicked', () => {
        const deleteHandler = vi.fn();
        render(
            <BrowserRouter>
                <ReviewList reviews={mockReviews} onDelete={deleteHandler} isLoading={false} />
            </BrowserRouter>
        );

        const deleteBtns = screen.getAllByLabelText(/Purge investigation log/i);
        fireEvent.click(deleteBtns[0]);

        expect(deleteHandler).toHaveBeenCalled();
    });
});
