import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for students & side projects",
      features: ["5 Peer Reviews / mo", "Standard AI reasoning", "Public dashboards", "Community support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      desc: "For serious full-stack developers",
      features: ["Unlimited Reviews", "Gemini 2.5 Flash context", "Priority reasoning", "Email support", "Private review links"],
      cta: "Join Pro",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Scale with advanced security",
      features: ["Single Sign-On (SSO)", "Dedicated AI models", "On-prem possibilities", "24/7 Phone support", "SLA guarantees"],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-8 py-40">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/70">
          Simple, Transparent <span className="text-blue-500">Pricing.</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto font-light">No hidden fees. No complexity. Just high-performance code reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[2.5rem] border ${tier.highlight ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900/40 border-slate-800/60'} h-full flex flex-col items-center text-center`}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-[10px] uppercase font-black tracking-widest rounded-full">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-white">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-white">{tier.price}</span>
              {tier.price !== "Custom" && <span className="text-slate-500 text-sm">/mo</span>}
            </div>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed italic">{tier.desc}</p>

            <div className="space-y-4 mb-10 w-full text-left">
              {tier.features.map(feat => (
                <div key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <Button
              variant={tier.highlight ? 'default' : 'outline'}
              className={`mt-auto w-full py-6 rounded-xl font-bold ${tier.highlight ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20' : 'border-slate-800 hover:bg-slate-800 text-white'}`}
            >
              {tier.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
