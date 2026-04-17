import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '../components/ui/button';
import { LANGUAGES } from '../constants/config';
import { Play, FileCode, Sparkles, GitBranch, ChevronLeft, Settings2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import GitHubModal from '../features/reviews/components/GitHubModal';
import AiSettingsModal from '../features/reviews/components/AiSettingsModal';
import Toast from '../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import { getLanguageExtension } from '../lib/codemirror';
import { useCodeInput } from '../hooks/useCodeInput';
import { EXAMPLE_SNIPPETS } from '../constants/snippets';

/**
 * 🛰️ INVESTIGATION INGESTION TERMINAL [PERFECTED v11.0]
 * ---------------------------------------------------
 * - Hook Architecture: Decoupled logic from presentation
 * - Responsive Shift: Optimized for mobile/tablet workflows
 * - Kinetic Reveals: Spring-loaded spring transitions
 */
const CodeInput = () => {
  const {
    view,
    setView,
    code,
    language,
    setLanguage,
    isGithubModalOpen,
    setIsGithubModalOpen,
    isAiSettingsOpen,
    setIsAiSettingsOpen,
    aiConfig,
    setAiConfig,
    toast,
    closeToast,
    isLoading,
    handleGithubImport,
    handleFileUpload,
    handleAnalyze,
    onCodeChange
  } = useCodeInput();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-180px)]">
        <AnimatePresence mode="wait">
          {view === 'selection' ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-center items-center gap-8 md:gap-12"
            >
              <div className="text-center space-y-2 md:space-y-3 px-4">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                  Initiate <span className="text-blue-500">Investigation</span>
                </h1>
                <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em]">Select source cluster ingest method</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-4">
                <GlassCard
                  onClick={() => document.getElementById('file-upload').click()}
                  className="p-8 md:p-12 flex flex-col items-center gap-6 cursor-pointer group rounded-[2rem] md:rounded-[2.5rem]"
                >
                  <input type="file" id="file-upload" className="hidden" aria-label="Upload source file" onChange={handleFileUpload} />
                  <div className="p-4 md:p-6 bg-slate-950 rounded-2xl md:rounded-3xl border border-slate-800 group-hover:scale-110 transition-transform">
                    <FileCode className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs md:text-sm">Source Cluster</h3>
                    <p className="text-slate-500 text-[9px] md:text-[10px] leading-relaxed">Direct file upload or remote GitHub sync</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Button
                      onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload').click(); }}
                      aria-label="Upload File"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black py-2.5 px-4 md:px-6 rounded-lg shadow-lg shadow-blue-600/20 flex gap-2"
                    >
                      <FileCode className="w-3 h-3" /> Upload
                    </Button>
                    <Button
                      onClick={(e) => { e.stopPropagation(); setIsGithubModalOpen(true); }}
                      aria-label="GitHub Sync"
                      className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black py-2.5 px-4 md:px-6 rounded-lg border border-slate-700"
                    >
                      <GitBranch className="w-3 h-3" /> GitHub
                    </Button>
                  </div>
                </GlassCard>

                <GlassCard
                  onClick={() => setView('editor')}
                  className="p-8 md:p-12 flex flex-col items-center gap-6 cursor-pointer group rounded-[2rem] md:rounded-[2.5rem]"
                >
                  <div className="p-4 md:p-6 bg-slate-950 rounded-2xl md:rounded-3xl border border-slate-800 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs md:text-sm">Manual Ingest</h3>
                    <p className="text-slate-500 text-[9px] md:text-[10px] leading-relaxed">Paste raw source fragments directly</p>
                  </div>
                  <div className="mt-8 flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="w-2 h-0.5 bg-white"></div>
                    <div className="w-8 h-0.5 bg-white"></div>
                    <div className="w-2 h-0.5 bg-white"></div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full px-4 md:px-0"
            >
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="space-y-0.5 md:space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => setView('selection')}
                    className="text-slate-500 hover:text-white gap-2 pl-0 mb-1 no-print text-[10px] md:text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> Change Method
                  </Button>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                    Analyze <span className="text-blue-500">Cluster</span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex-1 md:flex-none">
                    <select
                      value={language}
                      aria-label="Select source language"
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-transparent px-3 md:px-4 py-2.5 md:py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 outline-none hover:text-white transition-all cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value} className="bg-slate-900">
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={() => setIsAiSettingsOpen(true)}
                    className="bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white rounded-xl px-3 md:px-4 py-5 md:py-6 transition-all"
                    aria-label="Intelligence Settings"
                  >
                    <Settings2 className={`w-4 h-4 ${aiConfig.apiKey ? 'text-blue-500' : ''}`} />
                  </Button>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading || !code.trim()}
                    aria-label={isLoading ? "Analyzing" : "Execute Analysis"}
                    className="flex-1 md:flex-none bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-xl px-4 md:px-10 py-5 md:py-6 font-black uppercase tracking-wider text-[10px] md:text-xs flex gap-2 md:gap-3 transition-all active:scale-95 disabled:opacity-30 justify-center group"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                         <span>Analyzing...</span>
                      </div>
                    ) : (
                      <>
                        <Play className="w-3 h-3 md:w-4 md:h-4 fill-current group-hover:scale-110 transition-transform" /> 
                        <span>Execute</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-slate-950/80 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative group">
                <div className="absolute top-0 left-0 right-0 h-10 md:h-12 bg-slate-900/80 flex items-center px-6 md:px-8 border-b border-slate-800/60 z-10 backdrop-blur-xl justify-between">
                  <div className="flex items-center">
                    <div className="hidden xs:flex gap-1.5 md:gap-2 mr-4 md:mr-6 text-slate-700">
                      <div className="w-2 md:w-3 h-2 md:h-3 rounded-full border border-current opacity-50"></div>
                      <div className="w-2 md:w-3 h-2 md:h-3 rounded-full border border-current opacity-50"></div>
                      <div className="w-2 md:w-3 h-2 md:h-3 rounded-full border border-current opacity-50"></div>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-2">
                      <FileCode className="w-3 h-3 text-blue-500" />
                      Source Console / <span className="text-slate-400">{language}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 no-print">
                     <Button 
                       variant="ghost" 
                       onClick={() => onCodeChange(EXAMPLE_SNIPPETS[language] || '')}
                       className="h-7 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-slate-800 transition-all rounded-lg px-2"
                     >
                       Try Example
                     </Button>
                     <Button 
                       variant="ghost" 
                       onClick={() => onCodeChange('')}
                       className="h-7 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-lg px-2"
                     >
                       Clear
                     </Button>
                  </div>
                </div>
                
                <div className="pt-10 md:pt-12 h-full overflow-auto custom-scrollbar relative">
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 top-10 md:top-12 bottom-0 bg-blue-600/5 backdrop-blur-[1px] z-20 pointer-events-none overflow-hidden"
                      >
                         <motion.div 
                           animate={{ y: ['-100%', '1000%'] }}
                           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                           className="h-20 w-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent flex items-center justify-center"
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-8 rounded-full border border-blue-500/10 bg-blue-500/5 animate-pulse">
                               <Sparkles className="w-12 h-12 text-blue-500/20 animate-spin-slow" />
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={oneDark}
                    extensions={getLanguageExtension(language)}
                    onChange={onCodeChange}
                    className="text-xs md:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex justify-between items-center text-slate-600 text-[8px] md:text-[10px] font-bold tracking-widest uppercase pb-4 md:pb-0">
                <div className="flex gap-4 md:gap-6 italic">
                  <span className="flex items-center gap-1.5 md:gap-2"><div className="w-1 h-1 bg-slate-700 rounded-full" /> Mirror Active</span>
                  <span className="flex items-center gap-1.5 md:gap-2"><div className="w-1 h-1 bg-slate-700 rounded-full" /> {code.length} Metrics</span>
                </div>
                <p className="opacity-40 hidden sm:block">System Status: Optimal</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GitHubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        onImport={handleGithubImport}
        isLoading={isLoading}
      />

      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        config={aiConfig}
        setConfig={setAiConfig}
      />

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </DashboardLayout>
  );
};

export default CodeInput;
