import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthListener } from '../useAuthListener';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { setAuthToken } from '../../services/api';

// 🧪 MOCK ARCHITECTURE
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  setAuthToken: vi.fn(),
}));

describe('useAuthListener Hook', () => {
  const mockSetSession = vi.fn();
  const mockSubscription = { unsubscribe: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.mockReturnValue({ setSession: mockSetSession });
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: mockSubscription } });
  });

  it('performs internal identity recovery on initialization', async () => {
    const mockSession = { user: { email: 'dev@codepilot.ai' }, access_token: 'token-123' };
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });

    renderHook(() => useAuthListener());

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(mockSetSession).toHaveBeenCalledWith(mockSession);
      expect(setAuthToken).toHaveBeenCalledWith('token-123');
    });
  });

  it('orchestrates real-time state sync on auth events', async () => {
    let authCallback;
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return { data: { subscription: mockSubscription } };
    });

    renderHook(() => useAuthListener());

    const eventSession = { user: { email: 'update@codepilot.ai' }, access_token: 'new-token' };
    
    // Simulate SIGNED_IN event
    authCallback('SIGNED_IN', eventSession);

    expect(mockSetSession).toHaveBeenCalledWith(eventSession);
    expect(setAuthToken).toHaveBeenCalledWith('new-token');

    // Simulate SIGNED_OUT event
    authCallback('SIGNED_OUT', null);

    expect(mockSetSession).toHaveBeenCalledWith(null);
    expect(setAuthToken).toHaveBeenCalledWith(null);
  });

  it('safely disconnects event stream on unmount', () => {
    const { unmount } = renderHook(() => useAuthListener());
    unmount();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
