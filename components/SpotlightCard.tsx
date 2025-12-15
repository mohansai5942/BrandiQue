import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface SpotlightCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ to, title, description, icon, delay }) => {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <Link
      ref={divRef}
      to={to}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[24px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F1320] px-8 py-16 md:px-6 md:py-10 lg:px-8 lg:py-16 text-center shadow-xl dark:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group h-full block ${delay || ''}`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(160, 32, 240, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Border Glow Beam */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(160, 32, 240, 0.4), transparent 40%)`,
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