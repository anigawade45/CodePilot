import { motion } from 'framer-motion';
import { Shield, Bug, Code, Share2 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Security Shield",
      desc: "Automatic detection of SQLi, XSS, and hardcoded secrets.",
      color: "blue",
      bg: "from-blue-500/20 to-transparent"
    },
    {
      icon: Bug,
      title: "Leak Detection",
      desc: "Identify memory leaks and unhandled exceptions instantly.",
      color: "rose",
      bg: "from-rose-500/20 to-transparent"
    },
    {
      icon: Code,
      title: "Pro Refactoring",
      desc: "Smarter suggestions to reduce cyclomatic complexity.",
      color: "emerald",
      bg: "from-emerald-500/20 to-transparent"
    },
    {
      icon: Share2,
      title: "Team Sync",
      desc: "Collaborative public tokens for cross-team audits.",
      color: "amber",
      bg: "from-amber-500/20 to-transparent"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-12 md:mb-20 px-4">
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight md:tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/70">
          Built for Technical Excellence
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto italic font-light text-sm md:text-base">Every line of code is an opportunity for perfection. CodePilot helps you get there faster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="group relative p-6 md:p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 bg-linear-to-br ${feat.bg} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

            <div className={`relative z-10 p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 md:mb-8 w-fit shadow-xl group-hover:scale-110 group-hover:shadow-${feat.color}-500/20 transition-all duration-300`}>
              <feat.icon className={`w-6 h-6 text-${feat.color}-400`} />
            </div>

            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 group-hover:text-white transition-colors">{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                {feat.desc}
              </p>
            </div>

            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${feat.color}-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
