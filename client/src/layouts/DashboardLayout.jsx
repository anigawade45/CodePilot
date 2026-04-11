import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  User,
  Sparkles,
  Zap,
  ShieldCheck,
  Bug
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { createClient } from '../lib/client';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'new', label: 'New Review', icon: PlusCircle, path: '/new' },
  { id: 'history', label: 'Analysis History', icon: History, path: '/history' },
];



const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession, searchQuery, setSearchQuery } = useStore();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
      {/* 🚀 Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-slate-950/50 backdrop-blur-xl flex flex-col z-20 no-print">
        <div className="p-6">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">CodePilot</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 text-slate-400">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 opacity-50">General</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                location.pathname === item.path 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'hover:bg-slate-900/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="active" className="ml-auto w-1 h-5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400"
          >
            <LogOut className="w-5 h-5 text-red-500/50" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-125 transition-transform">
               <Zap className="w-12 h-12" />
            </div>
            <p className="text-xs font-bold text-blue-100 mb-1">PRO PLAN</p>
            <p className="text-xs text-blue-200/80 mb-3 leading-tight italic">Unlock real-time review & enterprise scale</p>
            <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
                Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* 📟 Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl px-8 flex items-center justify-between z-10 no-print">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-slate-800 mx-2" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition-all overflow-hidden shadow-2xl">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`} alt="avatar" />
              </div>
              <div className="hidden lg:block text-left">
                 <p className="text-xs font-bold text-white tracking-tight leading-none mb-1">{session?.user?.email?.split('@')[0]}</p>
                 <p className="text-[10px] text-slate-500 font-mono">Developer ID: {session?.user?.id?.slice(0, 7)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
          <div className="p-8 pb-32">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
