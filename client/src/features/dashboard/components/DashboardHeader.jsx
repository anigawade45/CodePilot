import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 🛰️ DASHBOARD HUD [ENTERPRISE v9.8]
 * ---------------------------------
 * - Centralized Routing: Linked to ROUTES system
 * - Kinetic Reveal: Framer Motion entrance
 * - A-11-Y Hardened: Keyboard & Screen Reader support
 */
const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    console.log('[HUD] Initiating New Analysis Protocol');
    navigate(ROUTES.NEW_ANALYSIS);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12"
    >
      <div className="space-y-0.5 md:space-y-1">
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
          Overview
        </h1>
        <div className="text-slate-500 font-medium text-[10px] md:text-sm flex items-center gap-2">
          <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
          <p>System metrics & investigative logs</p>
        </div>
      </div>

      <Button
        onClick={handleAction}
        onKeyDown={(e) => e.key === 'Enter' && handleAction()}
        aria-label="Initialize a new sovereign code analysis"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 px-6 md:px-8 py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-wider flex gap-2 md:gap-3 group active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-xs md:text-sm w-full sm:w-auto justify-center"
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
        <span>Run New Analysis</span>
      </Button>
    </motion.div>
  );
};

// 🧠 PERFORMANCE: Optimize for static re-renders in dashboard context
export default React.memo(DashboardHeader);
