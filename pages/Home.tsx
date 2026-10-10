import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
   ArrowRight, Trophy, Rocket, Clock, LayoutTemplate, Play, Code,
   PenTool, Megaphone, Zap, Cpu, Copy, Command, BarChart3, Search,
   Globe, Layers, ShieldCheck, ZapIcon, Target, Check, HelpCircle,
   Sparkles, Shield, Star, Monitor, Smartphone, Database, Globe2, Palette,
   History, Award, Activity, FileCode, HeartHandshake, Eye, Lightbulb, Workflow,
   Terminal, Braces, Binary, Bot, ExternalLink
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/TextReveal';
import SpotlightCard from '../components/SpotlightCard';
import ViewOptimizer from '../components/ViewOptimizer';
import IndustrySolutions from '../components/IndustrySolutions';
import GrowthPlans from '../components/GrowthPlans';
import { PILLARS } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';
import { INITIAL_N8N_PROJECTS } from './N8nProjectsData';
import { N8nWorkflowViewer } from '../components/N8nWorkflowViewer';

const STATS = [
   { label: "Delivery Approach", value: "End-to-End", icon: Rocket, color: "text-neon-purple" },
   { label: "Project Scope", value: "Clearly Defined", icon: Trophy, color: "text-neon-blue" },
   { label: "Client Support", value: "Ongoing", icon: Clock, color: "text-green-400" },
];

const ROTATING_WORDS = ["Web Development", "AI Agents & Automations", "Graphic Design", "Growth Systems"];

const SELECTED_PREVIEW_PROJECTS = [
   {
      title: 'CREATOR PROMPTS',
      category: 'SAAS Ecosystem',
      desc: 'A dedicated ecosystem for digital creators and personal brands, offering AI-driven tools, resource hubs, and streamlined branding assets.',
      tags: ['Next.js', 'AI Tools', 'UI/UX'],
      image: 'https://cdn.imgchest.com/files/f7d1c1ce40b3.jpg',
      video: 'https://cdn.imgchest.com/files/800f6ef2e71a.mp4',
      link: 'https://creator.brandique.in',
   },
   {
      title: 'MY FIRST PORTFOLIO',
      category: 'Handcrafted Web Presence',
      desc: 'Developed with complete handcrafted code, showcasing early web design skills, clean responsive layout structures, and fluid component arrangements.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
      image: 'https://cdn.imgchest.com/files/2139b17e3f2c.png',
      link: 'https://mohanwebdeveloper.netlify.app/',
   },
   {
      title: 'ARCAR | SPORTS CAR STORE',
      category: 'UI/UX Interactive Design',
      desc: 'Immersive e-commerce store layout built in Figma targeting high-end luxury sports cars, structured with customized 3D spatial grids.',
      tags: ['Figma', 'UI/UX Layout', 'Visual Concept'],
      image: 'https://cdn.imgchest.com/files/ffa2d64a507b.png',
      link: 'https://www.figma.com/design/krZKRq4Zs2xXXVcI4z6qJw/Car-animation-3D?node-id=0-1&p=f',
   },
   {
      title: 'JJH INTERIORS',
      category: 'Architecture & Design',
      desc: 'A luxury interior design portfolio showcasing high-end residential and commercial architectural projects with a focus on minimalist elegance.',
      tags: ['Design', 'Luxury', 'Portfolio'],
      image: 'https://cdn.imgchest.com/files/c881793b1aa7.jpg',
      link: 'https://interiors.jjhglobalsolutions.com',
   }
];

interface PreviewProjectMediaProps {
   image?: string;
   video?: string;
   title: string;
   workflowJson?: string;
}

const ProjectPreviewMedia: React.FC<PreviewProjectMediaProps> = ({ image, video, title, workflowJson }) => {
   const [showVideo, setShowVideo] = useState(!!video);
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      if (!showVideo && video) {
         timeoutId = setTimeout(() => {
            setShowVideo(true);
         }, 2000);
      }

      return () => {
         if (timeoutId) {
            clearTimeout(timeoutId);
         }
      };
   }, [showVideo, video]);

   useEffect(() => {
      if (showVideo && videoRef.current) {
         videoRef.current.currentTime = 0;
         videoRef.current.play().catch((err) => {
            console.log("Auto-play prevented (expected in certain browser policies):", err);
         });
      }
   }, [showVideo]);

   const handleVideoEnded = () => {
      setShowVideo(false);
   };

   if (workflowJson) {
      return (
         <div className="relative w-full h-full bg-[#17181c] overflow-hidden pointer-events-none">
            <N8nWorkflowViewer workflowJson={workflowJson} height="100%" showControls={false} fitPadding={0.18} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1320]/80 via-transparent to-transparent" />
         </div>
      );
   }

   return (
      <div className="relative w-full h-full overflow-hidden">
         {/* Image layer */}
         {image && (
            <img
               src={image}
               alt={title}
               className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                  showVideo && video ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
               }`}
            />
         )}

         {/* Video layer */}
         {video && (
            <video
               ref={videoRef}
               src={video}
               muted
               playsInline
               onEnded={handleVideoEnded}
               className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                  showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
               }`}
            />
         )}
      </div>
   );
};

const Home: React.FC = () => {
   const { getRawPhone, projects, n8nProjects } = useSiteSettings();
   const { openInquiry } = useInquiry();
   const activeProjects = projects.filter(p => !p.isDeleted);
   const mainPreviewProjects = activeProjects.length > 0 ? activeProjects.slice(0, 4) : SELECTED_PREVIEW_PROJECTS;

   const activeN8nProjects = (n8nProjects || []).filter(p => !p.isDeleted);
   const quotationProject = activeN8nProjects.find(p => p.title.toLowerCase().includes('quotation')) || INITIAL_N8N_PROJECTS[0];
   const instagramProject = activeN8nProjects.find(p => p.title.toLowerCase().includes('instagram')) || INITIAL_N8N_PROJECTS[1];
   
   const featuredProjectsList = [
      ...mainPreviewProjects,
      ...(quotationProject ? [quotationProject] : []),
      ...(instagramProject ? [instagramProject] : []),
   ];
   const [currentWordIndex, setCurrentWordIndex] = useState(0);
   const [typedCode, setTypedCode] = useState('');
   const heroRef = useRef<HTMLElement>(null);

   const fullCodeSnippet = `class BrandiQue {
  constructor() {
    this.mission = "Growing Businesses";
    this.stack = ["React", "AI", "Cloud"];
  }

  async launch(project) {
    console.log("Optimizing...");
    await this.engineer(project);
    return "MORE_CUSTOMERS";
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
         <section ref={heroRef} className="relative flex items-center justify-center pt-32 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 w-full overflow-hidden min-h-[75vh] lg:min-h-[85vh]">
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
                  <div className="block lg:hidden mt-[48px]">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                        Websites · AI Agents · Design
                     </div>

                     <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-[22px]">
                        We Build <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-gradient-x bg-[length:200%_auto]">
                           {ROTATING_WORDS[currentWordIndex]}.
                        </span>
                     </h1>

                     <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light border-l-2 border-neon-purple/30 pl-6 mt-6">
                        <TextReveal text="BrandiQue builds the growth system small businesses need: websites that win enquiries, AI agents that reply and follow up 24/7, and design that earns trust." delay={300} />
                     </div>

                     <div className="flex flex-wrap gap-4 mt-8">
                        <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-neon-purple/20 text-sm md:text-base">
                           Get a Free Growth Audit <ArrowRight size={18} />
                        </button>
                        <Link to="/pricing" className="px-6 py-3.5 border border-gray-300 dark:border-white/10 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm md:text-base">
                           See Pricing
                        </Link>
                     </div>
                  </div>

                  {/* ✅ Desktop (lg+): Keep entrance animations */}
                  <div className="hidden lg:block">
                     <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-bold uppercase tracking-widest">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                           Websites · AI Agents · Design
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-4">
                           We Build <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue animate-gradient-x bg-[length:200%_auto]">
                              {ROTATING_WORDS[currentWordIndex]}.
                           </span>
                        </h1>

                        <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light border-l-2 border-neon-purple/30 pl-6 mt-6">
                           <TextReveal text="BrandiQue builds the growth system small businesses need: websites that win enquiries, AI agents that reply and follow up 24/7, and design that earns trust." delay={300} />
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                           <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-neon-purple/20 text-sm md:text-base">
                           Get a Free Growth Audit <ArrowRight size={18} />
                        </button>
                           <Link to="/pricing" className="px-6 py-3.5 border border-gray-300 dark:border-white/10 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm md:text-base">
                              See Pricing
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
                           <span className="text-[10px] text-gray-500 font-mono">SolutionsEngine.js</span>
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
                           {'    '}<span className="text-blue-400">this</span>.<span className="text-pink-400">mission</span> = <span className="text-green-400">"Growing Businesses"</span>;<br />
                           {'    '}<span className="text-blue-400">this</span>.<span className="text-pink-400">stack</span> = [<span className="text-orange-400">"React"</span>, <span className="text-orange-400">"AI"</span>, <span className="text-orange-400">"Cloud"</span>];<br />
                           {'  '}{'}'}<br /><br />
                           {'  '}<span className="text-blue-400">async</span> <span className="text-yellow-400">launch</span>(project) {'{'}<br />
                           {'    '}console.<span className="text-purple-400">log</span>(<span className="text-green-400">"Optimizing..."</span>);<br />
                           {'    '}<span className="text-blue-400">await</span> <span className="text-blue-400">this</span>.<span className="text-purple-400">engineer</span>(project);<br />
                           {'    '}<span className="text-pink-400">return</span> <span className="text-green-400">"MORE_CUSTOMERS"</span>;<br />
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
                           <div className="text-xs font-black text-green-500">READY TO BUILD</div>
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

{/* Ads significantly removed */}

         {/* 2. THE PROBLEM WE SOLVE */}
         <section className="py-20 md:py-24 border-y border-gray-200 dark:border-white/5 bg-white dark:bg-[#05070A]">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
               <ScrollReveal>
                  <div className="max-w-3xl mx-auto text-center">
                     <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">Why businesses lose customers online</p>
                     <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Most customers don't say no. <span className="text-yellow-500">They just never hear back.</span></h2>
                     <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">A slow reply, no follow-up or an outdated look is enough to send a ready-to-buy customer to a competitor. BrandiQue fixes all three with one connected system.</p>
                  </div>
               </ScrollReveal>
               <div className="mt-12 grid gap-5 md:grid-cols-3">
                  {[
                     { icon: Eye, problem: 'They don\'t trust what they see', fix: 'Graphic design and branding that make your business look established on every post, ad and profile.' },
                     { icon: Globe, problem: 'They can\'t find or understand you', fix: 'A fast website that explains your offer in seconds and puts WhatsApp, call and enquiry buttons everywhere.' },
                     { icon: Bot, problem: 'Nobody replies or follows up', fix: 'AI agents that answer 24/7, capture every lead and follow up automatically until the customer decides.' },
                  ].map((item, i) => (
                     <ScrollReveal key={item.problem} delay={`delay-${i * 100}`}>
                        <div className="h-full rounded-[28px] border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-white/10 dark:bg-[#0D1017]">
                           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><item.icon size={24} /></div>
                           <h3 className="mt-6 text-xl font-bold">{item.problem}</h3>
                           <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.fix}</p>
                        </div>
                     </ScrollReveal>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. THREE CORE SERVICES */}
         <section id="services" className="py-20 md:py-28 bg-gray-50 dark:bg-[#05070A]">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
               <ScrollReveal>
                  <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                     <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">What we do</p>
                     <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Three services. <span className="text-yellow-500">One growth team.</span></h2>
                     <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">Use one service on its own, or combine all three so your design, website and automations work together.</p>
                  </div>
               </ScrollReveal>
               <div className="grid gap-5 lg:gap-6 md:grid-cols-3">
                  {PILLARS.map((pillar, i) => {
                     const PillarIcon = pillar.id === 'web' ? Code : pillar.id === 'ai' ? Bot : Palette;
                     return (
                        <ScrollReveal key={pillar.id} delay={`delay-${i * 100}`}>
                           <article className="group flex h-full flex-col rounded-[28px] border border-gray-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0D1017]">
                              <div className="flex items-center justify-between">
                                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black"><PillarIcon size={24} /></div>
                                 <span className="text-xs font-bold tracking-[0.2em] text-gray-400">{pillar.number}</span>
                              </div>
                              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 dark:text-yellow-300">{pillar.outcome}</p>
                              <h3 className="mt-2 text-2xl font-bold tracking-tight">{pillar.title}</h3>
                              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{pillar.description}</p>
                              <ul className="mt-6 flex-1 space-y-3">
                                 {pillar.points.map(point => (
                                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"><Check size={16} className="mt-0.5 shrink-0 text-yellow-500" />{point}</li>
                                 ))}
                              </ul>
                              <div className="mt-7 flex items-end justify-between border-t border-gray-200 pt-5 dark:border-white/10">
                                 <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Starting at</div>
                                    <div className="text-2xl font-black tracking-tight">{pillar.startingAt}</div>
                                 </div>
                                 <Link to={pillar.href} className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400">Explore <ArrowRight size={14} /></Link>
                              </div>
                           </article>
                        </ScrollReveal>
                     );
                  })}
               </div>
               <ScrollReveal>
                  <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
                     <span className="text-sm text-gray-500 dark:text-gray-400">Also available: WordPress & CMS, brand identity and content marketing.</span>
                     <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:gap-2.5 transition-all">All services <ArrowRight size={14} /></Link>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 4. HOW THE SYSTEM WORKS */}
         <section className="py-20 md:py-24 bg-white dark:bg-[#080A0F] border-y border-gray-200 dark:border-white/5">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
               <ScrollReveal>
                  <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight">From first look to <span className="text-yellow-500">paying customer.</span></h2>
               </ScrollReveal>
               <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                     { step: '01', icon: Palette, title: 'Attract', text: 'On-brand posts and ads make people stop scrolling and trust you.' },
                     { step: '02', icon: Globe, title: 'Convert', text: 'Your website turns that interest into a WhatsApp message, call or form.' },
                     { step: '03', icon: Bot, title: 'Automate', text: 'AI replies instantly, logs the lead and follows up without you.' },
                     { step: '04', icon: BarChart3, title: 'Grow', text: 'A monthly report shows what worked, and we improve it every month.' },
                  ].map((item, i) => (
                     <ScrollReveal key={item.step} delay={`delay-${i * 100}`}>
                        <div className="relative h-full rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-[#0D1017]">
                           <div className="flex items-center justify-between">
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><item.icon size={21} /></span>
                              <span className="text-xs font-black tracking-[0.2em] text-gray-400">{item.step}</span>
                           </div>
                           <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                           <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.text}</p>
                        </div>
                     </ScrollReveal>
                  ))}
               </div>
            </div>
         </section>

         {/* --- CURATED PROJECTS PREVIEW --- */}
         <section id="projects" className="py-24 bg-white dark:bg-[#05070A] border-t border-gray-200 dark:border-white/5">
            <div className="max-w-[1500px] mx-auto px-6">
               <ScrollReveal>
                  <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                     <span className="text-xs font-bold uppercase tracking-[0.3em] text-neon-purple">Portfolio Highlights</span>
                     <h2 className="text-3xl md:text-5xl font-bold">Featured <span className="text-neon-blue">Creations.</span></h2>
                     <p className="text-gray-500 text-lg font-light">A curated showcase spanning bespoke functional applications, agency architectures, and high-fidelity interactive designs.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-12">
                     {featuredProjectsList.map((project: any, idx) => {
                        const isWorkflow = Boolean(project.workflowJson);
                        const linkUrl = isWorkflow ? '/projects' : (project.link || '/projects');
                        const isExternal = !isWorkflow && linkUrl.startsWith('http');

                        return (
                           <div 
                              key={project.id || idx} 
                              className="group flex flex-col bg-gray-50 dark:bg-[#0A0C11] rounded-2xl md:rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden hover:border-neon-purple/30 transition-all duration-500 hover:shadow-2xl"
                           >
                              {/* Media layer */}
                              <div className="relative aspect-[16/9] w-full bg-gray-900 border-b border-gray-100 dark:border-white/5">
                                 <ProjectPreviewMedia 
                                    image={project.image} 
                                    video={"video" in project ? project.video : undefined} 
                                    title={project.title} 
                                    workflowJson={project.workflowJson}
                                 />
                                 <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/60 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold tracking-wider rounded-full text-white uppercase z-10">
                                    {project.category || 'Automation'}
                                 </div>
                              </div>

                              {/* Content layer */}
                              <div className="p-3 md:p-8 flex-grow flex flex-col justify-between space-y-3 md:space-y-6">
                                 <div className="space-y-1.5 md:space-y-3">
                                    <h3 className="text-xs md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors flex items-center gap-1 md:gap-2 uppercase line-clamp-2 md:line-clamp-none">
                                       {project.title}
                                    </h3>
                                    <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed line-clamp-2 md:line-clamp-none">
                                       {project.desc}
                                    </p>
                                 </div>

                                 <div className="flex flex-wrap gap-1 md:gap-2 pt-1 md:pt-2">
                                    {(project.tags || []).map((tag: string, tIdx: number) => (
                                       <span 
                                          key={tIdx} 
                                          className="text-[8px] md:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 md:px-2.5 md:py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 rounded-full"
                                       >
                                          #{tag}
                                       </span>
                                    ))}
                                 </div>

                                 <div className="pt-2 md:pt-4 border-t border-gray-200/50 dark:border-white/5 flex justify-end">
                                    {isExternal ? (
                                       <a 
                                          href={linkUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="inline-flex items-center gap-1 md:gap-2 text-[9px] md:text-xs font-bold uppercase tracking-widest text-neon-purple hover:text-neon-blue transition-colors"
                                       >
                                          Launch Concept <ExternalLink className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                       </a>
                                    ) : (
                                       <Link 
                                          to={linkUrl} 
                                          className="inline-flex items-center gap-1 md:gap-2 text-[9px] md:text-xs font-bold uppercase tracking-widest text-neon-purple hover:text-neon-blue transition-colors"
                                       >
                                          View Creation <ArrowRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                       </Link>
                                    )}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <div className="flex flex-col items-center justify-center pt-16">
                     <Link 
                        to="/projects" 
                        className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 shadow-xl hover:shadow-neon-purple/20 text-sm tracking-wider uppercase"
                     >
                        Click Here for More Projects <ArrowRight size={16} />
                     </Link>
                     <p className="text-xs text-gray-400 mt-4 font-light uppercase tracking-wider">Unveiling our comprehensive suite of codebases and 3D mockups</p>
                  </div>
               </ScrollReveal>
            </div>
         </section>

         {/* 5. INDUSTRY SOLUTIONS */}
         <IndustrySolutions compact />

         {/* 6. MONTHLY GROWTH PLANS */}
         <GrowthPlans />

         {/* 7. PROCESS */}
         <section className="py-20 md:py-24 max-w-6xl mx-auto px-4 md:px-6 text-center">
            <ScrollReveal>
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Live in weeks, <span className="text-yellow-500">not months.</span></h2>
               <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">A simple, fixed process so you always know what happens next and what it costs.</p>
               <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
                  {[
                     { step: '01', title: 'Free growth audit', text: 'We review your website, WhatsApp and social presence and share 3 practical fixes.', icon: Search },
                     { step: '02', title: 'Fixed proposal', text: 'You get the scope, timeline and price in writing before anything starts.', icon: Target },
                     { step: '03', title: 'Build & launch', text: 'Most projects go live in 1 to 4 weeks, tested on mobile and desktop.', icon: Rocket },
                     { step: '04', title: 'Grow every month', text: 'Optional monthly plan for updates, creatives, AI tuning and reports.', icon: BarChart3 },
                  ].map((item) => (
                     <div key={item.step} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0F1320]">
                        <div className="flex items-center gap-3">
                           <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">{item.step}</span>
                           <item.icon size={20} className="text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <h3 className="mt-5 font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.text}</p>
                     </div>
                  ))}
               </div>
            </ScrollReveal>
         </section>

         {/* 8. WHY BRANDIQUE */}
         <section className="py-20 md:py-28 bg-white dark:bg-[#080A0F] border-y border-gray-200 dark:border-white/5">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
               <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                  <ScrollReveal>
                     <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">Why BrandiQue</p>
                     <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Not just a website. <span className="text-yellow-500">A system that keeps working.</span></h2>
                     <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">BrandiQue is a founder-led studio from Visakhapatnam combining AI engineering, web development and design. You work directly with the people building your system, not a chain of account managers.</p>
                     <Link to="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:gap-3 transition-all">Meet the founder <ArrowRight size={16} /></Link>
                  </ScrollReveal>
                  <div className="grid gap-4 sm:grid-cols-2">
                     {[
                        { icon: Layers, title: 'One team for everything', text: 'Design, website and AI built together, so nothing breaks between three vendors.' },
                        { icon: ShieldCheck, title: 'Fixed written quotes', text: 'Clear deliverables and prices before work starts. No hidden extras.' },
                        { icon: HeartHandshake, title: 'You own it all', text: 'Your website, designs and workflows belong to you after final payment.' },
                        { icon: Workflow, title: 'Real automation skills', text: 'Working n8n and AI agent builds for WhatsApp, Telegram, quotations and more.' },
                     ].map((item, i) => (
                        <ScrollReveal key={item.title} delay={`delay-${(i % 2) * 100}`}>
                           <div className="h-full rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-[#0D1017]">
                              <item.icon size={22} className="text-yellow-600 dark:text-yellow-300" />
                              <h3 className="mt-4 font-bold">{item.title}</h3>
                              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.text}</p>
                           </div>
                        </ScrollReveal>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 9. FAQ */}
         <section id="faq" className="py-20 md:py-24 bg-gray-50 dark:bg-[#0A0C11]/50">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
               <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight">Frequently asked <span className="text-yellow-500">questions.</span></h2>
               <div className="grid md:grid-cols-2 gap-5">
                  {[
                     { q: 'What does the free growth audit include?', a: 'We look at your website (or lack of one), Google and social presence and how fast enquiries get answered, then send 3 practical fixes. There is no obligation to buy.' },
                     { q: 'Do I need all three services?', a: 'No. Many clients start with one, like a website or a WhatsApp chatbot, and add the rest when they are ready.' },
                     { q: 'Can the AI assistant reply in Telugu or Hindi?', a: 'Yes, AI assistants can be set up to understand and reply in the languages your customers use, and to hand over to a person when needed.' },
                     { q: 'Do you work with businesses outside Visakhapatnam?', a: 'Yes. We work remotely with businesses across India and abroad over WhatsApp, calls and video meetings.' },
                  ].map((faq) => (
                     <ScrollReveal key={faq.q} className="p-6 bg-white dark:bg-[#0F1320] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="font-bold mb-3 flex items-start gap-2"><HelpCircle size={16} className="mt-1 shrink-0 text-yellow-500" /> {faq.q}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                     </ScrollReveal>
                  ))}
               </div>
               <div className="mt-8 text-center">
                  <Link to="/pricing#pricing-faq" className="inline-flex items-center gap-2 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:gap-3 transition-all">Pricing and payment questions <ArrowRight size={15} /></Link>
               </div>
            </div>
         </section>

         {/* 11. FINAL CTA (PAGE ENDING) */}
         <section id="contact" className="py-32 relative overflow-hidden text-center bg-white dark:bg-[#05070A] border-t border-gray-100 dark:border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
            <ScrollReveal>
               <div className="max-w-[1500px] mx-auto px-6 space-y-10 relative z-10">
                  <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter">Ready to get more <br /><span className="text-neon-blue text-gradient">customers on autopilot?</span></h2>
                  <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto">Start with a free growth audit. We'll show you exactly where you're losing enquiries and what to fix first.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                     <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3">
                        Get My Free Audit <ArrowRight size={20} />
                     </button>
                     <a href={`tel:${getRawPhone()}`} className="px-10 py-5 border border-gray-300 dark:border-white/10 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                        Call Us
                     </a>
                  </div>
                  <div className="pt-20 opacity-30">
                     <img
                        src="https://cdn.imgchest.com/files/1b3230978aa9.png"
                        alt="Logo"
                        onContextMenu={(e) => e.preventDefault()}
                        className="h-12 md:h-16 mx-auto object-contain hidden dark:block"
                     />
                     <img
                        src="https://cdn.imgchest.com/files/c912299e5353.png"
                        alt="Logo"
                        onContextMenu={(e) => e.preventDefault()}
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