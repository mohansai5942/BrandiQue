import React from 'react';
import { Check, Repeat, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { GROWTH_PLANS } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';

interface GrowthPlansProps { showHeading?: boolean; }

const GrowthPlans: React.FC<GrowthPlansProps> = ({ showHeading = true }) => {
  const { openInquiry } = useInquiry();
  return (
    <section id="growth-plans" className="scroll-mt-24 relative py-20 md:py-28 px-4 md:px-6 bg-[#080A0F] text-white overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
      <div className="relative max-w-6xl mx-auto">
        {showHeading && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-300">
                <Repeat size={14} /> Monthly Growth Plans
              </span>
              <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">Launch once. <span className="text-yellow-400">Keep growing every month.</span></h2>
              <p className="mt-5 text-base md:text-lg leading-relaxed text-white/65">A website or chatbot is only the start. Our monthly plans keep your site updated, your AI assistant sharp, your leads flowing and your social media active, with one team responsible for all of it.</p>
            </div>
          </ScrollReveal>
        )}

        <div className="grid gap-5 lg:gap-6 md:grid-cols-3 items-stretch">
          {GROWTH_PLANS.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={`delay-${index * 100}`}>
              <article className={`relative flex h-full flex-col rounded-[28px] border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 ${plan.featured ? 'border-yellow-400/70 bg-[#15170F] shadow-[0_18px_70px_rgba(234,179,8,0.14)]' : 'border-white/10 bg-[#0D1017]'}`}>
                {plan.featured && <span className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-black">Most popular</span>}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-white/60">{plan.bestFor}</p>
                <div className="mt-6 border-y border-white/10 py-5">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className="ml-2 text-sm text-white/55">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.items.map(item => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85"><Check size={17} className="mt-0.5 shrink-0 text-yellow-400" /><span>{item}</span></li>
                  ))}
                </ul>
                <button type="button" onClick={() => openInquiry('Monthly Growth Plan', `${plan.name} Plan`)} className={`mt-8 inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${plan.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-white/10 text-white hover:bg-yellow-400 hover:text-black'}`}>
                  Start with {plan.name} <ArrowRight size={17} />
                </button>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs leading-relaxed text-white/45">3-month minimum, then month to month. Plans cover ongoing work; the first website, chatbot or automation setup is quoted separately. Hosting, API, messaging and ad costs are billed at cost.</p>
      </div>
    </section>
  );
};

export default GrowthPlans;
