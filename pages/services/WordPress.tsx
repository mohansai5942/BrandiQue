import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, LayoutTemplate, Settings, FileText, Globe, Users, Grid, MousePointer2, Map, Layers, ShieldCheck, Edit3, TrendingUp, Palette } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const WordPress: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  
  useEffect(() => {
    const text = "Welcome to my website...";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => { index = 0; }, 2000); // Loop
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] pt-24 md:pt-28 lg:pt-36 transition-colors duration-300">
      <div className="relative w-full overflow-hidden bg-transparent py-8 md:py-12 lg:py-24">
         {/* Background Ambience */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse-glow"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
            {/* Floating Plugin Icons */}
            {[LayoutTemplate, Settings, FileText, Globe].map((Icon, i) => (
               <div 
                 key={i} 
                 className="absolute text-blue-500/10 animate-float"
                 style={{ 
                   top: `${20 + i * 20}%`, 
                   right: `${10 + (i % 2) * 80}%`, 
                   animationDelay: `${i}s`,
                   transform: `rotate(${i * 15}deg)`
                 }}
               >
                 <Icon size={48} className="scale-75 md:scale-75 lg:scale-100" />
               </div>
            ))}
         </div>

         <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            
            {/* 1. Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
               
               {/* Left: Dashboard Simulation - Scaled down for tablet */}
               <div className="relative perspective-2000 group w-full max-w-[340px] md:max-w-[420px] lg:max-w-none mx-auto lg:mx-0">
                  <ScrollReveal>
                     {/* Added 'lg:' prefix to hover effects to disable 3D rotate on mobile/tablet */}
                     <div className="relative transform transition-transform duration-700 lg:hover:rotate-y-3 lg:hover:rotate-x-3 preserve-3d">
                        
                        {/* Laptop Mockup Body */}
                        <div className="bg-[#151A25] rounded-t-xl border border-white/10 shadow-2xl p-1 relative z-20 w-full mx-auto lg:mx-0">
                           {/* Screen */}
                           <div className="bg-[#0F1320] rounded-lg overflow-hidden border border-white/5 aspect-[16/10] relative grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr] lg:grid-cols-[60px_1fr]">
                              
                              {/* WP Sidebar */}
                              <div className="bg-[#1a1d26] border-r border-white/5 py-2 md:py-3 flex flex-col items-center gap-2 md:gap-3">
                                 <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-blue-500 flex items-center justify-center mb-1 md:mb-2 animate-spin-slow" style={{ animationDuration: '10s' }}>
                                    <LayoutTemplate size={12} className="text-white md:w-[14px]" />
                                 </div>
                                 {[FileText, Palette, Settings, Users, Grid].map((Icon, i) => (
                                    <div key={i} className={`w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-blue-500/10 hover:text-blue-400 transition-colors ${i===1 ? 'bg-blue-500/10 text-blue-400' : ''}`}>
                                       <Icon size={12} className="md:w-[14px]" />
                                    </div>
                                 ))}
                              </div>

                              {/* WP Content Area */}
                              <div className="p-3 md:p-4 bg-[#0A0C11] relative">
                                 {/* Top Bar */}
                                 <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2">
                                       <h4 className="text-[8px] md:text-[10px] font-bold text-white">Edit Page</h4>
                                       <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[6px] md:text-[8px]">Draft</span>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-blue-500 text-white text-[6px] md:text-[8px] font-bold">Update</div>
                                 </div>

                                 {/* Editor Simulation */}
                                 <div className="space-y-2 md:space-y-3">
                                    {/* Title Block */}
                                    <div className="h-6 md:h-8 w-3/4 border border-white/5 rounded bg-[#151A25] flex items-center px-3 text-[8px] md:text-[10px] text-white">
                                       {typedText}<span className="inline-block w-0.5 h-3 bg-blue-500 ml-1 animate-pulse"></span>
                                    </div>
                                    
                                    {/* Drag & Drop Animation Container */}
                                    <div className="relative h-24 md:h-32 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center bg-[#151A25]/50 overflow-hidden">
                                       <span className="text-[8px] md:text-[10px] text-gray-600">Drag blocks here</span>
                                       
                                       {/* Flying Block Animation */}
                                       <div className="absolute top-1/2 left-1/2 w-16 h-12 md:w-24 md:h-16 bg-[#1a1d26] border border-blue-500/50 rounded shadow-xl flex flex-col items-center justify-center gap-1 z-10 animate-scale-in" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}>
                                          <div className="w-6 h-4 md:w-8 md:h-6 bg-gray-700 rounded-sm"></div>
                                          <div className="h-0.5 md:h-1 w-8 md:w-12 bg-gray-600 rounded"></div>
                                          <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                              <MousePointer2 size={6} className="md:w-[8px]" />
                                          </div>
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                       <div className="h-8 md:h-12 bg-[#151A25] rounded border border-white/5"></div>
                                       <div className="h-8 md:h-12 bg-[#151A25] rounded border border-white/5"></div>
                                    </div>
                                 </div>
                              </div>

                              {/* Sidebar Panels Popup Animation */}
                              <div className="absolute top-10 right-2 md:right-4 w-24 md:w-32 bg-[#1a1d26] border border-white/10 rounded-lg shadow-xl p-2 flex flex-col gap-2 animate-fade-in delay-500">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[6px] md:text-[8px] text-white font-bold">Block Settings</span>
                                    <Settings size={8} className="text-gray-500" />
                                  </div>
                                  <div className="h-1 w-full bg-white/10 rounded">
                                    <div className="h-full w-2/3 bg-blue-500 rounded"></div>
                                  </div>
                                  <div className="flex gap-1">
                                    <div className="h-3 w-3 md:h-4 md:w-4 rounded bg-white/5 border border-white/10"></div>
                                    <div className="h-3 w-3 md:h-4 md:w-4 rounded bg-blue-500 border border-blue-400"></div>
                                    <div className="h-3 w-3 md:h-4 md:w-4 rounded bg-white/5 border border-white/10"></div>
                                  </div>
                              </div>
                           </div>
                        </div>
                        
                        {/* Laptop Base */}
                        <div className="h-2 md:h-3 w-full max-w-[360px] md:max-w-[440px] lg:max-w-[550px] mx-auto bg-[#0F1320] rounded-b-xl border-t border-white/5 shadow-2xl relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 md:w-16 h-1 bg-white/10 rounded-b-md"></div>
                        </div>

                        {/* Glow Effect Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[60px] md:blur-[80px] -z-10 rounded-full"></div>
                     </div>
                  </ScrollReveal>
               </div>

               {/* Right: Text Content */}
               <div>
                  <ScrollReveal delay="delay-100">
                     <div className="overflow-hidden mb-2">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                           WordPress Web Development
                        </h2>
                     </div>
                     
                     <div className="mb-4 md:mb-6">
                        <TextReveal text="Fast, flexible, scalable websites with easy content management" className="text-base md:text-lg lg:text-xl text-blue-400 font-medium" delay={300} />
                     </div>
                     
                     <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 font-light animate-fade-up delay-200">
                        We build powerful WordPress websites that are easy to edit, secure, fast-loading, and optimized for business growth. Perfect for clients who want control without touching the code.
                     </p>

                     {/* Features List */}
                     <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                        {[
                          "Custom WordPress sections",
                          "Theme modifications",
                          "Faster deployments",
                          "SEO-friendly structure",
                          "Easy-to-manage admin panel"
                        ].map((feat, i) => (
                           <li key={i} className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: 'forwards' }}>
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                 <Check size={10} className="md:w-[12px]" strokeWidth={3} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-xs md:text-xs lg:text-base">{feat}</span>
                           </li>
                        ))}
                     </ul>

                     <a 
                        href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20Wordpress%20website!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-lg hover:shadow-blue-500/40 group transform hover:-translate-y-1"
                     >
                        Start WP Project <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
                     </a>
                  </ScrollReveal>
               </div>
            </div>
            
<div className="my-10">
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-format="fluid"
    data-ad-layout-key="-ef+6k-30-ac+ty"
    data-ad-client="ca-pub-9587188804206049"
    data-ad-slot="2366860495"
  ></ins>
</div>

            {/* 2. Process Section */}
            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">How We Build Your WordPress Website</h3>
                     <div className="h-1 w-16 md:w-20 bg-blue-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
                     {/* Connector Line */}
                     <div className="hidden md:block absolute top-10 md:top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-blue-500/20 -z-10"></div>
                     
                     {[
                        { step: "01", title: "Plan the Structure", desc: "Define your pages, layout, and brand requirements.", icon: Map },
                        { step: "02", title: "Build with Custom Blocks", desc: "We use page builders, custom blocks, and optimized themes.", icon: Layers },
                        { step: "03", title: "Optimize, Secure & Deliver", desc: "Speed, SEO, backups, security, and training for easy updates.", icon: ShieldCheck }
                     ].map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                           <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 md:mb-6 shadow-xl group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                               <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-xs md:text-sm border-2 md:border-4 border-white dark:border-[#0A0C11]">
                                  {item.step}
                               </div>
                               <item.icon size={24} className="md:w-[32px] md:h-[32px] text-gray-400 group-hover:text-blue-400 transition-colors" />
                           </div>
                           <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{item.title}</h4>
                           <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                     ))}
                  </div>

                  <div className="text-center mt-8 md:mt-12">
                     <p className="text-gray-500 text-xs md:text-sm italic">“You get full control — edit content anytime without developer help.”</p>
                  </div>
               </ScrollReveal>
            </div>

            {/* 3. Why WordPress Block */}
            <div className="bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden group shadow-xl dark:shadow-none">
               {/* Hover Gradient Reveal */}
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
               
               <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                  <ScrollReveal>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Why Choose WordPress?</h3>
                     <ul className="space-y-4 md:space-y-6">
                        {[
                           { title: "Market Leader", text: "WordPress powers over 40% of the internet.", icon: Globe },
                           { title: "Zero Coding", text: "Easy editing — no coding required for content updates.", icon: Edit3 },
                           { title: "Limitless", text: "Thousands of plugins expand functionality instantly.", icon: Grid },
                           { title: "Growth Ready", text: "SEO-friendly structure and highly scalable architecture.", icon: TrendingUp }
                        ].map((item, i) => (
                           <li key={i} className="flex gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-blue-400 shrink-0 mt-1 border border-gray-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                                 <item.icon size={16} className="md:w-[20px] md:h-[20px]" />
                              </div>
                              <div>
                                 <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-0.5 md:mb-1">{item.title}</h4>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{item.text}</p>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </ScrollReveal>

                  <div className="relative h-full min-h-[250px] md:min-h-[300px] hidden md:block">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-3xl opacity-30 animate-pulse-glow"></div>
                      <div className="absolute inset-4 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-sm">
                          <div className="text-center">
                             <LayoutTemplate size={60} className="md:w-[80px] md:h-[80px] text-gray-300 dark:text-white/20 mx-auto mb-4" />
                             <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">CMS Powerhouse</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WordPress;