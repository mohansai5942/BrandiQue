import React, { useState, useEffect } from 'react';
import { Check, Shield, MessageCircle, Star, ArrowRight, Clock, Lock, Sparkles, Zap, LayoutTemplate, ChevronDown, ChevronUp, Globe, Server, Code, Palette, Smartphone, Search, Database, Trophy, Rocket, Target, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const SERVICES = [
  {
    id: "personal",
    title: "Personal Website",
    price: "9,000",
    oldPrice: "18,000",
    tagline: "For Individuals & Portfolios",
    icon: Sparkles,
    features: ["Custom React/Next.js Build", "5 Pages Included", "Mobile Responsive", "Contact Form Integration", "Basic Technical SEO", "7-Day Fast Delivery"]
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    price: "9,000",
    oldPrice: "18,000",
    tagline: "For Creators & Artists",
    icon: Palette,
    features: ["High-End Visual Gallery", "3D Motion Effects", "Custom Brand Integration", "Mobile Optimized", "Domain & Hosting Setup", "10-Day Delivery"]
  },
  {
    id: "business",
    title: "Business Website",
    price: "10,999",
    oldPrice: "22,000",
    tagline: "For Agencies & Startups",
    icon: LayoutTemplate,
    features: ["Multi-Page Architecture", "Lead Generation Focus", "Google Maps & WhatsApp", "Speed Optimization", "CMS for Easy Updates", "14-Day Delivery"]
  },
  {
    id: "ecommerce",
    title: "E-commerce Store",
    price: "28,999",
    oldPrice: "58,000",
    tagline: "For Online Sellers",
    icon: Lock,
    features: ["Full Product Catalog", "Secure Payment Gateway", "Admin Dashboard", "Inventory Management", "Customer Accounts", "25-Day Pro Delivery"]
  }
];

const FAQ_ITEMS = [
  { q: "Standard Delivery Time entha?", a: "Standard projects 7-14 days lo complete chestam. Complex e-commerce sites ki 3-4 weeks padutundi." },
  { q: "Hosting and Domain include ayyi untunda?", a: "Memu configuration help chestam. Mana plans lo technical setup guidance free ga untundi." },
  { q: "Technical SEO support untunda?", a: "Kachitanga. Memu build chese prati site Core Web Vitals ki optimized ga, SEO-friendly architecture tho untundi." },
  { q: "Maintenance services provide chestara?", a: "Avunu, memu monthly maintenance mariyu post-launch support plans kuda offer chestunnam." }
];

const WebDevelopment = () => {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-[1500px] mx-auto w-full relative overflow-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="text-center mb-24 lg:mb-32">
        <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
               <Zap size={14} /> Limited Time: 50% Agency Discount
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
              Web Design <br/> <span className="text-neon-purple text-gradient">Starter Kits.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              High-performance, custom-coded websites built for business growth. Get premium agency quality at the most competitive market prices.
            </p>
        </ScrollReveal>
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

      {/* 2. PRICING GRID */}
      <section id="pricing" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
         {SERVICES.map((s, i) => (
           <ScrollReveal key={i} delay={`delay-${i*100}`}>
              <div className="relative group p-8 rounded-[40px] bg-white dark:bg-[#0F1320] border border-gray-100 dark:border-white/5 shadow-2xl hover:border-neon-purple/50 transition-all duration-500 flex flex-col h-full">
                 {/* Top Decor */}
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-neon-purple">
                    <s.icon size={80} />
                 </div>
                 
                 <div className="relative z-10 flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-8 text-neon-purple shadow-sm">
                       <s.icon size={30} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-10">{s.tagline}</p>
                    
                    <div className="mb-10">
                       <div className="flex items-end gap-2 mb-1">
                          <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">₹{s.price}</span>
                          <span className="text-sm font-bold text-gray-400 line-through mb-1.5 opacity-60">₹{s.oldPrice}</span>
                       </div>
                       <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Inclusive of everything</p>
                    </div>

                    <ul className="space-y-4 mb-12">
                       {s.features.map((f, idx) => (
                         <li key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-light">{f}</span>
                         </li>
                       ))}
                    </ul>
                 </div>

                 <a 
                   href={`https://wa.me/917093320572?text=Hi, I am interested in the ${s.title} package.`}
                   target="_blank"
                   rel="noreferrer"
                   className="relative z-10 w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm text-center shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   Get Started Now
                 </a>
              </div>
           </ScrollReveal>
         ))}
      </section>

      {/* 3. DETAILED DELIVERABLES */}
      <section className="py-24 bg-white dark:bg-[#0A0C11]/50 border-y border-gray-100 dark:border-white/5 rounded-[48px] px-8 md:px-16 mb-32">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">What makes our <br/><span className="text-neon-blue">Engineering</span> different?</h2>
               <p className="text-gray-500 text-lg mb-12 font-light leading-relaxed">
                  Unlike agencies that sell generic WordPress templates, BrandiQue focuses on strategic digital engineering. Every "Starter Kit" is built with a long-term vision.
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
                  <p className="text-blue-400 mb-2">// BrandiQue Core Vitals</p>
                  <p className="text-white mb-2">const webVitals = {'{'}</p>
                  <p className="pl-6">LCP: <span className="text-green-400">"0.8s"</span>,</p>
                  <p className="pl-6">FID: <span className="text-green-400">"15ms"</span>,</p>
                  <p className="pl-6">CLS: <span className="text-green-400">"0.01"</span>,</p>
                  <p className="pl-6">Accessibility: <span className="text-yellow-400">100</span>,</p>
                  <p className="pl-6">BestPractices: <span className="text-yellow-400">100</span></p>
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
      <section className="py-24 bg-gray-50 dark:bg-white/[0.02] rounded-[48px] border border-gray-200 dark:border-white/5 px-6 md:px-12 mb-32">
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