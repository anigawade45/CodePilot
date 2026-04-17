import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { getLanguageExtension } from '../lib/codemirror';
import { useReviewResult } from '../hooks/useReviewResult';
import {
    ShieldAlert,
    Zap,
    Bug,
    Palette,
    ChevronLeft,
    Download,
    Share2,
    FileCode,
    CheckCircle2,
    Trash2,
    Activity,
    Code2,
    AlertTriangle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import GlassCard from '../components/ui/GlassCard';
import MetricCircle from '../components/ui/MetricCircle';
import LoadingState from '../components/ui/LoadingState';
import { Button } from '../components/ui/button';

const ReviewResult = () => {
    const {
        id,
        currentReview,
        issues,
        filteredIssues,
        isLoading,
        activeTab,
        setActiveTab,
        toast,
        setToast,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        highlightedLine,
        scrollToLine,
        setEditorView,
        handleShare,
        handleDelete,
        navigate
    } = useReviewResult();

    if (isLoading || !currentReview) {
        return <LoadingState message="Hydrating Analysis Cluster..." />;
    }

    const severityColor = (sev) => {
        const s = (sev || 'low').toLowerCase();
        switch (s) {
            case 'high': return 'text-red-400 border-red-500/20 bg-red-500/10';
            case 'medium': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
            default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
        }
    };

    const categoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'security': return <ShieldAlert className="w-4 h-4" />;
            case 'performance': return <Zap className="w-4 h-4" />;
            case 'bug': return <Bug className="w-4 h-4" />;
            default: return <Palette className="w-4 h-4" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto">
                {/* 🏷️ TOP NAVIGATION & HEADER */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-10 no-print">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="text-slate-500 hover:text-white gap-2 pl-0 group transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Return to Archive</span>
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                                <Activity className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic line-clamp-1">
                                    Report: <span className="text-blue-500">#{id?.slice(0, 10).toUpperCase() || 'EXTERNAL'}</span>
                                </h1>
                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Analysis Finalized • {currentReview?.created_at ? new Date(currentReview.created_at).toLocaleDateString() : 'REAL-TIME PROBE'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="ghost"
                            aria-label="Purge Investigation"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500/30 text-[10px] font-black uppercase tracking-widest px-6 h-12 rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Purge
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleShare}
                            className="bg-slate-900/40 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-6 h-12 rounded-xl"
                        >
                            <Share2 className="w-4 h-4 mr-2 text-blue-400" /> Share
                        </Button>
                        <Button
                            onClick={() => window.print()}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 px-8 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            <Download className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                    </div>
                </div>

                {/* 📊 CORE METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 no-print">
                    <GlassCard className="p-8 col-span-1 md:col-span-2 flex items-center justify-around bg-slate-900/20">
                        <MetricCircle
                            value={Math.max(0, 100 - (issues.filter(i => i.severity === 'high').length * 15))}
                            label="Security"
                            color="blue"
                        />
                        <MetricCircle
                            value={Math.max(0, 100 - (issues.filter(i => i.category === 'performance').length * 10))}
                            label="Performance"
                            color="emerald"
                        />
                        <MetricCircle
                            value={Math.max(0, 100 - (issues.length * 5))}
                            label="Accuracy"
                            color="amber"
                        />
                    </GlassCard>

                    <GlassCard className="p-8 md:col-span-2 flex flex-col justify-center border-blue-500/10 bg-blue-500/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black uppercase tracking-tighter text-xl italic leading-none">Intelligence Hub</h3>
                                    <p className="text-blue-400/60 text-[9px] uppercase font-black tracking-widest mt-1">Cross-Reference Data Generated</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Source Node</span>
                                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider shadow-lg ${
                                    currentReview?.provider?.includes('user') 
                                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 shadow-emerald-500/10' 
                                        : currentReview?.provider?.includes('local')
                                        ? 'border-blue-500/30 text-blue-400 bg-blue-500/5 shadow-blue-500/10 Anim-Pulse'
                                        : 'border-purple-500/30 text-purple-400 bg-purple-500/5 shadow-purple-500/10'
                                }`}>
                                    {currentReview?.provider || 'SYSTEM-DEFAULT'}
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-medium">
                            Investigation yielded <span className="text-white font-bold">{issues.length} critical findings</span> across <span className="text-white font-bold">{(currentReview?.code || '').split('\n').length} lines</span>.
                            Node <span className="text-blue-400 font-bold uppercase">{currentReview?.provider || 'Global Cluster'}</span> identified <span className="text-red-400 font-bold">{issues.filter(i => i.severity === 'high').length} security hazards</span> with cross-node verification.
                        </p>
                    </GlassCard>
                </div>

                {/* 🖥️ MAIN CONTENT AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">

                    {/* 📄 SOURCE EXPLORER (7/12) */}
                    <div className="lg:col-span-7 flex flex-col min-h-0">
                        <div className="flex-1 bg-slate-950 rounded-[2.5rem] border border-slate-800 overflow-hidden relative shadow-2xl group">
                            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900/10 backdrop-blur-md flex items-center px-8 border-b border-slate-800/60 z-10 justify-between">
                                <div className="flex items-center gap-3">
                                    <Code2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                                        repository.analysis_snapshot.{currentReview?.language === 'python' ? 'py' : 'js'}
                                    </span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                                </div>
                            </div>
                            <div className="pt-12 h-full">
                                <CodeMirror
                                    value={currentReview?.code || '// Cluster offline or synchronizing...'}
                                    height="100%"
                                    theme={oneDark}
                                    extensions={[
                                        getLanguageExtension(currentReview?.language || 'javascript')
                                    ]}
                                    editable={false}
                                    readOnly={true}
                                    onCreateEditor={(view) => setEditorView(view)}
                                    className="text-xs font-mono h-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 🔍 INTELLIGENT FINDINGS (5/12) */}
                    <div className="lg:col-span-5 flex flex-col min-h-0">
                        <div className="bg-slate-900/40 p-1.5 rounded-2xl mb-6 flex border border-slate-800/60 no-print">
                            {['all', 'bug', 'security', 'performance'].map((tab) => (
                                <button
                                    key={tab}
                                    aria-label={`${tab} findings`}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 rounded-xl py-2.5 text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-1 ring-blue-400/20'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {tab === 'all' ? `TOTAL [${issues.length}]` : tab === 'performance' ? 'PERFORMANCE' : tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
                            <AnimatePresence mode="popLayout">
                                {filteredIssues.map((issue, index) => (
                                    <motion.div
                                        key={issue.id || `issue-${index}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <GlassCard
                                            onClick={() => scrollToLine(issue.line_number)}
                                            className={`group p-6 cursor-pointer border-slate-800/60 hover:border-slate-600 transition-all ${highlightedLine === issue.line_number ? 'ring-2 ring-blue-500/30 border-blue-500/40' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner ${severityColor(issue.severity)}`}>
                                                        {categoryIcon(issue.category)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${severityColor(issue.severity).split(' ')[0]}`}>
                                                                {issue.severity} Severity
                                                            </span>
                                                            <span className="text-slate-700 text-[10px]">•</span>
                                                            <span className={`text-[8px] font-black h-4 px-2 flex items-center rounded-full border ${issue.source === 'sovereign' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'}`}>
                                                                {issue.source?.toUpperCase() || 'AI'}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-white text-md font-bold tracking-tight mt-1">
                                                            Finding <span className="text-slate-400 font-mono text-sm ml-1">#L{issue.line_number}</span>
                                                        </h4>
                                                    </div>
                                                </div>
                                                {issue.severity === 'high' && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
                                            </div>

                                            <div className="relative pl-4 mb-6">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 rounded-full" />
                                                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                                                    &ldquo;{issue.message}&rdquo;
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Recommended Mitigation</span>
                                                </div>
                                                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 font-mono leading-relaxed group-hover:text-blue-100 transition-colors">
                                                    {issue.suggestion}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filteredIssues.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24 bg-slate-950/40 rounded-[2.5rem] border-2 border-dashed border-slate-900"
                                >
                                    <Info className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-600 text-[11px] font-black uppercase tracking-widest">No matching findings in this sector.</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛡️ MODALS & OVERLAYS */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="System Purge Sequence"
                message="DANGER: Initiating this purge will permanently erase this investigation cluster and all associated intelligence from the secure cloud. This action is IRREVERSIBLE."
                confirmText="Execute Purge"
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
