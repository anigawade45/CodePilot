import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Eye, 
  TrendingUp, 
  Code2, 
  Clock, 
  Filter, 
  ChevronDown,
  Activity,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../hooks/useHistory';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../features/dashboard/components/EmptyState';

const History = () => {
  const navigate = useNavigate();
  const {
    historyReviews,
    stats,
    isLoading,
    isDeleting,
    sortBy,
    setSortBy,
    filterLang,
    setFilterLang,
    purgeReview
  } = useHistory();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteTrigger = (e, review) => {
    e.stopPropagation();
    setDeleteTarget({ id: review.id, title: `Audit #${review.id.slice(0, 7)}` });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await purgeReview(deleteTarget.id);
    if (success) setDeleteTarget(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'CRITICAL-SECURE';
    if (score >= 50) return 'ACTION-REQUIRED';
    return 'SYSTEM-COMPROMISED';
  };

  return (
    <DashboardLayout>
      {/* 🔮 PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
        <div className="max-w-full overflow-hidden">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="p-2 md:p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl">
              <HistoryIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic truncate">
              Investigation <span className="text-blue-500">Archive</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-[11px] md:text-sm flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Synchronized with Global Intelligence
          </p>
        </div>

        {/* 📊 SUMMARY CHANNELS */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <StatMini label="ENTRIES" value={stats.total} icon={Calendar} color="blue" />
          <StatMini label="ACCURACY" value={`${stats.avgScore}%`} icon={TrendingUp} color="emerald" />
          <StatMini label="TOP LANG" value={stats.languages[0] || 'N/A'} icon={Code2} color="purple" />
        </div>
      </div>

      {/* 🎛️ CONTROL CLUSTER */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
           {/* Search is handled by store/DashboardLayout globally, but we add local filters here */}
           <div className="relative group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <select 
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Languages</option>
                {stats.languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
           </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Sort By:</span>
          <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'date-desc', label: 'Recent' },
              { id: 'score-desc', label: 'Severity' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  sortBy === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 AUDIT LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : historyReviews.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="popLayout">
            {historyReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="group relative overflow-hidden border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/50" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6">
                    <div className="flex items-center md:items-start gap-4 md:gap-5">
                      <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center justify-center min-w-[60px] md:min-w-[70px] ${getScoreColor(review.score)}`}>
                        <span className="text-lg md:text-xl font-black leading-none">{review.score || 0}</span>
                        <span className="text-[7px] md:text-[8px] font-bold mt-1 uppercase tracking-tighter opacity-70">Accuracy</span>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1 md:space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-400 font-mono text-[8px] px-2 py-0">
                            AUDIT-{review.id.slice(0, 8).toUpperCase()}
                          </Badge>
                          <span className="hidden xs:inline text-slate-600 text-[10px]">•</span>
                          <span className={`text-[8px] font-black tracking-widest uppercase ${getScoreColor(review.score).split(' ')[0]}`}>
                            {getScoreLabel(review.score)}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-lg font-bold text-white tracking-tight truncate">
                          Analyzed via <span className="text-blue-500 uppercase">{review.language}</span> Engine
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[10px] md:text-xs font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {review.createdAt && !isNaN(new Date(review.createdAt)) ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {review.createdAt && !isNaN(new Date(review.createdAt)) ? new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t border-slate-800/20 md:border-none">
                      <Button 
                        variant="ghost" 
                        aria-label="View Analysis Details"
                        onClick={() => navigate(`/review/${review.id}`)}
                        className="flex-1 md:flex-none text-slate-400 hover:text-white hover:bg-slate-800/50 gap-2 border border-slate-800 md:border-transparent rounded-xl h-10 md:h-11 px-4 md:px-6"
                      >
                        <Eye className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-wider">View Details</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        aria-label="Purge Entry"
                        onClick={(e) => handleDeleteTrigger(e, review)}
                        className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl h-10 md:h-11 w-10 md:w-11 p-0 transition-all border border-slate-800 md:border-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Purge Intelligence Log"
        message={`This action will permanently remove ${deleteTarget?.title} from the secure archive. Internal state cannot be recovered.`}
        confirmText="Execute Purge"
      />
    </DashboardLayout>
  );
};

const StatMini = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border whitespace-nowrap ${colors[color]}`}>
      <div className="p-1.5 rounded-lg bg-white/5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{label}</p>
        <p className="text-sm font-black leading-none">{value}</p>
      </div>
    </div>
  );
};

const HistorySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-28 bg-slate-900/50 rounded-3xl border border-slate-800/50 animate-pulse" />
    ))}
  </div>
);

export default History;
