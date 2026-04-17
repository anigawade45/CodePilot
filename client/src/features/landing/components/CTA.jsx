import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32 relative text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="group relative p-10 md:p-24 rounded-[2.5rem] md:rounded-[3.5rem] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center shadow-[0_0_100px_-20px_rgba(37,99,235,0.4)] overflow-hidden w-full gap-4"
      >
        {/* 🪄 Internal Grid Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[20px_20px] md:bg-size-[30px_30px] opacity-20 pointer-events-none" />

        <h2 className="relative z-10 text-3xl md:text-6xl font-black text-white mb-4 md:mb-8 tracking-tighter leading-tight italic">
          Ready to ship <br className="hidden md:block" /> better code?
        </h2>

        <p className="relative z-10 text-blue-100/80 text-base md:text-lg mb-8 md:mb-12 max-w-lg mx-auto font-light leading-relaxed">
          Join thousands of engineers who use CodePilot to automate their review workflow and eliminate bugs early.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          className="relative z-10 bg-white text-blue-600 hover:bg-slate-50 px-10 md:px-12 py-6 md:py-8 text-lg md:text-xl rounded-2xl shadow-2xl shadow-black/20 font-black flex items-center gap-3 active:scale-95 transition-all group w-full sm:w-auto justify-center"
        >
          Get Started for Free <Zap className="w-5 h-5 md:w-6 md:h-6 fill-blue-600 group-hover:rotate-12 transition-transform" />
        </Button>

        <div className="relative z-10 mt-6 md:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-blue-100/50 text-[10px] uppercase tracking-widest font-bold">
            <Shield className="w-3 h-3" /> Enterprise Grade
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-blue-300/30" />
          <div className="flex items-center gap-2 text-blue-100/50 text-[10px] uppercase tracking-widest font-bold">
            <Zap className="w-3 h-3" /> Instant Setup
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
