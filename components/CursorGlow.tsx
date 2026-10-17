import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion, isFinePointer } from '../hooks/useScrollY';

// A fixed soft radial glow that follows the cursor site-wide.
// Desktop only (pointer: fine), off when the user prefers reduced motion.
// Movement is transform-only; the rAF loop stops itself once settled,
// so nothing runs while the mouse is idle.
const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion() || !isFinePointer()) return;
    const el = ref.current;
    if (!el) return;

    let tx = -600;
    let ty = -600;
    let x = -600;
    let y = -600;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      if (Math.abs(tx - x) < 0.4 && Math.abs(ty - y) < 0.4) {
        raf = 0;
        return;
      }
      el.style.transform = `translate3d(${Math.round(x - 220)}px, ${Math.round(y - 220)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[440px] w-[440px] rounded-full opacity-[0.15] [@media(pointer:fine)]:block"
      style={{
        background:
          'radial-gradient(circle, rgba(250, 204, 21, 0.5) 0%, rgba(255, 255, 255, 0.1) 42%, transparent 68%)',
        transform: 'translate3d(-600px, -600px, 0)',
      }}
    />
  );
};

export default CursorGlow;
