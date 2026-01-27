import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
   ArrowRight, Trophy, Rocket, Clock, LayoutTemplate, Play, Code,
   PenTool, Megaphone, Zap, Cpu, Copy, Command, BarChart3, Search,
   Globe, Layers, ShieldCheck, ZapIcon, Target, Check, HelpCircle,
   Sparkles, Shield, Star, Monitor, Smartphone, Database, Globe2, Palette,
   History, Award, Activity, FileCode, HeartHandshake, Eye, Lightbulb, Workflow,
   Terminal, Braces, Binary
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/TextReveal';
import SpotlightCard from '../components/SpotlightCard';
import ViewOptimizer from '../components/ViewOptimizer';

const STATS = [
   { label: "Projects Completed", value: "100+", icon: Rocket, color: "text-neon-purple" },
   { label: "Client Satisfaction", value: "99%", icon: Trophy, color: "text-neon-blue" },
   { label: "Fast Delivery", value: "7-14 Days", icon: Clock, color: "text-green-400" },
];

const ROTATING_WORDS = ["Digital Empires", "Intelligent Brands", "High-End Websites", "Future Tech"];

const Home: React.FC = () => {
   const [currentWordIndex, setCurrentWordIndex] = useState(0);
   const [typedCode, setTypedCode] = useState('');
   const heroRef = useRef<HTMLElement>(null);

   const fullCodeSnippet = `class BrandiQue {
  constructor() {
    this.mission = "Building Empires";
    this.stack = ["React", "AI", "Cloud"];
  }

  async launch(project) {
    console.log("Optimizing...");
    await this.engineer(project);
    return "SUCCESS_200";
  }
}`;

   useEffect(() => {
      // Word rotation
      const wordInterval = setInterval(() => {
         setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      }, 3000);

      // Code typing effect
      let charIndex = 0;
      const typingInterval = setInterval(() => {
         if (charIndex <= fullCodeSnippet.length) {
            setTypedCode(fullCodeSnippet.slice(0, charIndex));
            charIndex++;
         } else {
            setTimeout(() => {
               charIndex = 0;
               setTypedCode('');
            }, 5000); // Wait 5s then restart
         }
      }, 40);

      return () => {
         clearInterval(wordInterval);
         clearInterval(typingInterval);
      };
   }, []);

   return (
      <div className="flex flex-col pb-0 overflow-x-hidden bg-gray-50 dark:bg-[#05070A] relative text-gray-900 dark:text-white transition-colors duration-300">

         {/* 1. HERO SECTION - Enhanced with coding elements and animations */}
         <section ref={heroRef} className="relative flex items-center justify-center pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 w-full overflow-hidden min-h-[75vh] lg:min-h-[85vh]">
            {/* Tech Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(176,38,255,0.03),transparent_70%)] pointer-events-none"></div>

            {/* Floating Code Symbols */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
               <div className="absolute top-[20%] left-[10%] animate-float" style={{ animationDelay: '0s' }}><Braces className="text-neon-purple w-8 h-8 md:w-12 md:h-12" /></div>
               <div className="absolute bottom-[20%] left-[15%] animate-float-fast" style={{ animationDelay: '1s' }}><Code className="text-neon-blue w-6 h-6 md:w-10 md:h-10" /></div>
               <div className="absolute top-[30%] right-[10%] animate-float" style={{ animationDelay: '0.5s' }}><Binary className="text-pink-500 w-10 h-10 md:w-16 md:h-16" /></div>
               <div className="absolute bottom-[30%] right-[15%] animate-float-fast" style={{ animationDelay: '1.5s' }}><Terminal className="text-green-500 w-8 h-8 md:w-12 md:h-12" /></div>
            </div>

            <div className="max-w-[1500px] w-full mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
               <div className="space-y-6 text-left">

                  {/* ✅ Mobile (<lg): NO entrance animations */}
                  <div className="block lg:hidden">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                        Engineered for Excellence
                     </div>

                     <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-4">
                        We Architect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-gradient-x bg-[length:200%_auto]">
                           {ROTATING_WORDS[currentWordIndex]}.
                        </span>
                     </h1>

                     <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light border-l-2 border-neon-purple/30 pl-6 mt-6">
                        <TextReveal text="Merging precision code with avant-garde design to build digital platforms that command authority." delay={300} />
                     </div>

                     <div className="flex flex-wrap gap-4 mt-8">
                        <Link to="/services" className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-neon-purple/20 text-sm md:text-base">
                           Start Project <ArrowRight size={18} />
                        </Link>
                        <Link to="/web-development" className="px-6 py-3.5 border border-gray-300 dark:border-white/10 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm md:text-base">
                           Web Pricing
                        </Link>
                     </div>
                  </div>

                  {/* ✅ Desktop (lg+): Keep entrance animations */}
                  <div className="hidden lg:block">
                     <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-bold uppercase tracking-widest">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                           Engineered for Excellence
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-4">
                           We Architect <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-gradient-x bg-[length:200%_auto]">
                              {ROTATING_WORDS[currentWordIndex]}.
                           </span>
                        </h1>

                        <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light border-l-2 border-neon-purple/30 pl-6 mt-6">
                           <TextReveal text="Merging precision code with avant-garde design to build digital platforms that command authority." delay={300} />
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                           <Link to="/services" className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-neon-purple/20 text-sm md:text-base">
                              Start Project <ArrowRight size={18} />
                           </Link>
                           <Link to="/web-development" className="px-6 py-3.5 border border-gray-300 dark:border-white/10 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm md:text-base">
                              Web Pricing
                           </Link>
                        </div>
                     </ScrollReveal>
                  </div>

               </div>


               {/* IDE / Terminal Block with Typewriter Effect */}
               <div className="relative block">
                  <ScrollReveal delay="delay-200"> <div className="relative bg-[#0A0C11] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group scale-[0.82] sm:scale-90 md:scale-95 lg:scale-100 origin-center lg:origin-right preserve-3d lg:hover:rotate-y-2 lg:hover:rotate-x-2 transition-transform duration-500">
                     {/* Terminal Header */}
                     <div className="h-10 bg-[#151A25] border-b border-white/5 flex items-center px-4 justify-between">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-gray-500 font-mono">AgencyEngine.js</span>
                           <div className="w-3 h-3 rounded bg-blue-500/20 flex items-center justify-center"><Code size={8} className="text-blue-400" /></div>
                        </div>
                     </div>

                     {/* Code Typing Area */}
                     <div className="p-4 sm:p-6 md:p-8 min-h-[240px] sm:min-h-[280px] md:min-h-[340px] font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed relative">
                        {/* Line Numbers */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#0F1320]/50 border-r border-white/5 flex flex-col items-center pt-8 text-[10px] text-gray-700 select-none">
                           {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
                        </div>

                        <div className="pl-6 whitespace-pre text-gray-300 overflow-hidden">
                           <span className="text-blue-400">class</span> <span className="text-yellow-400">BrandiQue</span> {'{'}<br />
                           {'  '}<span className="text-purple-400">constructor</span>() {'{'}<br />
                           {'    '}<span className="text-blue-400">this</span>.<span className="text-pink-400">mission</span> = <span className="text-green-400">"Building Empires"</span>;<br />
                           {'    '}<span className="text-blue-400">this</span>.<span className="text-pink-400">stack</span> = [<span className="text-orange-400">"React"</span>, <span className="text-orange-400">"AI"</span>, <span className="text-orange-400">"Cloud"</span>];<br />
                           {'  '}{'}'}<br /><br />
                           {'  '}<span className="text-blue-400">async</span> <span className="text-yellow-400">launch</span>(project) {'{'}<br />
                           {'    '}console.<span className="text-purple-400">log</span>(<span className="text-green-400">"Optimizing..."</span>);<br />
                           {'    '}<span className="text-blue-400">await</span> <span className="text-blue-400">this</span>.<span className="text-purple-400">engineer</span>(project);<br />
                           {'    '}<span className="text-pink-400">return</span> <span className="text-green-400">"SUCCESS_200"</span>;<br />
                           {'  '}{'}'}<br />
                           {'}'}
                           <span className="inline-block w-2 h-4 bg-neon-purple animate-pulse ml-1 align-middle"></span>
                        </div>
                     </div>

                     {/* Status Bar */}
                     <div className="h-6 bg-[#0F1320] border-t border-white/5 flex items-center px-4 justify-between text-[9px] text-gray-600 font-mono">
                        <div className="flex items-center gap-3">
                           <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-500" /> master*</span>
                           <span>UTF-8</span>
                        </div>
                        <div>JavaScript</div>
                     </div>

                     {/* Glow Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/5 to-transparent pointer-events-none"></div>
                  </div>

                     {/* Floating Badges */}
                     <div className="absolute top-2 left-2 sm:-top-6 sm:-left-6 scale-[0.75] sm:scale-100 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl animate-float z-20 flex items-center gap-2 sm:gap-3 group">

                        <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                           <Cpu size={20} />
                        </div>
                        <div>
                           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">System Status</div>
                           <div className="text-xs font-black text-green-500">100% OPERATIONAL</div>
                        </div>
                     </div>

                     <div className="absolute bottom-2 right-2 sm:-bottom-6 sm:-right-6 scale-[0.75] sm:scale-100 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl animate-float-fast z-20 flex items-center gap-2 sm:gap-3 group" style={{ animationDelay: '1s' }}>

                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                           <Terminal size={20} />
                        </div>
                        <div>
                           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Deploying to</div>
                           <div className="text-xs font-black">EDGE_V3_INDIA</div>
                        </div>
                     </div>
                  </ScrollReveal>
               </div>
            </div>
         </section>

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

{/* ===== In-Article Ad ===== */}
<div className="my-10 flex justify-center">
  <ins
    className="adsbygoogle"
    style={{ display: "block", textAlign: "center" }}
    data-ad-layout="in-article"
    data-ad-format="fluid"
    data-ad-client="ca-pub-9587188804206049"
    data-ad-slot="9328856681"
  />
</div>

{/* ===== Auto-relaxed Ad ===== */}
<div className="my-10 flex justify-center">
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-format="autorelaxed"
    data-ad-client="ca-pub-9587188804206049"
    data-ad-slot="2426738115"
  />
</div>

         {/* 2. TRUST MARQUEE */}
         <section className="py-12 border-y border-gray-200 dark:border-white/5 bg-white dark:bg-[#05070A]">
            <div className="max-w-[1500px] mx-auto px-6">
               <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Trusted technologies & global standards</p>
               <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <Globe2 size={40} /> <Cpu size={40} /> <Layers size={40} /> <Zap size={40} /> <Database size={40} /> <Shield size={40} />
               </div>
            </div>
         </section>

         {/* --- INFO BLOCK A: THE EVOLUTION OF DIGITAL DOMINANCE --- */}
         <section className="py-24 bg-white dark:bg-[#05070A] border-b border-gray-100 dark:border-white/5">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                     <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple"><History size={24} /></div>
                        <h2 className="text-3xl md:text-5xl font-bold">The Evolution of <span className="text-neon-purple">Digital Dominance.</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                           In the early days of the internet, a simple "online brochure" was enough for a business to establish a presence. Today, the landscape has shifted dramatically. Your website is no longer just a destination; it is the central nervous system of your entire brand's digital identity. At BrandiQue, we recognize that to thrive in this hyper-competitive era, businesses must transcend traditional design.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                           Modern web engineering requires a synthesis of lightning-fast performance, semantic architecture, and immersive storytelling. We've seen the rise and fall of template-based solutions that offer quick fixes but leave brands with slow, generic platforms that fail to rank or convert. Our philosophy is rooted in building "Digital Empires"—platforms that are architected to withstand the test of time, algorithm updates, and shifting user behaviors.
                        </p>
                     </div>
                     <div className="bg-gray-100 dark:bg-[#0A0C11] p-8 md:p-12 rounded-[40px] border border-gray-200 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-neon-purple"><Workflow size={120} /></div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Award className="text-neon-purple" /> Industry-Leading Standards</h3>
                        <ul className="space-y-6">
                           {[
                              { t: "Semantic HTML5", d: "Ensuring search engines and assistive technologies perfectly understand your content hierarchy." },
                              { t: "Zero-Latency Interactivity", d: "Optimizing JavaScript bundles to ensure every click feels instantaneous and fluid." },
                              { t: "Visual Authority", d: "Crafting bespoke design systems that communicate luxury, trust, and professional depth." }
                           ].map((item, i) => (
                              <li key={i} className="space-y-1">
                                 <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">{item.t}</h4>
                                 <p className="text-sm text-gray-500 font-light">{item.d}</p>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 3. ABOUT US SHORTFORM */}
         <section className="py-24 md:py-32 bg-white dark:bg-[#0A0C11]/30">
            <div className="max-w-[1500px] mx-auto px-6">
               <div className="max-w-4xl mx-auto text-center space-y-12">
                  <ScrollReveal>
                     <h2 className="text-3xl md:text-6xl font-bold mb-8 tracking-tight">Architecting the <span className="text-neon-purple">Modern Web.</span></h2>
                     <div className="grid md:grid-cols-2 gap-12 text-left text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                        <p>BrandiQue is a premier digital studio helping businesses navigate the modern web. We specialize in building high-performance websites that serve as powerful engines for business growth and authority.</p>
                        <p>By leveraging frameworks like React and Next.js, we ensure every platform we deliver is lightning-fast, mobile-responsive, and infinitely scalable for the long term.</p>
                     </div>
                     <div className="flex justify-center pt-10">
                        <Link to="/about" className="text-sm font-bold text-neon-purple uppercase tracking-widest border-b-2 border-neon-purple/20 pb-1 hover:border-neon-purple transition-all">Learn Our Story</Link>
                     </div>
                  </ScrollReveal>
               </div>
            </div>
         </section>

         {/* --- INFO BLOCK B: STRATEGIC ENGINEERING VS GENERIC DESIGN --- */}
         <section className="py-24 bg-white dark:bg-[#05070A]">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                     <h2 className="text-3xl md:text-5xl font-bold">Strategic <span className="text-neon-blue">Engineering</span> vs Generic Design</h2>
                     <p className="text-gray-500 text-lg font-light">Why the underlying architecture of your website determines your business success.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                        {
                           title: "Custom Code Benefits",
                           icon: FileCode,
                           content: "While platforms like WordPress are excellent for some, custom-coded React and Next.js applications offer unparalleled control. We strip away the bloat of third-party plugins, ensuring your code is clean, lightweight, and focused solely on your specific business logic. This leads to higher security ratings and significantly lower maintenance overhead."
                        },
                        {
                           title: "User Psychology & UI",
                           icon: Eye,
                           content: "Design is not just about aesthetics; it's about guiding the user's intent. We utilize visual hierarchy, color theory, and micro-interactions to create a 'flow' that naturally leads visitors toward your desired Call to Action. Every pixel is placed with strategic purpose to minimize bounce rates and maximize time-on-site."
                        },
                        {
                           title: "Future-Proofing Brands",
                           icon: Lightbulb,
                           content: "Technology moves fast. A website built today must be ready for the innovations of tomorrow. By using modular architecture and headless CMS systems, we ensure that your content and presentation layers are decoupled. This allows you to redesign your UI in the future without rebuilding your entire data foundation."
                        }
                     ].map((block, i) => (
                        <div key={i} className="p-10 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-6 group hover:border-neon-blue/30 transition-colors">
                           <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-neon-blue shadow-lg group-hover:scale-110 transition-transform"><block.icon size={28} /></div>
                           <h3 className="text-2xl font-bold">{block.title}</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light">{block.content}</p>
                        </div>
                     ))}
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 4. QUICK STATS GRID */}
         <ViewOptimizer>
            <section className="py-16 px-4 max-w-[1500px] mx-auto w-full">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {STATS.map((stat, i) => (
                     <ScrollReveal key={i} delay={`delay-${i * 50}`}>
                        <div className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 p-8 rounded-3xl flex items-center gap-6 hover:shadow-2xl transition-all group">
                           <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${stat.color} border border-gray-100 dark:border-white/5 shadow-inner group-hover:scale-110 transition-transform`}>
                              <stat.icon size={32} />
                           </div>
                           <div>
                              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                           </div>
                        </div>
                     </ScrollReveal>
                  ))}
               </div>
            </section>
         </ViewOptimizer>

{/* ===== In-Article Ad ===== */}
<div className="my-10 flex justify-center">
  <ins
    className="adsbygoogle"
    style={{ display: "block", textAlign: "center" }}
    data-ad-layout="in-article"
    data-ad-format="fluid"
    data-ad-client="ca-pub-9587188804206049"
    data-ad-slot="9328856681"
  />
</div>

         {/* --- INFO BLOCK C: MAXIMIZING ROI THROUGH PERFORMANCE --- */}
         <section className="py-24 bg-white dark:bg-[#0A0C11]/50 border-y border-gray-200 dark:border-white/5">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="space-y-12">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                        <Activity size={14} /> Revenue-Driven Development
                     </div>
                     <h2 className="text-3xl md:text-6xl font-bold leading-tight">Performance is not a <span className="text-neon-blue">feature.</span> It's the <span className="text-green-400">Foundation.</span></h2>
                     <div className="grid md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                        <p>
                           Statistics prove that for every second your website takes to load beyond 3 seconds, your conversion rate drops by over 20%. At BrandiQue, we treat performance as a core business metric. We don't just optimize images; we architect entire data-fetching strategies using Incremental Static Regeneration (ISR) and Server-Side Rendering (SSR) to ensure your users never see a loading spinner.
                        </p>
                        <p>
                           Our SEO strategy is equally rigorous. Most agencies stop at meta titles and descriptions. We go deeper, implementing JSON-LD Schema markup, ensuring perfect Core Web Vital scores (LCP, FID, CLS), and building accessible DOM structures. When Google sees a technically perfect website that serves users instantly, your organic visibility skyrockets, providing a sustainable ROI that far outweighs paid advertising costs in the long run.
                        </p>
                     </div>
                     <div className="pt-6">
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent"></div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 5. SERVICES HUB (SHORTFORM) */}
         <section id="services-hub" className="py-24 max-w-[1500px] mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
               <h2 className="text-3xl md:text-5xl font-bold">Our Core <span className="text-neon-blue">Capabilities.</span></h2>
               <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">Everything you need to brand, build, and scale your digital presence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <SpotlightCard to="/services/full-stack" title="Full-Stack" description="Custom-coded React sites built for speed." icon={<Code size={32} />} delay="delay-0" />
               <SpotlightCard to="/services/wordpress" title="WordPress" description="Easy-to-manage, professional CMS builds." icon={<LayoutTemplate size={32} />} delay="delay-100" />
               <SpotlightCard to="/services/branding" title="Branding" description="Logos and 3D mockups that define you." icon={<PenTool size={32} />} delay="delay-200" />
               <SpotlightCard to="/services/digital-marketing" title="Marketing" description="Viral social creatives for high reach." icon={<Megaphone size={32} />} delay="delay-300" />
            </div>
         </section>

{/* ===== Auto-relaxed Ad ===== */}
<div className="my-10 flex justify-center">
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-format="autorelaxed"
    data-ad-client="ca-pub-9587188804206049"
    data-ad-slot="2426738115"
  />
</div>

         {/* 6. WHY CHOOSE US (TEXT HEAVY) */}
         <section className="py-24 bg-gray-100 dark:bg-[#0A0C11]/50 border-y border-gray-200 dark:border-white/5">
            <div className="max-w-[1500px] mx-auto px-6">
               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <ScrollReveal>
                     <h2 className="text-4xl md:text-6xl font-bold mb-8">Performance <br />First <span className="text-neon-purple">Engineering.</span></h2>
                     <div className="space-y-8 text-gray-600 dark:text-gray-400 text-lg font-light">
                        <p>In today's digital market, speed is currency. A one-second delay can cost you 7% in conversions. At BrandiQue, we don't just "design" — we engineer for sub-second performance.</p>
                        <div className="grid grid-cols-2 gap-8 pt-4">
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 font-bold text-black dark:text-white uppercase tracking-wider text-xs"><ZapIcon size={16} className="text-neon-blue" /> Lightning Speed</div>
                              <p className="text-sm">Optimized assets and server-side rendering.</p>
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 font-bold text-black dark:text-white uppercase tracking-wider text-xs"><Search size={16} className="text-neon-purple" /> SEO Foundation</div>
                              <p className="text-sm">Technical SEO baked into the core of every build.</p>
                           </div>
                        </div>
                     </div>
                  </ScrollReveal>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="h-64 bg-neon-purple/5 rounded-2xl border border-neon-purple/10 flex flex-col items-center justify-center p-6 text-center animate-float">
                        <Monitor size={48} className="text-neon-purple mb-4" />
                        <span className="font-bold text-xs uppercase">Desktop Optimized</span>
                     </div>
                     <div className="h-64 bg-neon-blue/5 rounded-2xl border border-neon-blue/10 flex flex-col items-center justify-center p-6 text-center animate-float" style={{ animationDelay: '1s' }}>
                        <Smartphone size={48} className="text-neon-blue mb-4" />
                        <span className="font-bold text-xs uppercase">Mobile Responsive</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 7. INDUSTRY SPECIALIZATION */}
         <section className="py-24 max-w-[1500px] mx-auto px-6">
            <ScrollReveal>
               <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                  <div className="max-w-2xl">
                     <h2 className="text-4xl md:text-5xl font-bold mb-4">Niche <span className="text-neon-blue">Solutions.</span></h2>
                     <p className="text-gray-500 text-lg font-light">We provide tailored digital solutions for diverse industry requirements.</p>
                  </div>
                  <div className="h-[2px] flex-grow bg-gray-200 dark:bg-white/5 mb-4 hidden md:block"></div>
               </div>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {["Real Estate", "E-Commerce", "Portfolio", "Personal", "Healthcare", "Tech Startups", "Agency", "Creator"].map((item, i) => (
                     <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-neon-purple transition-all bg-white dark:bg-[#0F1320] flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-neon-purple group-hover:scale-150 transition-transform"></div>
                        <span className="font-bold text-sm md:text-base uppercase tracking-wider">{item}</span>
                     </div>
                  ))}
               </div>
            </ScrollReveal>
         </section>

         {/* --- INFO BLOCK D: SCALING FOR THE FUTURE --- */}
         <section className="py-24 bg-white dark:bg-[#05070A]">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                     <div className="order-2 lg:order-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-[#0F1320] p-6 rounded-2xl border border-white/5 shadow-xl">
                              <h4 className="text-neon-purple font-bold text-3xl mb-2">99.9%</h4>
                              <p className="text-xs text-gray-500 uppercase tracking-widest">Uptime Promise</p>
                           </div>
                           <div className="bg-[#0F1320] p-6 rounded-2xl border border-white/5 shadow-xl mt-8">
                              <h4 className="text-neon-blue font-bold text-3xl mb-2">256-bit</h4>
                              <p className="text-xs text-gray-500 uppercase tracking-widest">SSL Security</p>
                           </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-purple/5 blur-[100px] rounded-full"></div>
                     </div>
                     <div className="order-1 lg:order-2 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold">Scaling for the <span className="text-neon-purple text-gradient">Future.</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                           A website that works for 100 visitors might crash with 10,000. Our engineering focus is on "elastic scalability." By leveraging cloud-native deployment patterns and distributed edge computing, we ensure that your digital infrastructure expands dynamically based on demand. This is critical for businesses planning rapid expansion or launching seasonal campaigns.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                           Security is the silent pillar of our development process. Every input is sanitized, every API route is protected, and every deployment is scanned for vulnerabilities. In an age of increasing data breaches, BrandiQue provides the peace of mind that your business and customer data are shielded behind multiple layers of enterprise-grade protection.
                        </p>
                        <div className="pt-4 flex gap-4">
                           <Check size={20} className="text-green-500" /> <span className="text-sm font-bold uppercase tracking-wider opacity-60">GDPR Compliant Architecture</span>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 8. WEB DEV PRICING TEASER (SHORTFORM) */}
         <section className="py-24 bg-black text-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="max-w-[1500px] mx-auto px-6 relative z-10">
               <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold">Starter <span className="text-neon-purple text-gradient">Kits.</span></h2>
                  <p className="text-gray-400 max-w-xl mx-auto font-light">Professional presence at fractional market prices.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { title: "Personal", price: "9,000", tag: "Portfolio" },
                     { title: "Business", price: "10,999", tag: "Agency" },
                     { title: "E-Commerce", price: "28,999", tag: "Online Store" }
                  ].map((plan, i) => (
                     <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-center group">
                        <span className="text-[10px] font-bold uppercase text-neon-purple mb-4 block tracking-widest">{plan.tag}</span>
                        <h3 className="text-2xl font-bold mb-6">{plan.title}</h3>
                        <div className="text-4xl font-black mb-8">₹{plan.price}</div>
                        <Link to="/web-development" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-neon-purple transition-colors">View Features <ArrowRight size={14} /></Link>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 9. PROCESS METHODOLOGY */}
         <section className="py-24 max-w-[1500px] mx-auto px-6 text-center">
            <ScrollReveal>
               <h2 className="text-3xl md:text-5xl font-bold mb-16">The BrandiQue <span className="text-neon-purple">Methodology.</span></h2>
               <div className="grid md:grid-cols-5 gap-8">
                  {[
                     { step: "01", title: "Strategy", icon: Target },
                     { step: "02", title: "UI Design", icon: Palette },
                     { step: "03", title: "Engineering", icon: Code },
                     { step: "04", title: "Optimization", icon: ZapIcon },
                     { step: "05", title: "Launch", icon: Rocket }
                  ].map((item, i) => (
                     <div key={i} className="space-y-6 group">
                        <div className="w-20 h-20 mx-auto rounded-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 flex items-center justify-center text-2xl font-black text-neon-purple shadow-xl group-hover:scale-110 group-hover:bg-neon-purple group-hover:text-white transition-all">
                           {item.step}
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                     </div>
                  ))}
               </div>
            </ScrollReveal>
         </section>

         {/* 10. FAQ SHORTFORM */}
         <section className="py-24 bg-gray-50 dark:bg-[#0A0C11]/50 border-t border-gray-200 dark:border-white/5">
            <div className="max-w-[1500px] mx-auto px-6">
               <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked <span className="text-neon-blue">Questions.</span></h2>
               <div className="grid md:grid-cols-2 gap-6">
                  {[
                     { q: "Standard Delivery Time?", a: "Standard builds take 7-14 days, complex apps 3-4 weeks." },
                     { q: "Is Technical SEO Included?", a: "Yes, optimized structure is baked into every build from day one." },
                     { q: "Mobile Responsiveness?", a: "100%. We build mobile-first to ensure perfect cross-device views." },
                     { q: "Do you offer maintenance?", a: "Yes, we act as long-term technical partners for our clients." }
                  ].map((faq, i) => (
                     <ScrollReveal key={i} className="p-6 bg-white dark:bg-[#0F1320] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h4 className="font-bold mb-3 flex items-center gap-2"><HelpCircle size={16} className="text-neon-purple" /> {faq.q}</h4>
                        <p className="text-sm text-gray-500 font-light leading-relaxed">{faq.a}</p>
                     </ScrollReveal>
                  ))}
               </div>
            </div>
         </section>

         {/* --- INFO BLOCK E: THE BRANDIQUE VISION --- */}
         <section className="py-24 md:py-32 bg-white dark:bg-[#05070A] overflow-hidden">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="max-w-4xl mx-auto space-y-16">
                     <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Bridging <span className="text-neon-purple">Creativity</span> and <span className="text-neon-blue">Code</span></h2>
                        <p className="text-gray-500 text-lg font-light">A final deep dive into our agency's technical philosophy and commitment to excellence.</p>
                     </div>

                     <div className="space-y-12 text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                        <p>
                           The digital world is often divided into two camps: the designers who value art above all, and the developers who value logic. At BrandiQue, we believe this is a false dichotomy. Great digital work lives at the intersection. It requires the soul of an artist and the precision of a mathematician. Our team is trained to see websites as living, breathing entities that must balance beauty with brutal technical efficiency.
                        </p>
                        <p>
                           We are committed to ethical development practices. This means we don't just build what's easy; we build what's right for your long-term success. We prioritize accessibility (A11y) to ensure the web is open to everyone, we use sustainable coding patterns to reduce digital carbon footprints, and we maintain radical transparency in our pricing and timelines.
                        </p>
                        <p>
                           When you choose BrandiQue, you aren't just hiring a vendor; you are gaining a strategic partner. We immerse ourselves in your industry, understand your competitors, and build a platform that doesn't just "look good" on a portfolio—it actually solves business problems. Whether you are a solo creator or a rising startup, we give you the enterprise-grade tools you need to compete on a global scale.
                        </p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 pt-8">
                        <div className="flex items-start gap-4 p-8 rounded-3xl bg-neon-purple/5 border border-neon-purple/10">
                           <HeartHandshake className="text-neon-purple shrink-0" size={32} />
                           <div>
                              <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Radical Transparency</h4>
                              <p className="text-sm text-gray-500 font-light leading-relaxed">We provide real-time project tracking and clear communication throughout the lifecycle of your project.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 p-8 rounded-3xl bg-neon-blue/5 border border-neon-blue/10">
                           <Sparkles className="text-neon-blue shrink-0" size={32} />
                           <div>
                              <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Uncompromising Quality</h4>
                              <p className="text-sm text-gray-500 font-light leading-relaxed">Every line of code undergoes rigorous peer review and testing before it ever reaches a production environment.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 11. FINAL CTA (PAGE ENDING) */}
         <section className="py-32 relative overflow-hidden text-center bg-white dark:bg-[#05070A] border-t border-gray-100 dark:border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
            <ScrollReveal>
               <div className="max-w-[1500px] mx-auto px-6 space-y-10 relative z-10">
                  <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter">Ready to build your <br /><span className="text-neon-blue text-gradient">Digital Empire?</span></h2>
                  <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto">Join the elite businesses that have elevated their authority with BrandiQue. Let's create your success story today.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                     <Link to="/contact" className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3">
                        Request Consultation <ArrowRight size={20} />
                     </Link>
                     <a href="tel:+917093320572" className="px-10 py-5 border border-gray-300 dark:border-white/10 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                        Call an Expert
                     </a>
                  </div>
                  <div className="pt-20 opacity-30">
                     <img
                        src="https://cdn.imgchest.com/files/fd6fe875bd05.png"
                        alt="Logo"
                        className="h-12 md:h-16 mx-auto object-contain hidden dark:block"
                     />
                     <img
                        src="https://cdn.imgchest.com/files/dcafd6812298.png"
                        alt="Logo"
                        className="h-12 md:h-16 mx-auto object-contain block dark:hidden"
                     />
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Visakhapatnam, India • Global Operations</p>
                  </div>
               </div>
            </ScrollReveal>
         </section>

      </div>
   );
};

export default Home;