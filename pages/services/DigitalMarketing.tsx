import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Youtube, Video, Heart, MessageCircle, Share2, Megaphone, Search, Palette, TrendingUp } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import TextReveal from '../../components/TextReveal';

const DigitalMarketing: React.FC = () => {
  const [likes, setLikes] = useState(8432);
  const [comments, setComments] = useState(128);
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
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] animate-pulse-glow"></div>
              <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]"></div>
              
              {/* Floating Hashtags & Emojis */}
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

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              {/* Grid Layout */}
              <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-20 md:mb-24 lg:mb-32">
                  
                  {/* LEFT: Phone Visual - Order adjusted for Tablet */}
                  <div className="relative perspective-2000 flex justify-center lg:justify-end pr-0 lg:pr-10">
                      <div className="relative transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6 preserve-3d">
                          
                          {/* Floating Elements Around Phone */}
                          {/* YouTube Thumbnail */}
                          <div className="absolute top-[10%] -left-[15%] md:-left-[20%] w-32 h-20 md:w-36 md:h-24 lg:w-40 lg:h-24 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl animate-float z-20 overflow-hidden transform rotate-[-6deg]" style={{ animationDelay: '0.5s' }}>
                              <div className="absolute inset-0 flex items-center justify-center bg-red-600/10">
                                  <Youtube size={24} className="md:w-[32px] md:h-[32px] text-red-500" />
                              </div>
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[6px] md:text-[8px] font-bold text-white">12:45</div>
                          </div>

                          {/* Chart Card */}
                          <div className="absolute bottom-[20%] -right-[10%] md:-right-[15%] w-28 h-22 md:w-32 md:h-24 lg:w-36 lg:h-28 bg-white dark:bg-[#151A25] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl animate-float-fast z-30 p-2 md:p-3 transform rotate-[6deg]" style={{ animationDelay: '1.5s' }}>
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
                                  <span className="text-[6px] md:text-[8px] text-gray-500 dark:text-gray-400 uppercase font-bold">Reach</span>
                              </div>
                              <div className="flex items-end gap-1 h-8 md:h-12 justify-between">
                                  {[40, 65, 45, 80, 55, 90].map((h, i) => (
                                      <div key={i} style={{ height: `${h}%` }} className="w-2 md:w-3 bg-green-500/20 rounded-t-sm relative group">
                                          <div className="absolute bottom-0 left-0 w-full bg-green-500 rounded-t-sm transition-all duration-1000" style={{ height: '100%' }}></div>
                                      </div>
                                  ))}
                              </div>
                              <div className="mt-2 text-right">
                                  <span className="text-green-500 dark:text-green-400 text-[10px] md:text-xs font-bold">+124%</span>
                              </div>
                          </div>

                          {/* The Phone */}
                          <div className="w-[240px] h-[480px] md:w-[280px] md:h-[560px] lg:w-[300px] lg:h-[600px] bg-black rounded-[32px] md:rounded-[40px] border-[6px] md:border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative z-10">
                              {/* Notch */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-[#1a1a1a] rounded-b-xl md:rounded-b-2xl z-20"></div>
                              
                              {/* Screen Content */}
                              <div className="w-full h-full bg-[#000] relative flex flex-col">
                                  {/* Header */}
                                  <div className="pt-8 md:pt-10 pb-2 px-3 md:px-4 flex items-center justify-between border-b border-white/10">
                                      <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                                              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white">BQ</div>
                                          </div>
                                          <span className="text-[10px] md:text-xs font-bold text-white">brandique_agency</span>
                                      </div>
                                      <div className="w-1 h-3 md:h-4 flex flex-col justify-between items-center">
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                          <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full"></div>
                                      </div>
                                  </div>

                                  {/* Main Post */}
                                  <div className="flex-1 bg-[#111] relative group cursor-pointer">
                                      <img 
                                          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" 
                                          alt="Social Content" 
                                          className="w-full h-full object-cover opacity-80"
                                      />
                                      {/* Popping Heart Animation */}
                                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${showHeart ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                          <Heart size={60} className="md:w-[80px] md:h-[80px] text-white fill-white drop-shadow-xl" />
                                      </div>
                                      
                                      {/* Play Icon Overlay */}
                                      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 p-1 md:p-1.5 rounded-full backdrop-blur-sm">
                                          <Video size={12} className="md:w-[16px] md:h-[16px] text-white" />
                                      </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="p-3 md:p-4 bg-black">
                                      <div className="flex items-center justify-between mb-2 md:mb-3">
                                          <div className="flex items-center gap-3 md:gap-4">
                                              <Heart size={20} className={`cursor-pointer transition-colors md:w-[24px] md:h-[24px] ${showHeart ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                              <MessageCircle size={20} className="md:w-[24px] md:h-[24px] text-white hover:text-gray-300 transition-colors" />
                                              <Share2 size={20} className="md:w-[24px] md:h-[24px] text-white hover:text-gray-300 transition-colors" />
                                          </div>
                                          <div className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/10 rounded-full text-[8px] md:text-[10px] font-bold uppercase text-white animate-pulse">
                                              Trending
                                          </div>
                                      </div>
                                      <div className="text-xs md:text-sm font-bold text-white mb-1">
                                          {likes.toLocaleString()} likes
                                      </div>
                                      <div className="text-[10px] md:text-xs text-gray-300">
                                          <span className="font-bold text-white mr-1">brandique_agency</span>
                                          Boosting your brand's digital presence 🚀 <span className="text-blue-400">#marketing #growth</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* RIGHT: Content - Order adjusted for Tablet */}
                  <div>
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
                          <ul className="space-y-2 md:space-y-3 mb-8 md:mb-10">
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