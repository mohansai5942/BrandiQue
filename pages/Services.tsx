import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, LayoutTemplate, PenTool, Megaphone, ShieldCheck, ZapIcon, Globe } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Services: React.FC = () => {
  const SERVICES_LIST = [
    {
      title: "Full-Stack Web Development",
      description: "Custom-coded, high-performance websites built with React, Next.js, and modern technologies for maximum speed and scalability.",
      fullText: "Our full-stack solutions are engineered for businesses that demand zero compromise. We build robust frontends using React and Next.js, ensuring your users enjoy a seamless, app-like experience. Our development process includes technical SEO, mobile optimization, and secure API integrations to ensure your site is a long-term business powerhouse.",
      icon: Code,
      link: "/services/full-stack",
      color: "text-neon-purple",
      bgHover: "hover:border-neon-purple/50",
      gradient: "from-neon-purple/20 to-blue-500/20"
    },
    {
      title: "WordPress Development",
      description: "User-friendly, manageable websites built on WordPress. Perfect for blogs, business sites, and clients who need easy content updates.",
      fullText: "For clients needing ultimate flexibility, we deliver high-performance WordPress builds. We move beyond generic themes, creating custom-tailored blocks and sections that allow you to manage your content effortlessly while maintaining a premium aesthetic. We prioritize security and speed, ensuring your CMS doesn't slow down your business growth.",
      icon: LayoutTemplate,
      link: "/services/wordpress",
      color: "text-blue-400",
      bgHover: "hover:border-blue-400/50",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Branding & Identity",
      description: "Complete visual identity creation including logos, color palettes, typography, and style guides to make your brand unforgettable.",
      fullText: "A great product needs a great brand. We bridge the gap between utility and emotion by crafting unique visual identities. From logo conceptualization to full-scale brand style guides and 3D mockups, we ensure your business speaks a consistent and professional language across every digital and physical touchpoint.",
      icon: PenTool,
      link: "/services/branding",
      color: "text-pink-400",
      bgHover: "hover:border-pink-400/50",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      title: "Digital Marketing",
      description: "Strategic social media creatives and digital content designed to engage audiences, boost reach, and drive conversions.",
      fullText: "Build your presence where your customers are. Our marketing services focus on high-engagement creatives, thumb-stopping social media content, and strategic digital campaigns. We help you tell your story through visuals that resonate, helping you convert followers into loyal brand advocates.",
      icon: Megaphone,
      link: "/services/digital-marketing",
      color: "text-green-400",
      bgHover: "hover:border-green-400/50",
      gradient: "from-green-500/20 to-teal-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-20 px-4 md:px-6 max-w-[1400px] mx-auto w-full relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 hidden lg:block">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[150px] animate-pulse-glow"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16 md:mb-20 lg:mb-32">
         <ScrollReveal>
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white leading-tight">
               Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-black dark:via-white to-neon-blue animate-gradient-x bg-[length:200%_auto]">Services</span>
             </h1>
             <p className="text-sm md:text-base lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
               Everything you need to build, brand, and grow your online presence. From pixel-perfect code to stunning visual identities.
             </p>
         </ScrollReveal>
      </div>

      {/* DETAILED SERVICE NARRATIVE (AdSense Content) */}
      <section className="mb-24 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ScrollReveal>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Comprehensive Solutions for the Digital Era</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At BrandiQue, we understand that the digital world is integrated. A website doesn't exist in a vacuum; it is the cornerstone of your brand's digital ecosystem. That's why we offer a holistic suite of services designed to work together in harmony. Whether you are launching a new startup or revitalizing an existing brand, our strategic approach ensures that every pixel and every line of code serves a specific business purpose.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay="delay-100" className="space-y-4">
              <div className="flex items-center gap-2 text-neon-purple font-bold">
                <ZapIcon size={18} /> Performance
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Speed is the most critical metric. We optimize for high-speed delivery to ensure zero bounce rates and maximum user retention.
              </p>
            </ScrollReveal>
            <ScrollReveal delay="delay-200" className="space-y-4">
              <div className="flex items-center gap-2 text-neon-blue font-bold">
                <ShieldCheck size={18} /> Security
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Protecting your data and your users' privacy is our top priority. We implement modern security protocols across every build.
              </p>
            </ScrollReveal>
            <ScrollReveal delay="delay-300" className="space-y-4">
              <div className="flex items-center gap-2 text-green-500 font-bold">
                <Globe size={18} /> Visibility
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Search Engine Optimization is baked into our workflow, not added as an afterthought. We ensure Google loves your site.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Service Grid */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
         {SERVICES_LIST.map((service, index) => (
            <ScrollReveal key={index} delay={`delay-${index * 100}`}>
               <Link 
                  to={service.link}
                  className={`group relative flex flex-col justify-between h-full bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 lg:p-12 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${service.bgHover}`}
               >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none`}></div>
                  
                  <div className="relative z-10">
                     <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 md:mb-8 ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                     </div>
                     
                     <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 group-hover:translate-x-2 transition-transform duration-300">{service.title}</h3>
                     <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-lg leading-relaxed mb-4">{service.description}</p>
                     <p className="text-gray-500 dark:text-gray-500 text-[10px] md:text-xs lg:text-sm leading-relaxed mb-6 md:mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{service.fullText}</p>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 md:gap-3 text-xs md:text-xs lg:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-white dark:opacity-60 group-hover:text-black dark:group-hover:text-white group-hover:opacity-100 transition-all">
                     Explore Service <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
               </Link>
            </ScrollReveal>
         ))}
      </div>

    </div>
  );
};

export default Services;