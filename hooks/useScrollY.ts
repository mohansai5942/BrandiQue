import { useEffect, useState } from 'react';

// One shared passive scroll listener for the whole app (parallax, navbar
// state, …). rAF-throttled: subscribers re-render at most once per frame
// while scrolling, and nothing runs when the page is idle.
let currentY = 0;
const subscribers = new Set<(y: number) => void>();
let ticking = false;

function handleScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    currentY = window.scrollY;
    subscribers.forEach((fn) => fn(currentY));
  });
}

if (typeof window !== 'undefined') {
  currentY = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
}

export function useScrollY(): number {
  const [y, setY] = useState(currentY);
  useEffect(() => {
    subscribers.add(setY);
    setY(window.scrollY);
    return () => {
      subscribers.delete(setY);
    };
  }, []);
  return y;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}
