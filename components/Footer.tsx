import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, AtSign, Mail, ArrowRight, Phone, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { settings, getRawPhone } = useSiteSettings();

  const SOCIAL_LINKS = [
    { icon: Instagram, href: settings.instagram || "https://www.instagram.com/brandiquewebsolutions/" },
    { icon: Twitter, href: "https://x.com/Mohan_Creator" }, // Twitter (X)
    { icon: AtSign, href: "https://www.threads.com/@mohan_creator/" }, // Threads
    { icon: Mail, href: `mailto:${settings.email}` }
  ];

  return (
    <footer className="relative bg-white dark:bg-[#0A0C11] pt-10 pb-6 md:pt-10 md:pb-6 lg:pt-16 lg:pb-8 overflow-hidden mt-auto border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[100rem] mx-auto px-6 relative z-10">
        
        {/* Grid Layout: 2 cols Brand + 3 cols Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8 lg:gap-10 mb-8 md:mb-10 lg:mb-16">
          
          {/* Brand Column (Spans 2 columns on lg screens) */}
          <ScrollReveal className="col-span-2 lg:col-span-2 space-y-4 md:space-y-4 lg:space-y-6 pr-4 md:pr-4 lg:pr-8" delay="delay-100">
            <Link 
              to="/" 
              className="flex items-center gap-3 group w-fit"
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Light Theme Logo (Visible in Light Mode) */}
              <img 
                src="https://cdn.imgchest.com/files/c912299e5353.png" 
                alt="BrandiQue Web Solutions" 
                className="h-[40px] md:h-[48px] lg:h-[64px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 block dark:hidden" 
              />
              {/* Dark Theme Logo (Visible in Dark Mode) */}
              <img 
                src="https://cdn.imgchest.com/files/1b3230978aa9.png" 
                alt="BrandiQue Web Solutions" 
                className="h-[40px] md:h-[48px] lg:h-[64px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 hidden dark:block" 
              />
            </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-xs lg:text-sm leading-relaxed max-sm font-light">
              We help businesses win and keep more customers with web development, AI agents & automations, and graphic design.
            </p>

            <div className="flex gap-3 md:gap-3 lg:gap-4 pt-2">
              {SOCIAL_LINKS.map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 dark:bg-[#151A25] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 hover:border-neon-purple hover:text-white hover:bg-neon-purple hover:scale-[1.15] hover:rotate-12 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  <item.icon size={14} className="md:w-[14px] md:h-[14px] lg:w-[18px] lg:h-[18px]" />
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Services Column */}
          <ScrollReveal className="col-span-1" delay="delay-200">
            <h4 className="text-gray-900 dark:text-white font-bold mb-3 md:mb-4 lg:mb-6 text-sm md:text-sm lg:text-lg">Services</h4>
            <ul className="space-y-2 md:space-y-2 lg:space-y-3">
              {[
                { label: 'Web Development', to: '/web-development' },
                { label: 'AI Agents & Automation', to: '/services/ai-automation' },
                { label: 'Graphic Design', to: '/services/graphic-design' },
                { label: 'Pricing & Packages', to: '/pricing' },
                { label: 'Monthly Memberships', to: '/pricing#growth-plans' },
                { label: 'Industry Solutions', to: '/solutions' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] md:text-xs lg:text-sm transition-all duration-200 flex items-center gap-1 group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-neon-blue opacity-0 group-hover:opacity-100"><ArrowRight size={10} className="md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" /></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Company Column */}
          <ScrollReveal className="col-span-1" delay="delay-400">
            <h4 className="text-gray-900 dark:text-white font-bold mb-3 md:mb-4 lg:mb-6 text-sm md:text-sm lg:text-lg">Company</h4>
            <ul className="space-y-2 md:space-y-2 lg:space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'All Services', to: '/services' },
                { label: 'Pricing & Packages', to: '/pricing' },
                { label: 'Industry Solutions', to: '/solutions' },
                { label: 'Web Development', to: '/web-development' },
                { label: 'Contact', to: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] md:text-xs lg:text-sm transition-all duration-200 flex items-center gap-1 group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-pink-500 opacity-0 group-hover:opacity-100"><ArrowRight size={10} className="md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" /></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Resources Column */}
          <ScrollReveal className="col-span-1" delay="delay-500">
            <h4 className="text-gray-900 dark:text-white font-bold mb-3 md:mb-4 lg:mb-6 text-sm md:text-sm lg:text-lg">Resources</h4>
            <ul className="space-y-2 md:space-y-2 lg:space-y-3">
              {[
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Terms of Service', to: '/terms-and-conditions' },
                { label: 'Cookie Policy', to: '/cookie-policy' },
                { label: 'Support Center', to: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[10px] md:text-xs lg:text-sm transition-all duration-200 flex items-center gap-1 group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-yellow-500 opacity-0 group-hover:opacity-100"><ArrowRight size={10} className="md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" /></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

        </div>

        {/* Bottom Bar */}
        <ScrollReveal className="border-t border-gray-200 dark:border-white/5 pt-6 md:pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4" delay="delay-400">
          <p className="text-gray-500 dark:text-gray-500 text-[10px] md:text-xs lg:text-sm text-center md:text-left">
            &copy; {currentYear} BrandiQue Web Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-3 md:gap-6">
             <span className="text-gray-500 dark:text-gray-500 text-[10px] md:text-xs lg:text-sm">Created by <Link to="/about" className="text-black dark:text-white font-bold hover:text-neon-purple transition-colors cursor-pointer">Mohan</Link></span>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;