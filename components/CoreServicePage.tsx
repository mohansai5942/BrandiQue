import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, MessageCircle, LayoutTemplate, ShoppingCart, User, Rocket, Search, Bot, FileSpreadsheet, BellRing,
  FileText, Workflow, PenTool, Image, Megaphone, MonitorPlay, Layers, Sparkles, PhoneOutgoing, PhoneIncoming, Languages,
  CalendarCheck, AudioLines, Check, Minus, Clock, PhoneCall, X,
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
  monitor: MonitorPlay, layers: Layers, phoneOut: PhoneOutgoing, phoneIn: PhoneIncoming, languages: Languages, calendar: CalendarCheck,
  audio: AudioLines,
};
const ICON_TONE: Record<string, string> = {
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
  amber: 'bg-amber-400/15 text-amber-600 dark:text-amber-300',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
};

const Cell: React.FC<{ v: string | boolean; featured?: boolean }> = ({ v, featured }) => {
  if (v === true) return <Check size={18} aria-label="Included" className="mx-auto text-yellow-500" />;
  if (v === false || v === '–') return <Minus size={18} aria-label="Not included" className="mx-auto text-gray-300 dark:text-white/20" />;
  return <span className={`text-xs md:text-sm font-semibold ${featured ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{v}</span>;
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
          <button type="button" onClick={() => openInquiry(c.inquiry, '', { billingType: 'Fixed written quote', source: 'Service page · Get a fixed quote' })} className={btnPrimary}>Get a fixed quote <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
          <a href="#pricing" className={btnSecondary}>See pricing</a>
        </>}
      >
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"><MessageCircle size={15} /> Ask on WhatsApp</a>
      </PageHero>

      {/* Outcomes */}
      {c.outcomes.length === 1 ? (
        <section aria-label="What you can expect" className="bg-white px-5 py-6 dark:bg-[#080A0F] md:px-8 md:py-8 desk:px-12">
          <div className="flex justify-center">
            <p data-voice-247 className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-yellow-400/60 bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-black shadow-[0_8px_28px_rgba(234,179,8,0.22)] md:flex-nowrap md:whitespace-nowrap md:px-5 md:text-base">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-yellow-300" aria-hidden="true"><Clock size={14} strokeWidth={2.5} /></span>
              <strong className="font-black tracking-tight">{c.outcomes[0].stat}</strong>
              <span aria-hidden="true" className="text-black/50">·</span>
              <span>{c.outcomes[0].label}</span>
            </p>
          </div>
        </section>
      ) : (
      <section aria-label="What you can expect" className="border-y border-gray-200 bg-white py-10 dark:border-white/5 dark:bg-[#080A0F]">
        <dl className="mx-auto grid max-w-[100rem] grid-cols-3 gap-3 md:gap-6 px-5 md:px-8 desk:px-12">
          {c.outcomes.map(o => (
            <div key={o.label} className="text-center md:text-left">
              <dt className="sr-only">{o.label}</dt>
              <dd className="text-lg font-black tracking-tight sm:text-2xl md:text-4xl">{o.stat}</dd>
              <dd className="mt-1 text-[11px] leading-snug md:text-sm text-gray-500 dark:text-gray-400">{o.label}</dd>
            </div>
          ))}
        </dl>
      </section>
      )}

      {/* What we build */}
      <section className="px-5 py-12 md:px-8 desk:px-12 md:py-28">
        <div className="mx-auto max-w-[100rem]">
          <ScrollReveal><SectionHeading eyebrow="What we deliver" title={c.buildsTitle} /></ScrollReveal>
          <div className="mt-8 md:mt-12 grid grid-cols-2 gap-3 md:gap-4 desk:grid-cols-3">
            {c.builds.map((b, i) => {
              const Icon = ICONS[b.icon] || Sparkles;
              return (
                <ScrollReveal key={b.title} delay={`delay-${(i % 3) * 100}`}>
                  <div className="group h-full rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-3.5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0D1017]">
                    <span className={`flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl ${tone}`}><Icon size={18} /></span>
                    <h3 className="mt-3 md:mt-5 text-sm md:text-lg font-bold leading-snug">{b.title}</h3>
                    <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">{b.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {c.options && (
            <div className="mt-8 md:mt-14 grid gap-3 md:gap-5 md:grid-cols-2">
              {c.options.map(o => (
                <ScrollReveal key={o.title}>
                  <div className="flex h-full flex-col rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 md:p-7 dark:border-white/10 dark:from-[#0D1017] dark:to-[#0A0C11]">
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
      <section id="pricing" className="scroll-mt-24 border-t border-gray-200 bg-white pt-12 dark:border-white/5 dark:bg-[#080A0F] md:pt-28">
        <div className="px-5 md:px-8 desk:px-12 2xl:px-16"><ScrollReveal>{id === 'voice'
          ? <SectionHeading eyebrow="Plans & pricing" title={<>Monthly plans or <span className="text-yellow-500">pay as you go.</span></>} text="Pick a monthly plan with included minutes from ₹2,799, or top up minutes as you need them from ₹2,848. All prices are inclusive of taxes, plus a one-time setup fee of ₹1,999." />
          : <SectionHeading eyebrow="One-time packages" title={<>Clear starting prices. <span className="text-yellow-500">Fixed written quote.</span></>} text="Pick a starting point. After a short call you get the exact scope, timeline and price in writing, and nothing starts until you approve." />}</ScrollReveal></div>
        <GrowthOffers showHeading={false} pillars={[id]} bare />
      </section>

      {/* Comparison tables (only for services that define them) */}
      {c.compare && (
        <section id="compare" className="scroll-mt-24 border-t border-gray-200 bg-white px-5 pb-12 pt-12 dark:border-white/5 dark:bg-[#080A0F] md:px-8 md:pb-28 md:pt-20 desk:px-12">
          <div className="mx-auto max-w-[100rem]">
            <ScrollReveal><SectionHeading eyebrow={c.compare.eyebrow} title={c.compare.title} text={c.compare.text} /></ScrollReveal>
            {c.compare.rows.length > 0 && <ScrollReveal>
              <div className="mt-8 overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10 md:mt-12">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <caption className="sr-only">{c.compare.title}</caption>
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#0D1017]">
                      <th scope="col" className="w-[34%] px-4 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gray-500 md:px-6">Feature</th>
                      {c.compare.columns.map((col, i) => (
                        <th key={col} scope="col" className={`px-3 py-4 text-center text-sm font-bold md:text-base ${i === c.compare?.recommended ? 'bg-yellow-400/10 text-gray-900 dark:text-white' : ''}`}>
                          {col}{i === c.compare?.recommended && <span className="mt-1 block text-[9px] font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-300">{c.compare?.recommendedLabel ?? 'Recommended'}</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.compare.rows.map(r => (
                      <tr key={r.feature} className="border-t border-gray-200 dark:border-white/10">
                        <th scope="row" className="px-4 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 md:px-6">{r.feature}</th>
                        {r.values.map((v, i) => <td key={i} className={`px-3 py-3.5 text-center ${i === c.compare?.recommended ? 'bg-yellow-400/5' : ''}`}><Cell v={v} featured={i === c.compare?.recommended} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>}
            {c.compare.groups && c.compare.groups.length > 0 && <ScrollReveal>
              <div data-compare-plans className="mt-8 overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10 md:mt-12">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <caption className="sr-only">{c.compare.title}: {c.compare.text}</caption>
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#0D1017]">
                      <th scope="col" className="sticky left-0 z-10 w-[36%] bg-gray-50 px-4 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:bg-[#0D1017] md:px-6"><span className="sr-only">Feature</span></th>
                      {c.compare.columns.map((col, i) => (
                        <th key={col} scope="col" className={`px-3 py-4 text-center text-sm font-bold md:text-base ${i === c.compare?.recommended ? 'border-x border-t-2 border-yellow-400/60 border-t-yellow-400 bg-yellow-400/15 text-gray-900 dark:text-white' : ''}`}>
                          {i === c.compare?.recommended && <span className="mb-1 block text-[9px] font-black uppercase tracking-wider text-yellow-700 dark:text-yellow-300">{c.compare?.recommendedLabel ?? 'Recommended'}</span>}{col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {c.compare.groups.map(g => (
                    <tbody key={g.title}>
                      <tr className="border-t border-gray-200 bg-white dark:border-white/10 dark:bg-[#080A0F]">
                        <th scope="colgroup" colSpan={c.compare!.columns.length + 1} className="px-4 pb-2 pt-6 text-left md:px-6">
                          <span className="sticky left-4 inline-block text-sm font-black tracking-tight text-gray-900 dark:text-white md:left-6 md:text-base">{g.title}</span>
                        </th>
                      </tr>
                      {g.rows.map(r => (
                        <tr key={`${g.title}-${r.feature}`} className="border-t border-gray-100 dark:border-white/5">
                          <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 dark:bg-[#080A0F] dark:text-gray-300 md:px-6">{r.feature}</th>
                          {r.values.map((v, i) => <td key={i} className={`px-3 py-3.5 text-center ${i === c.compare?.recommended ? 'border-x border-yellow-400/60 bg-yellow-400/5' : ''}`}><Cell v={v} featured={i === c.compare?.recommended} /></td>)}
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
              {id === 'voice' && <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">All prices inclusive of taxes. One-time setup fee ₹1,999. Prefer no monthly plan? Pay as you go from ₹2,848 (320 minutes at ₹8.90/min).</p>}
            </ScrollReveal>}
            {c.compare.versus && (
              <ScrollReveal>
                <div className="mt-10 md:mt-16">
                  <h3 className="text-center text-2xl font-bold tracking-tight md:text-3xl">{c.compare.versus.title}</h3>
                  {/* Desktop / tablet: table */}
                  <div data-versus-table className="mx-auto mt-6 hidden max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0D1017] sm:block">
                    <table className="w-full table-fixed border-collapse text-left">
                      <caption className="sr-only">{c.compare.versus.title}</caption>
                      <colgroup><col className="w-[26%]" /><col className="w-[40%]" /><col className="w-[34%]" /></colgroup>
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.03]">
                          <th scope="col" className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 md:px-6">Feature</th>
                          <th scope="col" className="border-x border-t-2 border-yellow-400/50 border-t-yellow-400 bg-yellow-400/15 px-5 py-4 text-sm font-bold text-gray-900 dark:text-white md:px-6 md:text-base">
                            <span className="mb-0.5 block text-[9px] font-black uppercase tracking-wider text-yellow-700 dark:text-yellow-300">Recommended</span>{c.compare.versus.columns[0]}
                          </th>
                          <th scope="col" className="px-5 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 md:px-6 md:text-base">{c.compare.versus.columns[1]}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                        {c.compare.versus.rows.map(r => (
                          <tr key={r.feature} className="align-top transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                            <th scope="row" className="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 md:px-6">{r.feature}</th>
                            <td className="border-x border-yellow-400/50 bg-yellow-400/[0.06] px-5 py-4 md:px-6">
                              <span className="flex items-start gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white" aria-label="Advantage"><Check size={12} strokeWidth={3} /></span>{r.values[0]}
                              </span>
                            </td>
                            <td className="px-5 py-4 md:px-6">
                              <span className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500/80 dark:bg-red-400/10 dark:text-red-400/80" aria-label="Drawback"><X size={12} strokeWidth={3} /></span>{r.values[1]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile: stacked cards */}
                  <ul data-versus-cards className="mt-6 space-y-3 sm:hidden">
                    {c.compare.versus.rows.map(r => (
                      <li key={r.feature} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#0D1017]">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{r.feature}</p>
                        <p className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-yellow-400/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
                          <span><span className="sr-only">{c.compare!.versus!.columns[0]}: </span>{r.values[0]}</span>
                        </p>
                        <p className="mt-1.5 flex items-start gap-2.5 px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500/80" aria-hidden="true"><X size={12} strokeWidth={3} /></span>
                          <span><span className="text-gray-400">{c.compare!.versus!.columns[1]}: </span>{r.values[1]}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">{c.compare.versus.note}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Membership for this service */}
      <Memberships initialTrack={id} />

      {/* Use cases */}
      <section className="px-5 py-12 md:px-8 desk:px-12 md:py-28">
        <div className="mx-auto max-w-[100rem]">
          <ScrollReveal><SectionHeading eyebrow="Who it's for" title="Built for businesses like yours" /></ScrollReveal>
          <div className="mt-8 md:mt-12 grid grid-cols-2 gap-3 md:gap-4">
            {c.useCases.map((u, i) => (
              <ScrollReveal key={u.who} delay={`delay-${(i % 2) * 100}`}>
                <div className="flex h-full gap-4 rounded-3xl border border-gray-200 bg-white p-4 md:p-6 dark:border-white/10 dark:bg-[#0D1017]">
                  <span className="text-3xl font-black text-yellow-500/80">0{i + 1}</span>
                  <div><h3 className="font-bold">{u.who}</h3><p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{u.what}</p></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process + tools */}
      <section className="border-y border-gray-200 bg-white px-5 py-12 dark:border-white/5 dark:bg-[#080A0F] md:px-6 md:py-28">
        <div className="mx-auto max-w-[100rem]">
          <ScrollReveal><SectionHeading eyebrow="How we work" title={<>From first call to launch, <span className="text-yellow-500">no surprises.</span></>} /></ScrollReveal>
          <ol className="mt-8 md:mt-12 grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
            {c.process.map((p, i) => (
              <li key={p.title} className="relative rounded-3xl border border-gray-200 bg-gray-50 p-4 md:p-6 dark:border-white/10 dark:bg-[#0D1017]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">{i + 1}</span>
                <h3 className="mt-4 font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{p.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Tools we use</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {c.tools.map(t => <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <FounderPromise />

      {/* FAQ */}
      <section className="px-5 py-12 md:px-8 desk:px-12 md:py-28">
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
      <section className="px-5 pb-12 md:px-6 md:pb-28">
        <div className="relative mx-auto max-w-[100rem] overflow-hidden rounded-[32px] border border-gray-200 bg-white p-5 text-gray-900 shadow-sm dark:border-transparent dark:bg-[#0B0D12] dark:text-white dark:shadow-none md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="relative grid gap-3 md:gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{c.ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-white/65 md:text-lg">{c.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => openInquiry('Free Growth Audit', '', { price: 'Free', extra: { 'Interested in': c.inquiry }, source: 'Service page · Free growth audit' })} className={btnPrimary}>Get a free growth audit <ArrowRight size={18} /></button>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/20 px-7 py-4 font-bold text-gray-900 dark:text-white transition-colors hover:border-green-400 hover:text-green-400"><MessageCircle size={18} /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoreServicePage;
