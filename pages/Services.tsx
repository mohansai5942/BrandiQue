import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, LayoutTemplate, PenTool, Megaphone, Check, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Services: React.FC = () => {
  const SERVICES_LIST = [
    {
      title: "Full-Stack Development",
      description: "Custom-coded, high-performance websites built with React and Next.js.",
      icon: Code,
      link: "/services/full-stack",
      color: "text-neon-purple",
      features: ["Next.js/React", "Custom UI", "SEO Ready"]
    },
    {
      title: "WordPress Development",
      description: "User-friendly, scalable websites built with custom tailored block configurations.",
      icon: LayoutTemplate,
      link: "/services/wordpress",
      color: "text-blue-400",
      features: ["Custom CMS", "Easy Admin", "Fast Load"]
    },
    {
      title: "Branding & Identity",
      description: "Complete visual identity including logos, color palettes, and 3D mockups.",
      icon: PenTool,
      link: "/services/branding",
      color: "text-pink-400",
      features: ["Logo Design", "3D Mockups", "Brand Guides"]
    },
    {
      title: "Digital Marketing",
      description: "Strategic social creatives designed to engage audiences and boost reach.",
      icon: Megaphone,
      link: "/services/digital-marketing",
      color: "text-green-400",
      features: ["Social Creatives", "Viral Growth", "Content Strategy"]
    }
  ];

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-[1500px] mx-auto w-full relative overflow-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <div className="text-center mb-24">
         <ScrollReveal>
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-6 shadow-sm mx-auto">
                <Sparkles size={14} className="text-neon-purple" />
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase">Expert Agency Services</span>
             </div>
             <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight leading-[1.1]">
               Our <span className="text-neon-purple">Expertise.</span>
             </h1>
             <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed font-light">Expert digital solutions engineered for growth and aesthetic authority.</p>
         </ScrollReveal>
      </div>

      {/* 2. SERVICES GRID */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
         {SERVICES_LIST.map((service, index) => (
            <ScrollReveal key={index} delay={`delay-${index * 100}`}>
               <Link to={service.link} className="group relative flex flex-col justify-between h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[40px] p-10 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:border-neon-purple/30 shadow-xl">
                  <div>
                     <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-8 ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><service.icon size={30} /></div>
                     <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{service.title}</h3>
                     <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 font-light">{service.description}</p>
                     
                     <div className="flex flex-wrap gap-2 mb-10">
                        {service.features.map((f, i) => (
                           <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase text-gray-500 tracking-wider border border-gray-200 dark:border-white/5">{f}</span>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neon-purple">Explore Service <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></div>
               </Link>
            </ScrollReveal>
         ))}
      </div>

      {/* 3. CTA ENDING */}
      <div className="mt-32 text-center py-24 bg-gray-100 dark:bg-[#0A0C11] rounded-[48px] border border-gray-200 dark:border-white/10">
         <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Need a Custom Quote?</h2>
            <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto font-light">We offer bespoke plans tailored to your unique project requirements.</p>
            <Link to="/contact" className="px-10 py-4 bg-neon-purple text-white rounded-full font-bold shadow-lg shadow-neon-purple/30 hover:scale-105 transition-transform inline-flex items-center gap-3">Contact Agency <ArrowRight size={20} /></Link>
         </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;