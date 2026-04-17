import { Activity } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 🛰️ INVESTIGATION EMPTY STATE [CONVERSION v9.8]
 * --------------------------------------------
 * - High-Conversion Copy: Focused on user value
 * - Kinetic Pulse: Animated signal to suggest potential
 * - Global Routing: Synchronized with ROUTES system
 */
const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="text-center p-10 md:p-20 bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center animate-in fade-in zoom-in duration-700"
    >
      <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
             <Activity className="w-10 h-10 text-slate-700 animate-pulse" />
          </div>
      </div>

      <h3 className="text-white text-xl font-bold mb-3 tracking-tight">No analysis history found</h3>
      
      <p className="text-slate-500 text-base mb-2 max-w-sm">
        Upload your source fragments and get instant AI-driven security insights.
      </p>
      
      <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black mb-8 opacity-60">
        Supports JS, Python, Rust & more
      </p>

      <Button 
        onClick={() => navigate(ROUTES.NEW_ANALYSIS)} 
        aria-label="Start your first code analysis investigation"
        className="bg-slate-100 text-black hover:bg-white hover:scale-105 rounded-2xl px-12 py-7 font-black uppercase tracking-wider text-xs shadow-2xl shadow-white/5 transition-all active:scale-95"
      >
        Initiate First Review
      </Button>
    </div>
  );
};

export default EmptyState;
