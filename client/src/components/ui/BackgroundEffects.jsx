import React from 'react';

/**
 * 🌌 SOVEREIGN BACKGROUND SYSTEM
 * ----------------------------
 * CENTRALIZED PERFORMANCE-TUNED EFFECTS:
 * - will-change-transform: Offloads blurs to GPU
 * - Responsive scaling: Small blurs for mobile, Cinematic for desktop
 * - Optical Grid: Low-opacity vector mesh
 */
const BackgroundEffects = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* 🏁 OPTICAL MESH GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* 🔦 PRIMARY TERMINAL GLOW (TOP) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[600px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full will-change-transform transition-all duration-1000"></div>

      {/* 🔭 SECONDARY SENSORY GLOW (MID) */}
      <div className="absolute top-[30%] -right-[10%] w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-indigo-600/10 blur-[60px] md:blur-[100px] rounded-full will-change-transform transition-all duration-1000"></div>

      {/* 🛡️ SECURITY SECTOR GLOW (BOTTOM) */}
      <div className="absolute bottom-[-5%] -left-[5%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-emerald-500/5 blur-[50px] md:blur-[80px] rounded-full will-change-transform transition-all duration-1000"></div>

      {/* 🌫️ BASE ATMOSPHERIC GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
    </div>
  );
});

BackgroundEffects.displayName = 'BackgroundEffects';

export default BackgroundEffects;
