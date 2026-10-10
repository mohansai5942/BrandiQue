import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Palette, PenTool, Layers, Image, Megaphone, MonitorPlay, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import GrowthOffers from '../../components/GrowthOffers';

const DESIGN_SERVICES = [
  { icon: Palette, title: 'Social media creatives', description: 'Feed posts, story designs, carousels and campaign sets that stay consistent with your brand.' },
  { icon: Megaphone, title: 'Ad creatives & promotions', description: 'Clear visual hierarchy for offers, launches, announcements and paid campaign assets.' },
  { icon: MonitorPlay, title: 'Thumbnails & banners', description: 'Scroll-stopping visuals for creator content, channels, websites and digital campaigns.' },
  { icon: Layers, title: 'Brand collateral', description: 'Business cards, flyers, brochures, pitch decks and other everyday brand materials.' },
];

const PROCESS = [
  { number: '01', title: 'Brief & direction', description: 'We clarify the audience, platform, message, format and references before designing.' },
  { number: '02', title: 'Design & refine', description: 'You review a focused direction and provide consolidated feedback within the agreed scope.' },
  { number: '03', title: 'Export & handover', description: 'Receive final assets in the agreed formats, sized for the intended platforms.' },
];

const GraphicDesign: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pb-20 pt-32 text-gray-900 transition-colors duration-300 dark:bg-[#05070A] dark:text-white md:pt-40">
    <section className="relative overflow-hidden px-4 pb-14 md:px-6 md:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-3xl rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300 md:text-xs">
            <Sparkles size={14} /> Graphic design studio
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
            Make your brand<br /><span className="text-amber-500">impossible to ignore.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
            BrandiQue creates purposeful digital visuals that help your business look consistent, communicate clearly and show up professionally across the channels that matter.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 font-bold text-black transition-colors hover:bg-amber-300">Discuss a design brief <ArrowRight size={17} /></Link>
            <a href="#design-pricing" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3.5 font-semibold transition-colors hover:border-amber-400/60 dark:border-white/15">View starting prices</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
            <span className="inline-flex items-center gap-2"><Check size={15} className="text-amber-500" /> Agreed deliverables</span>
            <span className="inline-flex items-center gap-2"><Check size={15} className="text-amber-500" /> Platform-ready exports</span>
            <span className="inline-flex items-center gap-2"><Check size={15} className="text-amber-500" /> Clear revision scope</span>
          </div>
        </ScrollReveal>
        <ScrollReveal delay="delay-200">
          <div className="relative rounded-[32px] border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#0D1017] md:p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-[#11130F] p-4 text-white md:p-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-300">Campaign / 01</span>
                <div><div className="mb-2 h-1 w-10 bg-amber-400" /><p className="text-xl font-black leading-tight md:text-2xl">MAKE<br />IT MATTER.</p><p className="mt-3 text-[10px] text-white/60">A message worth remembering.</p></div>
              </div>
              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-950 p-4 text-white md:p-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/70">Digital / 02</span>
                <div><Image size={26} className="mb-4 text-violet-200" /><p className="text-xl font-black leading-tight md:text-2xl">BOLD<br />BY DESIGN.</p><p className="mt-3 text-[10px] text-white/65">Built for the feed.</p></div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 dark:border-white/10">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">One visual system</p><p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Consistent assets across your brand touchpoints.</p></div>
                <PenTool size={24} className="shrink-0 text-amber-500" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <ScrollReveal>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">What we design</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Visuals with a job to do.</h2>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">Each asset starts with its purpose—what people should notice, understand or do next. We align the design with your message instead of adding decoration for its own sake.</p>
        </div>
      </ScrollReveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DESIGN_SERVICES.map((service, index) => (
          <ScrollReveal key={service.title} delay={index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : index === 2 ? 'delay-300' : 'delay-400'}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-amber-400/60 dark:border-white/10 dark:bg-[#0D1017]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-300"><service.icon size={21} /></div>
              <h3 className="mt-5 font-bold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.description}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <ScrollReveal>
        <div className="rounded-[28px] border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0D1017] md:p-10">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500"><Layers size={22} /></div><h2 className="text-2xl font-bold md:text-3xl">A straightforward creative process</h2></div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PROCESS.map(step => <div key={step.number} className="border-t border-gray-200 pt-5 dark:border-white/10"><p className="text-xs font-bold tracking-[0.2em] text-amber-600 dark:text-amber-300">{step.number}</p><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.description}</p></div>)}
          </div>
        </div>
      </ScrollReveal>
    </section>

    <div id="design-pricing" className="mt-10"><GrowthOffers showHeading={false} pillars={['design']} /></div>

    <section className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-[28px] bg-[#11130F] p-7 text-white md:p-12">
          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Ready when you are</p><h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Let’s make your next creative count.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">Share the platform, audience, content format and deadline. We’ll confirm the scope and quote before design work begins.</p></div>
            <Link to="/contact" className="relative inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 font-bold text-black transition-colors hover:bg-amber-300">Start a brief <ArrowRight size={17} /></Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>
);

export default GraphicDesign;
