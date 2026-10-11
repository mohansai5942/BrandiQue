import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, MessageCircle, LayoutTemplate, ShoppingCart, User, Rocket, Search, Bot, FileSpreadsheet, BellRing,
  FileText, Workflow, PenTool, Image, Megaphone, MonitorPlay, Layers, Sparkles,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import PageHero, { SectionHeading, btnPrimary, btnSecondary } from './ui/PageHero';
import GrowthOffers from './GrowthOffers';
import Memberships from './Memberships';
import FounderPromise from './FounderPromise';
import { SERVICE_VISUALS } from './ServiceVisuals';
import { SERVICE_CONTENT } from '../data/services';
import { PillarId, whatsappLink } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICONS: Record<string, React.ElementType> = {
  layout: LayoutTemplate, cart: ShoppingCart, user: User, rocket: Rocket, search: Search, message: MessageCircle, bot: Bot,
  sheet: FileSpreadsheet, bell: BellRing, file: FileText, workflow: Workflow, pen: PenTool, image: Image, megaphone: Megaphone,
  monitor: MonitorPlay, layers: Layers,
};
const ICON_TONE: Record<string, string> = {
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
  amber: 'bg-amber-400/15 text-amber-600 dark:text-amber-300',
};

const CoreServicePage: React.FC<{ id: PillarId }> = ({ id }) => {
  const c = SERVICE_CONTENT[id];
  const Visual = SERVICE_VISUALS[id];
  const { openInquiry } = useInquiry();
  const { settings } = useSiteSettings();
  const wa = whatsappLink(settings.whatsapp, `Hi BrandiQue, I am interested in ${c.inquiry}.`);
  const tone = ICON_TONE[c.accent];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#05070A] dark:text-white">
      <PageHero
        eyebrow={c.eyebrow}
        eyebrowIcon={Sparkles}
        title={c.title}
        highlight={c.highlight}
        description={c.intro}
        accent={c.accent}
        visual={<Visual />}
        actions={<>
          <button type="button" onClick={() => openInquiry(c.inquiry)} className={btnPrimary}>Get a fixed quote <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
          <a href="#pricing" className={btnSecondary}>See pricing</a>
        </>}
      >
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"><MessageCircle size={15} /> Ask on WhatsApp</a>
      </PageHero>

      {/* Outcomes */}
      <section aria-label="What you can expect" className="border-y border-gray-200 bg-white py-10 dark:border-white/5 dark:bg-[#080A0F]">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 sm:grid-cols-3 md:px-6">
          {c.outcomes.map(o => (
            <div key={o.label} className="text-center sm:text-left">
              <dt className="sr-only">{o.label}</dt>
              <dd className="text-3xl font-black tracking-tight md:text-4xl">{o.stat}</dd>
              <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">{o.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What we build */}
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal><SectionHeading eyebrow="What we deliver" title={c.buildsTitle} /></ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.builds.map((b, i) => {
              const Icon = ICONS[b.icon] || Sparkles;
              return (
                <ScrollReveal key={b.title} delay={`delay-${(i % 3) * 100}`}>
                  <div className="group h-full rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0D1017]">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon size={22} /></span>
                    <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{b.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {c.options && (
            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {c.options.map(o => (
                <ScrollReveal key={o.title}>
                  <div className="flex h-full flex-col rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-7 dark:border-white/10 dark:from-[#0D1017] dark:to-[#0A0C11]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Best for: {o.bestFor}</p>
                    <h3 className="mt-3 text-xl font-bold">{o.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{o.text}</p>
                    <a href={o.href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-yellow-700 hover:gap-3 dark:text-yellow-300">{o.cta} <ArrowRight size={15} /></a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* One-time packages */}
      <section id="pricing" className="scroll-mt-24 border-t border-gray-200 bg-white pt-20 dark:border-white/5 dark:bg-[#080A0F] md:pt-28">
        <div className="px-5 md:px-6"><ScrollReveal><SectionHeading eyebrow="One-time packages" title={<>Clear starting prices. <span className="text-yellow-500">Fixed written quote.</span></>} text="Pick a starting point. After a short call you get the exact scope, timeline and price in writing, and nothing starts until you approve." /></ScrollReveal></div>
        <GrowthOffers showHeading={false} pillars={[id]} bare />
      </section>

      {/* Membership for this service */}
      <Memberships initialTrack={id} />

      {/* Use cases */}
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal><SectionHeading eyebrow="Who it's for" title="Built for businesses like yours" /></ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {c.useCases.map((u, i) => (
              <ScrollReveal key={u.who} delay={`delay-${(i % 2) * 100}`}>
                <div className="flex h-full gap-4 rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0D1017]">
                  <span className="text-3xl font-black text-yellow-500/80">0{i + 1}</span>
                  <div><h3 className="font-bold">{u.who}</h3><p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{u.what}</p></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process + tools */}
      <section className="border-y border-gray-200 bg-white px-5 py-20 dark:border-white/5 dark:bg-[#080A0F] md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal><SectionHeading eyebrow="How we work" title={<>From first call to launch, <span className="text-yellow-500">no surprises.</span></>} /></ScrollReveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {c.process.map((p, i) => (
              <li key={p.title} className="relative rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-[#0D1017]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">{i + 1}</span>
                <h3 className="mt-4 font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{p.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Tools we use</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {c.tools.map(t => <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <FounderPromise />

      {/* FAQ */}
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal><SectionHeading eyebrow="FAQ" title="Questions, answered" /></ScrollReveal>
          <div className="mt-10 space-y-3">
            {c.faqs.map(f => (
              <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5 open:border-yellow-400/50 dark:border-white/10 dark:bg-[#0D1017]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{f.q}<ChevronDown size={18} className="shrink-0 text-gray-400 transition-transform group-open:rotate-180" /></summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 md:px-6 md:pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#0B0D12] p-8 text-white md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{c.ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">{c.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => openInquiry('Free Growth Audit')} className={btnPrimary}>Get a free growth audit <ArrowRight size={18} /></button>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 font-bold text-white transition-colors hover:border-green-400 hover:text-green-400"><MessageCircle size={18} /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoreServicePage;
