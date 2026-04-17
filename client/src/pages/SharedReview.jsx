import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CONFIG } from '../constants/config';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { getLanguageExtension } from '../lib/codemirror';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, Zap, Bug, Palette, FileCode } from 'lucide-react';

/**
 * 🌐 SHARED INSIGHTS PORTAL [OPTIMIZED v11.0]
 * -------------------------------------------
 * - Externalized Logic: Uses centralized CodeMirror resolver
 * - Reduced Footprint: Removed redundant language imports
 * - Read-Only Hygiene: Visual indicators for public access
 */
const SharedReview = () => {
    const { token } = useParams();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSharedReview = async () => {
            try {
                const response = await axios.get(`${CONFIG.API_BASE_URL}/share/${token}`);
                setReview(response.data);
            } catch (err) {
                console.error("Failed to load shared review cluster", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSharedReview();
    }, [token]);

    const issues = useMemo(() => review?.issues || [], [review]);

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] italic animate-pulse">Decrypting Shared Insights...</p>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Link Cluster Expired or Nullified</p>
                </div>
            </div>
        );
    }

    const severityColor = (sev) => {
        switch (sev?.toLowerCase()) {
            case 'high': return 'text-red-400 border-red-500/20 bg-red-500/10';
            case 'medium': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
            default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
        }
    };

    return (
        <div className="dark min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 h-[calc(100vh-4rem)]">
                <header className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <FileCode className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter uppercase italic">CodePilot Report</h1>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">System Snapshot Analysis</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/5 px-4 py-1.5 rounded-full font-black tracking-widest text-[9px]">PUBLIC_INTEL_READ_ONLY</Badge>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden pb-8">
                    {/* Code Section */}
                    <div className="lg:col-span-7 bg-slate-950/80 rounded-[2.5rem] border border-slate-800 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900/80 flex items-center px-6 border-b border-slate-800/60 z-10 backdrop-blur-xl justify-between">
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-2">
                                <FileCode className="w-3 h-3 text-blue-500" /> source.{review.language === 'python' ? 'py' : 'js'}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono italic">SECURE_VIEW_MODE</span>
                        </div>
                        <div className="pt-10 h-full overflow-auto custom-scrollbar">
                            <CodeMirror
                                value={review.code}
                                height="100%"
                                theme={oneDark}
                                extensions={getLanguageExtension(review.language)}
                                editable={false}
                                readOnly={true}
                                className="text-xs font-mono"
                            />
                        </div>
                    </div>

                    {/* Issues Section */}
                    <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 pl-2">AI Findings Cluster</h2>
                        {issues.map((issue) => (
                            <Card key={issue.id} className="p-6 bg-slate-900/40 border-slate-800/80 rounded-[1.5rem] hover:bg-slate-900/60 transition-all border">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${severityColor(issue.severity)}`}>
                                            {issue.category === 'security' && <ShieldAlert className="w-4 h-4" />}
                                            {issue.category === 'performance' && <Zap className="w-4 h-4" />}
                                            {issue.category === 'bug' && <Bug className="w-4 h-4" />}
                                            {issue.category === 'style' && <Palette className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <span className={`text-[10px] uppercase font-black tracking-widest ${severityColor(issue.severity)}`}>
                                                {issue.severity} Severity
                                            </span>
                                            <h4 className="text-white text-xs font-bold font-mono tracking-tight mt-0.5">Line {issue.line_number}</h4>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300 mb-6 leading-relaxed font-medium">&quot;{issue.message}&quot;</p>
                                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed">
                                    {issue.suggestion}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedReview;
