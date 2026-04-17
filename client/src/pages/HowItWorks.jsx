import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Key, 
  Database, 
  ChevronRight,
  Code2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Step = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-500"
  >
    <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/5 blur-[50px] group-hover:bg-blue-600/10 transition-all" />
    <div className="relative space-y-4">
      <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tighter italic italic">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  const [selectedTier, setSelectedTier] = useState(0);

  const tiers = [
    { 
      label: "Tier 01: Personal Keys (BYOK)", 
      icon: Key, 
      color: "text-blue-500",
      detail: "The highest intelligence layer. Uses your private API credentials (Gemini, Groq, Grok) with AES-256 encryption. Best for deep architectural reviews and custom precision.",
      metrics: "Latency: 800ms - 2.5s | Intelligence: Maximum"
    },
    { 
      label: "Tier 02: Platform System Pool", 
      icon: Database, 
      color: "text-indigo-500",
      detail: "A multi-node enterprise cluster consisting of Gemini 3.1, Groq, and Grok. If your personal keys hit quota limits, the engine automatically scavenges this shared pool to ensure continuous high-fidelity code investigations.",
      metrics: "Latency: 1.2s - 4s | Intelligence: Enterprise Grade"
    },
    { 
      label: "Tier 03: Local Neural Infrastructure", 
      icon: Cpu, 
      color: "text-purple-500",
      detail: "Bridges to your organization's local LLM nodes (Ollama/Llama-3). Zero data leaving your internal network. Perfect for compliant environments.",
      metrics: "Latency: Variable | Intelligence: Local Balanced"
    },
    { 
      label: "Tier 04: Sovereign Python AST Logic", 
      icon: ShieldCheck, 
      color: "text-emerald-500",
      detail: "The ultimate safety net. A manual, offline-capable analyzer using Abstract Syntax Trees. Provides security and syntax findings even with zero internet connectivity.",
      metrics: "Latency: 100ms - 300ms | Intelligence: Structural"
    }
  ];

  const steps = [
    {
      icon: Key,
      title: "Sovereign Link",
      description: "Securely link your personal AI clusters (Gemini, Groq, or Grok). Your keys are AES-256 encrypted and never leave your browser plain-text.",
      delay: 0.1
    },
    {
      icon: Code2,
      title: "Core Ingestion",
      description: "Paste your code or connect via GitHub. Our engine supports 20+ languages with deep syntax understanding and context awareness.",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Cascading Analysis",
      description: "The platform executes a hierarchical failover. It prioritizes your keys, then system backups, local models, and finally AST logic.",
      delay: 0.3
    },
    {
      icon: Lock,
      title: "Vaulted History",
      description: "Store every investigation in your private cloud vault. Track security trends and performance regressions over time with deep analytics.",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500"
          >
            <ShieldCheck className="w-3 h-3" /> Technical Architecture
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic"
          >
            How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">works.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-500 font-medium"
          >
            A high-fidelity investigation engine designed for zero-downtime, maximum precision, and total privacy using a multi-tier intelligence cascade.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {steps.map((step, idx) => (
            <Step key={idx} {...step} />
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                The Failover <span className="text-blue-500">Hierarchy</span>
              </h2>
              <p className="text-lg leading-relaxed">
                Click on any tier below to explore the technical specifications and behavior of our cascading intelligence link.
              </p>
            </div>

            <div className="space-y-3">
              {tiers.map((tier, idx) => (
                <div key={idx} className="space-y-2">
                  <button 
                    onClick={() => setSelectedTier(idx)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all border ${
                      selectedTier === idx 
                        ? 'bg-slate-900 border-blue-500/50 text-white shadow-lg shadow-blue-500/5' 
                        : 'bg-slate-900/30 border-slate-800/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-slate-950 ${tier.color}`}>
                      <tier.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">{tier.label}</span>
                    <motion.div 
                      animate={{ rotate: selectedTier === idx ? 90 : 0 }}
                      className="ml-auto opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {selectedTier === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/50 space-y-4">
                          <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            {tier.detail}
                          </p>
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                            <span className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase">Status:</span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{tier.metrics}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-white/5 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30"
                  />
                  <div className="absolute inset-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
                    <RefreshCw className="w-12 h-12 text-blue-500 animate-spin-slow" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3.5rem] bg-gradient-to-b from-blue-600 to-indigo-600 text-center space-y-8 shadow-[0_30px_100px_-20px_rgba(37,99,235,0.4)]"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic italic">
            Ready to secure your <br />architecture?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/code-review">
              <button className="px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 active:scale-95 transition-all shadow-xl shadow-black/10">
                Launch Investigation
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="px-10 py-5 bg-black/20 text-white border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-black/30 active:scale-95 transition-all backdrop-blur-md">
                Enter Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="relative border-t border-slate-900 py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          Powered by Sovereign Intelligence Core v11.0
        </p>
      </footer>
    </div>
  );
};

export default HowItWorks;
