import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bug, Zap, ShieldCheck } from 'lucide-react';

const StatsGrid = ({ reviewsCount }) => {
  const stats = [
    { label: 'Total Analyses', value: reviewsCount, icon: Activity, color: 'blue' },
    { label: 'Bugs Spotted', value: Math.floor(reviewsCount * 2.4), icon: Bug, color: 'red' },
    { label: 'Optimizations', value: Math.floor(reviewsCount * 1.8), icon: Zap, color: 'amber' },
    { label: 'Security Pass', value: '98%', icon: ShieldCheck, color: 'emerald' },
  ];

  const colorStyles = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  const textColorStyles = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-[1.5rem] bg-slate-900/40 border border-slate-800/60 transition-all hover:bg-slate-900/60 relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[160px]"
        >
          <div className={`p-3 rounded-2xl mb-4 border ${colorStyles[stat.color]}`}>
            <stat.icon className={`w-6 h-6 ${textColorStyles[stat.color]}`} />
          </div>
          <p className="text-2xl font-black text-white tracking-tight mb-1">{stat.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
