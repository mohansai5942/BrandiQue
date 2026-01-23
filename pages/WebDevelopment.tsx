import React, { useState, useEffect } from 'react';
import { Check, Shield, MessageCircle, Star, ArrowRight, Clock, Lock, Sparkles, Zap, LayoutTemplate, ChevronDown, ChevronUp, Globe, Server, Code, Palette, Smartphone, Search, Database, Trophy, Rocket, Target, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

// --- Data Configuration ---

const SERVICES = [
  {
    id: "personal",
    key: "personal",
    title: "Personal Website",
    marketPrice: "17,000",
    price: "9,000",
    save: "47%",
    tagline: "Best for Individuals",
    summary: "Establish your digital presence with a high-performance personal site.",
    theme: "green",
    gradient: "from-emerald-400 to-green-500",
    icon: Sparkles,
    timeline: "5–7 Business Days",
    breakdown: [
      { label: "Base Price", value: "₹9,000 (One-time)" },
      { label: "Subdomain", value: "Included (e.g. .netlify.app)" },
      { label: "Custom Domain", value: "Connect for Free (Domain cost ~₹899/yr)" },
      { label: "Hosting", value: "Free Tier Setup Included" }
    ],
    deliverables: [
      "Fully custom-coded site (React/Next.js)",
      "Responsive Mobile-First Design",
      "Basic SEO Setup (Meta tags, OpenGraph)",
      "Google Analytics & Search Console",
      "Contact Form with Email Alerts",
      "Social Media Links Integration",
      "1 Round of Design Revisions"
    ],
    addons: [
      { name: "Blog / News Section", price: "+ ₹3,000" },
      { name: "Dark/Light Mode Toggle", price: "+ ₹1,500" }
    ],
    faqs: [
      { q: "Do I have to pay monthly fees?", a: "No. We optimize your site to run on high-performance free tiers (like Vercel/Netlify) suitable for personal traffic." },
      { q: "Can I update the content?", a: "Yes, we can separate text into a config file, or add a CMS for an additional fee." },
      { q: "Do I own the code?", a: "Absolutely. You receive full source code ownership upon completion." }
    ]
  },
  {
    id: "portfolio",
    key: "portfolio",
    title: "Portfolio Website",
    marketPrice: "20,000",
    price: "9,000",
    save: "55%",
    tagline: "Perfect for Creators",
    summary: "Showcase your work with stunning galleries and smooth animations.",
    theme: "purple",
    gradient: "from-purple-500 to-pink-500",
    icon: Palette,
    timeline: "7–10 Business Days",
    breakdown: [
      { label: "Base Price", value: "₹9,000 (One-time)" },
      { label: "Subdomain", value: "Included" },
      { label: "Custom Domain", value: "Connect for Free" },
      { label: "Hosting", value: "Free Tier Setup Included" }
    ],
    deliverables: [
      "Custom Gallery Layout (Grid/Masonry)",
      "High-Res Image Optimization",
      "Video Background Support",
      "About Me & Resume Section",
      "Project Case Study Templates",
      "Interactive Hover Effects",
      "1 Round of Design Revisions"
    ],
    addons: [
      { name: "CMS Integration (Easy Uploads)", price: "+ ₹5,000" },
      { name: "Advanced Animations (GSAP)", price: "+ ₹4,000" }
    ],
    faqs: [
      { q: "Is it mobile responsive?", a: "Yes, we prioritize mobile views to ensure your work looks great on any device." },
      { q: "How many projects can I add?", a: "We set up the structure for unlimited projects. We will upload the first 6 for you." },
      { q: "Does it support video?", a: "Yes, we can embed YouTube/Vimeo links or optimized background videos." }
    ]
  },
  {
    id: "business",
    key: "business",
    title: "Business Website",
    marketPrice: "30,000",
    price: "10,999",
    save: "63%",
    tagline: "Best for Agencies / Startups",
    summary: "A professional, trustworthy platform to convert visitors into clients.",
    theme: "blue",
    gradient: "from-cyan-500 to-blue-600",
    icon: LayoutTemplate,
    timeline: "10–14 Business Days",
    breakdown: [
      { label: "Base Price", value: "₹10,999 (One-time)" },
      { label: "Domain Setup", value: "Assistance Included" },
      { label: "Business Email", value: "Setup Guide Included" },
      { label: "Hosting", value: "Rec: ₹300-500/mo (VPS/Cloud)" }
    ],
    deliverables: [
      "5-7 Custom Pages (Home, About, Services...)",
      "Lead Generation Forms",
      "Google Maps Integration",
      "Local SEO Optimization",
      "Fast Loading Speed (Core Web Vitals)",
      "Trust Signals & Testimonial Sliders",
      "2 Rounds of Revisions"
    ],
    addons: [
      { name: "Live Chat Integration", price: "+ ₹2,000" },
      { name: "Multi-language Support", price: "+ ₹6,000" }
    ],
    faqs: [
      { q: "Will my site rank on Google?", a: "We implement technical SEO best practices (meta tags, sitemap, schema) to give you the best start." },
      { q: "Can I collect emails?", a: "Yes, we can integrate forms with Mailchimp, ConvertKit, or direct email forwarding." },
      { q: "Do you provide content?", a: "We use placeholder text. You will need to provide the final copy, or we can hire a copywriter for you." }
    ]
  },
  {
    id: "ecommerce",
    key: "ecommerce",
    title: "E-commerce Website",
    marketPrice: "90,000",
    price: "28,999",
    save: "68%",
    tagline: "Sell Online, Fast",
    summary: "Full-featured online store with secure payments and inventory management.",
    theme: "orange",
    gradient: "from-orange-500 to-red-600",
    icon: Lock,
    timeline: "14–21 Business Days",
    breakdown: [
      { label: "Base Price", value: "₹28,999 (One-time)" },
      { label: "Payment Gateway", value: "Razorpay/Stripe Setup" },
      { label: "Product Upload", value: "First 10 Products Included" },
      { label: "Hosting", value: "Rec: ₹800+/mo (Scalable)" }
    ],
    deliverables: [
      "Complete Product Management System",
      "Shopping Cart & Secure Checkout",
      "User Accounts & Order History",
      "Admin Dashboard for Orders",
      "Discount Code Engine",
      "Stock/Inventory Tracking",
      "3 Rounds of Revisions"
    ],
    addons: [
      { name: "Abandoned Cart Recovery", price: "+ ₹5,000" },
      { name: "Wishlist Functionality", price: "+ ₹3,000" }
    ],
    faqs: [
      { q: "Is it secure?", a: "Yes, we use industry-standard encryption and secure payment gateways (Razorpay/Stripe)." },
      { q: "Are there transaction fees?", a: "We don't charge any. Your payment gateway usually charges ~2% per transaction." },
      { q: "Can I manage products easily?", a: "Yes, you get a user-friendly admin dashboard to add/edit products and track orders." }
    ]
  }
];

const WebDevelopment = () => {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const toggleFAQ = (id: string) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-6 max-w-[1400px] mx-auto w-full relative overflow-hidden bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="flex flex-col items-center justify-center mb-12 md:mb-16 lg:mb-24 text-center space-y-4 md:space-y-6 relative z-10">
        <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-[10px] md:text-[10px] lg:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
               <Zap size={12} className="fill-current md:w-[14px]" /> Limited Time Offers
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
               Web Development <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-pink-500 to-neon-blue animate-gradient-x bg-[length:200%_auto]">Starter Kit</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-xl max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8">
               Premium, custom-coded websites at a fraction of the market cost. Secure your digital future today.
            </p>

            <a 
               href="https://wa.me/917093320572?text=Hi%20I%20want%20a%20website%20quote" 
               target="_blank" 
               rel="noreferrer"
               className="px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-xs md:text-sm lg:text-lg rounded-full hover:scale-105 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 group"
            >
               Claim This Offer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform md:w-[20px]" />
            </a>
        </ScrollReveal>
      </section>


      {/* --- PRICE COMPARISON SECTION --- */}
      <section className="px-0 md:px-0 mb-16 md:mb-24 lg:mb-32 relative z-20">
         <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-6">
               
               {/* Box 1: Personal */}
               <div className="relative bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-2xl p-6 group hover:-translate-y-2 transition-all duration-300 shadow-xl dark:shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 dark:bg-white/5 backdrop-blur-md border-b border-x border-gray-200 dark:border-white/10 px-3 py-1 rounded-b-lg text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 w-max z-10">
                     Best for Individuals
                  </div>
                  <div className="mt-8 space-y-4 md:space-y-5 relative z-10 flex-1">
                     <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white text-center">Personal Website</h3>
                     <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                           <span>Real Market Price</span>
                           <span>Our Special Price</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-red-500/70 line-through text-xs md:text-xs lg:text-sm font-medium">₹17,000</span>
                           <span className="text-green-500 dark:text-green-400 text-xl md:text-xl lg:text-2xl font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">₹9,000</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg">
                            <Check size={12} /> Save 47%
                         </div>
                     </div>
                  </div>
                  <div className="mt-6 relative z-10">
                      <button onClick={() => scrollToId('personal')} className="w-full py-2.5 md:py-2.5 lg:py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs md:text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">View More Details <ChevronDown size={14} className="group-hover/btn:translate-y-1 transition-transform" /></button>
                  </div>
               </div>

               {/* Box 2: Portfolio */}
               <div className="relative bg-white dark:bg-[#0F1320] border border-neon-purple/30 rounded-2xl p-6 group hover:-translate-y-2 transition-all duration-300 shadow-xl dark:shadow-[0_0_20px_rgba(176,38,255,0.15)] hover:shadow-2xl dark:hover:shadow-[0_0_40px_rgba(176,38,255,0.3)] overflow-hidden flex flex-col">
                  <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neon-purple/10 dark:bg-neon-purple/20 backdrop-blur-md border-b border-x border-neon-purple/30 px-3 py-1 rounded-b-lg text-[10px] font-bold uppercase tracking-wider text-neon-purple w-max z-10">
                     Perfect for Creators
                  </div>
                  <div className="mt-8 space-y-4 md:space-y-5 relative z-10 flex-1">
                     <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white text-center">Portfolio Website</h3>
                     <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-neon-purple/20">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                           <span>Real Market Price</span>
                           <span>Our Special Price</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-red-500/70 line-through text-xs md:text-xs lg:text-sm font-medium">₹20,000</span>
                           <span className="text-neon-purple text-xl md:text-xl lg:text-2xl font-bold drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]">₹9,000</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-1.5 text-neon-purple font-bold bg-neon-purple/10 px-2 py-1 rounded-lg">
                            <Trophy size={12} /> Save 55%
                         </div>
                     </div>
                  </div>
                  <div className="mt-6 relative z-10">
                      <button onClick={() => scrollToId('portfolio')} className="w-full py-2.5 md:py-2.5 lg:py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs md:text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">View More Details <ChevronDown size={14} className="group-hover/btn:translate-y-1 transition-transform" /></button>
                  </div>
               </div>

               {/* Box 3: Business */}
               <div className="relative bg-white dark:bg-[#0F1320] border border-neon-blue rounded-2xl p-6 group hover:-translate-y-2 transition-all duration-300 shadow-xl dark:shadow-[0_0_30px_rgba(0,212,255,0.2)] overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neon-blue/10 dark:bg-neon-blue/20 backdrop-blur-md border-b border-x border-neon-blue/30 px-3 py-1 rounded-b-lg text-[10px] font-bold uppercase tracking-wider text-neon-blue w-max z-10">
                     Best for Agencies
                  </div>
                  <div className="mt-8 space-y-4 md:space-y-5 relative z-10 flex-1">
                     <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white text-center">Business Website</h3>
                     <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-neon-blue/20">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                           <span>Real Market Price</span>
                           <span>Our Special Price</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-red-500/70 line-through text-xs md:text-xs lg:text-sm font-medium">₹30,000</span>
                           <span className="text-neon-blue text-xl md:text-xl lg:text-2xl font-bold drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">₹10,999</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-1.5 text-neon-blue font-bold bg-neon-blue/10 px-2 py-1 rounded-lg">
                            <Zap size={12} /> Save 63%
                         </div>
                     </div>
                  </div>
                  <div className="mt-6 relative z-10">
                      <button onClick={() => scrollToId('business')} className="w-full py-2.5 md:py-2.5 lg:py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs md:text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">View More Details <ChevronDown size={14} className="group-hover/btn:translate-y-1 transition-transform" /></button>
                  </div>
               </div>

               {/* Box 4: E-Commerce */}
               <div className="relative bg-white dark:bg-[#0F1320] p-[1px] rounded-2xl group hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col shadow-xl dark:shadow-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white dark:bg-[#0F1320] h-full rounded-[15px] p-6 flex flex-col flex-1">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-md border-b border-x border-orange-500/30 px-3 py-1 rounded-b-lg text-[10px] font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400 w-max z-10">
                        Sell Online Fast
                     </div>
                     <div className="mt-8 space-y-4 md:space-y-5 relative z-10 flex-1">
                        <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500 text-center">E-Commerce</h3>
                        <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-orange-500/20">
                           <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                              <span>Real Market Price</span>
                              <span>Our Special Price</span>
                           </div>
                           <div className="flex justify-between items-end">
                              <span className="text-red-500/70 line-through text-xs md:text-xs lg:text-sm font-medium">₹90,000</span>
                              <span className="text-orange-500 dark:text-orange-400 text-xl md:text-xl lg:text-2xl font-bold drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">₹28,999</span>
                           </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded-lg">
                               <Rocket size={12} /> Save 68%
                            </div>
                        </div>
                     </div>
                      <div className="mt-6 relative z-10">
                          <button onClick={() => scrollToId('ecommerce')} className="w-full py-2.5 md:py-2.5 lg:py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs md:text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">View More Details <ChevronDown size={14} className="group-hover/btn:translate-y-1 transition-transform" /></button>
                      </div>
                  </div>
               </div>
            </div>
         </ScrollReveal>
      </section>

            {/* --- INFORMATIONAL NARRATIVE (AdSense Content) --- */}
      <section className="px-4 py-12 md:py-20 max-w-4xl mx-auto bg-white dark:bg-[#0A0C11]/50 rounded-[40px] border border-gray-200 dark:border-white/10 mb-24 relative z-20">
        <ScrollReveal className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Why Professional Web Development is Critical for Your Success</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-lg">
              In today's digital-first economy, your website is your most valuable employee. It works 24/7, handles your first impressions, and serves as your central hub for customer conversion. At BrandiQue, we don't believe in cutting corners. While DIY website builders might seem attractive, they often lack the performance, security, and SEO foundation required for real growth. Our starter kits are designed to solve this problem by providing custom-coded, expert-level web solutions at an accessible price point.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="text-neon-purple" /> Strategic Engineering
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                We approach web development through a lens of strategy. Every feature we implement is designed to move your business forward. We focus on 'Core Web Vitals' to ensure Google rewards your site with higher rankings, and we use modern frameworks like Next.js to provide a sub-second load experience that delights your users.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-neon-blue" /> Scalable Foundations
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                Our websites are built to grow with you. Whether you're starting with a simple personal landing page or a complex business portal, our clean code ensures that adding new features in the future is a seamless process. We handle the technical heavy lifting—hosting, domain setup, and security—so you can focus on your business.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* --- DETAILED BREAKDOWN SECTIONS --- */}
      <div className="space-y-16 md:space-y-24 lg:space-y-32 relative z-10">
          {SERVICES.map((service, idx) => (
             <section key={service.id} id={service.id} className="scroll-mt-24 md:scroll-mt-32">
                 <ScrollReveal>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-end justify-between mb-6 md:mb-8 border-b border-gray-200 dark:border-white/5 pb-6 md:pb-8">
                       <div>
                          <div className={`inline-flex items-center gap-2 mb-2 md:mb-3 text-${service.theme}-500 dark:text-${service.theme}-400 font-bold`}>
                             <service.icon size={16} className="md:w-[20px]" />
                             <span className="uppercase tracking-widest text-[10px] md:text-xs lg:text-sm">{service.tagline}</span>
                          </div>
                          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
                             {service.title} <span className="text-gray-500 dark:text-gray-600 font-light block md:inline text-lg md:text-2xl lg:text-4xl">— What’s included</span>
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-lg max-w-2xl">{service.summary}</p>
                       </div>
                       <div className="text-left md:text-right shrink-0 mt-4 md:mt-0">
                          <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 font-bold uppercase mb-1">Total Package Price</p>
                          <p className={`text-3xl md:text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}>
                             ₹{service.price}
                          </p>
                       </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                       <div className="lg:col-span-1 space-y-6 md:space-y-8">
                           <div className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg dark:shadow-none">
                              <h3 className="text-gray-900 dark:text-white font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-sm lg:text-base">
                                 <Server size={14} className="text-gray-400 md:w-[18px]" /> Cost Breakdown
                              </h3>
                              <div className="space-y-2 md:space-y-3 text-[10px] md:text-xs lg:text-sm">
                                 {service.breakdown.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                                       <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                                       <span className="text-gray-900 dark:text-white font-medium text-right">{item.value}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg dark:shadow-none">
                              <h3 className="text-gray-900 dark:text-white font-bold mb-2 flex items-center gap-2 text-sm md:text-sm lg:text-base">
                                 <Clock size={14} className="text-gray-400 md:w-[18px]" /> Estimated Timeline
                              </h3>
                              <p className={`text-xl md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}>
                                 {service.timeline}
                              </p>
                           </div>
                       </div>
                       <div className="lg:col-span-2">
                          <h3 className="text-lg md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                             <Check size={16} className={`text-${service.theme}-500 dark:text-${service.theme}-400 md:w-[20px]`} /> 
                             Core Deliverables
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                             {service.deliverables.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                                   <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-${service.theme}-500/20 text-${service.theme}-500 dark:text-${service.theme}-400 flex items-center justify-center shrink-0`}>
                                      <Check size={10} className="md:w-[12px]" strokeWidth={3} />
                                   </div>
                                   <span className="text-gray-700 dark:text-gray-300 text-[10px] md:text-xs lg:text-sm leading-relaxed">{item}</span>
                                </div>
                             ))}
                          </div>
                          <h3 className="text-lg md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                             <MessageCircle size={16} className="text-gray-400 md:w-[20px]" /> 
                             Frequently Asked Questions
                          </h3>
                          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                             {service.faqs.map((faq, i) => {
                                const faqId = `${service.key}-${i}`;
                                const isOpen = activeFAQ === faqId;
                                return (
                                   <div key={i} className="border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#0F1320] overflow-hidden shadow-sm dark:shadow-none">
                                      <button onClick={() => toggleFAQ(faqId)} className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                         <span className="text-xs md:text-xs lg:text-sm font-bold text-gray-800 dark:text-gray-200">{faq.q}</span>
                                         {isOpen ? <ChevronUp size={14} className="text-gray-500 md:w-[16px]" /> : <ChevronDown size={14} className="text-gray-500 md:w-[16px]" />}
                                      </button>
                                      {isOpen && (
                                         <div className="p-3 md:p-4 pt-0 text-[10px] md:text-[10px] lg:text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                                            {faq.a}
                                         </div>
                                      )}
                                   </div>
                                );
                             })}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 border-t border-gray-200 dark:border-white/5">
                             <a href="https://wa.me/917093320572?text=Hi%20I%20want%20a%20website%20quote" target="_blank" rel="noreferrer" className={`px-6 py-3 md:px-5 md:py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-white shadow-lg flex-1 text-center hover:scale-[1.02] transition-transform bg-gradient-to-r text-xs md:text-xs lg:text-base ${service.gradient}`}>Claim This Plan</a>
                             <Link to="/contact" className="px-6 py-3 md:px-5 md:py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex-1 text-center transition-colors text-xs md:text-xs lg:text-base">Request Custom Quote</Link>
                          </div>
                       </div>
                    </div>
                 </ScrollReveal>
             </section>
          ))}
      </div>

    </div>
  );
};

export default WebDevelopment;