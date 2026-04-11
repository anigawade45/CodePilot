import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-8 py-32 relative text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="group relative p-16 md:p-24 rounded-[3.5rem] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center shadow-[0_0_100px_-20px_rgba(37,99,235,0.4)] overflow-hidden w-full"
      >
        {/* 🪄 Internal Grid Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[30px_30px] opacity-20 pointer-events-none" />

        <h2 className="relative z-10 text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight italic">
          Ready to ship <br /> better code?
        </h2>

        <p className="relative z-10 text-blue-100/80 text-lg mb-12 max-w-lg mx-auto font-light">
          Join thousands of engineers who use CodePilot to automate their review workflow and eliminate bugs early.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          className="relative z-10 bg-white text-blue-600 hover:bg-slate-50 px-12 py-8 text-xl rounded-2xl shadow-2xl shadow-black/20 font-black flex items-center gap-3 active:scale-95 transition-all group"
        >
          Get Started for Free <Zap className="w-6 h-6 fill-blue-600 group-hover:rotate-12 transition-transform" />
        </Button>

        <div className="relative z-10 mt-10 flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-100/50 text-[10px] uppercase tracking-widest font-bold">
            <Shield className="w-3 h-3" /> Enterprise Grade
          </div>
          <div className="w-1 h-1 rounded-full bg-blue-300/30" />
          <div className="flex items-center gap-2 text-blue-100/50 text-[10px] uppercase tracking-widest font-bold">
            <Zap className="w-3 h-3" /> Instant Setup
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
