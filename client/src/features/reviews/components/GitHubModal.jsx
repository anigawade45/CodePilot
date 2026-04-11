import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const GitHubModal = ({ isOpen, onClose, onImport, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (!url.includes('github.com')) {
      setError('Please provide a valid GitHub URL');
      return;
    }
    setError('');
    onImport(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <GitBranch className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                  Import Source
                </h2>
                <p className="text-slate-500 text-sm font-medium">Connect your GitHub repository</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://github.com/user/repo/blob/main/file.js"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-blue-100 placeholder:text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                  autoFocus
                />
                {error && (
                  <div className="mt-2 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </div>
                )}
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-bold mb-2">Instructions</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste the direct link to a source file. CodePilot will fetch the raw content and automatically detect the language for analysis.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-2xl text-lg font-black uppercase tracking-wider shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Fetching Cluster...</>
                ) : (
                  <>Fetch Source Bundle</>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GitHubModal;
