import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Search,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Bug,
  Layout,
  Download,
  Share2,
  Terminal,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/* eslint-disable react/prop-types */
const CategoryIcon = ({ category }) => {
  switch (category) {
    case 'Security': return <ShieldAlert className="w-4 h-4 text-red-400" />;
    case 'Performance': return <Zap className="w-4 h-4 text-yellow-400" />;
    case 'Bug': return <Bug className="w-4 h-4 text-orange-400" />;
    case 'Style': return <Layout className="w-4 h-4 text-blue-400" />;
    default: return <Info className="w-4 h-4 text-gray-400" />;
  }
};

/* eslint-disable react/prop-types */
const CodeReviewer = ({ user, token, onSignOut }) => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleReview = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language: 'javascript' // Could be dynamic
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      // data: { reviewId: "...", issues: [...] }
      setResults({
        summary: {
          total: data.issues.length,
          critical: data.issues.filter(i => i.severity === 'high').length,
          warnings: data.issues.filter(i => i.severity === 'medium').length,
          suggestions: data.issues.filter(i => i.severity === 'low').length
        },
        issues: data.issues
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message); // Simple alert for now
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 p-6 md:p-12 max-w-7xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Code2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Sentia Review
            </h1>
            <p className="text-slate-400 text-sm">AI-Powered Code Intelligence</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 font-mono">Authenticated as</p>
            <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onSignOut} className="text-slate-500 hover:text-white hover:bg-red-500/10">
            Sign Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-900 border-slate-800 hover:bg-slate-800"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(results, null, 2));
              alert('Results copied to clipboard!');
            }}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-900 border-slate-800 hover:bg-slate-800"
            onClick={() => {
              const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'code-review.json';
              a.click();
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 flex flex-col gap-4"
        >
          <Card className="bg-slate-950/50 border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden h-full flex flex-col">
            <CardHeader className="border-b border-slate-800 bg-slate-900/30 py-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-slate-500 border-slate-800">
                  JavaScript / React
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 grow relative">
              <div className="absolute left-0 top-0 w-12 h-full bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-4 text-slate-600 text-xs font-mono select-none">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="h-6 leading-6">{i + 1}</div>
                ))}
              </div>
              <Textarea
                placeholder="Paste your code here for a deep-dive analysis..."
                className="w-full h-[500px] bg-transparent border-none text-blue-100 font-mono text-sm leading-6 resize-none focus-visible:ring-0 p-4 pl-16 pt-4 placeholder:text-slate-700"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </CardContent>
            <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center">
              <div className="text-xs text-slate-500 font-mono">
                {code.length} characters | UTF-8
              </div>
              <Button
                onClick={handleReview}
                disabled={isAnalyzing || !code.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" /> Review Code
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right Section: Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <AnimatePresence mode="wait">
            {!results && !isAnalyzing ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Card className="bg-slate-950/30 border-dashed border-slate-800 border-2 h-[600px] flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm">
                  <div className="p-6 rounded-full bg-slate-900/50 mb-6 border border-slate-800">
                    <Terminal className="w-12 h-12 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready for Inspection</h3>
                  <p className="text-slate-500 text-sm max-w-[280px]">
                    Enter your code block on the left to receive a comprehensive AI-powered code review instantly.
                  </p>
                </Card>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full space-y-4"
              >
                {[1, 2, 3].map(i => (
                  <Card key={i} className="bg-slate-900/40 border-slate-800 animate-pulse">
                    <div className="h-32 p-4 flex flex-col gap-3">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-4 bg-slate-800/50 rounded w-full" />
                      <div className="h-4 bg-slate-800/50 rounded w-2/3" />
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-red-400">{results.summary.critical}</div>
                    <div className="text-[10px] text-red-500 uppercase tracking-tighter">Critical</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-orange-400">{results.summary.warnings}</div>
                    <div className="text-[10px] text-orange-500 uppercase tracking-tighter">Warnings</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-blue-400">{results.summary.suggestions}</div>
                    <div className="text-[10px] text-blue-500 uppercase tracking-tighter">Info</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-green-400">92%</div>
                    <div className="text-[10px] text-green-500 uppercase tracking-tighter">Health</div>
                  </div>
                </div>

                <ScrollArea className="h-[520px] rounded-xl border border-slate-800 bg-slate-950/20 p-1">
                  <div className="space-y-4 p-3">
                    {results.issues.map((issue, idx) => (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors group cursor-default">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <CategoryIcon category={issue.category} />
                                <span className="font-semibold text-sm text-slate-200">{issue.title}</span>
                              </div>
                              <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px] border-none">
                                Line {issue.line_number}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                              {issue.message}
                            </p>
                            <div className="p-2 rounded bg-slate-950/50 border border-slate-800/50">
                              <div className="text-[10px] text-slate-500 uppercase mb-1 flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3 h-3 text-green-500" /> Recommended Fix
                              </div>
                              <p className="text-[11px] text-slate-300 leading-normal">
                                {issue.recommendation}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Decorative Circles */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default CodeReviewer;
