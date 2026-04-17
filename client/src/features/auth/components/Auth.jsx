import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Terminal, Sparkles, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useOAuthLogin } from '../../../hooks/useOAuthLogin';
import { useEmailAuth } from '../../../hooks/useEmailAuth';

/**
 * 🔒 ELITE AUTH GATEWAY
 * --------------------
 * High-friction-less entry for both GitHub and Magic Link (OTP) flows.
 */
const Auth = () => {
  const { login, loadingProvider, error: oauthError } = useOAuthLogin();
  const { handleMagicLink, loading: emailLoading, error: emailError } = useEmailAuth();
  
  const [email, setEmail] = useState('');
  const [sentStatus, setSentStatus] = useState(false);
  const isGitHubLoading = loadingProvider === 'github';

  const onMagicLinkRequest = async (e) => {
    e.preventDefault();
    if (!email) return;
    const result = await handleMagicLink(email);
    if (result === 'OTP_SENT') {
      setSentStatus(true);
    }
  };

  const error = oauthError || emailError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center gap-10 p-10 md:p-12 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_0_120px_-20px_rgba(37,99,235,0.2)] max-w-sm w-full transition-all duration-700 hover:shadow-[0_0_120px_-10px_rgba(37,99,235,0.4)] group overflow-hidden"
    >
      {/* 🪄 BACKGROUND DECOR */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 🏛️ ELITE BRANDING CLUSTER */}
      <div className="relative z-10 text-center space-y-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative inline-flex items-center justify-center w-24 h-24 mb-2 transition-transform duration-500"
        >
          <img
            src="/CodePilot.png"
            alt="CodePilot"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-6 h-6 text-blue-400" />
          </motion.div>
        </motion.div>

        <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
          CodePilot
        </h2>
        <p className="text-slate-400 text-[10px] font-mono tracking-[0.5em] uppercase opacity-50 px-2">
          Sovereign Intelligence
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!sentStatus ? (
          <motion.div
            key="auth-forms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative z-10 w-full space-y-8"
          >
            {/* 🚀 OAUTH SECTOR */}
            <Button
              onClick={() => login('github')}
              disabled={isGitHubLoading || emailLoading}
              className="w-full py-9 bg-linear-to-br from-[#24292e] to-[#1a1e22] text-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-white/10 hover:border-blue-500/30 hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group/btn relative overflow-hidden"
            >
              {isGitHubLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <span className="text-lg font-bold tracking-tight">Authorizing...</span>
                </div>
              ) : (
                <>
                  <Terminal className="w-6 h-6 transition-transform group-hover/btn:-translate-y-1" />
                  <span className="text-lg font-bold tracking-tight">Access via GitHub</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 opacity-0 group-hover/btn:opacity-100 -translate-x-full group-hover/btn:translate-x-full transition-all duration-1000" />
                </>
              )}
            </Button>

            {/* 🥯 DIVIDER */}
            <div className="flex items-center gap-4 opacity-20">
              <div className="h-px flex-1 bg-white" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white">OR</span>
              <div className="h-px flex-1 bg-white" />
            </div>

            {/* 📧 OTP SECTOR */}
            <form onSubmit={onMagicLinkRequest} className="space-y-4">
              <div className="group/input relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-blue-50 placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
              </div>
              <Button
                type="submit"
                disabled={!email || isGitHubLoading || emailLoading}
                className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl py-6 flex items-center justify-center gap-2 group/otp border border-white/5 transition-all active:scale-[0.98]"
              >
                {emailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <>
                    <span className="text-sm font-bold tracking-tight">Continue with OTP</span>
                    <ArrowRight className="w-4 h-4 group-hover/otp:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <CheckCircle2 className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Handshake Sent</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Check <span className="text-blue-400 font-bold font-mono">{email}</span> for your secure access link.
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setSentStatus(false)}
              className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest"
            >
              Try another email
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛡️ ERROR FEEDBACK */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl w-full"
        >
          <p className="text-[11px] text-center font-bold text-red-400 italic">
            GATEWAY FAULT: {error}
          </p>
        </motion.div>
      )}

      {/* 🧩 ENCRYPTION BADGE */}
      <div className="relative z-10 flex items-center gap-4 w-full opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/20" />
        <div className="flex gap-1.5 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-[8px] text-white/50 uppercase tracking-[0.3em] font-mono font-black">
            V-2 HANDSHAKE
          </p>
        </div>
        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/20" />
      </div>
    </motion.div>
  );
};

export default Auth;
