import React from 'react';

const TAGS = [
  "Cyberpunk", "Portrait", "Landscape", "Abstract", "Realistic", 
  "Anime", "3D Render", "Oil Painting", "Watercolor", "Sketch",
  "Cinematic", "Studio Lighting", "Neon", "Retro", "Vintage",
  "Sci-Fi", "Fantasy", "Surreal", "Minimalist", "Pop Art"
];

const Marquee: React.FC = () => {
  return (
    <div className="relative flex overflow-x-hidden border-y border-white/5 bg-[#0A0C11]/50 py-3 backdrop-blur-sm mb-12">
      {/* Alpha Mask for Fade Effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0A0C11] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0A0C11] to-transparent"></div>

      <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
        {/* Double the list for seamless loop */}
        {[...TAGS, ...TAGS].map((tag, index) => (
          <span 
            key={index} 
            className="text-xs font-medium text-gray-500 uppercase tracking-widest hover:text-neon-purple transition-colors cursor-default"
          >
            # {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;