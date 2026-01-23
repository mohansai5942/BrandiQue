import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Grid, LayoutGrid, X, Info } from 'lucide-react';
import PromptCard from '../components/PromptCard';
import ScrollReveal from '../components/ScrollReveal';
import PromptModal from '../components/PromptModal';
import { CategoryType, Prompt } from '../types';
import { usePrompts } from '../context/PromptContext';

interface CategoryPageProps {
  category: CategoryType;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { prompts } = usePrompts();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchCategory = category === 'All' ? true : prompt.category === category;
    const matchSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prompt.style?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-[1800px] mx-auto w-full relative overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
         {/* Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[150px] animate-pulse-glow"></div>
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10 lg:mb-12 relative z-10">
         <ScrollReveal>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-4 md:mb-5 lg:mb-6 shadow-sm dark:shadow-neon/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default animate-fade-in">
                 <Sparkles size={14} className="text-neon-purple animate-pulse" />
                 <span className="text-[10px] md:text-[10px] lg:text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase">
                    {category === 'All' ? 'Premium Collection' : `${category} Series`}
                 </span>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-5 lg:mb-6 text-gray-900 dark:text-white tracking-tight leading-tight animate-reveal-text">
               {category === 'All' ? (
                 <>Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-neon-blue animate-gradient-x bg-[length:200%_auto]">Masterpieces</span></>
               ) : (
                 <>{category} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-neon-blue animate-gradient-x bg-[length:200%_auto]">Edition</span></>
               )}
             </h1>
             
             <div className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-xl max-w-2xl mx-auto leading-relaxed font-light animate-fade-up delay-200 space-y-4">
               <p>
                 Discover our dedicated {category} collection, featuring the most effective image prompts for leading AI generative models. Whether you are using ChatGPT's DALL-E, Midjourney, or Google's latest Gemini models, these prompts provide the precise technical direction needed to generate high-quality art.
               </p>
               <p className="text-xs md:text-sm font-medium border-t border-gray-200 dark:border-white/5 pt-4 flex items-center justify-center gap-2">
                 <Info size={14} className="text-neon-purple" />
                 This collection focuses on {category}-specific visual styles, ensuring consistent character portrayal and environmental context for your projects.
               </p>
             </div>
         </ScrollReveal>
      </div>

      {/* Sticky Control Dock */}
      <div className="sticky top-24 z-40 mb-6 md:mb-8 lg:mb-10 px-0 md:px-2">
         <div className="max-w-[1400px] mx-auto w-full">
            <div className="bg-white/80 dark:bg-[#0A0C11]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] animate-fade-up delay-300">
               
               {/* Navigation Tabs */}
               <div className="flex p-1 bg-gray-100 dark:bg-[#151A25]/50 rounded-xl overflow-x-auto max-w-full no-scrollbar w-full md:w-auto border border-gray-200 dark:border-white/5">
                  {['All', 'Men', 'Women', 'Couple'].map((tab) => {
                     const isActive = category === tab;
                     return (
                       <Link 
                          key={tab}
                          to={tab === 'All' ? '/ai-prompts' : `/${tab.toLowerCase()}`}
                          className={`relative flex-1 md:flex-none px-4 py-2 md:px-4 md:py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs md:text-xs lg:text-sm font-bold transition-all duration-300 whitespace-nowrap text-center overflow-hidden group ${
                             isActive 
                             ? 'text-white shadow-lg' 
                             : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
                          }`}
                       >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-100 rounded-lg"></div>
                          )}
                          <span className="relative z-10 flex items-center gap-2 justify-center">
                            {tab}
                          </span>
                       </Link>
                     );
                  })}
               </div>

               {/* Search & View Controls */}
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative group flex-grow md:w-60 lg:w-72">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-purple transition-colors" size={14} />
                     <input 
                       type="text" 
                       placeholder="Search prompts..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-gray-100 dark:bg-[#151A25]/50 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white text-xs md:text-xs lg:text-sm 
                                  focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)]
                                  transition-all placeholder:text-gray-500"
                     />
                     {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white">
                            <X size={12} />
                        </button>
                     )}
                  </div>
                  
                  <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-[#151A25]/50 p-1 rounded-xl border border-gray-200 dark:border-white/5">
                     <button 
                       onClick={() => setViewMode('grid')}
                       className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                       title="Grid View"
                     >
                        <LayoutGrid size={16} />
                     </button>
                     <button 
                       onClick={() => setViewMode('compact')}
                       className={`p-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        title="Compact View"
                     >
                        <Grid size={16} />
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>

      {/* Results Grid */}
      <div className="min-h-[400px] max-w-[1400px] mx-auto">
        {filteredPrompts.length > 0 ? (
           <div className={`grid gap-4 md:gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'}`}>
              {filteredPrompts.map((prompt, idx) => (
                 <ScrollReveal key={prompt.id} delay={`delay-${(idx % 10) * 50}`}>
                    <PromptCard 
                      prompt={prompt} 
                      onClick={() => setSelectedPrompt(prompt)}
                      style={{ height: '100%' }}
                    />
                 </ScrollReveal>
              ))}
           </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-32 text-center rounded-[32px] border border-dashed border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm animate-fade-up">
               <div className="w-24 h-24 bg-white dark:bg-[#0A0C11] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/5 group">
                  <Search size={32} className="text-gray-400 group-hover:text-neon-purple transition-colors duration-500" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
               <p className="text-gray-500 max-w-sm mx-auto mb-8">We couldn't find any prompts matching "{searchTerm}".</p>
               <button 
                 onClick={() => setSearchTerm('')}
                 className="px-8 py-3 rounded-xl bg-neon-purple text-white font-bold hover:bg-purple-600 transition-all shadow-neon hover:shadow-neon-strong"
               >
                 Clear Search
               </button>
           </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-500 text-xs md:text-xs lg:text-sm mb-4">Showing {filteredPrompts.length} result{filteredPrompts.length !== 1 && 's'}</p>
          <div className="w-2 h-2 bg-gray-300 dark:bg-white/10 rounded-full mx-auto"></div>
      </div>

      {/* Modal - Same as Home */}
      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />

    </div>
  );
};

export default CategoryPage;