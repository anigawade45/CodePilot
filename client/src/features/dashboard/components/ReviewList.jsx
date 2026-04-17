import { memo } from 'react';
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Clock, Trash2, Code2, Bug, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 🛰️ INVESTIGATIVE LOG GRID [PERFECTED v10.0]
 * -----------------------------------------
 * - Stagger Orchestration: Memory-efficient parent-child animation
 * - Temporal Shielding: Validated date strings with fallback
 * - Tactile HUD: Active scale feedback and Link semantics
 * - Staff Memoization: Optimized re-render prevention
 */

import { Skeleton } from '../../../components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const ReviewList = ({ reviews, onDelete, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-64 rounded-[2.5rem] bg-slate-900/20 border border-slate-800/40" />
            ))}
        </div>
    );
  }

  const handleNavigate = (id) => {
    if (!id) return;
    navigate(ROUTES.REVIEW_DETAIL.replace(':id', id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Analysis Logs
        </h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20"
      >
        {(reviews || []).map((review, index) => {
          // 🛡️ DATA SANITIZATION: Resilience against malformed timestamps
          const date = new Date(review.created_at);
          const isValidDate = !isNaN(date.getTime());
          
          const timeStr = isValidDate 
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--';
          const dateStr = isValidDate 
            ? date.toLocaleDateString()
            : 'Unstable Temporal Signal';

          const snippet = review.code
            ? review.code.length > 150
              ? review.code.slice(0, 150) + '...'
              : review.code
            : 'No code fragment identified.';

          return (
            <motion.div key={review.id || index} variants={itemVariants}>
              <Card
                role="link"
                tabIndex={0}
                aria-label={`View analysis report for investigation ${review.id || 'Unknown'}`}
                onClick={() => handleNavigate(review.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(review.id);
                  }
                }}
                className="group h-full flex flex-col p-6 bg-slate-900/40 border-slate-800/60 hover:border-blue-500/40 hover:bg-slate-800/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] focus:ring-2 focus:ring-blue-500/40 focus:outline-none transition-all cursor-pointer relative overflow-hidden rounded-[2.5rem] active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{timeStr} • {dateStr}</p>
                    <h3 className="text-lg font-black text-white tracking-tight line-clamp-1 italic uppercase">Log-{(review.id?.slice(0, 7) || 'UNKNOWN')}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e, review);
                    }}
                    aria-label="Purge investigation log"
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-500 hover:text-red-400 transition-all p-2 rounded-xl bg-slate-950/50 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/40 active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 font-mono text-[11px] text-slate-400 line-clamp-3 relative group-hover:text-blue-200 transition-colors">
                    <p className="leading-relaxed opacity-70 italic font-medium">
                        &quot;{snippet}&quot;
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
                      <Code2 className="w-3 h-3" /> {review.language || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
                      <Bug className="w-3 h-3" /> Fix Logged
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-400 font-black">Deep Investigation Protocol</span>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-2 group-hover:text-blue-400 transition-all" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// 🧠 STAFF PERFORMANCE: Custom comparison to prevent re-renders unless data actually mutates
ReviewList.displayName = 'ReviewList';
export default memo(ReviewList, (prev, next) => {
  return prev.reviews === next.reviews;
});
