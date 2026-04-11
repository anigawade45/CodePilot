import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ShieldAlert, Zap, Bug, Palette, ChevronLeft, Download, Share2, FileCode, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';

const ReviewResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState(null);
    const { currentReview, setCurrentReview, setLoading, isLoading } = useStore();
    const [activeTab, setActiveTab] = useState('all');
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const scrollToLine = (line) => {
        if (!view) return;
        const pos = view.state.doc.line(line).from;
        view.dispatch({
            selection: { head: pos, anchor: pos },
            scrollIntoView: true
        });
    };

    useEffect(() => {
        const fetchReview = async () => {
            try {
                setLoading(true);
                const data = await reviewService.getReviewById(id);
                setCurrentReview(data);
            } catch (err) {
                console.error("Failed to load review", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id]);

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

    if (isLoading || !currentReview) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-950 gap-6">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-500 font-black tracking-[0.3em] uppercase text-[10px]">Decrypting Intelligence...</p>
            </div>
        );
    }

    const issues = currentReview.issues || [];
    const filteredIssues = activeTab === 'all' ? issues : issues.filter(i => i.category.toLowerCase() === activeTab);

    const severityColor = (sev) => {
        switch (sev?.toLowerCase()) {
            case 'high': return 'text-red-400 border-red-500/20 bg-red-500/10';
            case 'medium': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
            default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
        }
    };

    const handleShare = async () => {
        try {
            const data = await reviewService.shareReview(id);
            const shareUrl = `${window.location.origin}/share/${data.public_token}`;
            await navigator.clipboard.writeText(shareUrl);
            setToast({ isOpen: true, message: "System Link: Copied to clipboard", type: 'success' });
        } catch (err) {
            setToast({ isOpen: true, message: "Error: Failed to sync share link", type: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleteModalOpen(false);
            await reviewService.deleteReview(id);
            setToast({ isOpen: true, message: "System Purge: Investigation deleted", type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setToast({ isOpen: true, message: "System Error: Failed to purge logs", type: 'error' });
        }
    };

    return (
        <DashboardLayout>
            <div className="hidden print:flex items-center justify-between mb-12 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">CodePilot Report</h1>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-0.5">Automated Intelligence Protocol</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Investigation Timestamp</p>
                    <p className="text-slate-900 text-sm font-mono mt-1">{new Date().toLocaleString()}</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/dashboard')} 
                        className="text-slate-500 hover:text-white gap-2 pl-0 mb-2 no-print"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Logs
                    </Button>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                        Investigation <span className="text-blue-500">#{id.slice(0, 7)}</span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-3 no-print">
                    <Button
                        variant="ghost"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500/30 text-[10px] font-bold uppercase tracking-widest px-6"
                    >
                        <Trash2 className="w-3 h-3 mr-2" /> Purge
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleShare}
                        className="bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest px-6"
                    >
                        <Share2 className="w-3 h-3 mr-2 text-blue-400" /> Share
                    </Button>
                    <Button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        <Download className="w-3 h-3 mr-2" /> PDF Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
                {/* Source Explorer */}
                <div className="lg:col-span-7 flex flex-col min-h-0">
                    <div className="flex-1 bg-slate-950/80 rounded-[2rem] border border-slate-800 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900/80 flex items-center px-6 border-b border-slate-800/60 z-10 backdrop-blur-xl justify-between">
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-2">
                                <FileCode className="w-3 h-3 text-blue-500" /> source_snapshot.{currentReview.language === 'python' ? 'py' : 'js'}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono italic">READ_ONLY_ACCESS</span>
                        </div>
                        <div className="pt-10 h-full overflow-auto custom-scrollbar">
                           <CodeMirror
                                value={currentReview.code}
                                height="100%"
                                theme={oneDark}
                                extensions={getLanguageExtension(currentReview.language)}
                                editable={false}
                                readOnly={true}
                                onStatistics={(data) => {}}
                                onCreateEditor={(view) => setView(view)}
                                className="text-xs font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Intelligent Findings */}
                <div className="lg:col-span-5 flex flex-col min-h-0">
                    <div className="bg-slate-900/50 border border-slate-800 p-1 rounded-2xl mb-6 flex no-print">
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            All ({issues.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('bug')}
                            className={`flex-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'bug' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Bugs
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Security
                        </button>
                        <button 
                            onClick={() => setActiveTab('performance')}
                            className={`flex-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Perf
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {filteredIssues.map((issue, index) => (
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card 
                                        onClick={() => scrollToLine(issue.line_number)}
                                        className="p-6 bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-blue-500/30 transition-all group rounded-2xl relative overflow-hidden cursor-pointer active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${severityColor(issue.severity)}`}>
                                                    {issue.category === 'security' && <ShieldAlert className="w-4 h-4" />}
                                                    {issue.category === 'performance' && <Zap className="w-4 h-4" />}
                                                    {issue.category === 'bug' && <Bug className="w-4 h-4" />}
                                                    {issue.category === 'style' && <Palette className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className={`text-[10px] uppercase font-black tracking-[0.15em] ${severityColor(issue.severity)}`}>
                                                        {issue.severity} Severity
                                                    </span>
                                                    <h4 className="text-white text-xs font-bold font-mono tracking-tight mt-0.5">Line {issue.line_number}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-slate-300 mb-6 leading-relaxed font-medium">"{issue.message}"</p>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Refactor Suggestion</span>
                                            </div>
                                            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed group-hover:text-blue-200 transition-colors">
                                                {issue.suggestion}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredIssues.length === 0 && (
                            <div className="text-center py-20 bg-slate-950/50 rounded-[2rem] border border-dashed border-slate-800">
                               <Zap className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                               <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">No optimization paths detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Purge Investigation"
                message="CRITICAL ACTION: This will permanently purge this investigation and all Findings from the cloud cluster. This action cannot be undone."
                confirmText="Purge Logs"
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

export default ReviewResult;
