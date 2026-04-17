import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * 🛰️ UNIFIED SOVEREIGN LOADER
 * --------------------------
 * The single source of truth for all "Wait" states in the application.
 * High-tech, consistent, and smooth.
 */
/* eslint-disable react/prop-types */
const LoadingState = ({ message = "Decrypting Intelligence..." }) => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* 🪄 Ambient Pulse Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* 📟 Primary Spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
          />
          
          {/* Inner Decorative Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-2 border border-slate-800 border-dashed rounded-full"
          />
          
          {/* Central Signal Point */}
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        </div>

        {/* 📡 Information HUD */}
        <div className="text-center space-y-2">
          <p className="text-slate-200 font-black tracking-[0.4em] uppercase text-[10px] italic">
            {message}
          </p>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1 h-1 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* 🧩 System Markers */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[8px] text-slate-700 font-mono tracking-widest uppercase pointer-events-none">
        CODEPILOT // SYS_LOAD_ACTIVE // CLUSTER_8
      </div>
    </div>
  );
};

LoadingState.displayName = 'LoadingState';
export default memo(LoadingState);
