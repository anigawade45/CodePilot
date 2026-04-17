/* eslint-disable react/prop-types */
 
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const MetricCircle = ({ value, label, color = "blue", size = "md" }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const colors = {
    blue: "stroke-blue-500",
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    red: "stroke-red-500"
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("relative", sizes[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={colors[color]}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xl italic tracking-tighter">
          {value}%
        </div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
    </div>
  );
};

MetricCircle.displayName = 'MetricCircle';
export default MetricCircle;
