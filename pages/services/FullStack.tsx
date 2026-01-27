import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code, Zap, LayoutTemplate, Rocket, Server, Sparkles, TrendingUp, Globe } from 'lucide-react';
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