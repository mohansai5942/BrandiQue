import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code2, Bot, Palette, MessageCircle, PhoneCall } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { whatsappLink } from '../data/offers';
import { SERVICE_VISUALS, ServiceKey } from './ServiceVisuals';

const SERVICES: { key: ServiceKey; label: string; line: string; icon: React.ElementType; href: string; accent: string; bar: string; from: string }[] = [
  { key: 'web', label: 'Web Development', line: 'Websites that sell.', icon: Code2, href: '/web-development', accent: 'text-cyan-600 dark:text-cyan-300', bar: 'bg-cyan-400', from: '₹9,000' },
  { key: 'ai', label: 'AI Agents & Automations', line: 'AI that follows up.', icon: Bot, href: '/services/ai-automation', accent: 'text-violet-600 dark:text-violet-300', bar: 'bg-violet-400', from: '₹12,000' },
  { key: 'design', label: 'Graphic Design', line: 'Design that wins trust.', icon: Palette, href: '/services/graphic-design', accent: 'text-amber-500 dark:text-amber-300', bar: 'bg-amber-400', from: '₹4,500' },
  { key: 'voice', label: 'Voice Calling AI Agents', line: 'Voice AI that calls.', icon: PhoneCall, href: '/services/voice-ai-agents', accent: 'text-emerald-600 dark:text-emerald-300', bar: 'bg-emerald-400', from: '₹2,799/mo' },
];

const FLOATERS: Record<ServiceKey, { t: string; s: string }[]> = {
  web: [{ t: 'Website live', s: 'Mobile-first · SEO-ready' }, { t: 'New enquiry', s: 'via WhatsApp button' }],
  ai: [{ t: 'Lead captured', s: 'Saved to Google Sheets' }, { t: 'Reply sent', s: 'in seconds, 24 × 7' }],
  design: [{ t: 'Brand kit ready', s: 'Logo · colours · fonts' }, { t: '8 posts delivered', s: 'This month’s creatives' }],
  voice: [{ t: 'Lead called', s: 'within seconds, in Telugu' }, { t: 'Visit booked', s: 'WhatsApp confirmation sent' }],
};

const TRUST = ['Fixed written quotes', 'You own everything', 'Live in 1–4 weeks', 'Telugu & English support'];
const CYCLE_MS = 4200;

const HeroGrowth: React.FC = () => {
  const { openInquiry } = useInquiry();
  const { settings } = useSiteSettings();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive(i => (i + 1) % SERVICES.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const current = SERVICES[active];
  const Visual = SERVICE_VISUALS[current.key];
  const waHref = whatsappLink(settings.whatsapp, 'Hi BrandiQue, I would like a free growth audit for my business.');

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 pb-10 pt-[6.75rem] dark:bg-[#05070A] md:pb-24 md:pt-36 desk:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 top-80 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-[100rem] items-center gap-3 md:gap-12 px-5 md:px-8 desk:px-12 2xl:px-16 desk:grid-cols-[1.05fr_0.95fr] desk:gap-14">
        <div>

          <h1 className="text-[2.5rem] font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-6xl desk:text-[4.4rem]">
            {SERVICES.map((s, i) => (
              <span key={s.key} className={`block transition-all duration-500 ${i === active ? s.accent : 'text-gray-900/25 dark:text-white/25'}`}>{s.line}</span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
            BrandiQue is one team for <strong className="font-semibold text-gray-900 dark:text-white">websites</strong>, <strong className="font-semibold text-gray-900 dark:text-white">AI agents</strong>, <strong className="font-semibold text-gray-900 dark:text-white">graphic design</strong> and <strong className="font-semibold text-gray-900 dark:text-white">AI voice calling</strong>. We build the site that wins the enquiry, the AI that replies and follows up, the voice agent that calls every lead, and the design that makes customers trust you, so you grow without hiring four agencies.
          </p>

          <div className="mt-6 md:mt-8 flex flex-row flex-wrap items-center gap-2.5 md:gap-3">
            <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm md:px-7 md:py-4 md:text-base font-bold text-black shadow-[0_12px_40px_rgba(234,179,8,0.35)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300">
              Get a free growth audit <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm md:px-7 md:py-4 md:text-base font-bold text-gray-900 transition-colors hover:border-yellow-400 dark:border-white/15 dark:bg-white/5 dark:text-white">
              Explore services
            </Link>
          </div>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline dark:text-green-400">
            <MessageCircle size={15} /> Or chat with us on WhatsApp
          </a>
          <div className="mt-2">
            <Link to="/roi-calculator" className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-700 hover:underline dark:text-yellow-300">
              Losing enquiries after hours? See what it costs you <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-gray-200 pt-6 dark:border-white/10">
            {TRUST.map(item => <li key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Check size={16} className="shrink-0 text-yellow-500" />{item}</li>)}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-cyan-400/20 via-violet-500/10 to-amber-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -inset-10 hidden rounded-full border border-dashed border-gray-300/60 animate-spin-slow dark:border-white/10 xl:block" />
          {FLOATERS[current.key].map((f, i) => (
            <div key={`${current.key}-${i}`} className={`absolute z-20 hidden items-center gap-2.5 rounded-2xl border border-gray-200 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur animate-float dark:border-white/10 dark:bg-[#11151C]/95 xl:flex ${i === 0 ? '-left-36 top-[46%]' : '-right-6 bottom-[22%]'}`} style={{ animationDelay: `${i * 1.5}s` }}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black`}><Check size={15} /></span>
              <span><span className="block text-xs font-bold text-gray-900 dark:text-white">{f.t}</span><span className="block text-[10px] text-gray-500 dark:text-gray-400">{f.s}</span></span>
            </div>
          ))}
          <div className="relative rounded-[30px] border border-gray-200 bg-white/70 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
            <div role="tablist" aria-label="Our services" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {SERVICES.map((s, i) => (
                <button key={s.key} role="tab" type="button" aria-selected={i === active} onClick={() => setActive(i)} className={`relative overflow-hidden rounded-xl px-2 py-2.5 text-left transition-colors ${i === active ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'}`}>
                  <s.icon size={15} className={i === active ? '' : s.accent} />
                  <div className="mt-1 text-[10px] font-bold leading-tight sm:text-xs">{s.label}</div>
                  <div className={`mt-0.5 text-[9px] font-semibold sm:text-[10px] ${i === active ? 'opacity-70' : 'text-gray-400'}`}>from {s.from}</div>
                  {i === active && !paused && <span key={`bar-${active}`} className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`} style={{ animation: `heroProgress ${CYCLE_MS}ms linear forwards` }} />}
                </button>
              ))}
            </div>
            <div className="mt-3 h-[21rem] sm:h-[24rem]">
              <div key={current.key} className="h-full"><Visual /></div>
            </div>
            <Link to={current.href} className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white/5 dark:text-white dark:hover:bg-yellow-400 dark:hover:text-black">
              Explore {current.label} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes heroProgress{from{width:0}to{width:100%}}`}</style>
    </section>
  );
};

export default HeroGrowth;
