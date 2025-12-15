import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Shield, Zap, LayoutTemplate, Star, Rocket, Code, ArrowRight, Heart, Cpu, Globe, Palette, Monitor, Box, Terminal, Database, Smartphone, Layers, Command } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/TextReveal';
import ViewOptimizer from '../components/ViewOptimizer';

const TiltCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable on mobile/tablet
    if (window.innerWidth < 1024) return;
    
    if (!cardRef.current || !glowRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    const glowX = e.clientX - left;
    const glowY = e.clientY - top;

    // Direct DOM manipulation
    requestAnimationFrame(() => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;
        }
        if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(600px circle at ${glowX}px ${glowY}px, rgba(176, 38, 255, 0.15), transparent 40%)`;
        }
    });
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform group ${className} desktop-optimize-transform`}
    >
      <div 
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[inherit] z-0"
        style={{
          background: `radial-gradient(600px circle at center, rgba(176, 38, 255, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

const TechBadge = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-default">
    <Icon size={16} className="text-gray-500 dark:text-gray-400" />
    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{label}</span>
  </div>
);

const About: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-[1600px] mx-auto w-full relative overflow-hidden bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      
      {/* --- Ambient Background Effects --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
         <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[120px] animate-pulse-glow"></div>
         <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
         
         {/* Floating Elements - Optimized with ViewOptimizer wrapper effectively via parent container if needed, but handled globally via CSS class if applied */}
         <div className="absolute top-40 left-10 text-gray-400/20 dark:text-white/5 animate-float delay-700"><Box size={48} /></div>
         <div className="absolute bottom-40 right-10 text-gray-400/20 dark:text-white/5 animate-float delay-1000"><Globe size={64} /></div>
      </div>

      {/* 1. HERO SECTION (Untouched per instructions) */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-24 lg:mb-32 px-4 lg:px-12">
         
         {/* Left: Text Content */}
         <div className="text-center lg:text-left max-w-2xl order-2 lg:order-1 z-10">
            <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-6 shadow-sm dark:shadow-neon/10 mx-auto lg:mx-0 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase">Founder & Lead Developer</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                   Hello, I'm <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-blue-500 animate-gradient-x bg-[length:200%_auto]">Mohan.</span>
                </h1>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base lg:text-xl leading-relaxed font-light">
                   <p>
                      I am the founder of <strong className="text-black dark:text-white">BrandiQue Web Agency</strong>.
                   </p>
                   <p>
                      My focus is on creating professional, high-performance, and future-ready digital experiences. I combine <span className="text-neon-purple font-medium">brand identity</span>, <span className="text-blue-500 dark:text-blue-400 font-medium">UX</span>, and <span className="text-green-500 dark:text-green-400 font-medium">scalability</span> to deliver results.
                   </p>
                   
                   <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                      <TechBadge icon={Code} label="React/Next.js" />
                      <TechBadge icon={LayoutTemplate} label="WordPress" />
                      <TechBadge icon={Palette} label="UI/UX Design" />
                   </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   <Link to="/contact" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm md:text-base hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group">
                      Let's Talk <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                   <Link to="/services" className="px-8 py-4 bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-full font-bold text-sm md:text-base hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
                      View My Work
                   </Link>
                </div>
            </ScrollReveal>
         </div>

         {/* Right: Profile Image with Tech Frame */}
         <div className="relative group shrink-0 order-1 lg:order-2 z-10">
             {/* Decorative Rings */}
            <div className={`absolute inset-[-40px] border border-dashed border-gray-300 dark:border-white/5 rounded-full animate-[spin_20s_linear_infinite] ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}></div>
            <div className={`absolute inset-[-20px] border border-neon-purple/20 rounded-full animate-[spin_15s_linear_infinite_reverse] ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-300`}></div>
            
            {/* Center Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/30 to-blue-500/30 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            {/* Main Image */}
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-[8px] border-white dark:border-[#0A0C11] relative z-10 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white dark:bg-[#0A0C11] group-hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="https://files.catbox.moe/upp9cw.jpg" 
                  alt="Mohan - Founder" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-custom grayscale hover:grayscale-0" 
                />
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-4 -left-4 md:bottom-8 md:-left-8 bg-white/90 dark:bg-[#0A0C11]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-xl z-20 animate-float">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
                  <div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Visionary</div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white">Mohan</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. STATS STRIP - Optimized */}
      <ViewOptimizer>
      <div className="w-full border-y border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#0A0C11]/50 backdrop-blur-sm mb-24">
         <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-wrap justify-around gap-8">
            {[
               { label: "Projects Delivered", value: "100+", icon: Rocket },
               { label: "Client Satisfaction", value: "99%", icon: Star },
               { label: "Experience", value: "4+ Years", icon: Layers },
               { label: "Response Time", value: "< 2 Hrs", icon: Zap },
            ].map((stat, i) => (
               <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-neon-purple group-hover:bg-neon-purple/10 transition-all">
                     <stat.icon size={20} />
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">{stat.value}</div>
                     <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
      </ViewOptimizer>

      {/* 3. CORE PILLARS GRID (3D TILT) - Optimized */}
      <ViewOptimizer>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 lg:mb-32 px-4 lg:px-8">
         
         {/* Card 1 */}
         <ScrollReveal delay="delay-100" className="h-full">
            <TiltCard className="h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[32px] p-8 md:p-10 shadow-xl dark:shadow-2xl hover:shadow-[0_0_40px_rgba(176,38,255,0.1)] overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Shield size={120} className="text-black dark:text-white" />
               </div>
               
               <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-8 border border-neon-purple/20 shadow-[0_0_20px_rgba(176,38,255,0.2)]">
                  <Shield size={32} />
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What I Believe In</h3>
               
               <div className="space-y-4 relative z-10">
                  {[
                     { text: "Custom solutions, no templates", icon: Code },
                     { text: "Performance & UX first", icon: Zap },
                     { text: "Clean, scalable code", icon: Cpu },
                     { text: "Future-ready design", icon: Globe }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-purple group-hover/item:scale-150 transition-transform"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium group-hover/item:text-black dark:group-hover/item:text-white transition-colors">{item.text}</span>
                     </div>
                  ))}
               </div>
            </TiltCard>
         </ScrollReveal>

         {/* Card 2 */}
         <ScrollReveal delay="delay-200" className="h-full">
            <TiltCard className="h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[32px] p-8 md:p-10 shadow-xl dark:shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <LayoutTemplate size={120} className="text-black dark:text-white" />
               </div>

               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-8 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <LayoutTemplate size={32} />
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h3>
               
               <ul className="space-y-4 relative z-10">
                  {[
                     { label: "Full-Stack Development", sub: "React, Next.js, Node", icon: Monitor },
                     { label: "WordPress Development", sub: "Custom themes & plugins", icon: Database },
                     { label: "Branding & Identity", sub: "Logos, 3D mockups", icon: Palette },
                     { label: "Digital Marketing", sub: "Creatives & Strategy", icon: Rocket },
                  ].map((item, i) => (
                     <li key={i} className="flex items-start gap-3 group/item p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-default">
                        <item.icon size={18} className="text-blue-500 mt-0.5" />
                        <div>
                           <span className="block text-sm text-gray-900 dark:text-white font-bold">{item.label}</span>
                           <span className="block text-xs text-gray-500">{item.sub}</span>
                        </div>
                     </li>
                  ))}
               </ul>
            </TiltCard>
         </ScrollReveal>

         {/* Card 3 */}
         <ScrollReveal delay="delay-300" className="h-full">
            <TiltCard className="h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[32px] p-8 md:p-10 shadow-xl dark:shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Rocket size={120} className="text-black dark:text-white" />
               </div>

               <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 dark:text-green-400 mb-8 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <Rocket size={32} />
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h3>
               
               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  To empower businesses with digital tools that drive real growth. We don't just build websites; we build engines for revenue, engagement, and long-term success in an ever-evolving digital landscape.
               </p>

               <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                     <Star size={14} className="text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-bold text-gray-900 dark:text-white">Client-Centric Approach</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Zap size={14} className="text-neon-purple fill-neon-purple" />
                     <span className="text-xs font-bold text-gray-900 dark:text-white">Innovation First</span>
                  </div>
               </div>
            </TiltCard>
         </ScrollReveal>

      </div>
      </ViewOptimizer>
      
    </div>
  );
};

export default About;