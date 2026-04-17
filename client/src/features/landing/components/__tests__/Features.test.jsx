import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Features from '../Features';

// Features Component Test Suite

describe('Features Component', () => {
  it('renders correctly with section title', () => {
    render(<Features />);

    expect(screen.getByText(/Built for Technical Excellence/i)).toBeInTheDocument();
  });

  it('renders all four featured cards', () => {
    render(<Features />);

    expect(screen.getByText('Security Shield')).toBeInTheDocument();
    expect(screen.getByText('Leak Detection')).toBeInTheDocument();
    expect(screen.getByText('Pro Refactoring')).toBeInTheDocument();
    expect(screen.getByText('Team Sync')).toBeInTheDocument();
  });

  it('renders descriptions for feature cards', () => {
    render(<Features />);

    expect(screen.getByText(/Automatic detection of SQLi, XSS, and hardcoded secrets/i)).toBeInTheDocument();
    expect(screen.getByText(/Identify memory leaks and unhandled exceptions instantly/i)).toBeInTheDocument();
  });
});
