import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmailAuth } from '../useEmailAuth';
import { supabase } from '../../lib/supabase';

// 🧪 MOCK ARCHITECTURE
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOtp: vi.fn(),
    },
  },
}));

describe('useEmailAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('orchestrates manual sign-in protocol', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ 
        data: { session: { token: 'xyz' } }, 
        error: null 
    });

    const { result } = renderHook(() => useEmailAuth());

    let error;
    await act(async () => {
        error = await result.current.handleEmailAuth('test@example.com', 'password123', false);
    });

    expect(error).toBeNull();
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
    });
  });

  it('manages new identity registration pulse', async () => {
    supabase.auth.signUp.mockResolvedValue({ 
        data: { session: null, user: { id: '1' } }, 
        error: null 
    });

    const { result } = renderHook(() => useEmailAuth());

    let response;
    await act(async () => {
        response = await result.current.handleEmailAuth('new@example.com', 'password123', true);
    });

    expect(response).toBe('IDENTITY_CREATED_WAITING_VERIFICATION');
    expect(supabase.auth.signUp).toHaveBeenCalled();
  });

  it('handles Magic Link (OTP) transmission', async () => {
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useEmailAuth());

    let response;
    await act(async () => {
        response = await result.current.handleMagicLink('otp@example.com');
    });

    expect(response).toBe('OTP_SENT');
    expect(supabase.auth.signInWithOtp).toHaveBeenCalled();
  });

  it('maps raw Supabase rejections to friendly intelligence reports', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ 
        data: null, 
        error: { message: 'Invalid login credentials' } 
    });

    const { result } = renderHook(() => useEmailAuth());

    let error;
    await act(async () => {
        error = await result.current.handleEmailAuth('wrong@example.com', 'wrong', false);
    });

    expect(error).toContain('Invalid credentials');
    expect(result.current.error).toContain('Invalid credentials');
  });
});
