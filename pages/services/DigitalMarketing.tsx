import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Youtube, Video, Heart, MessageCircle, Share2, Megaphone, Search, Palette, TrendingUp, BarChart, PieChart, Target, Package, Cpu, Sparkles, Layers, ListChecks } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const DigitalMarketing: React.FC = () => {
  const [likes, setLikes] = useState(8432);
  const [showHeart, setShowHeart] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLikes(prev => prev + Math.floor(Math.random() * 5) + 1);
      if (Math.random() > 0.7) {
         setShowHeart(true);
         setTimeout(() => setShowHeart(false), 800);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] pt-24 md:pt-28 lg:pt-36 transition-colors duration-300">
      <div className="relative w-full overflow-hidden bg-transparent py-8 md:py-12 lg:py-24">
          {/* Background Elements - Optimized for Mobile */}
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-0 w-[200px] md:w-[400px] lg:w-[600px] h-[200px] md:h-[400px] lg:h-[600px] bg-green-500/5 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] animate-pulse-glow"></div>
              <div className="absolute bottom-0 right-0 w-[250px] md:w-[500px] lg:w-[800px] h-[250px] md:h-[500px] lg:h-[800px] bg-purple-500/5 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px]"></div>
              
              {/* Floating Hashtags & Emojis - Desktop Only to reduce mobile load */}
              <div className="hidden lg:block">
                {['#Growth', '🔥', '#Viral', '🚀', '✨', '#Brand', '👍', '💬'].map((tag, i) => (
                    <div 
                        key={i}
                        className="absolute text-gray-300 dark:text-white/5 font-bold text-xl animate-float"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 90}%`,
                            animationDelay: `${i * 1.5}s`,
                            animationDuration: `${10 + i * 2}s`
                        }}
                    >
                        {tag}
                    </div>
                ))}
              </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              {/* Grid Layout: Stacked on Mobile, Side-by-Side on Tablet/Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
                  
                  {/* LEFT: Phone Visual */}
                  <div className="relative perspective-2000 flex justify-center lg:justify-end pr-0 lg:pr-10 order-1">
                      {/* 3D Transform only on Desktop Hover */}
                      <div className="relative transform transition-transform duration-700 lg:hover:rotate-y-6 lg:hover:rotate-x-6 preserve-3d">
                          
                          {/* Floating Elements Around Phone - Static & Smaller on Mobile/Tablet */}
                          {/* YouTube Thumbnail */}
                          <div className="absolute top-[10%] -left-[10%] md:-left-[15%] lg:-left-[20%] w-24 h-14 md:w-28 md:h-16 lg:w-40 lg:h-24 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl lg:animate-float z-20 overflow-hidden transform rotate-[-6deg]" style={{ animationDelay: '0.5s' }}>
                              <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 relative overflow-hidden group">
                                  {/* Abstract thumbnail art */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black"></div>
                                  <div className="absolute -right-4 -bottom-4 w-12 h-12 md:w-16 md:h-16 bg-red-600/20 rounded-full blur-xl"></div>
                                  <Youtube size={20} className="md:w-[24px] lg:w-[32px] text-red-500 relative z-10 drop-shadow-md" />
                              </div>
                              <div className="absolute bottom-1 right-1 lg:bottom-1.5 lg:right-1.5 px-1 py-0.5 bg-black/80 rounded text-[6px] md:text-[8px] font-bold text-white">12:45</div>
                          </div>

                          {/* Chart Card */}
                          <div className="absolute bottom-[20%] -right-[10%] md:-right-[15%] lg:-right-[15%] w-24 h-20 md:w-28 md:h-22 lg:w-36 lg:h-28 bg-white dark:bg-[#151A25] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl lg:animate-float-fast z-30 p-2 md:p-3 transform rotate-[6deg]" style={{ animationDelay: '1.5s' }}>
                              <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
                                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
                                  <span className="text-[6px] md:text-[8px] text-gray-500 dark:text-gray-400 uppercase font-bold">Reach</span>
                              </div>
                              <div className="flex items-end gap-0.5 lg:gap-1 h-6 md:h-8 lg:h-12 justify-between">
                                  {[40, 65, 45, 80, 55, 90].map((h, i) => (
                                      <div key={i} style={{ height: `${h}%` }} className="w-1.5 md:w-2 lg:w-3 bg-green-500/20 rounded-t-sm relative group">
                                          <div className="absolute bottom-0 left-0 w-full bg-green-500 rounded-t-sm transition-all duration-1000" style={{ height: '100%' }}></div>
                                      </div>
                                  ))}
                              </div>
                              <div className="mt-1.5 lg:mt-2 text-right">
                                  <span className="text-green-500 dark:text-green-400 text-[8px] md:text-[10px] lg:text-xs font-bold">+124%</span>
                              </div>
                          </div>

                          {/* The Phone - Responsive Sizing */}
                          <div className="w-[220px] h-[440px] md:w-[240px] md:h-[480px] lg:w-[300px] lg:h-[600px] bg-black rounded-[24px] md:rounded-[32px] lg:rounded-[40px] border-[6px] md:border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative z-10">
                              {/* Notch */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 lg:w-32 h-4 md:h-5 lg:h-6 bg-[#1a1a1a] rounded-b-lg md:rounded-b-xl lg:rounded-b-2xl z-20"></div>
                              
                              {/* Screen Content */}
                              <div className="w-full h-full bg-[#000] relative flex flex-col">
                                  {/* Header */}
                                  <div className="pt-6 md:pt-8 lg:pt-10 pb-2 px-3 md:px-4 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-sm z-10">
                                      <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] lg:p-[2px]">
                                              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[6px] md:text-[8px] lg:text-[10px] font-bold text-white">BQ</div>
                                          </div>
                                          <span className="text-[8px] md:text-[10px] lg:text-xs font-bold text-white">brandiqueweb</span>
                                      </div>
                                      <div className="w-1 h-3 md:h-4 flex flex-col justify-between items-center opacity-60">
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                      </div>
                                  </div>

                                  {/* Main Post Content - Updated with New Image */}
                                  <div className="flex-1 bg-[#050505] relative group cursor-pointer overflow-hidden">
                                      <img 
                                          src="https://cdn.imgchest.com/files/63bb11beb595.jpg" 
                                          alt="Social Post Content" 
                                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                      />

                                      {/* Popping Heart Animation */}
                                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${showHeart ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                          <Heart size={50} className="md:w-[60px] lg:w-[80px] h-auto text-white fill-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                                      </div>
                                      
                                      {/* UI Overlays */}
                                      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/40 p-1.5 md:p-2 rounded-full backdrop-blur-md border border-white/10">
                                          <PieChart size={10} className="md:w-[14px] lg:w-[16px] h-auto text-white" />
                                      </div>
                                      
                                      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                                          <div className="px-1.5 py-0.5 md:px-2 md:py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-md text-[6px] md:text-[8px] lg:text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                              <TrendingUp size={8} className="md:w-[10px]" /> Growth
                                          </div>
                                      </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="p-3 md:p-4 bg-black border-t border-white/5 relative z-10">
                                      <div className="flex items-center justify-between mb-1.5 md:mb-2 lg:mb-3">
                                          <div className="flex items-center gap-3 md:gap-4">
                                              <Heart size={16} className={`cursor-pointer transition-colors md:w-[20px] lg:w-[24px] h-auto ${showHeart ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                              <MessageCircle size={16} className="md:w-[20px] lg:w-[24px] h-auto text-white hover:text-gray-300 transition-colors" />
                                              <Share2 size={16} className="md:w-[20px] lg:w-[24px] h-auto text-white hover:text-gray-300 transition-colors" />
                                          </div>
                                          <div className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/10 rounded-full text-[6px] md:text-[8px] lg:text-[10px] font-bold uppercase text-white animate-pulse">
                                              Live Campaign
                                          </div>
                                      </div>
                                      <div className="text-[10px] md:text-xs lg:text-sm font-bold text-white mb-0.5 md:mb-1">
                                          {likes.toLocaleString()} insights
                                      </div>
                                      <div className="text-[8px] md:text-[10px] lg:text-xs text-gray-300">
                                          <span className="font-bold text-white mr-1">brandiqueweb</span>
                                          Boosting your brand's digital presence 🚀 <span className="text-blue-400">#marketing #growth</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* RIGHT: Content */}
                  <div className="order-2 text-center md:text-left">
                      <ScrollReveal>
                          <div className="overflow-hidden mb-2">
                              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-reveal-text">
                                  Digital Marketing
                              </h2>
                          </div>
                          
                          <div className="mb-4 md:mb-6">
                              <TextReveal text="Creatives that build your brand’s social presence" className="text-base md:text-lg lg:text-xl text-green-400 font-medium" delay={300} />
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 font-light animate-fade-up delay-200">
                              High-quality social media creatives, thumbnails, brand content, and digital visuals crafted to increase engagement, attract customers, and grow your online presence.
                          </p>

                          {/* Features List */}
                          <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10 text-left">
                              {[
                                  "Social media creatives",
                                  "Instagram branding",
                                  "YouTube thumbnails",
                                  "Consistent content design",
                                  "High-engagement visual strategy"
                              ].map((feat, i) => (
                                  <li key={i} className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: 'forwards' }}>
                                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                          <Check size={10} className="md:w-[12px]" strokeWidth={3} />
                                      </div>
                                      <span className="text-gray-700 dark:text-gray-300 text-xs md:text-xs lg:text-base">{feat}</span>
                                  </li>
                              ))}
                          </ul>

                          <a 
                              href="https://wa.me/917093320572?text=Hi%20I%20am%20looking%20for%20a%20Digital%20Marketing%20service!"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-lg hover:shadow-green-500/40 group transform hover:-translate-y-1"
                          >
                              Grow Your Brand <ArrowRight size={16} className="md:w-[18px] group-hover:translate-x-1 transition-transform" />
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

              {/* Process Section */}
              <div className="mb-20 md:mb-24 lg:mb-32">
                  <ScrollReveal>
                      <div className="text-center mb-10 md:mb-16">
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">How We Grow Your Digital Presence</h3>
                          <div className="h-1 w-16 md:w-20 bg-green-500 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
                          {/* Connector Line */}
                          <div className="hidden md:block absolute top-10 md:top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-green-500/20 via-green-500/50 to-green-500/20 -z-10"></div>
                          
                          {[
                              { step: "01", title: "Understand Your Brand", desc: "We identify your tone, audience, and themes.", icon: Search },
                              { step: "02", title: "Design Creatives", desc: "Posts, reels, thumbnails, banners crafted for maximum attention.", icon: Palette },
                              { step: "03", title: "Optimize & Grow", desc: "Content strategy, consistency, branding, and platform alignment.", icon: TrendingUp }
                          ].map((item, i) => (
                              <div key={i} className="relative flex flex-col items-center text-center group">
                                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 md:mb-6 shadow-xl group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                      <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-green-500 text-white font-bold rounded-full flex items-center justify-center text-xs md:text-sm border-2 md:border-4 border-white dark:border-[#0A0C11]">
                                          {item.step}
                                      </div>
                                      <item.icon size={24} className="md:w-[32px] md:h-[32px] text-gray-400 group-hover:text-green-400 transition-colors" />
                                  </div>
                                  <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{item.title}</h4>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs">{item.desc}</p>
                              </div>
                          ))}
                      </div>
                  </ScrollReveal>
              </div>

              
      {/* Detailed Digital Marketing Overview */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 mb-20 md:mb-32">
         <ScrollReveal>
             <div className="text-center mb-10 md:mb-16">
                 <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed Packages & Strategy</h3>
                 <div className="h-1 w-20 bg-green-500 mx-auto rounded-full mb-6"></div>
                 <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
                    Result-driven digital marketing solutions to help businesses increase their online visibility, reach the right audience, and grow effectively.
                 </p>
             </div>
         </ScrollReveal>

         {/* Bento Grid Layout */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            
            {/* Pricing Card - spans 1 col */}
            <ScrollReveal delay="delay-100" className="lg:row-span-2">
               <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-[32px] p-8 h-full flex flex-col shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute -top-4 -right-4 p-6 opacity-20 pointer-events-none transform group-hover:rotate-12 transition-transform duration-500">
                     <TrendingUp size={120} className="text-white" />
                  </div>
                  <div className="relative z-10 flex-grow">
                     <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">Pricing Tiers</h4>
                     <p className="text-green-100 text-sm mb-8 leading-relaxed">
                        Flexible plans tailored to your growth ambitions. From brand awareness to customer acquisition, we deliver measurable results.
                     </p>
                     
                     <div className="space-y-4">
                        <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20">
                           <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">Starter</p>
                           <div className="flex items-end gap-1">
                              <p className="text-white text-2xl font-black">₹10K – ₹20K</p>
                              <span className="text-xs font-medium text-green-200 mb-1">/ month</span>
                           </div>
                        </div>
                        <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20 relative overflow-hidden">
                           <div className="absolute top-0 right-0 bg-white text-green-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">MOST POPULAR</div>
                           <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">Growth</p>
                           <div className="flex items-end gap-1">
                              <p className="text-white text-2xl font-black">₹25K – ₹50K</p>
                              <span className="text-xs font-medium text-green-200 mb-1">/ month</span>
                           </div>
                        </div>
                        <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-2xl p-5 border border-white/20">
                           <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">Premium</p>
                           <div className="flex items-end gap-1">
                              <p className="text-white text-2xl font-black">₹60K – ₹1.2L</p>
                              <span className="text-xs font-medium text-green-200 mb-1">/ month</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </ScrollReveal>

            {/* Features Card */}
            <ScrollReveal delay="delay-200">
               <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-green-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                        <Sparkles size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Features</h4>
                  </div>
                  <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                     {["Brand awareness campaigns", "Content planning & strategy", "Social media management", "Audience targeting & research", "Paid ad campaign setup", "Engagement improvement", "Performance tracking", "Monthly reporting"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <span>{item}</span></li>
                     ))}
                  </ul>
               </div>
            </ScrollReveal>

            {/* Deliverables Card */}
            <ScrollReveal delay="delay-300">
               <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <Package size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Deliverables</h4>
                  </div>
                  <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                     {["Monthly marketing plan", "Content calendar (schedule)", "Social media posts/designs", "Ad campaign setup & reports", "Audience targeting report", "Performance analytics", "Growth insights", "Monthly progress report"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3"><Check size={16} className="text-blue-500 shrink-0 mt-0.5" /> <span>{item}</span></li>
                     ))}
                  </ul>
               </div>
            </ScrollReveal>

            {/* Process Card - spans 2 cols on lg, placed below features/deliverables */}
            <ScrollReveal delay="delay-400" className="md:col-span-2">
               <div className="bg-[#0A0C11] rounded-[32px] p-8 md:p-10 border border-gray-800 shadow-xl relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[80px]"></div>
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0">
                        <ListChecks size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-white">Full Cycle Process</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative z-10 flex-grow">
                     {[
                        { title: "Requirement Analysis", desc: "Understand goals & audience" },
                        { title: "Strategy Planning", desc: "Create marketing plan & approach" },
                        { title: "Content Planning", desc: "Decide posts, creatives & schedule" },
                        { title: "Campaign Setup", desc: "Set up ads & platforms" },
                        { title: "Execution", desc: "Run campaigns & manage content" },
                        { title: "Monitoring", desc: "Track performance & engagement" },
                        { title: "Optimization", desc: "Improve results based on data" },
                        { title: "Reporting", desc: "Monthly report & insights" }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 group-hover:bg-green-500 group-hover:text-white transition-colors flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                           <div>
                              <p className="text-sm md:text-base font-bold text-gray-200 mb-1">{item.title}</p>
                              <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </ScrollReveal>

            {/* Requirements Card */}
            <ScrollReveal delay="delay-500">
               <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                        <Layers size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Requirements</h4>
                  </div>
                  <ul className="space-y-3 flex-grow text-sm text-gray-600 dark:text-gray-400">
                     {["Business details", "Target audience info", "Products / services", "Social media access", "Brand logo/assets", "Marketing goals", "Ads budget", "Competitor references"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3"><Check size={14} className="text-orange-500 shrink-0" /> <span>{item}</span></li>
                     ))}
                  </ul>
               </div>
            </ScrollReveal>

            {/* Tech & Tools Card - spans 1 col */}
            <ScrollReveal delay="delay-600">
               <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                        <Cpu size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Tech & Tools</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-grow">
                     {["Meta Ads", "Google Ads", "Analytics", "Canva", "Business Suite", "SEO tools", "Notion / Sheets", "Search Console"].map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                           {item}
                        </span>
                     ))}
                  </div>
               </div>
            </ScrollReveal>

            {/* Promises Card - spans 2 cols on lg */}
            <ScrollReveal delay="delay-700" className="md:col-span-2">
               <div className="bg-white dark:bg-[#151A25] rounded-[32px] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-xl h-full flex flex-col group hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                        <Target size={24} />
                     </div>
                     <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Our Promises</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 flex-grow text-sm text-gray-600 dark:text-gray-400">
                     {["Clear transparent strategy", "Consistent campaign execution", "Regular performance tracking", "On-time monthly reporting", "Data-driven optimization", "Professional support", "Revisions based on results", "Focus on improving reach"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3"><Check size={16} className="text-red-500 shrink-0" /> <span>{item}</span></div>
                     ))}
                  </div>
               </div>
            </ScrollReveal>

         </div>
         
         <div className="mt-12 md:mt-16 text-center flex justify-center w-full">
            <a 
               href="https://wa.me/917093320572?text=Hi,%20I%20am%20interested%20in%20your%20Digital%20Marketing%20services."
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white rounded-full font-bold text-base md:text-lg hover:bg-black transition-colors shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:shadow-black/30 group"
            >
               Get a Marketing Quote <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
         </div>
      </div>
{/* Why Digital Marketing Matters Block */}
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                  {/* Text Block */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-xl dark:shadow-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                      <ScrollReveal>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Why Digital Marketing Matters?</h3>
                          <ul className="space-y-3 md:space-y-4 grid md:grid-cols-2 gap-x-4">
                              {[
                                  "Consistent visuals increase brand trust.",
                                  "Good creatives improve reach and engagement.",
                                  "Your audience recognizes your style instantly.",
                                  "Strong digital content converts viewers into customers.",
                                  "Every business needs an active online presence."
                              ].map((text, i) => (
                                  <li key={i} className="flex gap-3">
                                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0 mt-0.5">
                                          <Check size={12} />
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{text}</p>
                                  </li>
                              ))}
                          </ul>
                      </ScrollReveal>
                  </div>

                  {/* Usage Block */}
                  <div className="lg:col-span-1 bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shadow-xl dark:shadow-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                          <Megaphone size={20} className="text-green-400" /> Perfect For
                      </h4>
                      <div className="flex flex-wrap gap-2">
                          {["Social Branding", "Product Promotions", "Business Visibility", "Event Marketing", "Creator Growth", "Portfolio"].map((tag, i) => (
                              <span key={i} className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase hover:bg-gray-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-default">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default DigitalMarketing;