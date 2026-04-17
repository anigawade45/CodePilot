import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../constants/routes';

export function useOAuthLogin() {
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const login = async (providerId = 'github') => {
    
    if (loadingProvider) return;

    try {
      setLoadingProvider(providerId);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: providerId,
        options: {
          redirectTo: `${window.location.origin}${ROUTES.DASHBOARD}`
        }
      });

      if (error) throw error;

    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoadingProvider(null);
      }
    }
  };

  return { login, loadingProvider, error };
}
