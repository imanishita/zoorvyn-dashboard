import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Check if hovering over clickable elements
    const handleMouseOver = (e) => {
      if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Use a media query to only show custom cursor on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null; // hide on mobile
  }

  return (
    <>
      {/* Small dot following exactly */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-500 rounded-full pointer-events-none z-[100]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Trailing circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-brand-500/50 rounded-full pointer-events-none z-[100]"
        animate={{ 
          x: mousePosition.x - 16, 
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </>
  );
}
