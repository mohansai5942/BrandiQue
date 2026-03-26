import React from 'react';
import { ArrowRight, Sparkles, Image, Video, TrendingUp } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const PROMPTS = [
  {
    title: "AI Image Prompts",
    description: "High-quality Midjourney and DALL-E prompts for stunning art.",
    icon: Image,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    title: "AI Video Prompts",
    description: "Sora and Runway Gen-2 prompts for cinematic AI videos.",
    icon: Video,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    title: "Trending Prompts",
    description: "Daily updated creative prompts for modern content creators.",
    icon: TrendingUp,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10"
  }
];

const PromptsSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0A0C11]/50 border-y border-gray-200 dark:border-white/5">
      <div className="max-w-[1500px] mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Creator <span className="text-neon-blue">Prompts.</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
              Daily AI image & video prompts for creators. Explore Midjourney, Sora, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROMPTS.map((prompt, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-[40px] bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-blue/5 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 text-neon-blue group-hover:scale-110 transition-transform duration-700">
                  <prompt.icon size={120} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className={`w-14 h-14 rounded-2xl ${prompt.bgColor} flex items-center justify-center ${prompt.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <prompt.icon size={28} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{prompt.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light">
                      {prompt.description}
                    </p>
                  </div>

                  <a 
                    href="https://creator.brandique.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-blue group-hover:gap-3 transition-all"
                  >
                    View Prompts <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PromptsSection;
