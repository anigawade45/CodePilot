import React from 'react';
import Navbar from '../features/landing/components/Navbar';
import Hero from '../features/landing/components/Hero';
import Features from '../features/landing/components/Features';
import Stats from '../features/landing/components/Stats';
import Pricing from '../features/landing/components/Pricing';
import CTA from '../features/landing/components/CTA';
import Footer from '../features/landing/components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* 🔮 Technical Background Grid - Managed at layout level for continuity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* 🪄 Global Background Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <Navbar />

      <main>
        <Hero />
        <Features />

        {/* 🏢 Professional "Middle-Section" Glow */}
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-0" />
          <Stats />
        </div>

        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
