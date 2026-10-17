import React, { useCallback, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../hooks/useScrollY';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Max pull in px toward the cursor. */
  strength?: number;
}

/**
 * Desktop-only magnetic pull for primary CTAs. The button drifts a few px
 * toward the cursor and springs back on leave. Transform-only, rAF-throttled.
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '', strength = 6 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const hovering = useRef(false);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!hovering.current || !ref.current) return;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const x = Math.max(-strength, Math.min(strength, dx * 0.18));
        const y = Math.max(-strength, Math.min(strength, dy * 0.18));
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    },
    [strength]
  );

  const onEnter = useCallback(() => {
    hovering.current = true;
    if (ref.current) ref.current.style.willChange = 'transform';
  }, []);

  const onLeave = useCallback(() => {
    hovering.current = false;
    cancelAnimationFrame(raf.current);
    if (ref.current) {
      ref.current.style.transform = 'translate3d(0, 0, 0)';
      ref.current.style.willChange = 'auto';
    }
  }, []);

  // Touch devices and reduced-motion users get the plain button — no JS cost.
  if (!isFinePointer() || prefersReducedMotion()) return <>{children}</>;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
      style={{ transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
