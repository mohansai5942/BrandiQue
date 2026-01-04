import React, { useState } from 'react';
import { Search, Sparkles, LayoutGrid, Grid, X } from 'lucide-react';
import PromptCard from '../components/PromptCard';
import ScrollReveal from '../components/ScrollReveal';
import PromptModal from '../components/PromptModal';
import { Prompt } from '../types';
import { PROMPTS_DATA } from '../constants';

const Prompts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  // Filter prompts based on search
  const filteredPrompts = PROMPTS_DATA.filter(prompt => {
    return (
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-[1800px] mx-auto w-full relative overflow-hidden transition-colors duration-300">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[150px] animate-pulse-glow"></div>
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 relative z-10">
         <ScrollReveal>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-6 shadow-sm dark:shadow-neon/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default">
                 <Sparkles size={14} className="text-neon-purple animate-pulse" />
                 <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase">AI Creative Prompts</span>
             </div>
             
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight leading-tight">
               Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-neon-blue animate-gradient-x bg-[length:200%_auto]">Inspiration</span>
             </h1>
             
             <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
               A curated collection of high-fidelity image prompts for Midjourney, ChatGPT, and Gemini. Ready to be copied and used for your next project.
             </p>
         </ScrollReveal>
      </div>

      {/* Control Bar */}
      <div className="sticky top-24 z-40 mb-8 px-2 max-w-[1400px] mx-auto w-full">
         <div className="bg-white/80 dark:bg-[#0A0C11]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:border-gray-300 dark:hover:border-white/20">
            
            {/* Search Input */}
            <div className="relative group w-full md:max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-purple transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search prompts by title, category, style..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-gray-100 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all placeholder:text-gray-500"
               />
               {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white">
                      <X size={14} />
                  </button>
               )}
            </div>

            {/* View Controls */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-[#151A25]/50 p-1 rounded-xl border border-gray-200 dark:border-white/5">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                 title="Grid View"
               >
                  <LayoutGrid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('compact')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                  title="Compact View"
               >
                  <Grid size={18} />
               </button>
            </div>

         </div>
      </div>

      {/* Prompts Grid */}
      <div className="max-w-[1400px] mx-auto min-h-[400px]">
        {filteredPrompts.length > 0 ? (
           <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'}`}>
              {filteredPrompts.map((prompt, idx) => (
                 <ScrollReveal key={prompt.id} delay={`delay-${(idx % 10) * 50}`}>
                    <PromptCard 
                      prompt={prompt as any} 
                      onClick={() => setSelectedPrompt(prompt as any)}
                      style={{ height: '100%' }}
                    />
                 </ScrollReveal>
              ))}
           </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-32 text-center rounded-[32px] border border-dashed border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
               <div className="w-20 h-20 bg-white dark:bg-[#0A0C11] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/5">
                  <Search size={32} className="text-gray-400" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No prompts found</h3>
               <p className="text-gray-500 max-w-sm mx-auto mb-8">We couldn't find any results matching your search criteria.</p>
               <button 
                 onClick={() => setSearchTerm('')}
                 className="px-8 py-3 rounded-xl bg-neon-purple text-white font-bold hover:bg-purple-600 transition-all shadow-neon"
               >
                 Show All Prompts
               </button>
           </div>
        )}
      </div>

      {/* Modal for Prompt Details */}
      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />

    </div>
  );
};

export default Prompts;