import { useEffect, useRef } from 'react';

/**
 * 📡 PREDICTIVE INTEL ENGINE
 * -------------------------
 * Pre-fetches critical application chunks (Dashboard/History/Analysis)
 * the moment a session is detected.
 * Uses 'useRef' to ensure this only fires EXACTLY once per session boot.
 */
export function usePrefetch(session) {
  const hasPrefetched = useRef(false);

  useEffect(() => {
    if (session && !hasPrefetched.current) {
      hasPrefetched.current = true;
      
      console.log('⚡ [Elite Performance] Predictive Pre-loading Dashboard & History clusters...');
      
      // We initiate the imports but don't hold them in state.
      // The browser's cache will handle the storage for instant mount.
      import('../pages/Dashboard');
      import('../pages/History');
      import('../pages/CodeInput');
      import('../pages/ReviewResult');
    }
  }, [session]);
}
