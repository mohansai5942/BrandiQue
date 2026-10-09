import React, { useState, useEffect } from 'react';
import { Check, Shield, MessageCircle, Star, ArrowRight, Clock, Lock, Sparkles, Zap, LayoutTemplate, ChevronDown, ChevronUp, Globe, Server, Code, Palette, Smartphone, Search, Database, Trophy, Rocket, Target, ShieldCheck, HelpCircle, User, Briefcase, ShoppingCart, Package, Layers, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

;

const FAQ_ITEMS = [
  { q: "Standard Delivery Time entha?", a: "Standard projects 7-14 days lo complete chestam. Complex e-commerce sites ki 3-4 weeks padutundi." },
  { q: "Hosting and Domain include ayyi untunda?", a: "Memu configuration help chestam. Mana plans lo technical setup guidance free ga untundi." },
  { q: "Technical SEO support untunda?", a: "Every build includes technical SEO foundations and agreed page checks. Search rankings and Core Web Vitals depend on hosting, content, third-party scripts and real-world usage, so specific scores or rankings are not guaranteed." },
  { q: "Maintenance services provide chestara?", a: "Avunu, memu monthly maintenance mariyu post-launch support plans kuda offer chestunnam." }
];

const WebDevelopment = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-[1500px] mx-auto w-full relative overflow-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="text-center mb-24 lg:mb-32">
        <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-yellow-300 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
               <Zap size={14} /> Transparent Scope & Pricing
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
              Web Design <br/> <span className="text-neon-purple text-gradient">Starter Kits.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Thoughtful design, reliable implementation and clearly scoped deliverables. Choose a starting package and we will confirm the final scope before work begins.
            </p>
        </ScrollReveal>
      </section>

      {/* 2. PRICING PACKAGES */}
      <section id="pricing" className="mb-32">
         {/* 2. OVERVIEW */}
         <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
               <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Website Types & Pricing</h3>
               <div className="h-1 w-20 bg-neon-purple mx-auto rounded-full mb-6"></div>
               <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">Explore our pricing models for various website types. Choose between Full Stack Custom Coding or WordPress Development based on your needs.</p>
            </div>
         </ScrollReveal>

         <div className="space-y-12">
            {[
               {
                  id: "personal",
                  title: "Personal Website",
                  icon: User,
                  desc: "We create personal websites that represent you professionally online with custom design, profile sections, and resume integration.",
                  customPrice: "₹9,000",
                  wpPrice: "₹9,000"
               },
               {
                  id: "portfolio",
                  title: "Portfolio Website",
                  icon: Palette,
                  desc: "Showcase your work effectively with project galleries, case studies, and smooth animations.",
                  customPrice: "₹11,000",
                  wpPrice: "₹11,000"
               },
               {
                  id: "business",
                  title: "Business Website",
                  icon: Briefcase,
                  desc: "Professional business websites with detailed service pages, lead generation forms, and SEO-friendly structures.",
                  customPrice: "₹15,000",
                  wpPrice: "₹15,000"
               },
               {
                  id: "ecommerce",
                  title: "E-Commerce Website",
                  icon: ShoppingCart,
                  desc: "Fully functional online stores with product management, secure payment integration, and order tracking.",
                  customPrice: "₹25,000",
                  wpPrice: "₹25,000"
               }
            ].map((pkg, idx) => (
               <ScrollReveal key={idx} delay={`delay-${(idx%2)*100}`}>
                  <div className="bg-white dark:bg-[#0F1320] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-xl overflow-hidden group">
                     {/* Header part */}
                     <div className="p-6 md:p-8 border-b border-gray-200 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-gray-900 dark:text-white pointer-events-none transition-transform duration-500 group-hover:scale-110">
                           <pkg.icon size={100} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                              <div className="flex items-center gap-4 mb-3">
                                 <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-900 dark:text-white shrink-0">
                                    <pkg.icon size={24} />
                                 </div>
                                 <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{pkg.title}</h4>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-3xl relative z-10">{pkg.desc}</p>
                           </div>
                        </div>
                     </div>

                     {/* Options grid */}
                     <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/5">
                        
                        {/* Custom Coding Option */}
                        <div className="p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors flex flex-col items-start h-full">
                           <div className="flex items-center gap-2 mb-4">
                              <Code size={18} className="text-neon-purple"/>
                              <h5 className="font-bold text-lg text-gray-900 dark:text-white">Full Stack Custom Coding</h5>
                           </div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                              High-performance, completely custom-coded. Best for unique designs and maximum speed.
                           </p>
                           <div className="mb-6">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Starting from</p>
                              <p className="text-2xl font-black text-neon-purple">{pkg.customPrice}</p>
                           </div>
                           <Link to={`/services/full-stack#${pkg.id}`} className="mt-auto w-full inline-flex items-center justify-between px-6 py-3.5 bg-gray-900 dark:bg-[#151A25] hover:bg-neon-purple dark:hover:bg-neon-purple text-white rounded-xl font-bold text-sm transition-all shadow-md group-hover:shadow-lg">
                              <span>Full Stack Details</span>
                              <ArrowRight size={16} />
                           </Link>
                        </div>

                        {/* WordPress Option */}
                        <div className="p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors flex flex-col items-start h-full">
                           <div className="flex items-center gap-2 mb-4">
                              <LayoutTemplate size={18} className="text-blue-500"/>
                              <h5 className="font-bold text-lg text-gray-900 dark:text-white">WordPress Development</h5>
                           </div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                              Flexible, easily manageable, and fast-to-deploy built on the world's most popular CMS.
                           </p>
                           <div className="mb-6">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Starting from</p>
                              <p className="text-2xl font-black text-blue-500">{pkg.wpPrice}</p>
                           </div>
                           <Link to={`/services/wordpress#${pkg.id}`} className="mt-auto w-full inline-flex items-center justify-between px-6 py-3.5 bg-gray-900 dark:bg-[#151A25] hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-md group-hover:shadow-lg">
                              <span>WordPress Details</span>
                              <ArrowRight size={16} />
                           </Link>
                        </div>

                     </div>
                  </div>
               </ScrollReveal>
            ))}
         </div>
      </section>

      {/* 3. DETAILED DELIVERABLES */}
      <section className="py-24 bg-white dark:bg-[#0A0C11]/50 border-y border-gray-100 dark:border-white/5 rounded-[48px] px-8 md:px-16 mb-32">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">What makes our <br/><span className="text-neon-blue">Engineering</span> different?</h2>
               <p className="text-gray-500 text-lg mb-12 font-light leading-relaxed">
                  Unlike Solutions Providers that sell generic WordPress templates, BrandiQue focuses on strategic digital engineering. Every "Starter Kit" is built with a long-term vision.
               </p>
               <div className="space-y-8">
                  {[
                    { title: "Technical SEO & Schema", desc: "Structured data and semantic HTML architecture included for maximum search engine reach.", icon: Target },
                    { title: "Lightning Load Speeds", desc: "We optimize every image, script, and asset for sub-second performance.", icon: Zap },
                    { title: "Enterprise Security", desc: "Clean code protocols ensure your site is protected against standard vulnerabilities.", icon: ShieldCheck }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6">
                       <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue shrink-0"><item.icon size={24} /></div>
                       <div>
                          <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </ScrollReveal>
            <div className="relative">
               <div className="absolute inset-0 bg-neon-purple/10 rounded-full blur-[100px] animate-pulse-glow"></div>
               <div className="bg-[#05070A] rounded-3xl border border-white/10 p-10 font-mono text-sm text-gray-500 relative z-10 shadow-2xl">
                  <div className="flex gap-2 mb-8">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-blue-400 mb-2">// BrandiQue Quality Checklist</p>
                  <p className="text-white mb-2">const launchChecks = {'{'}</p>
                  <p className="pl-6">Performance: <span className="text-green-400">"Measured before launch"</span>,</p>
                  <p className="pl-6">Accessibility: <span className="text-green-400">"Reviewed"</span>,</p>
                  <p className="pl-6">SEO: <span className="text-yellow-400">"Technical foundations"</span>,</p>
                  <p className="pl-6">Forms: <span className="text-yellow-400">"Submission tested"</span></p>
                  <p className="text-white">{'}'};</p>
                  <div className="mt-8 pt-8 border-t border-white/5">
                     <p className="text-gray-600 italic">"Engineering excellence is our default."</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. PROCESS STEP-BY-STEP */}
      <section className="mb-32">
         <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Development Journey.</h2>
            <div className="w-20 h-1.5 bg-neon-purple mx-auto rounded-full"></div>
         </ScrollReveal>
         <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Onboarding", desc: "Understanding your brand vision and requirements.", icon: MessageCircle },
              { step: "02", title: "Architecture", desc: "Designing the UI/UX and site structure.", icon: Palette },
              { step: "03", title: "Development", desc: "Engineering the code with modern frameworks.", icon: Code },
              { step: "04", title: "Deployment", desc: "Optimizing speed and going live globally.", icon: Rocket }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={`delay-${i*100}`}>
                 <div className="p-8 bg-white dark:bg-[#0F1320] border border-gray-100 dark:border-white/5 rounded-3xl text-center group hover:bg-neon-purple hover:border-neon-purple transition-all duration-500">
                    <div className="text-5xl font-black text-gray-100 dark:text-white/5 mb-6 group-hover:text-white/20 transition-colors">{item.step}</div>
                    <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-white transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light group-hover:text-white/80 transition-colors">{item.desc}</p>
                 </div>
              </ScrollReveal>
            ))}
         </div>
      </section>

      {/* 5. FULL FAQ SECTION */}
      <section id="faq" className="py-24 bg-gray-50 dark:bg-white/[0.02] rounded-[48px] border border-gray-200 dark:border-white/5 px-6 md:px-12 mb-32">
         <div className="max-w-[1500px] mx-auto">
            <ScrollReveal className="text-center mb-16">
               <h2 className="text-3xl font-bold">Frequently Asked <span className="text-neon-purple">Questions.</span></h2>
            </ScrollReveal>
            <div className="space-y-4 max-w-3xl mx-auto">
               {FAQ_ITEMS.map((faq, i) => (
                 <ScrollReveal key={i} delay={`delay-${i*50}`}>
                    <div className="bg-white dark:bg-[#0A0C11] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                       <button 
                         onClick={() => setOpenFaq(openFaq === i ? null : i)}
                         className="w-full flex items-center justify-between p-6 text-left"
                       >
                          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-3"><HelpCircle size={18} className="text-neon-purple" /> {faq.q}</span>
                          {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                       </button>
                       <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 p-6 pt-0 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">{faq.a}</p>
                       </div>
                    </div>
                 </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="text-center py-12">
          <ScrollReveal>
             <h2 className="text-3xl md:text-5xl font-bold mb-8">Need a Custom Enterprise Solution?</h2>
             <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto font-light">If you have specific requirements or a large-scale project, contact us for a personalized quote tailored to your budget.</p>
             <Link to="/contact" className="px-10 py-5 bg-neon-purple text-white rounded-full font-bold text-lg shadow-xl shadow-neon-purple/30 hover:scale-105 transition-transform inline-flex items-center gap-3">
                Book Consultation <ArrowRight size={22} />
             </Link>
          </ScrollReveal>
      </section>

    </div>
  );
};

export default WebDevelopment;