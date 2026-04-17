import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

describe('Stats Component', () => {
    it('renders the section title and subtitle', () => {
        render(<Stats />);

        expect(screen.getByText(/SaaS Metrics & Performance/i)).toBeInTheDocument();
        expect(screen.getByText(/The Toolkit of/i)).toBeInTheDocument();
        expect(screen.getByText(/Modern Teams./i)).toBeInTheDocument();
    });

    it('renders all key performance metrics', () => {
        render(<Stats />);

        // Check values
        expect(screen.getByText('99%')).toBeInTheDocument();
        expect(screen.getByText('2s')).toBeInTheDocument();
        expect(screen.getByText('15+')).toBeInTheDocument();
        expect(screen.getByText('∞')).toBeInTheDocument();

        // Check labels
        expect(screen.getByText(/Correct Context/i)).toBeInTheDocument();
        expect(screen.getByText(/Review Speed/i)).toBeInTheDocument();
        expect(screen.getByText(/Languages/i)).toBeInTheDocument();
        expect(screen.getByText(/Possibilities/i)).toBeInTheDocument();
    });
});
