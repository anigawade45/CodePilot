import React, { useState, useEffect } from 'react';
import { createClient } from '../../../lib/client';
import { Button } from '../../../components/ui/button';
import { LogIn } from 'lucide-react';

const supabase = createClient();

const Auth = ({ onSession }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      onSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      onSession(session);
    });

    return () => subscription.unsubscribe();
  }, [onSession]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Unlock AI Intelligence</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">Sign in with GitHub to save your reviews, track issues over time, and collaborate with your team.</p>
      </div>
      <Button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-white text-black hover:bg-slate-200 transition-all font-semibold flex items-center justify-center gap-2 py-6 rounded-xl"
      >
        {loading ? "Connecting..." : <><LogIn className="w-5 h-5" /> Sign in with GitHub</>}
      </Button>
      <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">Secure OAuth via Supabase</p>
    </div>
  );
};

export default Auth;
