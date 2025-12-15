import React, { useRef, useEffect, useState } from 'react';

interface ViewOptimizerProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

const ViewOptimizer: React.FC<ViewOptimizerProps> = ({ children, className = '', threshold = 0.1 }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply logic on desktop to respect "Desktop Only" requirement
    if (window.innerWidth < 1024) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: 0, 
        rootMargin: '100px 0px' // Pre-load slightly before entering viewport
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} ${!isInView ? 'desktop-off-screen' : ''}`}
    >
      {children}
    </div>
  );
};

export default ViewOptimizer;