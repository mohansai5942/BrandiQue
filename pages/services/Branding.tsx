import React, { useState, useRef } from 'react';
import { ArrowRight, PenTool, Palette, Grid, Type, Diamond, Search, BookOpen, ShieldCheck, Star, TrendingUp } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const Branding: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable on mobile/tablet
    if (window.innerWidth < 1024) return;
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] pt-24 md:pt-28 lg:pt-36 transition-colors duration-300">
      <div className="relative w-full overflow-hidden bg-transparent py-8 md:py-12 lg:py-24">
         {/* Elegant Ambient Background */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[150px] animate-pulse-glow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]"></div>
            
            {/* Floating Design Icons */}
            {[PenTool, Palette, Grid, Type].map((Icon, i) => (
               <div 
                 key={i} 
                 className="absolute text-pink-500/10 animate-float"
                 style={{ 
                   top: `${15 + i * 25}%`, 
                   left: `${5 + (i % 2) * 85}%`, 
                   animationDelay: `${i * 1.2}s`,
                   transform: `rotate(${i * -15}deg) scale(${1 + i * 0.2})`
                 }}
               >
                 <Icon size={64} className="opacity-50 md:opacity-100 scale-75 md:scale-100" />
               </div>
            ))}
         </div>

         <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            
            {/* 1. Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
               
               {/* Left: Text Content */}
               <div className="order-2 lg:order-1">
                  <ScrollReveal>
                     <div className="overflow-hidden mb-2">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                           Branding & Identity
                        </h2>
                     </div>
                     
                     <div className="mb-4 md:mb-6">
                        <TextReveal text="Build a memorable, powerful brand presence" className="text-base md:text-lg lg:text-xl text-pink-400 font-medium" delay={300} />
                     </div>
                     
                     <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 font-light animate-fade-up delay-200 max-w-lg lg:max-w-none">
                        We create brand identities that stand out — logos, color systems, typography, 3D mockups, and a complete visual language that defines your business.
                     </p>

                     {/* Features List */}
                     <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                        {[
                          "3D mockups (cards, envelopes, packaging)",
                          "Logo design & redesign",
                          "Brand style guide",
                          "Business identity setup",
                          "Consistent visual systems"
                        ].map((feat, i) => (
                           <li key={i} className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: 'forwards' }}>
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                                 <Diamond size={8} className="md:w-[10px]" strokeWidth={3} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-xs md:text-xs lg:text-base">{feat}</span>
                           </li>
                        ))}
                     </ul>

                     <a 
                        href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20Branding%20service!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white transition-all shadow-lg hover:shadow-pink-500/40 group transform hover:-translate-y-1"
                     >
                        Start Branding <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
                     </a>
                  </ScrollReveal>
               </div>

               {/* Right: 3D Visual Composition - Scaled down for tablet */}
               <div 
                 className="order-1 lg:order-2 relative h-[350px] md:h-[400px] lg:h-[500px] w-full perspective-2000 group"
                 ref={containerRef}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={handleMouseLeave}
               >
                  <div 
                     className="relative w-full h-full transform-3d transition-transform duration-100 ease-linear preserve-3d"
                     style={{
                        transform: `rotateY(${mousePos.x * 12}deg) rotateX(${mousePos.y * -12}deg)`
                     }}
                  >
                     {/* Background Gradient Blob */}
                     <div 
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-pink-500/30 to-purple-600/30 rounded-full blur-[80px] -z-10"
                       style={{ transform: 'translateZ(-50px)' }}
                     />

                     {/* 1. Brand Book (Main Element) - Smaller dimensions on tablet */}
                     <div 
                       className="absolute top-[15%] left-[20%] w-[160px] h-[220px] md:w-[180px] md:h-[260px] lg:w-[240px] lg:h-[320px] bg-[#1a1a1a] rounded-r-xl md:rounded-r-2xl rounded-l-sm border border-white/10 shadow-2xl flex flex-col items-center justify-center transform-3d transition-transform duration-500"
                       style={{ transform: 'translateZ(20px) rotateY(-15deg)' }}
                     >
                        {/* Spine Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-black to-gray-800 rounded-l-sm"></div>
                        
                        {/* Logo Animation on Cover */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-3 md:mb-4">
                           <svg viewBox="0 0 100 100" className="w-full h-full stroke-pink-500 stroke-[4] fill-none drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                              <path d="M50 10 L90 90 L10 90 Z" className="animate-draw-path" strokeDasharray="300" strokeDashoffset="300" />
                           </svg>
                           {/* Fill Animation */}
                           <div className="absolute inset-0 bg-pink-500 [clip-path:polygon(50%_10%,90%_90%,10%_90%)] opacity-0 animate-fade-in delay-1000 mix-blend-overlay"></div>
                        </div>
                        <div className="text-gray-500 text-[8px] md:text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em]">Brand Guide</div>
                        <div className="text-white font-serif text-lg md:text-xl lg:text-2xl mt-1">2025</div>
                     </div>

                     {/* 2. Floating Business Card - Smaller on tablet */}
                     <div 
                       className="absolute bottom-[20%] right-[10%] md:right-[15%] w-[140px] h-[85px] md:w-[160px] md:h-[100px] lg:w-[200px] lg:h-[120px] bg-white text-black rounded-lg md:rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform-3d flex items-center justify-center overflow-hidden animate-float"
                       style={{ transform: 'translateZ(60px) rotateX(10deg) rotateZ(-5deg)' }}
                     >
                        <div className="absolute top-0 right-0 w-10 h-10 md:w-16 md:h-16 bg-pink-500 rounded-full blur-xl opacity-20"></div>
                        <div className="text-center">
                           <div className="text-lg md:text-xl lg:text-2xl font-bold font-serif">BQ</div>
                           <div className="text-[6px] md:text-[8px] uppercase tracking-wider text-gray-500 mt-0.5 md:mt-1">Agency</div>
                        </div>
                     </div>

                     {/* 3. Color Palette Swatches */}
                     <div 
                       className="absolute top-[10%] right-[5%] md:right-[10%] flex flex-col gap-1.5 md:gap-2 transform-3d"
                       style={{ transform: 'translateZ(40px)' }}
                     >
                        {['bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-gray-800'].map((color, i) => (
                           <div 
                             key={i} 
                             className={`w-8 h-2 md:w-10 md:h-2.5 lg:w-12 lg:h-3 rounded-full ${color} shadow-lg animate-slide-in-right border border-white/10`}
                             style={{ animationDelay: `${1.5 + i * 0.1}s`, animationFillMode: 'both' }}
                           ></div>
                        ))}
                     </div>

                     {/* 4. Typography Sample */}
                     <div 
                       className="absolute bottom-[10%] left-[5%] md:left-[10%] bg-white dark:bg-[#151A25]/90 backdrop-blur border border-gray-200 dark:border-white/10 p-3 md:p-3 lg:p-4 rounded-lg md:rounded-xl shadow-xl transform-3d animate-fade-up"
                       style={{ transform: 'translateZ(30px)', animationDelay: '1s' }}
                     >
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                           <Type size={12} className="md:w-[14px] text-pink-400" />
                           <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">Typography</span>
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                           <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-none">Aa</div>
                           <div className="text-[6px] md:text-[8px] text-gray-500 tracking-widest">INTER / SANS-SERIF</div>
                        </div>
                     </div>

                  </div>
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
            <div className="mb-20 md:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Our Branding Process</h3>
                     <div className="h-1 w-16 md:w-20 bg-pink-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
                     {/* Connector Line */}
                     <div className="hidden md:block absolute top-10 md:top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-pink-500/20 via-pink-500/50 to-pink-500/20 -z-10"></div>
                     
                     {[
                        { step: "01", title: "Research & Discovery", desc: "Understand your business, audience, competitors, and personality.", icon: Search },
                        { step: "02", title: "Visual Identity Creation", desc: "Logo design, typography, color palette, shapes, and brand elements.", icon: PenTool },
                        { step: "03", title: "Mockups & Delivery", desc: "3D mockups, style guide, usage rules, and identity setup.", icon: BookOpen }
                     ].map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                           <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 md:mb-6 shadow-xl group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                               <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-pink-500 text-white font-bold rounded-full flex items-center justify-center text-xs md:text-sm border-2 md:border-4 border-white dark:border-[#0A0C11]">
                                  {item.step}
                               </div>
                               <item.icon size={24} className="md:w-[32px] md:h-[32px] text-gray-400 group-hover:text-pink-400 transition-colors" />
                           </div>
                           <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{item.title}</h4>
                           <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>

            {/* 3. Why Branding Matters Block */}
            <div className="bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden group shadow-xl dark:shadow-none">
               {/* Hover Gradient Reveal */}
               <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
               
               <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                  <ScrollReveal>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Why Branding Matters?</h3>
                     <ul className="space-y-4 md:space-y-6">
                        {[
                           { title: "Trust", text: "Your brand is the first impression customers trust.", icon: ShieldCheck },
                           { title: "Credibility", text: "Professional branding builds credibility instantly.", icon: Star },
                           { title: "Recognition", text: "A strong identity increases recognition and sales.", icon: TrendingUp },
                           { title: "Value", text: "Consistent visuals across platforms create long-term brand value.", icon: Diamond }
                        ].map((item, i) => (
                           <li key={i} className="flex gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-pink-400 shrink-0 mt-1 border border-gray-200 dark:border-white/5 group-hover:border-pink-500/30 transition-colors">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-3xl opacity-30 animate-pulse-glow"></div>
                      <div className="absolute inset-4 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-sm">
                          <div className="text-center">
                             <Palette size={60} className="md:w-[80px] md:h-[80px] text-gray-300 dark:text-white/20 mx-auto mb-4" />
                             <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">Visual Impact</p>
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

export default Branding;