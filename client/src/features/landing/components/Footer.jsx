import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
      <div className="flex items-center gap-2 opacity-50">
        <Zap className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold tracking-tight text-white">CodePilot</span>
      </div>
      <div className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium text-center">
        © {new Date().getFullYear()} CodePilot Labs. Built for the Future of DevOps.
      </div>
      <div className="flex gap-6 text-slate-500 text-xs">
        <a
          href="#"
          className="hover:text-white transition-colors"
          rel="noopener noreferrer"
        >
          Privacy
        </a>
        <a
          href="#"
          className="hover:text-white transition-colors"
          rel="noopener noreferrer"
        >
          Terms
        </a>
        <a
          href="https://twitter.com"
          className="hover:text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </div>
    </footer>
  );
};

export default Footer;
