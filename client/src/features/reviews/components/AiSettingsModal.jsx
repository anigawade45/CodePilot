import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Settings2, Key, Zap, Database } from 'lucide-react';
import { useCodeInput } from '../../../hooks/useCodeInput';
import { encryptKey, decryptKey } from '../../../lib/encryption';

/* eslint-disable react/prop-types */
const AiSettingsModal = ({ isOpen, onClose }) => {
  const { aiConfig, setAiConfig } = useCodeInput();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState(aiConfig);
  const [decryptedKey, setDecryptedKey] = useState('');

  useEffect(() => {
    setConfig(aiConfig);
  }, [aiConfig, isOpen]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setAiConfig(config);
    onClose();
  };

  const PROVIDERS = ['gemini', 'groq', 'grok', 'local', 'custom'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Intelligence Link</h2>
                  <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Select your primary cloud cluster</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-3 rounded-xl transition-all border ${showAdvanced ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}
                title="Advanced Configuration"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Provider Selection */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {PROVIDERS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      provider: p,
                      endpoint: p === 'local' ? 'http://localhost:11434/api/generate' : (p === 'groq' ? 'https://api.groq.com/openai/v1' : (p === 'grok' ? 'https://api.x.ai/v1' : (p === 'custom' || p === 'gemini' ? config.endpoint : ''))),
                      model: p === 'local' ? 'codepilot-brain:latest' : (p === 'groq' ? 'llama-3.3-70b-versatile' : (p === 'grok' ? 'grok-3-mini' : (p === 'gemini' ? 'gemini-3.1-flash-lite-preview' : (p === 'custom' ? config.model : ''))))
                    })}
                    className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${config.provider === p ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* API Key Input */}
              {config.provider !== 'local' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Key className="w-3 h-3" /> Authorization Token
                    </label>
                  </div>
                  <input
                    type="password"
                    placeholder={`Enter your ${config.provider} API key...`}
                    value={config.apiKey || ''}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                  />
                </div>
              )}

              {/* Advanced Configuration Fields */}
              {(config.provider === 'local' || config.provider === 'custom' || showAdvanced) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 pt-4 border-t border-slate-800/50"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Inference Point
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., https://api.openai.com/v1"
                      value={config.endpoint}
                      onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-3 h-3" /> Model Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., gpt-4-turbo"
                      value={config.model}
                      onChange={(e) => setConfig({ ...config, model: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-8 border-t border-slate-800/50">
              <button
                onClick={handleSave}
                className="w-full bg-white text-black hover:bg-slate-200 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5 active:scale-95 transition-all"
              >
                Lock In Logic
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AiSettingsModal;
