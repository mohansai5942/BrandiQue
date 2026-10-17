import { founder, COMPANY } from '../seo/site';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Shield, Zap, LayoutTemplate, Star, Rocket, Code, ArrowRight, Heart, Cpu, Globe, Palette, Monitor, Box, Terminal, Database, Smartphone, Layers, Command, Target, ZapIcon, Info, Bot, Share2, PenTool } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero from '../components/ui/PageHero';
import TextReveal from '../components/TextReveal';
import ViewOptimizer from '../components/ViewOptimizer';

const TiltCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (!cardRef.current || !glowRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    const glowX = e.clientX - left;
    const glowY = e.clientY - top;

    requestAnimationFrame(() => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;
        }
        if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(600px circle at ${glowX}px ${glowY}px, rgba(234, 179, 8, 0.15), transparent 40%)`;
        }
    });
  };

  const handleMouseLeave = () => {
    if (cardRef.current) { cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'; }
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`relative transition-transform duration-200 ease-out will-change-transform group ${className} desktop-optimize-transform`}>
      <div ref={glowRef} className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[inherit] z-0" style={{ background: `radial-gradient(600px circle at center, rgba(234, 179, 8, 0.15), transparent 40%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

const TechBadge = ({ icon: Icon, label, color = 'purple' }: { icon: any, label: React.ReactNode, color?: 'purple' | 'blue' }) => (
  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-default shadow-sm shrink-0 whitespace-nowrap">
    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${color === 'blue' ? 'text-blue-500 dark:text-blue-400' : 'text-neon-purple'} shrink-0`} />
    <span className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-mono font-bold whitespace-nowrap">{label}</span>
  </div>
);

const About: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen pb-12 md:pb-20 w-full relative overflow-hidden bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      <PageHero
        eyebrow="About BrandiQue"
        eyebrowIcon={Sparkles}
        title="The team behind"
        highlight="your growth."
        description="BrandiQue Web Solutions is a Visakhapatnam studio for websites, AI agents and automations, and graphic design. A small, accountable team that treats your business like our own."
      />
      <div className="mx-auto w-full max-w-[100rem] px-5 md:px-8 desk:px-12 2xl:px-16 pt-6">
      
      {/* 1. HERO SECTION - MOHAN */}
      <section id="founder" className="flex flex-col desk:flex-row items-center justify-between gap-5 md:gap-12 desk:gap-20 mb-8 sm:mb-12 md:mb-16 desk:mb-20 px-4 desk:px-12 relative z-10">
         <div className="text-center desk:text-left max-w-2xl order-2 desk:order-1 w-full">
            <ScrollReveal>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 border border-neon-purple/30 dark:border-neon-purple/40 backdrop-blur-md mb-6 shadow-sm mx-auto desk:mx-0">
                    <span className="text-xs font-extrabold tracking-widest text-neon-purple dark:text-yellow-300 uppercase">Founder</span>
                </div>
                
                <h2 className="text-[25.5px] xs:text-[31.5px] sm:text-4xl md:text-5xl desk:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight whitespace-nowrap">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-amber-400 to-yellow-500 animate-gradient-x bg-[length:200%_auto]">{founder.name}</span>
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg desk:text-xl leading-relaxed font-light text-left w-full break-words">
                   <p><strong>{founder.name}</strong> is the Founder of <strong>{COMPANY}</strong>, specializing in <span className="text-neon-purple font-medium">Web & App Engineering</span>, <span className="text-blue-500 font-medium">AI Agents</span>, workflow automation, <span className="text-cyan-500 dark:text-cyan-400 font-medium">UI/UX</span>, and strategic branding.</p>
                   <p>Known as K. Mohan Rao or Mohan Sai, I combine technology and creativity to turn complex ideas into elegant digital products that help ambitious businesses build a strong online presence and accelerate growth.</p>
                </div>

                <div className="flex flex-nowrap items-center justify-start gap-1 sm:gap-2 md:gap-2.5 pt-4 sm:pt-6 md:pt-8 pb-1 max-w-full overflow-hidden">
                   <TechBadge icon={Smartphone} label="Web/App Dev" />
                   <TechBadge icon={Bot} label="AI & Auto" />
                   <TechBadge icon={Share2} label="Influencer" />
                   <TechBadge icon={Palette} label="UI/UX" />
                </div>
            </ScrollReveal>
         </div>

         <div className="relative shrink-0 order-1 desk:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/30 to-blue-500/30 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 desk:w-[420px] desk:h-[420px] rounded-full overflow-hidden border-[8px] border-white dark:border-[#0A0C11] relative z-10 shadow-2xl bg-white dark:bg-[#0A0C11] transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={founder.image} srcSet={founder.srcSet} sizes="(min-width: 1024px) 462px, (min-width: 768px) 352px, 282px" width={founder.width} height={founder.height} alt={founder.alt} title={founder.title} decoding="async" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-custom grayscale hover:grayscale-0" />
            </div>
         </div>
      </section>

      {/* 2. PRAVEEN SECTION (BELOW MOHAN, ABOVE DIGITAL PHILOSOPHY) */}
      <section data-nosnippet className="flex flex-col desk:flex-row items-center justify-between gap-5 md:gap-12 desk:gap-20 mb-8 sm:mb-16 desk:mb-20 px-4 desk:px-12 relative z-10">
         <div className="relative shrink-0 order-1 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 desk:w-[420px] desk:h-[420px] rounded-full overflow-hidden border-[8px] border-white dark:border-[#0A0C11] relative z-10 shadow-2xl bg-white dark:bg-[#0A0C11] transition-transform duration-500 group-hover:scale-[1.02]">
                <img src="https://files.catbox.moe/ignhd8.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-custom grayscale hover:grayscale-0" />
            </div>
         </div>

         <div className="text-center desk:text-left max-w-2xl order-2 w-full">
            <ScrollReveal>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 backdrop-blur-md mb-6 shadow-sm mx-auto desk:mx-0">
                   <span className="text-xs font-extrabold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Co-Founder</span>
                </div>
                
                <h2 className="text-[24.72px] xs:text-[30.9px] sm:text-4xl md:text-5xl desk:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight whitespace-nowrap">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-gradient-x bg-[length:200%_auto]">Karri Praveen Kumar</span>
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg desk:text-xl leading-relaxed font-light text-left w-full break-words">
                   <p>As <strong>Graphic Designer & Web Developer</strong> at BrandiQue Web Solutions, I contribute to projects by crafting modern web applications with <span className="text-blue-500 font-medium">React & Next.js</span>.</p>
                   <p>By blending clean front-end architecture with creative <span className="text-cyan-500 dark:text-cyan-400 font-medium">Graphic Design</span>, I deliver intuitive digital experiences and impactful visual brand assets.</p>
                </div>

                <div className="flex flex-nowrap items-center justify-start gap-1 sm:gap-2 md:gap-2.5 pt-6 md:pt-8 pb-1 max-w-full overflow-hidden">
                   <TechBadge icon={PenTool} label="Graphic Design" color="blue" />
                   <TechBadge icon={Code} label="React / Next.js" color="blue" />
                   <TechBadge icon={Monitor} label="Web Dev" color="blue" />
                </div>
            </ScrollReveal>
         </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 py-8 mb-10 md:mb-16" aria-labelledby="company-story">
        <h2 id="company-story" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">About BrandiQue Web Solutions</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          <p>Founded by Kutikuppala Mohan Rao, BrandiQue Web Solutions brings together web development, design and automation. Based in Visakhapatnam (Vizag), Andhra Pradesh, our work helps businesses turn their requirements into usable digital products.</p>
          <p>Our mission is to make digital projects easier to understand and manage. Our vision is to be a long-term technical partner, supporting a business from its first website through changing content, integrations and workflows.</p>
          <p>Explore our three core services: <Link className="underline underline-offset-4" to="/web-development">web development</Link>, <Link className="underline underline-offset-4" to="/services/ai-automation">AI agents and automations</Link> and <Link className="underline underline-offset-4" to="/services/graphic-design">graphic design</Link>. <Link className="underline underline-offset-4" to="/contact">Contact the team</Link> to discuss a project.</p>
        </div>
      </section>

      {/* 2. EXTENDED AGENCY NARRATIVE */}
      <section className="w-full bg-white dark:bg-[#0A0C11]/30 border-y border-gray-200 dark:border-white/5 mb-32 py-14 md:py-32">
        <div className="max-w-[1500px] mx-auto px-6 space-y-20">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl desk:text-6xl font-bold text-gray-900 dark:text-white">Our Digital Philosophy</h2>
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-light leading-relaxed">Discover the principles that drive BrandiQue to deliver extraordinary results for every client, every time.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 desk:gap-20 text-left">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Target className="text-neon-purple" /> Visionary Excellence
                </h3>
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base desk:text-lg leading-relaxed font-light">
                  <p>BrandiQue was established with a singular focus: to elevate the standard of the web for small and medium-sized enterprises. We believe that your digital footprint should be as unique as your fingerprints. We choose a practical implementation for your goals, with attention to clear user journeys, maintainable structure and performance-conscious delivery.</p>
                  <p>Our vision is to act as your long-term technical partner. We don't just hand over a set of files and disappear; we stay with you, providing the insights and technical support needed to ensure your digital assets continue to perform as your business scales. Every line of code we write is a building block for your future success.</p>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <ZapIcon className="text-neon-blue" /> Technical Sophistication
                </h3>
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base desk:text-lg leading-relaxed font-light">
                  <p>We are performance-obsessed engineers. By utilizing modern web technologies like React, Tailwind CSS, and headless CMS architectures, we create platforms that are visually stunning but functionally unbeatable. Our commitment to 'Clean Code' means your website will be easier to maintain, more secure against cyber threats, and significantly more visible in search engine rankings.</p>
                  <p>In an era where the majority of web traffic is mobile, our 'Mobile-First' responsive design strategy ensures that your brand looks premium on every device, from 4K monitors to small-screen smartphones. At BrandiQue, we merge the art of design with the science of engineering to create digital experiences that truly resonate.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="delay-200">
            <div className="glass glass-glow p-5 md:p-14 rounded-[48px] text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 dark:opacity-10 text-neon-purple"><Sparkles size={120} /></div>
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">A Commitment from Leadership</h3>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-xl leading-relaxed font-light max-w-3xl">
                <p>"Digital transformation can often feel like a daunting hurdle for many business owners. Our mission at BrandiQue is to strip away that complexity and replace it with clarity. We personally oversee the technical architecture and operational execution of every project we take on, ensuring that it meets our uncompromising standards for speed, accessibility, and client success."</p>
                <p>"We aren't here to build just another website. We want to create a useful business tool that presents your offer clearly and helps people enquire beyond office hours when hosting and form integrations are configured for it. Let's build the right next step together."</p>
              </div>

              {/* Leadership Profiles */}
              <div className="pt-12 border-t border-gray-200 dark:border-white/10 mt-8 md:mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-purple animate-ping"></div>
                  <h4 className="text-sm uppercase font-bold text-neon-purple tracking-widest">Executive Leadership</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-5xl">
                  {/* Mohan - Founder */}
                  <div className="relative group p-4 md:p-8 rounded-3xl bg-white dark:bg-[#0A0C11]/80 border border-gray-200 dark:border-white/10 hover:border-neon-purple/60 shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl pointer-events-none group-hover:bg-neon-purple/20 transition-all"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neon-purple/50 shadow-neon/30 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      <img src={founder.image} srcSet={founder.srcSet} sizes="(min-width: 768px) 128px, 112px" width={founder.width} height={founder.height} alt={founder.alt} title={founder.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                        Founder
                      </div>
                      <h5 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mohan</h5>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        Web/App Developer, AI Agent & Automation Expert, Tech Influencer, and UI/UX Designer driving core digital innovations.
                      </p>
                    </div>
                  </div>

                  {/* Praveen - CEO */}
                  <div data-nosnippet className="relative group p-4 md:p-8 rounded-3xl bg-white dark:bg-[#0A0C11]/80 border border-gray-200 dark:border-white/10 hover:border-blue-500/60 shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-blue-500/30 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      <img src="https://files.catbox.moe/ignhd8.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                        Co-Founder
                      </div>
                      <h5 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Praveen</h5>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        React & Next.js Web Developer and Creative Graphic Designer specializing in modern front-end web apps and visual branding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <ViewOptimizer>
      <div className="grid md:grid-cols-3 gap-5 md:gap-8 mb-32 px-4 desk:px-8 max-w-[1500px] mx-auto">
         {[
            { title: "What I Believe In", icon: Shield, theme: "purple", list: ["Custom solutions, zero templates", "Performance & UX above all", "Clean, scalable architecture", "Global standard compliance"] },
            { title: "Our Commitment", icon: LayoutTemplate, theme: "blue", list: ["Conversion-focused web development", "Practical AI agents and workflow automation", "Professional graphic design and creative assets", "Supporting brand identity and content services"] },
            { title: "Our Mission", icon: Rocket, theme: "green", desc: "To help ambitious businesses use practical digital tools, clear design and thoughtful automation to serve customers better and build steadily." }
         ].map((pillar, i) => (
            <ScrollReveal key={i} delay={`delay-${(i+1)*100}`} className="h-full">
               <TiltCard className="h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[40px] p-6 md:p-10 shadow-2xl overflow-hidden flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-neon-${pillar.theme}/10 flex items-center justify-center text-neon-${pillar.theme} mb-8 border border-neon-${pillar.theme}/20 shadow-lg`}>
                     <pillar.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">{pillar.title}</h3>
                  {pillar.list ? (
                    <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-light text-sm md:text-base">
                      {pillar.list.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3"><Check size={14} className="text-neon-purple shrink-0" /> {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light">{pillar.desc}</p>
                  )}
               </TiltCard>
            </ScrollReveal>
         ))}
      </div>
      </ViewOptimizer>
      </div>
    </div>
  );
};

export default About;