import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code, Zap, LayoutTemplate, Rocket, Server, Sparkles, TrendingUp, Globe, Monitor, Package, Briefcase, ShoppingCart, User, Layers, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const FullStack: React.FC = () => {
  const [code, setCode] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  const fullCode = `const BrandiQue = () => {
  return (
    <div className="premium-web">
      <Header animated={true} />
      <Hero fullStack={true} />
      <Experience type="immersive" />
    </div>
  );
};`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullCode.length) {
        setCode(fullCode.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] pt-24 md:pt-28 lg:pt-36 transition-colors duration-300">
      <div className="relative w-full overflow-hidden bg-transparent py-8 md:py-12 lg:py-24">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(176,38,255,0.05),transparent_50%)]"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['{ }', '< >', 'div', '#', '//', '();'].map((symbol, i) => (
               <div 
                 key={i} 
                 className="absolute text-gray-300 dark:text-white/5 font-mono font-bold text-xl animate-float"
                 style={{ 
                   top: `${Math.random() * 80}%`, 
                   left: `${Math.random() * 90}%`, 
                   animationDelay: `${i * 1.5}s`,
                   animationDuration: `${10 + i * 2}s`
                 }}
               >
                 {symbol}
               </div>
            ))}
         </div>

         <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
               <div className="relative perspective-2000">
                  <ScrollReveal>
                     {/* Added 'lg:' prefix to hover effects to disable 3D rotate on mobile/tablet */}
                     <div className="relative transform transition-transform duration-700 lg:hover:rotate-y-6 lg:hover:rotate-x-6 preserve-3d">
                        <div className="bg-[#0F1320] rounded-xl border border-white/10 shadow-2xl overflow-hidden min-h-[300px] md:min-h-[340px] lg:min-h-[400px] relative z-20">
                           <div className="h-8 md:h-10 bg-[#151A25] border-b border-white/5 flex items-center px-3 md:px-4 gap-2">
                              <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
                                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
                                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
                              </div>
                              <div className="ml-4 text-[8px] md:text-[10px] text-gray-500 font-mono">App.tsx — Visual Studio Code</div>
                           </div>
                           <div className="p-4 md:p-6 font-mono text-xs md:text-xs lg:text-sm leading-relaxed">
                              <pre className="text-gray-300">
                                 <span className="text-pink-400">import</span> React <span className="text-pink-400">from</span> <span className="text-green-400">'react'</span>;<br/><br/>
                                 {code}
                                 <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} inline-block w-1.5 h-3 md:w-2 md:h-4 bg-neon-purple align-middle ml-1`}></span>
                              </pre>
                           </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-neon-purple/20 rounded-full blur-2xl -z-10 animate-pulse-glow"></div>
                        
                        <div className="absolute -right-4 md:-right-8 top-16 md:top-20 bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10 p-3 md:p-4 rounded-xl shadow-xl animate-float z-30 flex items-center gap-2 md:gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                              <Code size={16} className="md:w-[20px] md:h-[20px]" />
                           </div>
                           <div>
                              <div className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">Technology</div>
                              <div className="text-gray-900 dark:text-white font-bold text-xs md:text-sm">React + Next.js</div>
                           </div>
                        </div>
                        
                        <div className="absolute -left-4 md:-left-8 bottom-16 md:bottom-20 bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10 p-3 md:p-4 rounded-xl shadow-xl animate-float z-30 flex items-center gap-2 md:gap-3" style={{ animationDelay: '2s' }}>
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                              <Zap size={16} className="md:w-[20px] md:h-[20px]" />
                           </div>
                           <div>
                              <div className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">Performance</div>
                              <div className="text-gray-900 dark:text-white font-bold text-xs md:text-sm">Lightning Fast</div>
                           </div>
                        </div>
                     </div>
                  </ScrollReveal>
               </div>
               <div>
                  <ScrollReveal>
                     <div className="overflow-hidden mb-2">
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                           Full-Stack Web Design
                        </h2>
                     </div>
                     <div className="mb-4 md:mb-6">
                        <TextReveal text="Custom-coded websites with HTML, CSS, JavaScript" className="text-base md:text-lg lg:text-xl text-neon-purple font-medium" delay={300} />
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 font-light">
                        Modern, fast, responsive and animation-rich websites built from scratch using HTML, CSS, JavaScript, and React. Perfect for brands needing unique UI/UX experiences.
                     </p>
                     <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                        {[
                          "Custom-coded from scratch",
                          "Smooth animations & micro-interactions",
                          "Fully responsive layouts",
                          "UI/UX enhanced components",
                          "Pixel-perfect visual design"
                        ].map((feat, i) => (
                           <li key={i} className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: 'forwards' }}>
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0">
                                 <Check size={10} className="md:w-[12px]" strokeWidth={3} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-xs md:text-xs lg:text-base">{feat}</span>
                           </li>
                        ))}
                     </ul>
                     <a 
                        href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20Full-stack%20development%20coding%20website!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-neon-purple hover:text-white dark:hover:bg-neon-purple dark:hover:text-white transition-all shadow-lg hover:shadow-neon-purple/40 group transform hover:-translate-y-1"
                     >
                        Start Project <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
                     </a>
                  </ScrollReveal>
               </div>
            </div>
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

            <div className="mb-20 md:mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">How We Build Your Website</h3>
                     <div className="h-1 w-16 md:w-20 bg-neon-purple mx-auto rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
                     <div className="hidden md:block absolute top-10 md:top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-neon-purple/20 via-neon-purple/50 to-neon-purple/20 -z-10"></div>
                     {[
                        { step: "01", title: "Plan & Design", desc: "We understand your idea, plan the structure, create UI/UX layouts.", icon: LayoutTemplate },
                        { step: "02", title: "Develop & Animate", desc: "Your website is coded using HTML, CSS, JS, React with smooth animations.", icon: Code },
                        { step: "03", title: "Launch & Optimize", desc: "Speed, SEO, responsiveness, and security implemented before launch.", icon: Rocket }
                     ].map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                           <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 md:mb-6 shadow-xl group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                               <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-neon-purple text-white font-bold rounded-full flex items-center justify-center text-xs md:text-sm border-2 md:border-4 border-white dark:border-[#0A0C11]">
                                  {item.step}
                               </div>
                               <item.icon size={24} className="md:w-[32px] md:h-[32px] text-gray-400 group-hover:text-neon-purple transition-colors" />
                           </div>
                           <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{item.title}</h4>
                           <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                     ))}
                  </div>
                  <div className="text-center mt-8 md:mt-12">
                     <p className="text-gray-500 text-xs md:text-sm italic">“Each website is custom-built — no templates, no shortcuts.”</p>
                  </div>
               </ScrollReveal>
            </div>
            
            {/* PACKAGES SECTION */}
            <div className="mb-24 lg:mb-32">
               <ScrollReveal>
                  <div className="text-center mb-10 md:mb-16">
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Full Stack Development Services</h3>
                     <div className="h-1 w-20 bg-neon-purple mx-auto rounded-full mb-6"></div>
                     <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">Comprehensive solutions tailored to your unique needs, completely custom-coded.</p>
                  </div>
               </ScrollReveal>
               
               <div className="space-y-12 md:space-y-16">
                  {[
                    {
                      id: "personal",
                      title: "Personal Website",
                      icon: User,
                      desc: "We create personal websites that represent you professionally online. Our service includes custom design, about/profile sections, resume integration, contact forms, and mobile-friendly layouts to build your personal brand.",
                      price: { sub: "9,000 to 15,000", custom: "18,000 to 25,000" },
                      features: ["Custom UI design (clean & modern look)", "About Me / Profile section", "Resume / CV integration (download option)", "Contact form (email integration)", "Social media links integration", "Mobile responsive design", "Basic SEO setup", "Fast loading optimization"],
                      deliverables: ["Fully designed & developed website", "Mobile responsive version (all devices)", "Live website deployment (hosting setup)", "Domain / subdomain setup", "Basic SEO configuration", "Contact form integration (email connected)", "1–2 rounds of revisions", "Handover + basic usage guidance"],
                      process: ["Requirement discussion (profile, goals)", "Structure planning (about, resume, contact)", "UI design (clean & personal branding style)", "Development (responsive build)", "Review & minor revisions", "Testing & optimization", "Deployment (domain/hosting)", "Handover & guidance"],
                      requirements: ["Basic details (name, bio, profession)", "Profile photo / personal images", "Resume / CV (PDF or content)", "Social media links", "Contact details (email, phone)", "Any reference websites (optional)"],
                      tech: ["HTML, CSS, JavaScript", "React / Next.js (optional)", "Tailwind CSS", "Git & GitHub", "Basic SEO tools"],
                      promises: ["Clean & professional personal branding", "Fully mobile responsive", "Fast loading & smooth performance", "Secure hosting & basic protection", "On-time delivery", "Revisions included", "Full ownership after delivery"]
                    },
                    {
                      id: "portfolio",
                      title: "Portfolio Website",
                      icon: Briefcase,
                      desc: "We design portfolio websites focused on showcasing your work effectively. We provide project galleries, case study sections, smooth navigation, fast loading speed, and visually engaging layouts to highlight your skills and creativity.",
                      price: { sub: "10,000 to 17,000", custom: "16,000 to 28,000" },
                      features: ["Creative & visually engaging design", "Project showcase (images / videos)", "Case study pages (project details)", "Category / filter options for projects", "Smooth animations & transitions", "Contact / inquiry form", "Mobile & tablet responsive", "Performance optimization"],
                      deliverables: ["Custom-designed portfolio website", "Project showcase pages setup", "Mobile & tablet responsive design", "Live deployment (hosting + domain setup)", "Performance optimization", "Contact / inquiry form integration", "2–3 rounds of revisions", "Handover with editing guidance"],
                      process: ["Requirement discussion (niche, style)", "Content & project collection", "Layout planning (project showcase)", "Creative UI/UX design", "Development with animations", "Review & revisions", "Performance testing", "Deployment & handover"],
                      requirements: ["List of projects / works", "Project images / videos", "Project descriptions", "Personal / brand information", "Social links & contact details", "Design references (optional)"],
                      tech: ["HTML, CSS, JavaScript", "React / Next.js", "Tailwind CSS / Framer Motion", "Image optimization tools", "Git & GitHub"],
                      promises: ["Visually appealing & modern design", "High-quality project showcase", "Smooth animations & fast performance", "Fully responsive on all screens", "Revisions for design perfection", "On-time delivery commitment", "Complete control & easy updates"]
                    },
                    {
                      id: "business",
                      title: "Business Website",
                      icon: Briefcase,
                      desc: "We create professional business websites to enhance your online presence. Our service includes detailed service pages, lead generation forms, client testimonials, and SEO-friendly structures to help you attract and convert customers.",
                      price: { sub: "15,000 to 25,000", custom: "30,000 to 60,000" },
                      features: ["Professional business layout", "Service pages (detailed offerings)", "Lead generation forms", "WhatsApp / call integration", "Testimonials & client reviews", "SEO-friendly structure", "Google Maps integration", "Mobile responsive & speed optimized"],
                      deliverables: ["Professional business website", "Service pages & lead generation setup", "Mobile responsive design", "Domain + hosting configuration", "Basic SEO + speed optimization", "WhatsApp / call integration", "Google Maps integration", "2–3 revisions + support", "Website handover with admin access"],
                      process: ["Business requirement analysis", "Sitemap & page planning", "Professional UI/UX design", "Development (lead forms, integrations)", "Content integration", "Review & revisions", "SEO setup & performance optimization", "Deployment & support handover"],
                      requirements: ["Business details (services, overview)", "Logo & branding materials", "Service descriptions", "Images (office, team, products)", "Contact information", "Testimonials / client reviews", "Google Maps location (optional)"],
                      tech: ["HTML, CSS, JavaScript", "React / Next.js", "Tailwind / Bootstrap", "SEO tools (Google Search Console)", "Form integrations (Email/CRM)"],
                      promises: ["Professional & conversion-focused design", "SEO-friendly structure", "Fast, secure, and reliable performance", "Lead generation systems", "Mobile responsive & user-friendly", "Timely delivery with clear communication", "Post-launch support included"]
                    },
                    {
                      id: "ecommerce",
                      title: "E-Commerce Website",
                      icon: ShoppingCart,
                      desc: "We develop e-commerce websites that enable you to sell online. Our service includes product management, secure payment integration, shopping cart system, order tracking, and a user-friendly interface for a smooth buying experience.",
                      price: { sub: "25,000 to 50,000", custom: "1,50,000 to 5,00,000" },
                      features: ["Product listing & categories", "Shopping cart & checkout system", "Secure payment gateway integration", "User account & order tracking", "Admin panel (manage products & orders)", "Discount coupons & offers", "Inventory management", "Mobile-friendly & fast performance"],
                      deliverables: ["Fully functional online store", "Product & category setup", "Payment gateway integration", "Cart & checkout system", "User account & order tracking", "Admin dashboard access", "Mobile responsive & optimized", "Domain + hosting setup", "3–4 revisions + initial support", "Complete handover with training"],
                      process: ["Requirement discussion (products, features)", "Store structure planning", "UI/UX design (shopping experience)", "Development (cart, checkout, payment)", "Product & content setup", "Testing (orders, payments, user flow)", "Deployment (live store setup)", "Handover + training (admin usage)"],
                      requirements: ["Product details (name, price, description)", "Product images / videos", "Categories & product structure", "Payment details (bank/gateway)", "Shipping details & policies", "Business info (logo, contact)", "Terms & conditions / return policy"],
                      tech: ["React / Next.js", "Node.js (Backend)", "Payment Gateway Integration", "Database (MySQL / Firebase)", "Hosting (Managed servers)", "Security tools (SSL)"],
                      promises: ["Fully functional & secure online store", "Smooth shopping experience", "Safe payment gateway integration", "Fast loading & mobile-friendly design", "Proper product & order management", "Testing ensured before launch", "Training & support after delivery"]
                    }
                  ].map((pkg, i) => (
                    <ScrollReveal key={i} delay={`delay-${(i%2)*100}`}>
                      <div id={pkg.id} className="bg-white dark:bg-[#0F1320] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-xl overflow-hidden group">
                         <div className="p-6 md:p-10 border-b border-gray-200 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-neon-purple pointer-events-none">
                               <pkg.icon size={120} />
                            </div>
                            <div className="relative z-10 flex-1">
                               <div className="flex items-center gap-4 mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple shrink-0">
                                     <pkg.icon size={24} />
                                  </div>
                                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{pkg.title}</h4>
                               </div>
                               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-3xl">{pkg.desc}</p>
                            </div>
                            <div className="relative z-10 lg:text-right shrink-0">
                               <div className="bg-gray-50 dark:bg-[#151A25] p-5 rounded-2xl border border-gray-200 dark:border-white/5">
                                  <div className="mb-3">
                                     <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">With Sub-domain & Free Hosting</p>
                                     <p className="text-xl font-bold text-gray-900 dark:text-white">₹{pkg.price.sub}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">With Custom Domain & Secure Hosting</p>
                                     <p className="text-xl font-black text-neon-purple">₹{pkg.price.custom}</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         
                         <div className="p-6 md:p-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-10 bg-gray-50 dark:bg-white/[0.02]">
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Sparkles size={16} className="text-neon-purple"/> Features</h5>
                               <ul className="space-y-2">
                                  {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> <span>{f}</span></li>
                                  ))}
                               </ul>
                            </div>
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Package size={16} className="text-neon-purple"/> Deliverables</h5>
                               <ul className="space-y-2">
                                  {pkg.deliverables.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400"><Check size={14} className="text-blue-400 shrink-0 mt-0.5" /> <span>{f}</span></li>
                                  ))}
                               </ul>
                            </div>
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Layers size={16} className="text-neon-purple"/> Requirements</h5>
                               <ul className="space-y-2">
                                  {pkg.requirements.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400"><Check size={14} className="text-yellow-500 shrink-0 mt-0.5" /> <span>{f}</span></li>
                                  ))}
                               </ul>
                            </div>
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><LayoutTemplate size={16} className="text-neon-purple"/> Process</h5>
                               <ul className="space-y-2">
                                  {pkg.process.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                       <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">{i+1}</span>
                                       <span>{f}</span>
                                    </li>
                                  ))}
                               </ul>
                            </div>
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Code size={16} className="text-neon-purple"/> Tech Stack</h5>
                               <div className="flex flex-wrap gap-2">
                                  {pkg.tech.map((t, i) => (
                                    <span key={i} className="px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-gray-200 dark:bg-[#151A25] text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-white/5 shadow-sm">{t}</span>
                                  ))}
                               </div>
                            </div>
                            <div>
                               <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-neon-purple"/> Promises</h5>
                               <ul className="space-y-2">
                                  {pkg.promises.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400"><Check size={14} className="text-neon-purple shrink-0 mt-0.5" /> <span>{f}</span></li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                         
                         <div className="p-6 md:px-10 md:py-8 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0F1320] flex justify-end">
                            <a 
                               href={`https://wa.me/917093320572?text=Hi,%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.title)}%20Custom%20Coding%20website%20package.`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 px-6 py-3 bg-neon-purple text-white rounded-xl font-bold text-sm md:text-base hover:bg-black transition-colors"
                            >
                               Get Custom Quote for {pkg.title} <ArrowRight size={18} />
                            </a>
                         </div>
                      </div>
                    </ScrollReveal>
                  ))}
               </div>
            </div>
            
            <div className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden group shadow-xl dark:shadow-none">
               <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
               <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                  <ScrollReveal>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Why Custom Development Matters?</h3>
                     <ul className="space-y-4 md:space-y-6">
                        {[
                           { title: "Total Control", text: "Custom code gives you full control over design and functionality.", icon: Server },
                           { title: "Peak Performance", text: "Performance is faster than template-based websites (WordPress/Wix).", icon: Zap },
                           { title: "Unique Identity", text: "Animations and UI/UX are fully personalized to your brand.", icon: Sparkles },
                           { title: "Future Proof", text: "Better SEO, cleaner code, long-term scalability.", icon: TrendingUp }
                        ].map((item, i) => (
                           <li key={i} className="flex gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-neon-purple shrink-0 mt-1 border border-gray-200 dark:border-white/5">
                                 <item.icon size={16} className="md:w-[20px] md:h-[20px]" />
                              </div>
                              <div>
                                 <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-0.5 md:mb-1">{item.title}</h4>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{item.text}</p>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </ScrollReveal>
                  <div className="relative h-full min-h-[250px] md:min-h-[300px] hidden md:block">
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-blue-500/20 rounded-2xl blur-3xl opacity-30 animate-pulse-glow"></div>
                      <div className="absolute inset-4 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-sm">
                          <div className="text-center">
                             <Globe size={60} className="md:w-[80px] md:h-[80px] text-gray-300 dark:text-white/20 mx-auto mb-4" />
                             <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">Global Standard</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FullStack;