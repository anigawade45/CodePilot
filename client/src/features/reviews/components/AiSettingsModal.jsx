import { motion, AnimatePresence } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';

/* eslint-disable react/prop-types */
const AiSettingsModal = ({ isOpen, onClose, config, setConfig }) => {
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-tighter text-lg italic">Intelligence Link</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Sovereign Agent Configuration</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfigSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="block ml-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">Architectural Layer</label>
                <div className="grid grid-cols-2 gap-3">
                  {['gemini', 'openai', 'claude', 'local', 'custom'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        provider: p,
                        endpoint: p === 'local' ? 'http://localhost:11434/api/generate' : (p === 'custom' ? config.endpoint : ''),
                        model: p === 'local' ? 'codepilot-brain' : (p === 'custom' ? config.model : '')
                      })}
                      className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.provider === p ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {p === 'local' ? '🏠 Local' : (p === 'custom' ? '🛠️ Custom' : p)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setConfig({ provider: '', model: '', apiKey: '', endpoint: '' })}
                    className={`col-span-2 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.provider === '' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                  >
                    Auto-Failover (Server Pool)
                  </button>
                </div>
              </div>

              {config.provider && config.provider !== 'local' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 space-y-6 border-t border-slate-800"
                >
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 block ml-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      <Wand2 className="w-3 h-3" /> Authorization Token
                    </label>
                    <input
                      type="password"
                      aria-label={`${config.provider} key`}
                      placeholder={`Paste your ${config.provider} key here...`}
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 transition-all font-mono"
                    />
                  </div>
                </motion.div>
              )}

              {(config.provider === 'local' || config.provider === 'custom') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 space-y-4 border-t border-slate-800"
                >
                  <div className="space-y-2">
                    <label className="block ml-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">Inference Point</label>
                    <input
                      type="text"
                      placeholder="e.g. https://my-model.ai/v1"
                      value={config.endpoint}
                      onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block ml-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">Sovereign Model Identifier</label>
                    <input
                      type="text"
                      placeholder="e.g. codepilot-v1"
                      value={config.model}
                      onChange={(e) => setConfig({ ...config, model: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                    />
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-slate-200 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5 active:scale-95 transition-all"
              >
                Lock In Logic
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AiSettingsModal;
