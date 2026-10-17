import React from 'react';
import { useScrollY, prefersReducedMotion, isCoarsePointer } from '../hooks/useScrollY';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Fraction of scrollY applied as downward drift. */
  speed?: number;
  /** Max px drift. */
  max?: number;
}

/** Gentle scroll parallax (transform-only). Disabled on touch + reduced motion. */
const Parallax: React.FC<ParallaxProps> = ({ children, className = '', speed = 0.08, max = 120 }) => {
  const y = useScrollY();
  const disabled = prefersReducedMotion() || isCoarsePointer();

  if (disabled) return <div className={className}>{children}</div>;

  // Only the hero area needs this — skip work once scrolled far past it.
  // (window is undefined during prerender — guard it.)
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 0;
  const offset = viewportH > 0 && y < viewportH * 2 ? Math.min(y * speed, max) : 0;
  return (
    <div className={className} style={{ transform: `translate3d(0, ${offset.toFixed(1)}px, 0)` }}>
      {children}
    </div>
  );
};

export default Parallax;
