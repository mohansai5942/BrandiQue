import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, GraduationCap, Stethoscope, Store, Rocket, TrendingUp, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { INDUSTRY_SOLUTIONS, whatsappLink } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICONS: Record<string, LucideIcon> = {
  education: GraduationCap,
  healthcare: Stethoscope,
  'local-business': Store,
  launch: Rocket,
};

interface IndustrySolutionsProps { showHeading?: boolean; compact?: boolean; }

const IndustrySolutions: React.FC<IndustrySolutionsProps> = ({ showHeading = true, compact = false }) => {
  const { settings } = useSiteSettings();
  return (
    <section id="solutions" className="scroll-mt-24 py-12 md:py-28 px-5 md:px-8 desk:px-12 2xl:px-16 bg-gray-50 dark:bg-[#05070A]">
      <div className="max-w-[100rem] mx-auto">
        {showHeading && (
          <ScrollReveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-7 md:mb-14">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">Ready-made solutions</p>
                <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Built for your industry. <span className="text-yellow-500">Ready in weeks.</span></h2>
              </div>
              <p className="max-w-md text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">Website, AI and design combined into one package for a specific type of business, with one setup price and one monthly plan.</p>
            </div>
          </ScrollReveal>
        )}

        <div className={compact ? "flex snap-x snap-mandatory overflow-x-auto scrollbar-none -mx-5 px-5 pb-2 gap-3 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:gap-5 md:grid-cols-2" : "grid gap-3 md:gap-5 md:grid-cols-2"}>
          {INDUSTRY_SOLUTIONS.map((solution, index) => {
            const Icon = ICONS[solution.slug] || Rocket;
            return (
              <ScrollReveal key={solution.slug} delay={`delay-${(index % 2) * 100}`} className={compact ? "w-[84%] shrink-0 snap-start md:w-auto" : ""}>
                <article id={solution.slug} className="shine scroll-mt-28 flex h-full flex-col rounded-[28px] border border-gray-200 bg-white p-4 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0D1017]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><Icon size={24} /></div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Setup from</div>
                      <div className="text-2xl font-black tracking-tight">{solution.setup}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">+ {solution.plan}</div>
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 dark:text-yellow-300">{solution.industry}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">{solution.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{solution.problem}</p>
                  {!compact && (
                    <>
                      <ul className="mt-5 flex-1 space-y-2.5">
                        {solution.includes.map(item => (
                          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"><Check size={16} className="mt-0.5 shrink-0 text-yellow-500" />{item}</li>
                        ))}
                      </ul>
                      <div className="mt-5 rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-4">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 dark:text-yellow-300"><TrendingUp size={13} /> Why it pays for itself</p>
                        <ul className="mt-2.5 space-y-2">
                          {solution.roi.map(point => (
                            <li key={point} className="flex gap-2 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />{point}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  <div className="mt-5 md:mt-7 flex flex-row gap-2 md:gap-3">
                    <a href={whatsappLink(settings.whatsapp, solution.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-xs md:px-4 md:py-3.5 md:text-sm font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400">
                      <MessageCircle size={14} /><span className="md:hidden">Get this</span><span className="hidden md:inline">Get this for my business</span> <ArrowRight size={14} />
                    </a>
                    {compact && (
                      <Link to={`/solutions#${solution.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-xs md:px-4 md:py-3.5 md:text-sm font-semibold transition-colors hover:border-yellow-400/60 dark:border-white/15">What's included</Link>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs leading-relaxed text-gray-500">Setup prices are starting points for the listed scope. WhatsApp Business API, AI usage, domain and hosting are billed at cost. Don't see your industry? We tailor the same system to your business.</p>
      </div>
    </section>
  );
};

export default IndustrySolutions;
