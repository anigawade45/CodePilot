import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrefetch } from '../usePrefetch';

// 🧪 MOCK ARCHITECTURE
// Mock the dynamic imports to prevent async leaks during environment teardown.
// We mock the actual physical files using paths relative to this test file.
vi.mock('../../pages/Dashboard', () => ({ default: () => null }));
vi.mock('../../pages/History', () => ({ default: () => null }));
vi.mock('../../pages/CodeInput', () => ({ default: () => null }));
vi.mock('../../pages/ReviewResult', () => ({ default: () => null }));

describe('usePrefetch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initiates predictive pre-loading only when session is established', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const { rerender } = renderHook(({ session }) => usePrefetch(session), {
      initialProps: { session: null }
    });

    expect(logSpy).not.toHaveBeenCalled();

    rerender({ session: { user: { id: 'usr-123' } } });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Predictive Pre-loading'));
    
    logSpy.mockRestore();
  });

  it('guarantees single-pulse execution per session boot', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const session = { user: { id: 'usr-456' } };

    const { rerender, result } = renderHook(({ s }) => usePrefetch(s), {
      initialProps: { s: session }
    });

    expect(logSpy).toHaveBeenCalledTimes(1);

    // Re-render with same session content but different object reference
    rerender({ s: { ...session } }); 
    expect(logSpy).toHaveBeenCalledTimes(1); // Should NOT call again

    logSpy.mockRestore();
  });
});
