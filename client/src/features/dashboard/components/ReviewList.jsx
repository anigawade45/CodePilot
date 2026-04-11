import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, Code2, Bug, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ReviewList = ({ reviews, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
         <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Analysis Logs
         </h2>
         <Button variant="ghost" className="text-xs text-blue-400 hover:bg-blue-500/10 font-bold uppercase tracking-widest px-4 transition-all">
            Export All (CSV)
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              onClick={() => navigate(`/review/${review.id}`)}
              className="group h-full flex flex-col p-6 bg-slate-900/40 border-slate-800/60 hover:border-blue-500/40 hover:bg-slate-800/40 transition-all cursor-pointer relative overflow-hidden rounded-[2rem]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(review.created_at).toLocaleDateString()}</p>
                   <h3 className="text-lg font-black text-white tracking-tight line-clamp-1 italic uppercase">Log-{(review.id.slice(0, 7))}</h3>
                </div>
                <button
                  onClick={(e) => onDelete(e, review)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-2 rounded-xl bg-slate-950/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 font-mono text-[11px] text-slate-400 line-clamp-3 relative group-hover:text-blue-200 transition-colors">
                   <p className="leading-relaxed opacity-60 italic">"{review.code.slice(0, 150)}..."</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                   <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
                      <Code2 className="w-3 h-3" /> {review.language}
                   </span>
                   <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-widest leading-none">
                      <Bug className="w-3 h-3" /> Fix Found
                   </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-400">View Detailed Report</span>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-2 group-hover:text-blue-400 transition-all" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
