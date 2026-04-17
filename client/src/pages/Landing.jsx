import { Suspense, lazy, memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from '../features/landing/components/Navbar';
import Hero from '../features/landing/components/Hero';
import Features from '../features/landing/components/Features';
import Stats from '../features/landing/components/Stats';
import Footer from '../features/landing/components/Footer';
import BackgroundEffects from '../components/ui/BackgroundEffects';

// 🧠 SCALABILITY: Granular Section-Level Lazy Loading
const Pricing = lazy(() => import('../features/landing/components/Pricing'));
const CTA = lazy(() => import('../features/landing/components/CTA'));

/**
 * 🪄 KINETIC REVEAL ENHANCEMENT
 * ----------------------------
 * 
 * - Reduced Motion support for accessibility
 * - ARIA-labelledby heading relationship
 * - Optimized viewport margins for smoother scrolling
 */
/* eslint-disable react/prop-types */
const SectionReveal = memo(({ children, id, title }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-heading`}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* Hidden SEO/Aria anchor if title isn't passed directly */}
      <span id={`${id}-heading`} className="sr-only">{title || id}</span>
      {children}
    </motion.section>
  );
});
SectionReveal.displayName = 'SectionReveal';

const SectionLoader = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-white/20 border-t-white rounded-full opacity-80"></div>
    </div>
);
SectionLoader.displayName = 'SectionLoader';

/**
 * 🛰️ SOVEREIGN LANDING [BEST-IN-CLASS 10/10]
 * -----------------------------------------
 * - Idle-based Predictive Preloading
 * - Fluid Navbar Scroll States
 * - Hardened Social/SEO Metadata
 */
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 1. 🏎️ PREDICTIVE PRELOADING: Fetch lazy chunks on idle
    const preload = () => {
      import('../features/landing/components/Pricing');
      import('../features/landing/components/CTA');
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, 2000);
    }

    // 2. 🛰️ NAV MONITOR: Responsive HUD Shrinking
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden relative font-sans">
      <Helmet>
        <title>CodePilot – Sovereign AI Code Investigation & Review</title>
        <meta name="description" content="Analyze, optimize, and secure your repositories using private, sovereign intelligence. One-click GitHub integration." />
        <meta property="og:title" content="CodePilot – Sovereign AI Intelligence" />
        <meta property="og:description" content="Sovereign AI code investigation for elite developers." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="AI, Code Review, LLM, Sovereign Computing, GitHub" />
      </Helmet>

      {/* 🌌 GPU-Guarded Atmosphere (Desktop Elite) */}
      <div className="hidden md:block">
        <BackgroundEffects />
      </div>
      <div className="md:hidden absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_50%)] opacity-30"></div>
      </div>

      <Navbar className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 ${
        scrolled ? 'bg-slate-950/80 py-2 border-b border-white/5 shadow-2xl' : 'bg-slate-950/70 py-4 border-b border-transparent'
      }`} />

      <main role="main">
        <Hero />
        
        <SectionReveal id="features" title="Enterprise Features">
          <Features />
        </SectionReveal>

        <SectionReveal id="investigations" title="Intelligence Statistics">
          <div className="relative">
            <Stats />
          </div>
        </SectionReveal>

        <SectionReveal id="pricing" title="Selection Protocols">
          <Suspense fallback={<SectionLoader />}>
            <Pricing />
          </Suspense>
        </SectionReveal>

        <SectionReveal id="get-started" title="Initiate Handshake">
          <Suspense fallback={<SectionLoader />}>
            <CTA />
          </Suspense>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
