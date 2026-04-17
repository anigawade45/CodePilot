import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../constants/routes';

/**
 * 📧 UNIVERSAL EMAIL AUTH HOOK [PROBE MODE]
 * ----------------------------
 * Manages manual Sign-up, Sign-in, and Magic Link logic with deep logging.
 */
export function useEmailAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const getErrorMessage = (err) => {
    console.error('🔥 [Supabase Auth Rejection]:', {
      message: err.message,
      status: err.status,
      name: err.name
    });

    const msg = err?.message?.toLowerCase() || '';
    if (msg.includes('invalid login')) return 'Invalid credentials. Check your email/password.';
    if (msg.includes('user already registered')) return 'This email is already registered. Please sign in instead.';
    if (msg.includes('confirmation')) return 'Identity not verified. Please check your email.';
    if (msg.includes('password')) return 'Password is too weak. Use at least 6 characters.';
    
    return err.message || 'Authentication failed.';
  };

  const handleEmailAuth = async (email, password, isRegistering = false) => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error } = isRegistering 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (isRegistering && !data?.session) return 'IDENTITY_CREATED_WAITING_VERIFICATION';
      return null;
    } catch (err) {
      if (isMounted.current) {
        const friendlyError = getErrorMessage(err);
        setError(friendlyError);
        return friendlyError;
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleMagicLink = async (email) => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${ROUTES.DASHBOARD}`
        }
      });
      if (error) throw error;
      return 'OTP_SENT';
    } catch (err) {
      if (isMounted.current) setError(getErrorMessage(err));
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return { handleEmailAuth, handleMagicLink, loading, error };
}
