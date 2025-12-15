import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { X, Copy, Check, Share2, Heart, Download, Terminal, Sparkles, Layers, Cpu, Maximize2, Wand2, Command, Aperture } from 'lucide-react';

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (prompt) {
      document.body.style.overflow = 'hidden';
      // Reset states when prompt changes
      setImageLoaded(false); 
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [prompt]);

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const url = prompt.imageUrl;
    window.open(url, '_blank');
  };

  // Extract potential parameters (simple regex for --param value)
  const params = prompt.promptText.match(/--[a-zA-Z0-9]+(\s+[a-zA-Z0-9:.]+)?/g) || [];
  
  const displayImage = prompt.imageUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur and Noise */}
      <div 
        className="absolute inset-0 bg-white/90 dark:bg-[#05070A]/80 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#0A0C11] rounded-[20px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[85vh] lg:h-[85vh] animate-scale-in border border-gray-200 dark:border-white/10 group">
        
        {/* Glowing Border Gradient */}
        <div className="absolute inset-0 rounded-[20px] md:rounded-[32px] pointer-events-none border border-transparent dark:border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"></div>

        {/* Close Button (Mobile: Top Right, Desktop: Absolute) */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 md:p-2.5 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-white/10 backdrop-blur-md rounded-full text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:rotate-90 duration-300"
        >
          <X size={18} className="md:w-5 md:h-5" />
        </button>

        {/* --- LEFT: IMAGE SECTION --- */}
        <div className="w-full lg:w-[45%] h-[30vh] lg:h-auto bg-gray-100 dark:bg-[#05070A] relative flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10 shrink-0">
           {/* Background Blurred Image for Fill */}
           <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-125 saturate-150"
              style={{ backgroundImage: `url(${displayImage})` }}
           ></div>
           
           <div className="relative w-full h-full p-4 lg:p-8 flex items-center justify-center">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group/image h-full w-auto flex justify-center bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10">
                  {/* Loading Overlay */}
                  {!imageLoaded && (
                     <div className="absolute inset-0 bg-gray-100/80 dark:bg-[#151A25]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-neon-purple/30 border-t-neon-purple animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-purple dark:text-white animate-pulse" size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 tracking-widest uppercase animate-pulse">
                            Loading...
                        </span>
                     </div>
                  )}
                  
                  <img 
                    src={displayImage} 
                    alt={prompt.title} 
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-auto object-contain transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                  />
                  
                  {/* Image Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 md:p-6 z-10">
                      <div className="flex gap-2">
                         <button onClick={handleDownload} className="p-2 md:p-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/10 transition-all" title="Open Full Size">
                            <Maximize2 size={16} className="md:w-[18px] md:h-[18px]" />
                         </button>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold text-white">
                         <Aperture size={12} className="md:w-[14px] md:h-[14px] text-neon-purple" /> V6.0 Model
                      </div>
                  </div>
              </div>
           </div>
        </div>

        {/* --- RIGHT: CONTENT SECTION --- */}
        <div className="w-full lg:w-[55%] flex flex-col bg-white dark:bg-[#0A0C11] relative overflow-hidden">
           
           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 lg:p-10">
              
              {/* Header */}
              <div className="mb-6 md:mb-8">
                 <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4 animate-fade-up delay-100">
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
                        prompt.category === 'Men' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                        prompt.category === 'Women' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' :
                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                    }`}>
                      {prompt.category}
                    </span>
                    {prompt.style && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-medium">
                           <Wand2 size={10} className="md:w-3 md:h-3" /> {prompt.style}
                        </span>
                    )}
                 </div>

                 <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-2 md:mb-4 animate-fade-up delay-200">
                    {prompt.title}
                 </h2>
                 
                 <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500 animate-fade-up delay-300">
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <Heart size={14} className="md:w-4 md:h-4 text-red-500/80 fill-red-500/20" />
                       <span className="text-gray-700 dark:text-gray-300 font-bold">{prompt.likes}</span> <span className="hidden sm:inline">Likes</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <Layers size={14} className="md:w-4 md:h-4 text-blue-500 dark:text-blue-400" />
                       <span className="text-gray-700 dark:text-gray-300 font-bold">Midjourney v6</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <Cpu size={14} className="md:w-4 md:h-4 text-green-500 dark:text-green-400" />
                       <span className="text-gray-700 dark:text-gray-300 font-bold">Fast Gen</span>
                    </div>
                 </div>
              </div>

              {/* The Prompt Terminal */}
              <div className="mb-6 md:mb-8 animate-fade-up delay-500">
                 <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={12} className="md:w-[14px] md:h-[14px] text-neon-purple" /> Command Prompt
                    </h3>
                    <div className="flex gap-1.5 md:gap-2">
                        {params.slice(0, 2).map((p, i) => (
                           <span key={i} className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 font-mono">
                              {p}
                           </span>
                        ))}
                    </div>
                 </div>

                 <div className="relative group/terminal shadow-xl dark:shadow-none">
                    {/* Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl opacity-20 group-hover/terminal:opacity-40 blur transition duration-500"></div>
                    
                    <div className="relative bg-[#05070A] border border-white/10 rounded-xl p-0 overflow-hidden">
                       <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 bg-[#0F1320] border-b border-white/5">
                          <div className="flex gap-1.5">
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                          </div>
                          <div className="text-[9px] md:text-[10px] font-mono text-gray-600">bash</div>
                       </div>
                       <div className="p-3 md:p-5 font-mono text-xs md:text-sm leading-relaxed text-gray-300 break-words whitespace-pre-wrap">
                          <span className="text-neon-purple select-none">/imagine prompt: </span>
                          <span className="text-white">{prompt.promptText}</span>
                          <span className="inline-block w-1.5 h-3 md:w-2 md:h-4 bg-neon-purple/50 align-middle ml-1 animate-pulse"></span>
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* Footer Actions */}
           <div className="p-4 md:p-6 lg:p-8 bg-gray-50/50 dark:bg-[#0F1320]/50 border-t border-gray-200 dark:border-white/5 backdrop-blur-sm z-10 flex flex-col md:flex-row gap-3 md:gap-4 animate-fade-up delay-700 shrink-0">
              
              <button 
                 onClick={handleCopy}
                 className={`flex-1 relative py-3 md:py-4 px-6 md:px-8 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 overflow-hidden group/btn border
                    ${copied 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white dark:bg-white/5 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
              >
                 {copied ? <Check size={18} /> : <Copy size={18} />}
                 <span className="relative z-10">{copied ? "Copied" : "Copy"}</span>
              </button>

           </div>

        </div>

      </div>
    </div>
  );
};

export default PromptModal;