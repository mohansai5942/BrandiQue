import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children?: React.ReactNode;
  className?: string;
  delay?: string; // e.g. "delay-100"
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delay = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) will-change-transform transform ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm'
      } ${className} ${isVisible ? delay : ''}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;