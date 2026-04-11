import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { LANGUAGES } from '../constants/config';
import { Play, FileCode, Sparkles, GitBranch, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import GitHubModal from '../features/reviews/components/GitHubModal';
import Toast from '../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';

const CodeInput = () => {
  const [view, setView] = useState('selection'); // 'selection' | 'editor'
  const [code, setCode] = useState('// Paste your code here...\n\nfunction example() {\n  console.log("Hello CodePilot");\n}');
  const [language, setLanguage] = useState('javascript');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const { setLoading, isLoading, setCurrentReview, currentReview } = useStore();
  const navigate = useNavigate();

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case 'javascript':
      case 'typescript': return [javascript({ jsx: true, typescript: lang === 'typescript' })];
      case 'python': return [python()];
      case 'java': return [java()];
      case 'cpp': return [cpp()];
      case 'rust': return [rust()];
      case 'go': return [go()];
      case 'php': return [php()];
      case 'sql': return [sql()];
      default: return [javascript()];
    }
  };

  React.useEffect(() => {
    if (currentReview) {
      setCode(currentReview.code);
      setLanguage(currentReview.language || 'javascript');
      setView('editor');
    }
  }, [currentReview]);

  const handleGithubImport = async (url) => {
    try {
      setLoading(true);
      const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      const response = await axios.get(rawUrl);
      setCode(response.data);
      const ext = url.split('.').pop().toLowerCase();
      const langFinder = LANGUAGES.find(l => l.value === ext || l.value.includes(ext));
      if (langFinder) setLanguage(langFinder.value);
      setIsGithubModalOpen(false);
      setView('editor');
      setToast({ isOpen: true, message: "Sync Success: Cluster imported correctly", type: 'success' });
    } catch (err) {
      setToast({ isOpen: true, message: "Sync Error: Failed to access GitHub cluster", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const langFinder = LANGUAGES.find(l => l.value === ext || l.value.includes(ext));
    if (langFinder) setLanguage(langFinder.value);
    const reader = new FileReader();
    reader.onload = (event) => {
        setCode(event.target.result);
        setView('editor');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code.trim() || code.length < 10) {
      setToast({ isOpen: true, message: "Input Error: Code sample too small for analysis", type: 'info' });
      return;
    }

    try {
      setLoading(true);
      const results = await reviewService.createReview(code, language);
      setCurrentReview(results);
      navigate(`/review/${results.reviewId}`);
    } catch (err) {
      setToast({ isOpen: true, message: `System Error: ${err.response?.data?.error || "Analysis failed"}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onChange = useCallback((value) => {
    setCode(value);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          {view === 'selection' ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-center items-center gap-12"
            >
              <div className="text-center space-y-3">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                  Initiate <span className="text-blue-500">Investigation</span>
                </h1>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">Select source cluster ingest method</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Path A: Machine Import */}
                <Card 
                  onClick={() => document.getElementById('file-upload').click()}
                  className="bg-slate-900/40 border-slate-800 p-12 flex flex-col items-center gap-6 hover:bg-slate-900/60 hover:border-blue-500/30 transition-all cursor-pointer group rounded-[2.5rem] relative overflow-hidden"
                >
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                  <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 group-hover:scale-110 transition-transform">
                    <FileCode className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Source Cluster</h3>
                    <p className="text-slate-500 text-[10px] leading-relaxed">Direct file upload or remote GitHub sync</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Button 
                      onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload').click(); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] uppercase tracking-[0.2em] font-black py-3 px-6 rounded-lg shadow-lg shadow-blue-600/20 flex gap-2"
                    >
                      <FileCode className="w-3 h-3" /> Upload File
                    </Button>
                    <Button 
                      onClick={(e) => { e.stopPropagation(); setIsGithubModalOpen(true); }}
                      className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white text-[9px] uppercase tracking-[0.2em] font-black py-3 px-6 rounded-lg border border-slate-700"
                    >
                      <GitBranch className="w-3 h-3" /> GitHub Sync
                    </Button>
                  </div>
                </Card>

                {/* Path B: Manual Ingest */}
                <Card 
                  onClick={() => setView('editor')}
                  className="bg-slate-900/40 border-slate-800 p-12 flex flex-col items-center gap-6 hover:bg-slate-900/60 hover:border-blue-500/30 transition-all cursor-pointer group rounded-[2.5rem]"
                >
                  <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Manual Ingest</h3>
                    <p className="text-slate-500 text-[10px] leading-relaxed">Paste raw source fragments directly into the editor</p>
                  </div>
                  <div className="mt-8 flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-2 h-0.5 bg-white"></div>
                      <div className="w-8 h-0.5 bg-white"></div>
                      <div className="w-2 h-0.5 bg-white"></div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full"
            >
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => setView('selection')}
                    className="text-slate-500 hover:text-white gap-2 pl-0 mb-2 no-print"
                  >
                    <ChevronLeft className="w-4 h-4" /> Change Method
                  </Button>
                  <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                    Analyze <span className="text-blue-500">Cluster</span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 outline-none hover:text-white transition-all cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value} className="bg-slate-900 border-none">
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-xl px-10 py-6 font-black uppercase tracking-wider text-xs flex gap-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "Analyzing..." : <><Play className="w-4 h-4 fill-current" /> Execute Analysis</>}
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-slate-950/80 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900/80 flex items-center px-8 border-b border-slate-800/60 z-10 backdrop-blur-xl">
                  <div className="flex gap-2 mr-6 text-slate-700">
                    <div className="w-3 h-3 rounded-full border border-current"></div>
                    <div className="w-3 h-3 rounded-full border border-current"></div>
                    <div className="w-3 h-3 rounded-full border border-current"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-3">
                    <FileCode className="w-3 h-3 text-blue-500" />
                    Source Console / {language}
                  </span>
                </div>
                <div className="pt-12 h-full overflow-auto custom-scrollbar">
                  <CodeMirror
                    value={code}
                    height="100%"
                    theme={oneDark}
                    extensions={getLanguageExtension(language)}
                    onChange={onChange}
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-slate-600 text-[10px] font-bold tracking-widest uppercase">
                <div className="flex gap-6 italic">
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-700 rounded-full" /> CodeMirror Active</span>
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-700 rounded-full" /> {(code || '').length} Metrics Analyzed</span>
                </div>
                <p className="opacity-40">System Status: Optimal</p>
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
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </DashboardLayout>
  );
};

export default CodeInput;
