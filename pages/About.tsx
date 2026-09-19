import { founder, COMPANY } from '../seo/site';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Shield, Zap, LayoutTemplate, Star, Rocket, Code, ArrowRight, Heart, Cpu, Globe, Palette, Monitor, Box, Terminal, Database, Smartphone, Layers, Command, Target, ZapIcon, Info, Bot, Share2, PenTool } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
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
            glowRef.current.style.background = `radial-gradient(600px circle at ${glowX}px ${glowY}px, rgba(176, 38, 255, 0.15), transparent 40%)`;
        }
    });
  };

  const handleMouseLeave = () => {
    if (cardRef.current) { cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'; }
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`relative transition-transform duration-200 ease-out will-change-transform group ${className} desktop-optimize-transform`}>
      <div ref={glowRef} className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[inherit] z-0" style={{ background: `radial-gradient(600px circle at center, rgba(176, 38, 255, 0.15), transparent 40%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

const TechBadge = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1.5 md:py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-default shadow-sm shrink-0 whitespace-nowrap">
    <Icon size={15} className="text-neon-purple shrink-0" />
    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-mono font-bold">{label}</span>
  </div>
);

const About: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-[1500px] mx-auto w-full relative overflow-hidden bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      
      {/* 1. HERO SECTION - MOHAN */}
      <section id="founder" className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-20 px-4 lg:px-12 relative z-10">
         <div className="text-center lg:text-left max-w-2xl order-2 lg:order-1">
            <ScrollReveal>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 border border-neon-purple/30 dark:border-neon-purple/40 backdrop-blur-md mb-6 shadow-sm mx-auto lg:mx-0">
                    <span className="text-xs font-extrabold tracking-widest text-neon-purple dark:text-purple-300 uppercase">Founder</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">

                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-blue-500 animate-gradient-x bg-[length:200%_auto]">{founder.name}</span>
                </h1>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed font-light text-left">
                   <p><strong>{founder.name}</strong> is the Founder of <strong>{COMPANY}</strong>, specializing in <span className="text-neon-purple font-medium">Web & App Engineering</span>, <span className="text-blue-500 font-medium">AI Agents</span>, workflow automation, <span className="text-cyan-500 dark:text-cyan-400 font-medium">UI/UX</span>, and strategic branding.</p>
                   <p>Known as K. Mohan, I combine technology and creativity to turn complex ideas into elegant digital products that help ambitious businesses build a strong online presence and accelerate growth.</p>
                </div>

                <div className="flex flex-nowrap overflow-x-auto sm:overflow-visible items-center justify-start gap-2 md:gap-2.5 pt-8 pb-1 scrollbar-none max-w-full">
                   <TechBadge icon={Smartphone} label="Web/App Developer" />
                   <TechBadge icon={Bot} label="AI Agent & Automation Expert" />
                   <TechBadge icon={Share2} label="Influencer" />
                   <TechBadge icon={Palette} label="UI/UX Design" />
                </div>
            </ScrollReveal>
         </div>

         <div className="relative shrink-0 order-1 lg:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/30 to-blue-500/30 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-[8px] border-white dark:border-[#0A0C11] relative z-10 shadow-2xl bg-white dark:bg-[#0A0C11] transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={founder.image} alt={`${founder.name}, Founder of ${COMPANY}`} width={420} height={420} loading="eager" decoding="async" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-custom grayscale hover:grayscale-0" />
            </div>
         </div>
      </section>

      <section className="seo-content" aria-labelledby="company-story">
        <h2 id="company-story">About BrandiQue Web Solutions</h2>
        <p>Founded by Kutikuppala Mohan Rao, BrandiQue Web Solutions brings together web development, design and automation. Based in Visakhapatnam (Vizag), Andhra Pradesh, our work helps businesses turn their requirements into usable digital products.</p>
        <p>Our mission is to make digital projects easier to understand and manage. Our vision is to be a long-term technical partner, supporting a business from its first website through changing content, integrations and workflows.</p>
        <p>Explore our <Link to="/services/full-stack">full-stack development</Link>, <Link to="/services/wordpress">WordPress websites</Link>, <Link to="/services/ai-automation">AI agents and automation</Link>, <Link to="/services/branding">branding</Link> and <Link to="/services/digital-marketing">digital marketing services</Link>. <Link to="/contact">Contact the team</Link> to discuss a project.</p>
      </section>

      {/* 2. PRAVEEN SECTION (BELOW MOHAN, ABOVE DIGITAL PHILOSOPHY) */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-32 px-4 lg:px-12 relative z-10">
         <div className="relative shrink-0 order-1 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-[8px] border-white dark:border-[#0A0C11] relative z-10 shadow-2xl bg-white dark:bg-[#0A0C11] transition-transform duration-500 group-hover:scale-[1.02]">
                <img src="https://files.catbox.moe/ignhd8.jpg" alt="Praveen, team member" width={420} height={420} loading="lazy" decoding="async" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-custom grayscale hover:grayscale-0" />
            </div>
         </div>

         <div className="text-center lg:text-left max-w-2xl order-2">
            <ScrollReveal>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 backdrop-blur-md mb-6 shadow-sm mx-auto lg:mx-0">
                   <span className="text-xs font-extrabold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Co-Founder</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                   Meet <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-gradient-x bg-[length:200%_auto]">Praveen.</span>
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed font-light text-left">
                   <p>As <strong>Team Member</strong> & Web Developer at BrandiQue Web Solutions, I contribute to projects by crafting modern web applications with <span className="text-blue-500 font-medium">React & Next.js</span>.</p>
                   <p>By blending clean front-end architecture with creative <span className="text-cyan-500 dark:text-cyan-400 font-medium">Graphic Design</span>, I deliver intuitive digital experiences and impactful visual brand assets.</p>
                </div>

                <div className="flex flex-nowrap overflow-x-auto sm:overflow-visible items-center justify-start gap-2 md:gap-2.5 pt-8 pb-1 scrollbar-none max-w-full">
                   <TechBadge icon={PenTool} label="Graphic Designer" />
                   <TechBadge icon={Code} label="React / Next.js" />
                   <TechBadge icon={Monitor} label="Web Developer" />
                </div>
            </ScrollReveal>
         </div>
      </section>

      {/* 2. EXTENDED AGENCY NARRATIVE */}
      <section className="w-full bg-white dark:bg-[#0A0C11]/30 border-y border-gray-200 dark:border-white/5 mb-32 py-24 md:py-32">
        <div className="max-w-[1500px] mx-auto px-6 space-y-20">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">Our Digital Philosophy</h2>
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-light leading-relaxed">Discover the principles that drive BrandiQue to deliver clear, maintainable digital experiences.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 text-left">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Target className="text-neon-purple" /> Visionary Excellence
                </h3>
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed font-light">
                  <p>BrandiQue was established with a singular focus: to elevate the standard of the web for small and medium-sized enterprises. We believe that your digital footprint should be as unique as your fingerprints. While many agencies rely on bloated, generic templates that slow down your site and confuse your users, we architect custom solutions that prioritize fast loading and intuitive user journeys.</p>
                  <p>Our vision is to act as your long-term technical partner. We don't just hand over a set of files and disappear; we stay with you, providing the insights and technical support needed to ensure your digital assets continue to perform as your business scales. Every line of code we write is a building block for your future success.</p>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <ZapIcon className="text-neon-blue" /> Technical Sophistication
                </h3>
                <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed font-light">
                  <p>We are performance-obsessed engineers. By utilizing modern web technologies like React, Tailwind CSS, and headless CMS architectures, we create platforms that are visually stunning but built around practical business requirements. Our commitment to 'Clean Code' means your website will be easier to maintain, more secure against cyber threats, and easier for search engines to understand.</p>
                  <p>In an era where the majority of web traffic is mobile, our 'Mobile-First' responsive design strategy ensures that your brand looks premium on every device, from 4K monitors to small-screen smartphones. At BrandiQue, we merge the art of design with the science of engineering to create digital experiences that truly resonate.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="delay-200">
            <div className="bg-gray-100 dark:bg-white/5 p-8 md:p-14 rounded-[48px] border border-gray-200 dark:border-white/10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 text-neon-purple"><Sparkles size={120} /></div>
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">A Commitment from Leadership</h3>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-xl leading-relaxed font-light max-w-3xl">
                <p>"Digital transformation can often feel like a daunting hurdle for many business owners. Our mission at BrandiQue is to strip away that complexity and replace it with clarity. We personally oversee the technical architecture and operational execution of every project we take on, ensuring that it meets our uncompromising standards for speed, accessibility, and client success."</p>
                <p>"We aren't here to build just another website. We are here to build your most effective business tool—a platform that works 24/7 to capture leads, represent your values, and grow your brand. Let's create something extraordinary together."</p>
              </div>

              {/* Leadership Profiles */}
              <div className="pt-12 border-t border-gray-200 dark:border-white/10 mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-purple animate-ping"></div>
                  <h4 className="text-sm uppercase font-bold text-neon-purple tracking-widest">Our Team</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                  {/* Mohan - Founder */}
                  <div className="relative group p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0A0C11]/80 border border-gray-200 dark:border-white/10 hover:border-neon-purple/60 shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl pointer-events-none group-hover:bg-neon-purple/20 transition-all"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neon-purple/50 shadow-neon/30 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      <img src={founder.image} alt={`${founder.name}, Founder of ${COMPANY}`} width={128} height={128} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                        Founder
                      </div>
                      <h5 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{founder.name}</h5>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        Web/App Developer, AI Agent & Automation Expert, Tech Influencer, and UI/UX Designer driving core digital innovations.
                      </p>
                    </div>
                  </div>

                  {/* Praveen - Team Member */}
                  <div className="relative group p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0A0C11]/80 border border-gray-200 dark:border-white/10 hover:border-blue-500/60 shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-blue-500/30 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                      <img src="https://files.catbox.moe/ignhd8.jpg" alt="Praveen" width={128} height={128} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
      <div className="grid md:grid-cols-3 gap-8 mb-32 px-4 lg:px-8 max-w-[1500px] mx-auto">
         {[
            { title: "What I Believe In", icon: Shield, theme: "purple", list: ["Custom solutions, zero templates", "Performance & UX above all", "Clean, scalable architecture", "Global standard compliance"] },
            { title: "Our Commitment", icon: LayoutTemplate, theme: "blue", list: ["Full-Stack Development (React/Next.js)", "High-Performance WordPress", "Premium Branding & Identity", "Conversion-Focused Marketing"] },
            { title: "Our Mission", icon: Rocket, theme: "green", desc: "To empower modern businesses with digital tools that drive measurable growth. We democratize enterprise-grade technology for every ambitious entrepreneur." }
         ].map((pillar, i) => (
            <ScrollReveal key={i} delay={`delay-${(i+1)*100}`} className="h-full">
               <TiltCard className="h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[40px] p-10 shadow-2xl overflow-hidden flex flex-col">
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
  );
};

export default About;