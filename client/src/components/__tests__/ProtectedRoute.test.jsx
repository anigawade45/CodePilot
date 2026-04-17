import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

describe('ProtectedRoute Component', () => {
  const SecretContent = () => <div data-testid="secret">Classified Information</div>;

  it('renders children when a valid session exists', () => {
    const mockSession = { user: { id: '123' } };

    render(
      <MemoryRouter>
        <ProtectedRoute session={mockSession}>
          <SecretContent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('secret')).toBeInTheDocument();
  });

  it('redirects to root when no session is present', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div data-testid="landing">Landing Page</div>} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute session={null}>
                <SecretContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    // Should have redirected to "/"
    expect(screen.getByTestId('landing')).toBeInTheDocument();
    expect(screen.queryByTestId('secret')).not.toBeInTheDocument();
  });
});
