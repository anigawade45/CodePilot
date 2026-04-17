import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useStore } from '../../../store/useStore';
import { supabase } from '../../../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const { session, setSession } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  return (
    <nav className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8 flex justify-between items-center relative z-20">
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/CodePilot.png" 
          alt="CodePilot" 
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
        />
        <span className="text-xl md:text-2xl font-black tracking-tighter text-white">CodePilot</span>
      </div>
      
      {/* 💻 Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#investigations" className="hover:text-white transition-colors">Stats</a>
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

      {/* 📱 Mobile Quick Actions */}
      <div className="md:hidden">
        {session ? (
            <Button
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="bg-slate-900/50 border border-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg px-4"
            >
              Dashboard
            </Button>
        ) : (
            <Button
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg px-4"
            >
              Sign In
            </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
