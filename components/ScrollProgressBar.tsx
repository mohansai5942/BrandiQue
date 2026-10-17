import React, { useEffect, useState } from 'react';
import { useScrollY, prefersReducedMotion } from '../hooks/useScrollY';

/** Thin yellow scroll-progress bar fixed to the top. Transform-only (scaleX). */
const ScrollProgressBar: React.FC = () => {
  const y = useScrollY();
  const [progress, setProgress] = useState(0);
  const [reduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (reduced) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? Math.min(y / max, 1) : 0);
  }, [y, reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
