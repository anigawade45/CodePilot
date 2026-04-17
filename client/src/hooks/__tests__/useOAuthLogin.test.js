import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOAuthLogin } from '../useOAuthLogin';
import { supabase } from '../../lib/supabase';

// 🧪 MOCK ARCHITECTURE
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
    },
  },
}));

describe('useOAuthLogin Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initiates the GitHub handshake protocol', async () => {
    supabase.auth.signInWithOAuth.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useOAuthLogin());

    await act(async () => {
      await result.current.login('github');
    });

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: expect.objectContaining({
        redirectTo: expect.stringContaining('/dashboard')
      })
    });
  });

  it('manages loading states during the auth portal bridge', async () => {
    // Persistent pending state
    supabase.auth.signInWithOAuth.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useOAuthLogin());

    act(() => {
      result.current.login('google');
    });

    expect(result.current.loadingProvider).toBe('google');
  });

  it('captures provider rejections gracefully', async () => {
    supabase.auth.signInWithOAuth.mockResolvedValue({ 
      error: { message: 'Provider connection refused' } 
    });

    const { result } = renderHook(() => useOAuthLogin());

    await act(async () => {
      await result.current.login('github');
    });

    expect(result.current.error).toBe('Provider connection refused');
    expect(result.current.loadingProvider).toBeNull();
  });
});
