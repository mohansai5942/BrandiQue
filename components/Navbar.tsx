import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Sun, Moon, Menu, X, Home, Code, Info, Mail, ChevronRight, Layers, LayoutTemplate, PenTool, Megaphone, ChevronDown, ArrowRight, Sparkles, ExternalLink, Tag, Bot, Briefcase, Settings, Phone, Globe, Palette } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import logoLightBg from '../assets/brand/logo-light-bg.webp';
import logoDarkBg from '../assets/brand/logo-dark-bg.webp';

const Navbar: React.FC = () => {
  const { settings, getRawPhone, websites } = useSiteSettings();
  const activeWebsites = websites.filter(w => !w.isDeleted);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [websitesOpen, setWebsitesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isWebsitesHovered, setIsWebsitesHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);
  const [websiteHoverTimeout, setWebsiteHoverTimeout] = useState<any>(null);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('theme') !== 'light') {
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

  const navLinkClasses = (path: string, isHighlighted?: boolean) => `
    relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-2
    ${isHighlighted ? 'nav-highlight' : ''}
    ${isActive(path)
      ? 'text-white bg-black dark:bg-white/10 dark:text-white shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
      : isHighlighted 
        ? 'text-gray-900 dark:text-white'
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

  const handleWebsitesEnter = () => {
    if (websiteHoverTimeout) clearTimeout(websiteHoverTimeout);
    setIsWebsitesHovered(true);
  };

  const handleWebsitesLeave = () => {
    const timeout = setTimeout(() => {
      setIsWebsitesHovered(false);
    }, 200);
    setWebsiteHoverTimeout(timeout);
  };

  interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
    hasDropdown?: boolean;
    hasWebsitesDropdown?: boolean;
    badgeStyle?: 'cyan' | 'amber' | 'violet';
    isHighlighted?: boolean;
    isExternal?: boolean;
  }

  const NAV_ITEMS: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Layers, hasDropdown: true },
    { label: 'Pricing', path: '/pricing', icon: Tag },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail, badgeStyle: 'amber' },
  ];

  const getBadgeStyles = (style?: 'cyan' | 'amber' | 'violet') => {
    switch (style) {
      case 'cyan':
        return {
          bg: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500',
          shadow: 'shadow-[0_4px_18px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.65)]',
          ring: 'ring-2 ring-cyan-300 shadow-[0_0_22px_rgba(6,182,212,0.8)]',
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:via-orange-500 hover:to-rose-500',
          shadow: 'shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_28px_rgba(225,29,72,0.65)]',
          ring: 'ring-2 ring-amber-300 shadow-[0_0_22px_rgba(245,158,11,0.8)]',
        };
      case 'violet':
      default:
        return {
          bg: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 hover:from-fuchsia-500 hover:via-purple-500 hover:to-cyan-400',
          shadow: 'shadow-[0_4px_18px_rgba(192,38,211,0.35)] hover:shadow-[0_6px_28px_rgba(6,182,212,0.65)]',
          ring: 'ring-2 ring-fuchsia-300 shadow-[0_0_22px_rgba(192,38,211,0.8)]',
        };
    }
  };

  const SERVICE_ITEMS = [
    { title: "Web Development", path: "/web-development", desc: "Conversion-focused custom and WordPress websites", icon: Code, color: "text-cyan-300", gradient: "group-hover:border-cyan-300/50 group-hover:shadow-[0_0_20px_rgba(103,232,249,0.2)]" },
    { title: "AI Agents & Automations", path: "/services/ai-automation", desc: "Chatbots, n8n workflows and connected business tools", icon: Bot, color: "text-violet-300", gradient: "group-hover:border-violet-300/50 group-hover:shadow-[0_0_20px_rgba(196,181,253,0.2)]" },
    { title: "Graphic Design", path: "/services/graphic-design", desc: "Logos, brand identity, social and ad creatives", icon: Palette, color: "text-amber-300", gradient: "group-hover:border-amber-300/50 group-hover:shadow-[0_0_20px_rgba(252,211,77,0.2)]" }
  ];

  return (
    <>
      <header className={`fixed top-0 z-50 w-full -mt-[19px] transition-all duration-500 ease-custom will-change-transform ${scrolled ? 'bg-white/95 dark:bg-[#05070A]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-1.5 md:py-2 shadow-sm' : 'bg-transparent py-2.5 md:py-4 desk:py-6'}`}>
        <div className="max-w-[100rem] mx-auto px-5 md:px-8 desk:px-12 2xl:px-16 mt-[20px] m-0 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group relative z-50 animate-logo-entrance" onClick={() => setIsOpen(false)} onContextMenu={(e) => e.preventDefault()}>
            <img
              src={logoLightBg} width={566} height={240}
              alt="BrandiQue Web Solutions"
              className="h-[52px] sm:h-[62px] desk:h-[78px] w-auto object-contain transition-all duration-300 block dark:hidden"
              loading="eager"
            />

            <img
              src={logoDarkBg} width={566} height={240}
              alt="BrandiQue Web Solutions"
              className="h-[52px] sm:h-[62px] desk:h-[78px] w-auto object-contain transition-all duration-300 hidden dark:block"
              loading="eager"
            />

          </Link>

          <nav className="hidden desk:flex items-center gap-2 p-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-md relative z-50 shadow-sm dark:shadow-none transition-colors duration-500">
            {NAV_ITEMS.filter(item => item.path !== '/admin').map((item) => {
              if (item.hasWebsitesDropdown) {
                const styles = getBadgeStyles(item.badgeStyle || 'violet');
                return (
                  <div key={item.path} className="relative flex items-center justify-center" onMouseEnter={handleWebsitesEnter} onMouseLeave={handleWebsitesLeave}>
                    <button 
                      onClick={() => {
                        setIsWebsitesHovered(!isWebsitesHovered);
                      }}
                      className={`relative group cursor-pointer overflow-hidden rounded-full px-4 py-1.5 ${styles.bg} text-white font-bold text-xs md:text-sm ${styles.shadow} hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-white/30`}
                    >
                      {/* Continuous Automatic Top Shine Animation */}
                      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine pointer-events-none"></span>

                      {/* Interactive Hover Reflection Sweep */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></span>

                      <span className="relative flex items-center gap-2 text-xs md:text-sm font-extrabold text-white">
                        <Globe size={15} className="text-white group-hover:rotate-[180deg] transition-transform duration-700 ease-out shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
                        
                        <span className="tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-extrabold">
                          {item.label}
                        </span>

                        <ChevronDown size={13} className={`text-white/90 transition-transform duration-300 ${isWebsitesHovered ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[320px] bg-white dark:bg-[#0A0C11]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl transition-all duration-300 origin-top transform ${isWebsitesHovered ? 'opacity-100 translate-y-0 visible scale-100' : 'opacity-0 translate-y-4 invisible scale-95 pointer-events-none'}`}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#0A0C11]/95 border-t border-l border-gray-200 dark:border-white/10 rotate-45 transition-colors duration-500"></div>
                      <div className="space-y-1.5 relative z-10">
                        {activeWebsites.map((web) => (
                          <a 
                            key={web.id} 
                            href={web.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="relative overflow-hidden flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/70 dark:bg-white/[0.04] hover:bg-gradient-to-r hover:from-violet-600/10 hover:via-purple-600/10 hover:to-cyan-500/10 hover:border-violet-500/30 dark:hover:border-violet-400/30 hover:shadow-[0_4px_20px_rgba(147,51,234,0.15)] transition-all duration-300 group"
                          >
                            {/* Light Reflection Sweep */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></span>

                            <div className="flex items-center gap-3 min-w-0 relative z-10">
                              {web.logoUrl ? (
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-violet-500/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 group-hover:border-violet-500 transition-all duration-300 shadow-sm">
                                  <img src={web.logoUrl} alt={web.name} loading="lazy" decoding="async" className="w-full h-full object-contain rounded" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 dark:border-violet-400/30 flex items-center justify-center text-violet-600 dark:text-violet-300 shrink-0 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                  <Globe size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors block truncate">{web.name}</span>
                                {web.description && <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate font-medium mt-0.5">{web.description}</span>}
                              </div>
                            </div>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 ml-2 relative z-10" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              if (item.hasDropdown) {
                return (
                  <div key={item.path} className="relative" onMouseEnter={handleServicesEnter} onMouseLeave={handleServicesLeave}>
                    <Link to={item.path} className={`${navLinkClasses(item.path, item.isHighlighted)} group`}>
                      {item.icon && <item.icon size={14} />}
                      {item.label} 
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesHovered ? 'rotate-180' : ''}`} />
                    </Link>
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
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                          <Link to="/solutions" className="text-xs font-bold text-yellow-600 dark:text-yellow-300 hover:text-black dark:hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"><Sparkles size={12} /> Industry Solutions</Link>
                          <Link to="/services" className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">View Overview Page <ArrowRight size={12} /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              if (item.badgeStyle) {
                const active = isActive(item.path);
                const styles = getBadgeStyles(item.badgeStyle);
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`relative group cursor-pointer overflow-hidden rounded-full px-4 py-1.5 ${styles.bg} text-white font-bold text-xs md:text-sm ${styles.shadow} hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-white/30 ${
                      active ? `${styles.ring} scale-105` : ''
                    }`}
                  >
                    {/* Continuous Automatic Top Shine Animation */}
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine pointer-events-none"></span>

                    {/* Interactive Hover Reflection Sweep */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></span>

                    <span className="relative flex items-center gap-2 text-xs md:text-sm font-extrabold text-white">
                      {item.icon && <item.icon size={15} className="text-white group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />}
                      
                      <span className="tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-extrabold">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                );
              }
              if (item.isExternal) {
                return (
                  <a 
                    key={item.path} 
                    href={item.path} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={navLinkClasses(item.path, item.isHighlighted)}
                  >
                    {item.icon && <item.icon size={14} className={item.isHighlighted ? 'text-neon-purple' : ''} />}
                    {item.label}
                  </a>
                );
              }
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={navLinkClasses(item.path, item.isHighlighted)}
                >
                  {item.icon && <item.icon size={14} className={item.isHighlighted ? 'text-neon-purple' : ''} />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden desk:flex items-center gap-3">

            <a href={settings.instagram || "https://www.instagram.com/brandiquewebsolutions/"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-neon-purple hover:bg-neon-purple/20 transition-all duration-300 hover:scale-110 shadow-sm dark:shadow-none"><Instagram size={18} /></a>
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 hover:rotate-90 shadow-sm dark:shadow-none">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>

          <div className="desk:hidden flex items-center gap-2 relative z-50">
            <button 
              className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none flex items-center justify-center" 
              onClick={() => setIsOpen(true)} 
              aria-label="Open Menu"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
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
            if (item.hasWebsitesDropdown) {
              return (
                <div key={item.path} className={`rounded-2xl transition-all duration-300 overflow-hidden border ${websitesOpen ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10' : 'bg-transparent border-transparent'} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${Math.min(idx * 30, 150)}ms` }}>
                  <button 
                    onClick={() => setWebsitesOpen(!websitesOpen)} 
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white font-extrabold shadow-md border border-white/20 transition-all active:scale-[0.98]"
                  >
                    {/* Continuous Automatic Top Shine Animation */}
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine pointer-events-none"></span>

                    <div className="relative flex items-center gap-3 z-10">
                      <div className="p-2 rounded-xl bg-white/20 text-white shadow-inner"><Globe size={18} /></div>
                      <span className="text-base font-extrabold text-white tracking-wide">{item.label}</span>
                    </div>
                    <ChevronDown size={18} className={`text-white transition-transform duration-300 relative z-10 ${websitesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid gap-2 px-3 transition-all duration-300 ease-in-out ${websitesOpen ? 'pb-4 pt-2 max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {activeWebsites.map((web) => (
                      <a key={web.id} href={web.url} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="relative overflow-hidden flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#151A25] border border-gray-200/80 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all group">
                        <div className="flex items-center gap-3 min-w-0">
                          {web.logoUrl ? (
                            <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-violet-500/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                              <img src={web.logoUrl} alt={web.name} loading="lazy" decoding="async" className="w-full h-full object-contain rounded" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg text-violet-600 dark:text-violet-300 bg-violet-500/10 border border-violet-500/20 group-hover:scale-110 transition-transform"><Globe size={18} /></div>
                          )}
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-gray-900 dark:text-white block truncate">{web.name}</span>
                            {web.description && <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">{web.description}</span>}
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-violet-600 dark:text-violet-300 shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
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
                    <Link to="/solutions" onClick={() => setIsOpen(false)} className="mt-2 py-3 flex items-center justify-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-300 bg-yellow-400/5 rounded-xl border border-yellow-400/25 hover:bg-yellow-400/10 transition-colors"><Sparkles size={14} /> Industry Solutions</Link>
                    <Link to="/services" onClick={() => setIsOpen(false)} className="mt-2 py-3 flex items-center justify-center gap-2 text-xs font-bold text-neon-purple bg-neon-purple/5 rounded-xl border border-neon-purple/20 hover:bg-neon-purple/10 transition-colors">View All Services <ArrowRight size={14} /></Link>
                  </div>
                </div>
              );
            }
            const delayStyle = { transitionDelay: `${Math.min(idx * 30, 150)}ms` };

            if (item.badgeStyle) {
              const styles = getBadgeStyles(item.badgeStyle);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 overflow-hidden ${styles.bg} text-white font-bold shadow-md border border-white/20 ${
                    active ? 'ring-2 ring-white/90' : ''
                  }`}
                  style={delayStyle}
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine pointer-events-none"></span>
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 text-white"><item.icon size={18} /></div>
                    <span className="text-sm font-extrabold text-white">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-white/80" />
                </Link>
              );
            }
            const commonClasses = `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border border-transparent ${active ? 'bg-gray-100 dark:bg-white/10 shadow-sm border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]'} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${item.isHighlighted ? 'nav-highlight' : ''}`;

            if (item.isExternal) {
              return (
                <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={commonClasses} style={delayStyle}>
                  <div className={`p-2 rounded-lg transition-colors ${active ? 'text-neon-purple bg-neon-purple/10' : 'text-gray-400 bg-gray-100 dark:bg-white/5'}`}><item.icon size={20} /></div>
                  <span className={`text-base font-bold ${active ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{item.label}</span>
                </a>
              );
            }

            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={commonClasses} style={delayStyle}>
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
          <div className="flex gap-3">
            <a href={settings.instagram || "https://www.instagram.com/brandiquewebsolutions/"} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:text-neon-purple transition-colors"><Instagram size={16} /> Social</a>
            <a href={`tel:${getRawPhone()}`} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple font-bold text-sm hover:bg-neon-purple/20 transition-colors"><Phone size={16} /> Call Us</a>
          </div>
          <div className="text-center"><p className="text-[10px] text-gray-400 font-medium">v1.2.0 • BrandiQue Web Solutions</p></div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;