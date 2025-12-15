import React, { useState, useRef, useEffect } from 'react';
import { Prompt } from '../types';
import { Copy, Eye, Heart, Sparkles } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  style?: React.CSSProperties; 
  onClick?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, style, onClick }) => {
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    // Calculate rotation for 3D effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg tilt
    
    // Apply transform directly to avoid re-renders
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleMouseLeave = () => {
    setOpacity(0);
    // Reset transform
    if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-xl md:rounded-[14px] lg:rounded-[20px] bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 cursor-pointer overflow-hidden transition-all duration-200 ease-out will-change-transform shadow-md dark:shadow-none"
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      {/* Spotlight Effect Border */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-xl md:rounded-[14px] lg:rounded-[20px] opacity-0 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(176, 38, 255, 0.4), transparent 40%)`,
        }}
      />
      
      {/* Inner Content Container */}
      <div className="relative h-full bg-white dark:bg-[#0F1320] rounded-[10px] md:rounded-[13px] lg:rounded-[19px] p-2 md:p-3 lg:p-4 flex flex-col z-10 m-[1px] overflow-hidden">
        
        {/* Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Image Section */}
        <div className="relative aspect-[4/5] rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden mb-2 md:mb-3 lg:mb-4 bg-gray-100 dark:bg-[#05070A]">
          <img 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-custom group-hover:scale-110"
          />
          
          {/* Tags Overlay */}
          <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 lg:top-3 lg:left-3 flex gap-2">
            <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 lg:px-2.5 lg:py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-md md:rounded-md lg:rounded-lg text-[6px] md:text-[8px] lg:text-[10px] font-bold text-white uppercase tracking-wider">
              {prompt.category}
            </span>
          </div>

          {/* Likes Overlay - Only shows on hover */}
          <div className="hidden md:block absolute bottom-3 right-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 ease-custom">
             <div className="flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-medium">
                <Heart size={10} className="w-3 h-3 text-red-500 fill-red-500" /> {prompt.likes}
             </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-grow">
           <div className="flex justify-between items-start mb-1 md:mb-1.5 lg:mb-2">
              <h3 className="text-gray-900 dark:text-white font-bold text-[10px] md:text-xs lg:text-base leading-tight group-hover:text-neon-purple transition-colors duration-300 line-clamp-1 w-full">
                {prompt.title}
              </h3>
              {prompt.style && (
                <span className="hidden md:inline-block text-[10px] text-gray-500 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded uppercase">{prompt.style}</span>
              )}
           </div>
           
           <p className="text-gray-500 dark:text-gray-400 text-[8px] md:text-[10px] lg:text-xs leading-relaxed line-clamp-2 mb-2 md:mb-3 lg:mb-4 font-light min-h-[2em] md:min-h-[2.5em] hidden sm:block">
             {prompt.description}
           </p>

           {/* Action Footer */}
           <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1 text-[8px] md:text-[10px] lg:text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                 <Eye size={10} className="md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" /> <span className="hidden md:inline">View</span>
              </div>
              
              <button 
                onClick={handleCopy}
                className={`flex items-center justify-center gap-1 md:gap-1 lg:gap-1.5 px-2 py-1 md:px-2 md:py-1 lg:px-3 lg:py-1.5 rounded-md md:rounded-md lg:rounded-lg text-[8px] md:text-[10px] lg:text-xs font-bold transition-all duration-300 ${
                  copied 
                  ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-neon-purple hover:text-white hover:shadow-[0_0_15px_rgba(176,38,255,0.4)]'
                }`}
              >
                {copied ? <Sparkles size={8} className="md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" /> : <Copy size={8} className="md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" />}
                {copied ? 'Copied' : <span className="hidden md:inline">Copy</span>}
                {!copied && <span className="md:hidden">Copy</span>}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;