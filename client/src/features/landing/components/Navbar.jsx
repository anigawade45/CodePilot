import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useStore } from '../../../store/useStore';
import { createClient } from '../../../lib/client';

const supabase = createClient();

const Navbar = () => {
  const navigate = useNavigate();
  const { session, setSession } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  return (
    <nav className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center relative z-20">
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
          <Zap className="w-5 h-5 fill-white text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">CodePilot</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>

        {session ? (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-red-500/10 border border-slate-800 rounded-xl flex gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-slate-900 border border-slate-800 rounded-xl"
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
