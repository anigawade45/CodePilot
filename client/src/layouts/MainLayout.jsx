import { memo } from 'react';
/* eslint-disable react/prop-types */
const MainLayout = ({ children }) => {
  return (
    <div className="dark min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 font-sans antialiased overflow-x-hidden">
      {/* 🔮 Background Canvas (Glassmorphic) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

MainLayout.displayName = 'MainLayout';
export default memo(MainLayout);
