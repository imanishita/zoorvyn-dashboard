import { motion } from 'framer-motion';

/** Shared transition config for drifting orbs — keeps all orbs in sync. */
const orbTransition = {
  duration: 22,
  repeat: Infinity,
  ease: 'easeInOut',
};

/**
 * Full-viewport animated background with layered gradient orbs.
 * Rendered behind all content via fixed positioning and negative z-index.
 * Uses CSS animations (bg-drift) for GPU-friendly motion + Framer Motion for subtle floating orbs.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">

      {/* Base wash — light: soft blue/sky tint; dark: deep navy matching zorvyn.io */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/40 to-sky-50/30 dark:from-dark-bg dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />

      {/* Large drifting gradient blobs — CSS animation keeps GPU-friendly */}
      <div className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-100/30 to-transparent blur-3xl dark:from-blue-500/20 dark:via-indigo-600/15 dark:to-transparent animate-bg-drift" />
      <div className="absolute -right-1/4 bottom-0 h-[65vh] w-[65vw] rounded-full bg-gradient-to-tl from-indigo-200/35 via-violet-100/25 to-transparent blur-3xl dark:from-indigo-500/25 dark:via-violet-600/15 dark:to-transparent animate-bg-drift-slow" />

      {/* Dot pattern overlay — subtle grid texture */}
      <motion.div
        className="absolute inset-0 text-slate-900 dark:text-white"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentcolor 1.5px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating soft orbs — Framer Motion drift */}
      <motion.div
        className="absolute left-[5%] top-[20%] h-[45vmin] w-[45vmin] rounded-full bg-blue-300/20 blur-[90px] dark:bg-blue-500/15"
        animate={{ x: [0, 40, -25, 0], y: [0, -35, 30, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ ...orbTransition, delay: 0 }}
      />
      <motion.div
        className="absolute right-[0%] top-[35%] h-[40vmin] w-[40vmin] rounded-full bg-indigo-300/25 blur-[85px] dark:bg-cyan-500/12"
        animate={{ x: [0, -45, 20, 0], y: [0, 40, -20, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ ...orbTransition, delay: 3, duration: 26 }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[25%] h-[38vmin] w-[38vmin] rounded-full bg-violet-200/30 blur-[80px] dark:bg-violet-600/15"
        animate={{ x: [0, 30, -35, 0], y: [0, -25, 35, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ ...orbTransition, delay: 6, duration: 30 }}
      />

      {/* Horizon glows — breathing scale effect */}
      <div className="absolute top-[30%] left-[-20%] right-[-20%] flex justify-center">
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4], scaleY: [0.85, 1.15, 0.85] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="h-[42vh] w-full rounded-[100%] bg-gradient-to-b from-brand-400/20 via-blue-300/12 to-transparent blur-[100px] dark:from-brand-500/20 dark:via-indigo-500/12 dark:to-transparent"
        />
      </div>
      <div className="absolute bottom-[-8%] left-[8%] right-[8%] flex justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scaleX: [0.92, 1.12, 0.92] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="h-[32vh] w-[85vw] rounded-[100%] bg-gradient-to-t from-blue-300/18 via-sky-200/10 to-transparent blur-[100px] dark:from-brand-500/18 dark:via-blue-600/10 dark:to-transparent"
        />
      </div>
    </div>
  );
}
