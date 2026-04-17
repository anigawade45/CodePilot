import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { setAuthToken } from '../services/api';

/**
 * 📡 GLOBAL AUTH LISTENER [FINAL RECOVERY]
 * -----------------------
 * Resolves the "Redirect Purgatory" by forcing a fresh sync 
 * when the app mounts with Oauth fragments.
 */
export function useAuthListener() {
  const { setSession } = useStore();

  useEffect(() => {
    let isMounted = true;

    const syncIdentity = async (session, source) => {
      if (!isMounted) return;
      console.log(`[Identity Sync] ${source} | User: ${session?.user?.email || 'N/A'}`);
      
      setSession(session);
      setAuthToken(session?.access_token || null);
    };

    // 1. Critical Recovery for GitHub Callback
    const recoverSession = async () => {
      console.log('🔍 [Recovery] Checking for return-trip session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[Recovery] Session fetch failed:', error);
        syncIdentity(null, 'RECOVERY_ERROR');
      } else {
        syncIdentity(session, 'MANUAL_RECOVERY');
      }
    };

    recoverSession();

    // 2. Real-time Event Stream
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`📡 [Listener] Event: ${event}`);
      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        syncIdentity(session, `EVENT_${event}`);
      } else if (event === 'SIGNED_OUT') {
        syncIdentity(null, 'EVENT_SIGNED_OUT');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession]);
}
