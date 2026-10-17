import { useEffect } from 'react';
import { prefersReducedMotion, isFinePointer } from './useScrollY';

// One delegated mousemove listener for the whole app (rAF-throttled).
// Sets --mx/--my CSS vars on the nearest .glass-glow ancestor so that card's
// specular highlight follows the cursor. GPU-cheap: no React re-renders,
// only CSS variable writes on the hovered card.
let installed = false;

export function useCursorGlow(): void {
  useEffect(() => {
    if (installed || typeof window === 'undefined') return;
    if (prefersReducedMotion() || !isFinePointer()) return;
    installed = true;

    let raf = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (pending) {
        const { el, x, y } = pending;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${Math.round(x - rect.left)}px`);
        el.style.setProperty('--my', `${Math.round(y - rect.top)}px`);
        pending = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest?.('.glass-glow') as HTMLElement | null;
      if (!card) return;
      pending = { el: card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
      installed = false;
    };
  }, []);
}
