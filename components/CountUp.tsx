import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: string; // e.g. "14+", "100%"
  duration?: number; // ms
  className?: string;
}

// Only animates plain numeric values with a + or % suffix ("14+", "100%").
// Anything else ("3-in-1") renders statically — never invent animation.
const ANIMATABLE = /^(\d+(?:\.\d+)?)(\+|%)$/;

/** Counts a stat number up from 0 when scrolled into view. GPU-cheap: text only. */
const CountUp: React.FC<CountUpProps> = ({ value, duration = 1200, className = '' }) => {
  const match = value.match(ANIMATABLE);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || !ref.current) return;
    const target = parseFloat(match[1]);
    const suffix = match[2];
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo
          setDisplay(`${t === 1 ? target : Math.round(target * eased)}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
