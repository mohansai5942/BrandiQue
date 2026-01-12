
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Added 'Check' to the lucide-react imports to fix the undefined name error
import { ArrowRight, Trophy, Rocket, Clock, LayoutTemplate, Play, Code, PenTool, Megaphone, Zap, Cpu, Copy, Command, BarChart3, Fingerprint, Search, Globe, Layers, Hexagon, ShieldCheck, ZapIcon, Target, Check } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/TextReveal';
import SpotlightCard from '../components/SpotlightCard';
import ViewOptimizer from '../components/ViewOptimizer';

// --- DATA CONSTANTS ---

const STATS = [
  { label: "Projects Completed", value: "100+", icon: Rocket, color: "text-neon-purple" },
  { label: "Client Satisfaction", value: "99%", icon: Trophy, color: "text-neon-blue" },
  { label: "Fast Delivery", value: "7-14 Days", icon: Clock, color: "text-green-400" },
];

const ROTATING_WORDS = ["Digital Empires", "Intelligent Brands", "High-End Websites", "Future Tech"];

const TYPING_CODE = `const BrandiQue = {
  expertise: ['Web', 'AI', 'Brand'],
  mission: 'Build the Extraordinary',
  launch: async () => {
    await elevate(business);
  }
};`;

// --- MAIN COMPONENT ---

const Home: React.FC = () => {
  // Hero State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Parallax Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Rotating Text Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Code Typing Effect
  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= TYPING_CODE.length) {
        setTypedCode(TYPING_CODE.slice(0, charIndex));
        charIndex++;
      } else {
        setTimeout(() => { charIndex = 0; }, 5000); // Wait before restart
      }
    }, 50);
    
    const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
    }, 500);

    return () => {
        clearInterval(typeInterval);
        clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="flex flex-col pb-0 overflow-x-hidden bg-gray-50 dark:bg-[#05070A] relative text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-36 lg:pb-32 w-full overflow-hidden min-h-[90vh] md:min-h-0 lg:min-h-[95vh]"
      >
         <div className="absolute inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
             <div className="hidden lg:block">
               <div 
                  className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-neon-purple/20 dark:bg-neon-purple/10 rounded-full blur-[150px] animate-pulse-glow transition-transform duration-700 ease-out"
                  style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
               />
               <div 
                  className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[150px] transition-transform duration-700 ease-out"
                  style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
               />
             </div>
             <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 opacity-50"></div>
             {!isMobile && (
                 <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                 </div>
             )}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         </div>

         <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 lg:gap-12 items-center z-10 perspective-2000">
            <div className="space-y-6 md:space-y-8 relative z-20 text-left order-1">
                <div className="opacity-0 animate-fade-in flex justify-start" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                   <div className="inline-flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-default group shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                      <div className="relative flex h-1.5 w-1.5 md:h-2 md:h-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
                      </div>
                      <span className="text-[9px] md:text-[10px] lg:text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase group-hover:text-black dark:group-hover:text-white transition-colors">Accepting New Projects</span>
                   </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] text-gray-900 dark:text-white min-h-[3.3em] md:min-h-[auto]">
                   <div className="overflow-hidden pb-2 md:pb-4">
                      <span className="block animate-reveal-text origin-bottom" style={{ animationDelay: '50ms' }}>We Architect</span>
                   </div>
                   <div className="overflow-visible pb-2 md:pb-4 relative h-[1.4em]">
                      {ROTATING_WORDS.map((word, i) => (
                          <span 
                            key={i}
                            className={`absolute top-0 left-0 block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-blue-500 to-neon-pink animate-gradient-x bg-[length:200%_auto] transition-all duration-700 transform whitespace-nowrap pb-2 ${
                                i === currentWordIndex 
                                ? 'opacity-100 translate-y-0 filter-none' 
                                : 'opacity-0 translate-y-8 blur-sm pointer-events-none'
                            }`}
                          >
                             {word}.
                          </span>
                      ))}
                   </div>
                </h1>

                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base lg:text-xl max-w-lg leading-relaxed font-light border-l-2 border-gray-300 dark:border-white/10 pl-4 md:pl-5">
                   <TextReveal 
                     text="Merging code, creativity, and strategy to build digital experiences that define the future." 
                     delay={300}
                     className="block"
                   />
                </div>

                <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4 justify-start">
                    <Link 
                      to="/services" 
                      className="relative group overflow-hidden px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-sm lg:text-base hover:scale-105 transition-transform duration-300 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 animate-fade-up opacity-0"
                      style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <div className="absolute -inset-[100%] top-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                       <span className="relative z-10 flex items-center gap-2">
                         Start Project <ArrowRight size={16} className="md:w-[18px]" />
                       </span>
                    </Link>

                    <Link 
                      to="/web-development" 
                      className="px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full border border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white font-bold text-xs md:text-sm lg:text-base transition-all duration-300 flex items-center gap-2 group hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] animate-fade-up opacity-0"
                      style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                    >
                       Web Prices <Play size={12} className="fill-current group-hover:text-neon-blue transition-colors md:w-[14px]" />
                    </Link>
                </div>
                
                 <div className="hidden sm:flex pt-4 items-center gap-6 md:gap-8 border-t border-gray-200 dark:border-white/10 justify-start w-auto">
                    <div className="opacity-0 animate-fade-up" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 flex items-center gap-2">100+ <Rocket size={14} className="md:w-[16px] text-neon-purple" /></div>
                        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Projects Launched</div>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-gray-300 dark:bg-white/10 opacity-0 animate-fade-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}></div>
                    <div className="opacity-0 animate-fade-up" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 flex items-center gap-2">99% <Trophy size={14} className="md:w-[16px] text-neon-blue" /></div>
                        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Client Satisfaction</div>
                    </div>
                 </div>
            </div>

            <div className="relative block h-[350px] sm:h-[400px] md:h-[500px] lg:h-[650px] w-full opacity-0 animate-slide-in-blur order-2" style={{ perspective: isMobile ? 'none' : '1500px', animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <div 
                  className={`relative w-full h-full transition-transform duration-100 ease-linear ${!isMobile ? 'transform-3d preserve-3d' : ''}`}
                  style={!isMobile ? {
                     transform: `rotateY(${mousePos.x * 8}deg) rotateX(${mousePos.y * -8}deg)`
                  } : {}}
                >
                   <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-gradient-to-tr from-neon-purple/20 to-blue-500/20 rounded-full blur-[80px] md:blur-[100px] -z-10 transform-3d" style={{ transform: 'translateZ(-100px)' }}></div>
                   <div 
                     className={`absolute top-[5%] md:top-[10%] left-[2%] md:left-[5%] right-[2%] md:right-[5%] bottom-[10%] md:bottom-[15%] bg-[#0A0C11]/90 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden group transition-all duration-300 hover:border-white/20 ${!isMobile ? 'transform-3d' : ''}`}
                     style={!isMobile ? { transform: 'translateZ(0px)' } : {}}
                   >
                       <div className="h-8 md:h-10 border-b border-white/5 bg-[#0F1320] flex items-center px-3 md:px-4 justify-between relative">
                           <div className="flex gap-1.5 md:gap-2">
                               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
                               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
                               <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
                           </div>
                           <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
                              <Command size={10} className="text-white md:w-[12px]" />
                              <span className="text-[8px] md:text-[10px] text-white font-mono">brandique.config.ts</span>
                           </div>
                           <button className="group/copy relative p-1 md:p-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                               <Copy size={12} className="text-gray-500 group-hover/copy:text-white transition-colors relative z-10 md:w-[14px]" />
                               <div className="absolute inset-0 bg-neon-purple/80 rounded-md blur-[8px] opacity-0 group-hover/copy:opacity-100 group-hover/copy:animate-pulse transition-opacity"></div>
                           </button>
                       </div>
                       <div className="p-4 md:p-6 grid grid-cols-4 gap-4 h-full">
                           <div className="col-span-1 border-r border-white/5 pr-2 hidden sm:block">
                               <div className="flex flex-col gap-3 md:gap-4 text-gray-500">
                                   <Layers size={16} className="text-neon-purple md:w-[18px]" />
                                   <Search size={16} className="md:w-[18px]" />
                                   <Cpu size={16} className="md:w-[18px]" />
                                   <Globe size={16} className="md:w-[18px]" />
                               </div>
                           </div>
                           <div className="col-span-4 sm:col-span-3 font-mono text-[10px] md:text-xs lg:text-sm leading-relaxed relative">
                               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0C11] pointer-events-none opacity-50"></div>
                               <pre className="text-gray-300">
                                  <span className="text-pink-400">import</span> <span className="text-yellow-300">{`{ Future }`}</span> <span className="text-pink-400">from</span> <span className="text-green-400">'brandique'</span>;
                                  <br/><br/>
                                  {typedCode}
                                  <span className={`inline-block w-1.5 h-3 md:w-2 md:h-4 bg-neon-purple ml-1 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                               </pre>
                           </div>
                       </div>
                   </div>
                   <div 
                     className={`absolute top-[15%] md:top-[20%] -right-[2%] w-36 md:w-48 bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 p-3 md:p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 ${!isMobile ? 'transform-3d animate-float' : 'shadow-xl'}`}
                     style={!isMobile ? { transform: 'translateZ(60px)', animationDelay: '1s' } : {}}
                   >
                       <div className="flex justify-between items-start mb-2">
                           <div>
                               <div className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">Growth</div>
                               <div className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">+124%</div>
                           </div>
                           <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                               <BarChart3 size={12} className="md:w-[16px]" />
                           </div>
                       </div>
                       <div className="flex items-end gap-1 h-8 md:h-12 justify-between">
                           {[40, 70, 50, 90, 60, 80].map((h, i) => (
                               <div key={i} className="w-full bg-green-500/20 rounded-t-sm relative overflow-hidden h-full">
                                   <div 
                                     className="absolute bottom-0 left-0 w-full bg-green-500 rounded-t-sm transition-all duration-1000 ease-out" 
                                     style={{ height: `${h}%`, animation: `grow-up 1.5s ease-out forwards ${i * 0.1}s` }}
                                   ></div>
                               </div>
                           ))}
                       </div>
                   </div>
                   <div 
                     className={`absolute bottom-[15%] md:bottom-[20%] -left-[2%] md:-left-[5%] bg-white/90 dark:bg-[#0F1320]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 md:p-3 rounded-lg md:rounded-xl shadow-2xl transition-all duration-300 ${!isMobile ? 'transform-3d animate-float-fast' : ''}`}
                     style={!isMobile ? { transform: 'translateZ(40px) rotate(-5deg)', animationDelay: '0.5s' } : {}}
                   >
                       <div className="flex items-center gap-2 md:gap-3 mb-2">
                           <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neon-purple flex items-center justify-center text-white">
                               <Fingerprint size={12} className="md:w-[16px]" />
                           </div>
                           <div>
                               <div className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">Brand Identity</div>
                               <div className="text-[10px] md:text-xs font-bold text-gray-900 dark:text-white">Visual System</div>
                           </div>
                       </div>
                       <div className="flex gap-1 md:gap-1.5">
                           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-neon-purple shadow-sm"></div>
                           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-blue-500 shadow-sm"></div>
                           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-pink-500 shadow-sm"></div>
                           <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-black dark:bg-white shadow-sm"></div>
                       </div>
                   </div>
                   <div 
                     className={`absolute top-[2%] md:top-[5%] left-[8%] md:left-[10%] w-12 h-12 md:w-16 md:h-16 bg-[#0A0C11] border border-neon-blue/50 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.3)] flex items-center justify-center ${!isMobile ? 'transform-3d animate-pulse-glow' : ''}`}
                     style={!isMobile ? { transform: 'translateZ(80px)' } : {}}
                   >
                       <Hexagon size={24} className={`text-neon-blue md:w-[32px] ${!isMobile ? 'animate-spin-slow' : ''}`} />
                       <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[6px] md:text-[8px] font-bold text-white">AI</span>
                       </div>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* 2. SEO INFORMATIONAL SECTION (New Content for AdSense) */}
      <section className="px-4 md:px-6 py-16 md:py-24 bg-white dark:bg-[#0A0C11]/50 relative z-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Empowering Your Business Through Digital Excellence</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
                At BrandiQue Web Agency, we specialize in bridging the gap between sophisticated technology and impactful business goals. Our agency is a dedicated hub for high-end web development, creative branding, and results-driven digital marketing.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <ScrollReveal className="space-y-6" delay="delay-100">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Target className="text-neon-purple" /> Our Core Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our mission is simple: to help businesses scale in the modern digital landscape. We believe that a website should be more than just a digital brochure; it should be a powerful engine that drives leads, builds trust, and solidifies your brand authority. Whether you are an individual creator, a rising startup, or an established enterprise, we provide the tools and expertise to build an extraordinary online presence.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By leveraging cutting-edge frameworks like React and Next.js, along with robust content management systems like WordPress, we ensure your digital storefront is fast, secure, and infinitely scalable. We don't just write code; we architect solutions tailored to your unique market challenges.
              </p>
            </ScrollReveal>

            <ScrollReveal className="space-y-6" delay="delay-200">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <ShieldCheck className="text-neon-blue" /> Why Choose BrandiQue?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In a world full of generic templates, BrandiQue stands out by offering bespoke digital craftsmanship. We prioritize user experience (UX) and performance above all else. Every line of code is optimized for lightning-fast load times, and every visual element is designed to reflect your brand's core values.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Performance-First:</strong> We optimize for Core Web Vitals to ensure top-tier SEO rankings and user satisfaction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300"><strong>End-to-End Solutions:</strong> From initial wireframing and brand identity to post-launch marketing and maintenance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Innovative Tech:</strong> Integration of AI-driven features and modern animations to keep you ahead of the curve.</span>
                </li>
              </ul>
            </ScrollReveal>
          </div>

          <ScrollReveal delay="delay-300">
            <div className="bg-gray-100 dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">A Holistic Approach to Digital Growth</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-4xl mx-auto leading-relaxed">
                Digital success isn't just about having a pretty website. It's about a consistent visual identity that spans social media, a marketing strategy that reaches your ideal customers, and a technical foundation that never fails. At BrandiQue, we integrate these three pillars—Development, Branding, and Marketing—to create a seamless journey for your clients. We understand that your success is our success, which is why we offer dedicated support and transparent progress tracking throughout every project lifecycle.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. QUICK STATS */}
      <ViewOptimizer>
      <section className="px-3 md:px-6 pb-10 md:pb-12 lg:pb-20 max-w-[1200px] mx-auto w-full -mt-6 md:-mt-8 lg:-mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {STATS.map((stat, i) => (
               <ScrollReveal key={i} delay={`delay-${i * 50}`}>
                  <div className="bg-white/80 dark:bg-[#0F1320]/80 backdrop-blur-md border border-gray-200 dark:border-white/5 p-4 md:p-4 lg:p-6 rounded-xl md:rounded-xl lg:rounded-2xl flex items-center gap-3 md:gap-3 lg:gap-4 hover:border-gray-300 dark:hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg group">
                     <div className={`w-10 h-10 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-lg md:rounded-lg lg:rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center ${stat.color} border border-gray-100 dark:border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon size={20} className="md:w-5 md:h-5 lg:w-7 lg:h-7" />
                     </div>
                     <div>
                        <h3 className="text-lg md:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                        <p className="text-gray-500 text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                     </div>
                  </div>
               </ScrollReveal>
            ))}
         </div>
      </section>
      </ViewOptimizer>

      {/* 4. SERVICES HUB */}
      <ViewOptimizer>
      <section id="services-hub" className="px-4 md:px-6 py-12 md:py-12 lg:py-24 max-w-[1400px] mx-auto w-full">
         <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">Our Expertise</h2>
            <div className="h-1 w-16 md:w-20 lg:w-24 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto rounded-full mb-4 md:mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xs md:text-sm lg:text-base">We offer a comprehensive suite of digital services to elevate your brand.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-6 h-full">
            <div className="h-full">
              <SpotlightCard 
                to="/services/full-stack"
                title="Full-Stack Dev"
                description="Custom React & Next.js websites built for performance."
                icon={<Code size={24} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                delay="delay-0"
              />
            </div>
            <div className="h-full">
              <SpotlightCard 
                to="/services/wordpress"
                title="WordPress"
                description="Manageable, scalable sites with easy content updates."
                icon={<LayoutTemplate size={24} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                delay="delay-100"
              />
            </div>
            <div className="h-full">
              <SpotlightCard 
                to="/services/branding"
                title="Branding"
                description="Logos, identity, and visual systems that stand out."
                icon={<PenTool size={24} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                delay="delay-200"
              />
            </div>
            <div className="h-full">
              <SpotlightCard 
                to="/services/digital-marketing"
                title="Marketing"
                description="Social creatives and strategies to grow your reach."
                icon={<Megaphone size={24} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                delay="delay-300"
              />
            </div>
         </div>
         
         <div className="mt-8 md:mt-10 lg:mt-12 text-center">
             <Link to="/services" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs md:text-xs lg:text-sm font-bold uppercase tracking-wider group">
                View All Services Details <ArrowRight size={14} className="md:w-3 md:h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
         </div>
      </section>
      </ViewOptimizer>

      {/* 5. WEB DEV TEASER */}
      <ViewOptimizer>
      <section className="px-4 md:px-6 py-12 md:py-12 lg:py-20 bg-gradient-to-b from-gray-100 to-white dark:from-[#0A0C11] dark:to-[#05070A] border-y border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
         <div className="hidden lg:block absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 md:gap-10 lg:gap-16 items-center">
            <ScrollReveal>
               <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[10px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider mb-4 md:mb-4 lg:mb-6">
                  <Zap size={10} className="md:w-3 md:h-3" /> Web Development Packages
               </div>
               <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-4 lg:mb-6 text-gray-900 dark:text-white">Build Your Digital <br/><span className="text-gradient">Footprint.</span></h2>
               <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-6 lg:mb-8">
                  Whether you need a custom-coded masterpiece or a flexible WordPress site, we have transparent pricing packages tailored for individuals, startups, and enterprises.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link to="/web-development" className="px-6 py-3 md:px-5 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs md:text-xs lg:text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                     View Pricing Plans <ArrowRight size={16} className="md:w-[14px] lg:w-[18px]" />
                  </Link>
                  <div className="flex items-center justify-center gap-4 px-2 md:px-4 lg:px-6 text-[10px] md:text-xs lg:text-sm text-gray-500">
                     <span className="flex items-center gap-1"><Code size={12} className="md:w-[12px] lg:w-[14px]" /> React/Next.js</span>
                     <span className="w-1 h-1 bg-gray-400 dark:bg-gray-700 rounded-full"></span>
                     <span className="flex items-center gap-1"><LayoutTemplate size={12} className="md:w-[12px] lg:w-[14px]" /> WordPress</span>
                  </div>
               </div>
            </ScrollReveal>

            <ScrollReveal delay="delay-100">
               <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-6 lg:p-8 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-xl dark:shadow-none">
                      <div className="flex justify-between items-start mb-6 md:mb-6 lg:mb-8">
                         <div>
                            <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Starter Package</h3>
                            <p className="text-gray-500 text-xs md:text-xs lg:text-sm mt-1">Perfect for Personal Portfolios</p>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] md:text-[10px] lg:text-xs text-gray-400 line-through">₹17,000</p>
                             <p className="text-2xl md:text-2xl lg:text-3xl font-bold text-green-500 dark:text-green-400">₹9,000</p>
                         </div>
                      </div>
                      <div className="space-y-2 md:space-y-2 lg:space-y-3 mb-6 md:mb-6 lg:mb-8">
                         {['Custom Domain Setup', 'Mobile Responsive', 'SEO Basic Setup', 'Fast Loading Speed'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-xs md:text-xs lg:text-sm">
                               <div className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><Code size={10} className="md:w-2.5 lg:w-3" /></div>
                               {item}
                            </div>
                         ))}
                      </div>
                      <Link to="/web-development" className="block w-full py-2.5 md:py-2.5 lg:py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-center text-xs md:text-xs lg:text-sm font-bold text-gray-900 dark:text-white transition-colors">
                         Compare All Plans
                      </Link>
                  </div>
               </div>
            </ScrollReveal>
         </div>
      </section>
      </ViewOptimizer>

      {/* 6. ABOUT / PROCESS TEASER */}
      <ViewOptimizer>
      <section className="px-4 md:px-6 py-12 md:py-12 lg:py-20 bg-gray-100 dark:bg-[#0F1320]/30 border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
         <div className="max-w-[1000px] mx-auto text-center">
            <h2 className="text-2xl md:text-2xl lg:text-4xl font-bold mb-4 md:mb-4 lg:mb-6 text-gray-900 dark:text-white">How We Work</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-8 lg:mb-12 max-w-xl mx-auto text-xs md:text-sm lg:text-base">We believe in transparency and collaboration. Our process is designed to deliver results without the headache.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-8 mb-8 md:mb-8 lg:mb-12">
               {[
                  { title: "Discovery", desc: "We analyze your goals and market.", icon: Search },
                  { title: "Creation", desc: "We design and build with precision.", icon: PenTool },
                  { title: "Launch", desc: "We deploy and optimize for growth.", icon: Rocket },
               ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                     <div className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-3 md:mb-3 lg:mb-4 text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none">
                        <step.icon size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                     </div>
                     <h4 className="text-base md:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2">{step.title}</h4>
                     <p className="text-xs md:text-xs lg:text-sm text-gray-500">{step.desc}</p>
                  </div>
               ))}
            </div>

            <Link to="/about" className="text-xs md:text-xs lg:text-sm font-bold text-neon-purple hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest border-b border-neon-purple/30 pb-1 hover:border-black dark:hover:text-white">
               Read Our Story
            </Link>
         </div>
      </section>
      </ViewOptimizer>

    </div>
  );
};

export default Home;
