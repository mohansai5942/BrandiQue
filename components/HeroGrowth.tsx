import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCheck, MessageCircle, Sparkles, FileSpreadsheet, BellRing, CalendarClock, Bot } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { whatsappLink } from '../data/offers';

const ROTATING = ['Web Development', 'AI Agents & Automations', 'Graphic Design'];

const CHAT = [
  { from: 'customer', text: 'Hi, what are the fees for the Class 10 batch? Any evening timing?', time: '9:42 PM' },
  { from: 'bot', text: 'Hi! Class 10 fees are ₹18,000 per year. We have an evening batch, 6 to 8 PM. Would you like to book a free demo class?', time: '9:42 PM' },
  { from: 'customer', text: 'Yes, Saturday please', time: '9:43 PM' },
  { from: 'bot', text: 'Booked for Saturday, 10 AM ✅ We’ll send a reminder the day before.', time: '9:43 PM' },
];

const TRUST = ['Fixed written quotes', 'You own everything', 'Live in 1–4 weeks', 'Telugu & English support'];

const HeroGrowth: React.FC = () => {
  const { openInquiry } = useInquiry();
  const { settings } = useSiteSettings();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setWordIndex(i => (i + 1) % ROTATING.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const waHref = whatsappLink(settings.whatsapp, 'Hi BrandiQue, I would like a free growth audit for my business.');

  return (
    <section className="relative w-full overflow-hidden pt-32 pb-20 md:pt-36 lg:pt-40 lg:pb-28 bg-gray-50 dark:bg-[#05070A]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-neon-purple/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-14 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Copy */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
            Growth studio · Visakhapatnam, India
          </div>

          <h1 className="mt-6 text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.6rem] font-bold tracking-tight text-gray-900 dark:text-white">
            Turn every enquiry into a{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">paying customer.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            BrandiQue builds premium websites, AI agents that reply and follow up 24/7, and design that earns trust, working together as one growth system for your business.
          </p>

          <div className="mt-5 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">We build</span>
            <span className="relative inline-flex h-8 min-w-[220px] items-center overflow-hidden rounded-full border border-gray-200 bg-white px-3.5 font-bold text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <span key={wordIndex} className="animate-fade-in whitespace-nowrap leading-none">{ROTATING[wordIndex]}</span>
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-base font-bold text-black shadow-[0_12px_40px_rgba(234,179,8,0.35)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300">
              Get a free growth audit <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-4 text-base font-bold text-gray-900 transition-colors hover:border-green-500 hover:text-green-600 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-green-400 dark:hover:text-green-400">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
          <Link to="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
            Or see transparent pricing <ArrowRight size={14} />
          </Link>

          <ul className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-gray-200 pt-6 dark:border-white/10">
            {TRUST.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Check size={16} className="shrink-0 text-yellow-500" />{item}</li>
            ))}
          </ul>
        </div>

        {/* Visual: example AI conversation */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-yellow-400/20 via-transparent to-neon-purple/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0B0E14]">
            <div className="flex items-center gap-3 border-b border-gray-200 bg-[#075E54] px-5 py-4 text-white dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Bot size={20} /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">Sunrise Academy · AI Assistant</div>
                <div className="text-[11px] text-white/70">online · replies instantly</div>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">Example</span>
            </div>
            <div className="space-y-3 bg-[#ECE5DD] px-4 py-5 dark:bg-[#0F141B]">
              {CHAT.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug shadow-sm opacity-0 animate-fade-up ${msg.from === 'bot' ? 'rounded-tl-sm bg-white text-gray-800 dark:bg-[#1C232D] dark:text-gray-100' : 'rounded-tr-sm bg-[#DCF8C6] text-gray-800 dark:bg-[#005C4B] dark:text-white'}`} style={{ animationDelay: `${300 + i * 450}ms` }}>
                    {msg.text}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-500 dark:text-gray-400">{msg.time}{msg.from === 'customer' && <CheckCheck size={12} className="text-sky-500" />}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 text-center dark:divide-white/10 dark:border-white/10">
              {[{ icon: FileSpreadsheet, label: 'Lead saved' }, { icon: BellRing, label: 'Owner notified' }, { icon: CalendarClock, label: 'Reminder set' }].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1 px-2 py-3.5">
                  <item.icon size={17} className="text-yellow-600 dark:text-yellow-300" />
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0F1320]/95">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/15 text-green-600 dark:text-green-400"><MessageCircle size={18} /></span>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Reply time</div><div className="text-sm font-black text-gray-900 dark:text-white">Under 10 seconds</div></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0F1320]/95">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-300"><Sparkles size={18} /></span>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Working hours</div><div className="text-sm font-black text-gray-900 dark:text-white">24 × 7, all year</div></div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroGrowth;
