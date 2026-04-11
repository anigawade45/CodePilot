import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useStore } from '../../../store/useStore';

const Hero = () => {
   const navigate = useNavigate();
   const { session } = useStore();

   return (
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-40 relative z-10 flex flex-col items-center">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
         >
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-8"
            >
               <Sparkles className="w-3 h-3" />
               AI-Powered Code Intelligence
            </motion.div>
 
            <h1 className="text-6xl lg:text-[100px] font-black mb-8 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-linear-to-b from-white to-white/70">
               Engineer <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">Excellence.</span>
            </h1>
 
            <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
               CodePilot is the intelligent layer for your development workflow.
               Detect bottlenecks, squash bugs, and refactor like a pro with
               next-gen Gemini intelligence.
            </p>
 
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 text-xl rounded-2xl gap-3 shadow-2xl shadow-blue-500/40 active:scale-95 transition-all group font-bold"
               >
                  {session ? (
                     <>Go to Dashboard <LayoutDashboard className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                     <>Start Free Review <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  )}
               </Button>
               <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                  <div className="flex -space-x-2">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                        </div>
                     ))}
                  </div>
                  <div className="text-xs text-slate-400">
                     Joined by <span className="text-white font-bold">2,400+</span> developers
                  </div>
               </div>
            </div>
         </motion.div>

         {/* 📟 Product Preview Mockup */}
         <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative max-w-5xl w-full"
         >
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-20" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
               {/* Window Controls */}
               <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                     <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">codepilot_analysis.js</div>
                  <div className="w-10" />
               </div>
               {/* Analysis Preview Content */}
               <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4 font-mono text-[13px]">
                     <div className="flex gap-4">
                        <span className="text-slate-600">1</span>
                        <span className="text-blue-400">async</span> <span className="text-white">function</span> <span className="text-yellow-400">review</span>() {'{'}
                     </div>
                     <div className="flex gap-4 bg-red-500/10 border-l-2 border-red-500 -mx-8 px-8 py-1">
                        <span className="text-slate-600 italic line-through">2</span>
                        <span className="text-slate-400">  const data = await fetch(url);</span>
                     </div>
                     <div className="flex gap-4 bg-emerald-500/10 border-l-2 border-emerald-500 -mx-8 px-8 py-1">
                        <span className="text-slate-600 italic">2</span>
                        <span className="text-slate-100">  const {'{'} data, error {'}'} = await api.get();</span>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-slate-600">3</span>
                        <span className="text-white">  return data;</span>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-slate-600">4</span>
                        <span className="text-white">{'}'}</span>
                     </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Critical Bug</span>
                     </div>
                     <h4 className="text-white font-bold text-sm mb-2">Improper Error Handling</h4>
                     <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        Potential runtime crash if the fetch request fails. Always destructure data and error for resilience.
                     </p>
                     <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[10px] text-blue-400">
                        Suggestion: Wrap in try/catch or use a wrapper service.
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>
   );
};

export default Hero;
