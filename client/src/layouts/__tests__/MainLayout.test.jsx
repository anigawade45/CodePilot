import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainLayout from '../MainLayout';

describe('MainLayout Component', () => {
    it('renders child components within the glassmorphic shell', () => {
        render(
            <MainLayout>
                <div data-testid="landing-content">Landing Data</div>
            </MainLayout>
        );

        expect(screen.getByTestId('landing-content')).toBeInTheDocument();
    });

    it('applies core aesthetic container classes', () => {
        const { container } = render(
            <MainLayout>
                <div>Content</div>
            </MainLayout>
        );

        const shell = container.firstChild;
        expect(shell).toHaveClass('dark');
        expect(shell).toHaveClass('bg-slate-950');
    });
});
