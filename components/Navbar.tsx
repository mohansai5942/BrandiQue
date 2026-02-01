import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Sun, Moon, Menu, X, Home, Code, Info, Mail, ChevronRight, Layers, LayoutTemplate, PenTool, Megaphone, ChevronDown, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClasses = (path: string) => `
    relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
    ${isActive(path)
      ? 'text-white bg-black dark:bg-white/10 dark:text-white shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
      : 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }
  `;

  const handleServicesEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsServicesHovered(true);
  };

  const handleServicesLeave = () => {
    const timeout = setTimeout(() => {
      setIsServicesHovered(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Layers, hasDropdown: true },
    { label: 'Web Development', path: '/web-development', icon: Code },
    { label: 'AI Prompts', path: 'https://creator.brandique.in/', icon: Sparkles, isExternal: true },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  const SERVICE_ITEMS = [
    { title: "Full-Stack Web Development", path: "/services/full-stack", desc: "Custom-coded websites with modern UI/UX", icon: Code, color: "text-neon-purple", gradient: "group-hover:border-neon-purple/50 group-hover:shadow-[0_0_20px_rgba(176,38,255,0.2)]" },
    { title: "WordPress Development", path: "/services/wordpress", desc: "Fast, scalable, easy-to-manage builds", icon: LayoutTemplate, color: "text-blue-400", gradient: "group-hover:border-blue-400/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
    { title: "Branding & Identity", path: "/services/branding", desc: "Logos, 3D mockups, and brand systems", icon: PenTool, color: "text-pink-400", gradient: "group-hover:border-pink-400/50 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]" },
    { title: "Digital Marketing", path: "/services/digital-marketing", desc: "Social media creatives and growth visuals", icon: Megaphone, color: "text-green-400", gradient: "group-hover:border-green-400/50 group-hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]" }
  ];

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ease-custom will-change-transform ${scrolled ? 'bg-white/95 dark:bg-[#05070A]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-1.5 md:py-2 shadow-sm' : 'bg-transparent py-2.5 md:py-4 lg:py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group relative z-50 animate-logo-entrance" onClick={() => setIsOpen(false)} onContextMenu={(e) => e.preventDefault()}>
            <img
              src="https://cdn.imgchest.com/files/dcafd6812298.png"
              alt="BrandiQue Web Solutions"
              className="h-[52px] sm:h-[62px] lg:h-[78px] w-auto object-contain transition-all duration-300 block dark:hidden"
              loading="eager"
            />

            <img
              src="https://cdn.imgchest.com/files/fd6fe875bd05.png"
              alt="BrandiQue Web Solutions"
              className="h-[52px] sm:h-[62px] lg:h-[78px] w-auto object-contain transition-all duration-300 hidden dark:block"
              loading="eager"
            />

          </Link>

          <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-md relative z-50 shadow-sm dark:shadow-none transition-colors duration-500">
            {NAV_ITEMS.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.path} className="relative" onMouseEnter={handleServicesEnter} onMouseLeave={handleServicesLeave}>
                    <Link to={item.path} className={`${navLinkClasses(item.path)} flex items-center gap-1 group`}>{item.label} <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesHovered ? 'rotate-180' : ''}`} /></Link>
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[640px] bg-white dark:bg-[#0A0C11]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 origin-top transform ${isServicesHovered ? 'opacity-100 translate-y-0 visible scale-100' : 'opacity-0 translate-y-4 invisible scale-95 pointer-events-none'}`}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#0A0C11]/90 border-t border-l border-gray-200 dark:border-white/10 rotate-45 transition-colors duration-500"></div>
                      <div className="grid grid-cols-2 gap-3 relative z-10">
                        {SERVICE_ITEMS.map((service, idx) => (
                          <Link key={idx} to={service.path} className={`flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all duration-300 group ${service.gradient}`}>
                            <div className={`p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 ${service.color} shadow-sm dark:shadow-none`}><service.icon size={24} /></div>
                            <div>
                              <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1">{service.title} <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" /></h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300">{service.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/5 text-center transition-colors duration-500">
                        <Link to="/services" className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">View Overview Page <ArrowRight size={12} /></Link>
                      </div>
                    </div>
                  </div>
                );
              }
              if (item.isExternal) {
                return (<a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className={navLinkClasses(item.path)}>{item.label}</a>);
              }
              return (<Link key={item.path} to={item.path} className={navLinkClasses(item.path)}>{item.label}</Link>);
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="https://www.instagram.com/mohan_creator/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-neon-purple hover:bg-neon-purple/20 transition-all duration-300 hover:scale-110 shadow-sm dark:shadow-none"><Instagram size={18} /></a>
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 hover:rotate-90 shadow-sm dark:shadow-none">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>

          <button className="lg:hidden relative z-50 p-1.5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none" onClick={() => setIsOpen(true)} aria-label="Open Menu"><Menu size={24} strokeWidth={2} /></button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] bg-black/30 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} aria-hidden="true"></div>

      <aside className={`fixed top-0 right-0 z-[70] h-[100dvh] w-[85%] max-w-[400px] bg-white dark:bg-[#0A0C11] shadow-2xl border-l border-gray-200 dark:border-white/10 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-10 transition-colors duration-500">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Close Menu"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-2">
          {NAV_ITEMS.map((item, idx) => {
            const active = isActive(item.path);
            if (item.hasDropdown) {
              return (
                <div key={item.path} className={`rounded-2xl transition-all duration-300 overflow-hidden border ${servicesOpen ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10' : 'bg-transparent border-transparent'} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${Math.min(idx * 30, 150)}ms` }}>
                  <button onClick={() => setServicesOpen(!servicesOpen)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${!servicesOpen && 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${active || servicesOpen ? 'text-neon-purple bg-neon-purple/10' : 'text-gray-400 bg-gray-100 dark:bg-white/5'}`}><item.icon size={20} /></div>
                      <span className={`text-base font-bold ${active || servicesOpen ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{item.label}</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid gap-2 px-3 transition-all duration-300 ease-in-out ${servicesOpen ? 'pb-4 pt-1 max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {SERVICE_ITEMS.map((service, sIdx) => (
                      <Link key={sIdx} to={service.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#151A25] border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all">
                        <div className={`p-2 rounded-lg ${service.color} bg-opacity-10 dark:bg-opacity-20`}><service.icon size={18} className={service.color} /></div>
                        <div className="flex-1"><span className="text-sm font-bold text-gray-900 dark:text-white block">{service.title}</span><span className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{service.desc}</span></div>
                      </Link>
                    ))}
                    <Link to="/services" onClick={() => setIsOpen(false)} className="mt-2 py-3 flex items-center justify-center gap-2 text-xs font-bold text-neon-purple bg-neon-purple/5 rounded-xl border border-neon-purple/20 hover:bg-neon-purple/10 transition-colors">View All Services <ArrowRight size={14} /></Link>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border border-transparent ${active ? 'bg-gray-100 dark:bg-white/10 shadow-sm border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]'} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${Math.min(idx * 30, 150)}ms` }}>
                <div className={`p-2 rounded-lg transition-colors ${active ? 'text-neon-purple bg-neon-purple/10' : 'text-gray-400 bg-gray-100 dark:bg-white/5'}`}><item.icon size={20} /></div>
                <span className={`text-base font-bold ${active ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-purple"></div>}
              </Link>
            );
          })}
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50 space-y-4 transition-colors duration-500">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">{isDark ? <Moon size={18} /> : <Sun size={18} />}</div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-neon-purple' : 'bg-gray-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
          </button>
          <div className="flex gap-3"><a href="https://www.instagram.com/mohan_creator/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:text-neon-purple transition-colors"><Instagram size={16} /> Social</a></div>
          <div className="text-center"><p className="text-[10px] text-gray-400 font-medium">v1.2.0 • BrandiQue Web Solutions</p></div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;