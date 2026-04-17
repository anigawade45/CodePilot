import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { label: "Correct Context", value: "99%", color: "blue" },
    { label: "Review Speed", value: "2s", color: "amber" },
    { label: "Languages", value: "15+", color: "emerald" },
    { label: "Possibilities", value: "∞", color: "rose" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center text-center mb-12 md:mb-20 px-4">
          <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-6">
            SaaS Metrics & Performance
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/70 tracking-tight md:tracking-tighter text-center">
            The Toolkit of <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">Modern Teams.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 px-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-900/20 border border-slate-800/40 text-center group hover:bg-slate-900/40 transition-all"
            >
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-${stat.color}-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`text-4xl md:text-7xl font-black text-white mb-2 md:mb-4 tracking-tighter drop-shadow-2xl`}>
                {stat.value}
              </div>

              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className={`h-1 w-6 md:w-8 rounded-full bg-${stat.color}-500 mb-1 md:mb-2 opacity-50`} />
                <div className="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500 group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
