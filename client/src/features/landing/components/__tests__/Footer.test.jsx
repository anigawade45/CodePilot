import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
    it('renders logo and copyright information', () => {
        render(<Footer />);

        expect(screen.getByAltText('CodePilot')).toBeInTheDocument();
        expect(screen.getByText(/CodePilot Labs/i)).toBeInTheDocument();
        expect(screen.getByText(/Built for the Future of DevOps/i)).toBeInTheDocument();
    });

    it('contains essential resource links', () => {
        render(<Footer />);

        const privacyLink = screen.getByRole('link', { name: /Privacy/i });
        const termsLink = screen.getByRole('link', { name: /Terms/i });
        const twitterLink = screen.getByRole('link', { name: /Twitter/i });

        expect(privacyLink).toBeInTheDocument();
        expect(termsLink).toBeInTheDocument();
        expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    });
});
