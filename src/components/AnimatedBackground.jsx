// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Subtle Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.15] text-slate-900 dark:text-white"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentcolor 1.5px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Extremely Minimal Central Horizon Glow */}
      <div className="absolute top-[35%] left-[-20%] right-[-20%] flex justify-center">
        <motion.div 
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            scaleY: [0.8, 1.3, 0.8]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-[40vh] bg-brand-400/20 dark:bg-indigo-500/20 blur-[100px] rounded-[100%]"
        />
      </div>

      {/* Secondary Brand Glow */}
      <div className="absolute bottom-[-10%] left-[10%] right-[10%] flex justify-center">
        <motion.div 
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scaleX: [0.9, 1.2, 0.9]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="w-[80vw] h-[30vh] bg-blue-400/20 dark:bg-brand-500/20 blur-[100px] rounded-[100%]"
        />
      </div>
    </div>
  );
}
