import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', isOpen, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/10 shadow-emerald-500/10',
    error: 'border-red-500/20 bg-red-500/10 shadow-red-500/10',
    info: 'border-blue-500/20 bg-blue-500/10 shadow-blue-500/10',
  };

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] ${colors[type]}`}
        >
          {icons[type]}
          <p className="flex-1 text-sm font-bold text-white tracking-tight">
            {message}
          </p>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
