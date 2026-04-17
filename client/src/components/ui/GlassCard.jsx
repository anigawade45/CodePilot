/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * 💎 GlassCard Primitive
 * ---------------------
 * A high-end glassmorphic container for the Sovereign UI.
 * Features:
 * - Backdrop blur tracking
 * - Border glow effects
 * - Framer Motion integration
 * - Responsive padding & border-radius
 */
const GlassCard = forwardRef(({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  animate = true,
  ...props 
}, ref) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      ref={ref}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl transition-all duration-300",
        hover && "hover:bg-slate-900/60 hover:border-blue-500/30",
        glow && "after:absolute after:inset-0 after:z-[-1] after:bg-blue-500/5 after:blur-3xl after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        className
      )}
      {...props}
    >
      {/* Decorative corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
