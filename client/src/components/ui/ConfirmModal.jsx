/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-20 pointer-events-none ${type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />

          <div className="flex flex-col items-center text-center space-y-6">
            <div className={`p-5 rounded-3xl bg-slate-950 border border-slate-800 ${type === 'danger' ? 'text-red-500' : 'text-blue-500'}`}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{title}</h2>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[280px]">{message}</p>
            </div>

            <div className="flex flex-col w-full gap-3 pt-4">
              <Button
                onClick={onConfirm}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${
                  type === 'danger' 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                }`}
              >
                <Trash2 className="w-3 h-3 mr-2" /> {confirmText}
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full py-6 rounded-2xl text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
