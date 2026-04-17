import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useStore } from '../../../store/useStore';
import PropTypes from 'prop-types';

const Typewriter = ({ text, delay = 0, duration = 0.05 }) => {
   const letters = Array.from(text);
   const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
         opacity: 1,
         transition: { staggerChildren: duration, delayChildren: delay * i },
      }),
   };

   const child = {
      visible: {
         opacity: 1,
         transition: {
            type: "spring",
            damping: 12,
            stiffness: 200,
         },
      },
      hidden: {
         opacity: 0,
      },
   };

   return (
      <motion.span
         style={{ display: "inline-flex", overflow: "hidden" }}
         variants={container}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}
      >
         {letters.map((letter, index) => (
            <motion.span key={index} variants={child}>
               {letter === " " ? "\u00A0" : letter}
            </motion.span>
         ))}
         <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-[2px] h-4 bg-blue-400 ml-0.5"
         />
      </motion.span>
   );
};

Typewriter.propTypes = {
   text: PropTypes.string.isRequired,
   delay: PropTypes.number,
   duration: PropTypes.number,
};

const Hero = () => {
   const navigate = useNavigate();
   const { session } = useStore();

   return (
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 md:pt-40 pb-24 md:pb-40 relative z-10 flex flex-col items-center">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
         >
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-xs font-semibold text-blue-400 mb-8"
            >
               <Sparkles className="w-3 h-3" />
               Next-Gen Code Intelligence
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60">
               Engineer Excellence.
            </h1>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light px-4">
               CodePilot is the intelligent layer for your development workflow.
               Detect bottlenecks, squash bugs, and refactor code with
               Gemini-powered precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 text-xl rounded-2xl gap-3 shadow-2xl shadow-blue-500/40 active:scale-95 transition-all group font-bold"
               >
                  {session ? (
                     <>Go to Dashboard <LayoutDashboard className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                     <>Start Free Review <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  )}
               </Button>
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
                        <div className="flex gap-1.5">
                           <span className="text-blue-400">async</span>
                           <span className="text-white">function</span>
                           <span className="text-yellow-400">review</span>() {'{'}
                        </div>
                     </div>
                     <div className="flex gap-4 bg-red-500/10 border-l-2 border-red-500 -mx-8 px-8 py-1">
                        <span className="text-slate-600 italic line-through">2</span>
                        <div className="text-slate-400">
                           &nbsp;&nbsp;<Typewriter text="const data = await fetch(url);" delay={0.5} duration={0.03} />
                        </div>
                     </div>
                     <div className="flex gap-4 bg-emerald-500/10 border-l-2 border-emerald-500 -mx-8 px-8 py-1">
                        <span className="text-slate-600 italic">2</span>
                        <div className="text-slate-100">
                           &nbsp;&nbsp;<Typewriter text="const { data, error } = await api.get();" delay={1.8} duration={0.03} />
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-slate-600">3</span>
                        <div className="text-white">
                           &nbsp;&nbsp;<Typewriter text="return data;" delay={3.5} duration={0.03} />
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-slate-600">4</span>
                        <span className="text-white">{'}'}</span>
                     </div>
                  </div>
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, x: 20 }}
                     whileInView={{ opacity: 1, scale: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 3.8, duration: 0.5 }}
                     className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl"
                  >
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Critical Bug</span>
                     </div>
                     <h4 className="text-white font-bold text-sm mb-2">Improper Error Handling</h4>
                     <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        Potential runtime crash if the fetch request fails. Always destructure data and error for resilience.
                     </p>
                     <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[10px] text-blue-400 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Suggestion: Wrap in try/catch or use a wrapper service.
                     </div>
                  </motion.div>
               </div>
            </div>
         </motion.div>
      </section>
   );
};

export default Hero;
