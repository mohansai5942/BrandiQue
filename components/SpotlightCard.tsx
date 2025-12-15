import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

interface SpotlightCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ to, title, description, icon, delay }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Optimization: Skip calculation on mobile/tablet to save battery
    if (window.innerWidth < 1024) return;
    
    if (!cardRef.current || !spotlightRef.current || !borderRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM manipulation to avoid React re-renders
    requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(160, 32, 240, 0.15), transparent 40%)`;
      }
      if (borderRef.current) {
        borderRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(160, 32, 240, 0.4), transparent 40%)`;
      }
    });
  };

  return (
    <Link
      ref={cardRef}
      to={to}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-[24px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F1320] px-8 py-16 md:px-6 md:py-10 lg:px-8 lg:py-16 text-center shadow-xl dark:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group h-full block ${delay || ''} desktop-optimize-transform`}
    >
      {/* Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at center, rgba(160, 32, 240, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Border Glow Beam */}
      <div 
        ref={borderRef}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at center, rgba(160, 32, 240, 0.4), transparent 40%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          borderRadius: '24px',
          pointerEvents: 'none',
        }}
      >
        <div className="bg-gradient-to-r from-transparent via-neon-purple to-transparent h-full w-full opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 md:mb-4 lg:mb-6 inline-flex h-16 w-16 md:h-12 md:w-12 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 text-neon-purple shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-neon-purple group-hover:text-white group-hover:shadow-[0_0_25px_rgba(160,32,240,0.5)]">
           {/* Icon Reveal: Blur Pop-In handled by CSS transition on hover state logic above */}
           <div className="transition-all duration-300 group-hover:animate-wobble">
            {icon}
           </div>
        </div>

        <h3 className="mb-3 md:mb-2 lg:mb-3 text-2xl md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white relative inline-block">
          {title}
          {/* Neon Underline Glow */}
          <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-neon-purple shadow-[0_0_10px_#A020F0] transition-all duration-300 group-hover:w-full"></span>
        </h3>
        
        <p className="text-sm md:text-xs lg:text-sm leading-relaxed text-gray-500 dark:text-gray-400 transition-all duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-200 translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default SpotlightCard;