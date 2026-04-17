import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  LogOut,
  Search,
  Bell,
  User,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../constants/routes';
import ErrorBoundary from '../components/ErrorBoundary';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { id: 'new', label: 'New Review', icon: PlusCircle, path: ROUTES.NEW_ANALYSIS },
  { id: 'history', label: 'Analysis History', icon: History, path: ROUTES.HISTORY },
];

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Intelligence Dashboard',
  [ROUTES.NEW_ANALYSIS]: 'New Investigation Protocol',
  [ROUTES.HISTORY]: 'Repository Analysis History',
  [ROUTES.REVIEW_DETAIL.split('/:id')[0]]: 'Investigation Findings',
};

/* eslint-disable react/prop-types */
const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession, searchQuery, setSearchQuery } = useStore();
  
  const [avatarError, setAvatarError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // 🏎️ PERFORMANCE: Debounced Search Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      navigate('/');
    } catch (err) {
        console.error('Logout Fail-safe:', err.message);
        setSession(null);
        navigate('/');
    }
  };

  // 🛰️ HUD: Precise Path-Length Priority Matching
  const currentTitle = useMemo(() => {
    const matchingPath = Object.keys(PAGE_TITLES)
      .sort((a, b) => b.length - a.length)
      .find(path => location.pathname.startsWith(path));
    
    return PAGE_TITLES[matchingPath] || 'Sovereign Control';
  }, [location.pathname]);

  const isPro = session?.user?.user_metadata?.plan === 'pro';

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden relative">
      {/* 🚀 Sidebar [DESKTOP HUD] */}
      <motion.aside 
        animate={{ width: isCollapsed ? '80px' : '256px' }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="hidden md:flex border-r border-slate-800/60 bg-slate-950/50 backdrop-blur-xl flex-col z-20 no-print relative"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer group px-1"
              >
                <img 
                  src="/CodePilot.png" 
                  alt="CodePilot" 
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform" 
                />
                <span className="text-xl font-black tracking-tighter text-white">CodePilot</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors ml-auto"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 text-slate-400">
          {!isCollapsed && <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 opacity-50">General</p>}
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'hover:bg-slate-900/50 hover:text-white border border-transparent'
                  } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-white'}`} />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                {!isCollapsed && isActive && (
                  <motion.div layoutId="active-desktop" className="ml-auto w-1 h-5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 mt-auto border-t border-slate-800/40">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ''}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 text-red-500/50" />
            {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </motion.aside>

      {/* 📱 MOBILE NAVIGATION [FLOATING HUD] */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] z-[100] shadow-2xl shadow-black/50 no-print">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center justify-center p-3 rounded-xl transition-all ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-mobile" 
                  className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl" 
                />
              )}
              <item.icon className="w-4 h-4 relative z-10" />
            </button>
          );
        })}
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={handleLogout}
          className="p-3 rounded-xl text-red-500/50 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </nav>

      {/* 📟 Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <h2 className="text-lg font-black text-white uppercase tracking-tighter italic hidden lg:block whitespace-nowrap">{currentTitle}</h2>
            
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                aria-label="Search reports or investigative logs"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-4">
            <button aria-label="Notifications" className="p-2.5 rounded-xl hover:bg-slate-900 transition-colors group relative hidden sm:block">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            </button>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition-all overflow-hidden shadow-2xl shrink-0">
                {!avatarError ? (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`} 
                    alt="avatar" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="hidden sm:block text-left overflow-hidden">
                <p className="text-xs font-bold text-white tracking-tight leading-none mb-1 truncate max-w-[100px]">{session?.user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 font-mono">{(isPro ? 'PRO HUB' : `ID: ${session?.user?.id?.slice(0, 5)}`)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-4 md:p-8 pb-32 md:pb-8"
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
