import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<'default' | 'pointer' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on devices with fine pointers (mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);

    const mousePos = { x: 0, y: 0 };
    const trailerPos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      // Update inner cursor immediately (no lag)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      
      // Check for text inputs
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || computedStyle.cursor === 'text') {
        setVariant('text');
        return;
      }

      // Check for interactive elements
      const isInteractive = 
        ['A', 'BUTTON', 'SELECT'].includes(target.tagName) || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.closest('.group') || // Often used for cards in this app
        computedStyle.cursor === 'pointer';

      setVariant(isInteractive ? 'pointer' : 'default');
    };

    const animateTrailer = () => {
      // Smooth interpolation for the trailer
      const speed = 0.15; // Lower = smoother/laggier
      trailerPos.x += (mousePos.x - trailerPos.x) * speed;
      trailerPos.y += (mousePos.y - trailerPos.y) * speed;

      if (trailerRef.current) {
        trailerRef.current.style.transform = `translate3d(${trailerPos.x}px, ${trailerPos.y}px, 0) translate(-50%, -50%)`;
      }
      
      requestAnimationFrame(animateTrailer);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    
    const rafId = requestAnimationFrame(animateTrailer);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Cursor - High Precision */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[10000] pointer-events-none transition-all duration-200 ease-out mix-blend-difference will-change-transform
          ${variant === 'text' 
            ? 'h-6 w-[2px] bg-white' 
            : 'w-2 h-2 bg-white rotate-45'
          }
          ${isClicking ? 'scale-75' : 'scale-100'}
        `}
      />
      
      {/* Outer Trailer - Contextual Field */}
      <div 
        ref={trailerRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center will-change-transform transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${variant === 'text' ? 'opacity-0 scale-50' : 'opacity-100'}
          ${variant === 'pointer' ? 'w-14 h-14' : 'w-10 h-10'}
        `}
      >
        {/* Main Glow Ring */}
        <div className={`absolute inset-0 rounded-full border transition-all duration-300
          ${variant === 'pointer' 
            ? 'border-neon-purple/50 bg-neon-purple/5 backdrop-blur-[1px]' 
            : 'border-white/20 bg-transparent'
          }
          ${isClicking ? 'scale-90 border-neon-blue' : 'scale-100'}
        `} />

        {/* Tech Rotating Dashed Ring (Visible on Pointer) */}
        <div className={`absolute inset-[-4px] rounded-full border border-dashed border-white/20 transition-all duration-500
          ${variant === 'pointer' ? 'opacity-100 animate-spin-slow border-neon-blue/40' : 'opacity-0 scale-50'}
        `} />

        {/* Inner Pulse (Visible on Pointer) */}
        <div className={`absolute inset-0 rounded-full border border-white/10 transition-all duration-300
           ${variant === 'pointer' ? 'animate-ping opacity-20' : 'opacity-0'}
        `} />

        {/* Click Pulse Ring - Appears when clicking */}
         <div className={`absolute inset-0 rounded-full border border-neon-purple transition-all duration-500
           ${isClicking ? 'animate-ping opacity-100 scale-150' : 'opacity-0 scale-100'}
        `} />
      </div>
    </>
  );
};

export default CustomCursor;