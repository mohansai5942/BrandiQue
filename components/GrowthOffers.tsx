import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, Code2, Palette, PhoneCall, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PACKAGES, PILLARS, PillarId } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';

const PILLAR_ICONS: Record<PillarId, LucideIcon> = {
  web: Code2,
  ai: Bot,
  design: Palette,
  voice: PhoneCall,
};

// Inquiry service names are matched by InquiryContext to show the right questions.
const INQUIRY_SERVICE: Record<PillarId, string> = {
  web: 'Web Development',
  ai: 'AI Automation & Agents',
  design: 'Graphic Design',
  voice: 'Voice Calling AI Agents',
};

interface GrowthOffersProps { showHeading?: boolean; pillars?: PillarId[]; bare?: boolean; }

const GrowthOffers: React.FC<GrowthOffersProps> = ({ showHeading = true, pillars, bare = false }) => {
  const { openInquiry } = useInquiry();
  return (
    <section className={`relative px-5 md:px-8 desk:px-12 2xl:px-16 bg-white dark:bg-[#080A0F] ${bare ? 'pt-12 pb-12 md:pb-28' : 'py-12 md:py-28 border-y border-gray-200 dark:border-white/5'}`}>
      <div className="max-w-[100rem] mx-auto">
        {showHeading && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-600 dark:text-yellow-300">
                <Sparkles size={14} /> Clear scope. Clear pricing.
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                Start with what you need.<br /><span className="text-yellow-500">Add more as you grow.</span>
              </h2>
            </div>
          </ScrollReveal>
        )}

        <div className="space-y-16 md:space-y-20">
          {PILLARS.filter(pillar => !pillars || pillars.includes(pillar.id)).map(pillar => {
            const Icon = PILLAR_ICONS[pillar.id];
            const items = PACKAGES.filter(pkg => pkg.pillar === pillar.id);
            return (
              <div key={pillar.id} id={`pricing-${pillar.id}`} className="scroll-mt-28">
                <ScrollReveal>
                  <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black"><Icon size={24} /></span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{pillar.number} · {pillar.outcome}</p>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{pillar.title}</h3>
                      </div>
                    </div>
                    {!bare && <Link to={pillar.href} className="inline-flex items-center gap-2 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:gap-3 transition-all">Explore {pillar.title} <ArrowRight size={16} /></Link>}
                  </div>
                </ScrollReveal>
                <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none -mx-5 px-5 pb-2 gap-3 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-5 lg:gap-6 items-stretch">
                  {items.map((pkg, index) => (
                    <ScrollReveal key={pkg.name} delay={`delay-${index * 100}`} className="w-[84%] shrink-0 snap-start md:w-auto">
                      <article className={`relative h-full rounded-[28px] p-4 md:p-8 border flex flex-col transition-all duration-300 hover:-translate-y-1 ${pkg.featured ? 'border-yellow-400/60 bg-[#11130F] text-white shadow-[0_18px_70px_rgba(234,179,8,0.10)]' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0D1017] text-gray-900 dark:text-white'}`}>
                        {pkg.featured && <span className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black tracking-wider text-black uppercase">Recommended</span>}
                        <h4 className="text-xl md:text-2xl font-bold pr-24">{pkg.name}</h4>
                        <p className={`mt-3 text-sm leading-relaxed md:min-h-[72px] ${pkg.featured ? 'text-white/65' : 'text-gray-600 dark:text-gray-400'}`}>{pkg.description}</p>
                        <div className={`mt-6 border-y py-5 ${pkg.featured ? 'border-white/10' : 'border-gray-200 dark:border-white/10'}`}>
                          <div className="text-3xl md:text-4xl font-black tracking-tight">{pkg.price}</div>
                          <div className={`mt-1 text-xs ${pkg.featured ? 'text-white/55' : 'text-gray-500 dark:text-gray-400'}`}>{pkg.suffix}</div>
                        </div>
                        <ul className="mt-6 space-y-3 flex-1">
                          {pkg.items.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed"><Check size={17} className="mt-0.5 text-yellow-500 shrink-0" /><span>{item}</span></li>)}
                        </ul>
                        <p className={`mt-6 text-xs leading-relaxed ${pkg.featured ? 'text-white/50' : 'text-gray-500 dark:text-gray-400'}`}>{pkg.note}</p>
                        <button type="button" onClick={() => openInquiry(INQUIRY_SERVICE[pillar.id], pkg.name)} className={`mt-7 inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${pkg.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400 dark:hover:text-black'}`}>
                          Get a quote<ArrowRight size={17} />
                        </button>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 md:mt-12 text-center text-xs text-gray-500 dark:text-gray-500">
          Indicative starting prices for clearly scoped work. You receive a fixed written quote before any work begins. Voice agent plans are billed per agent every 30 days plus connected call minutes. External services, taxes and third-party costs are quoted separately.
        </p>
      </div>
    </section>
  );
};

export default GrowthOffers;
