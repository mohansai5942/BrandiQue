import React, { useState } from 'react';
import { ArrowRight, Check, Repeat, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { MEMBERSHIPS, MEMBERSHIP_TRACKS, MembershipTrack } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';

interface MembershipsProps { showHeading?: boolean; initialTrack?: MembershipTrack; lockTrack?: boolean; }

const Memberships: React.FC<MembershipsProps> = ({ showHeading = true, initialTrack = 'bundle', lockTrack = false }) => {
  const { openInquiry } = useInquiry();
  const [track, setTrack] = useState<MembershipTrack>(initialTrack);
  const plans = MEMBERSHIPS.filter(m => m.track === track);

  return (
    <section id="growth-plans" className="scroll-mt-24 relative overflow-hidden bg-[#06080C] px-4 py-20 text-white md:px-6 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl">
        {showHeading && (
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-300"><Repeat size={14} /> Monthly memberships</span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">Launch once. <span className="text-yellow-400">Keep growing every month.</span></h2>
              <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">Pick a membership for one service, or bundle all three and save. One accountable team keeps your website, AI and design improving every month.</p>
            </div>
          </ScrollReveal>
        )}

        {!lockTrack && (
          <div role="tablist" aria-label="Membership type" className="mx-auto mb-10 grid max-w-2xl grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {MEMBERSHIP_TRACKS.map(t => (
              <button key={t.id} role="tab" type="button" aria-selected={track === t.id} onClick={() => setTrack(t.id)} className={`rounded-xl px-2 py-2.5 text-xs font-bold transition-all md:text-sm ${track === t.id ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/70 hover:text-white'}`}>
                <span className="md:hidden">{t.short}</span><span className="hidden md:inline">{t.id === 'bundle' ? 'Bundles' : t.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mx-auto grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          {plans.map(plan => (
            <article key={plan.name} className={`relative flex h-full flex-col rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 md:p-8 ${plan.featured ? 'border-yellow-400/70 bg-gradient-to-b from-[#1A1A0F] to-[#0D1017] shadow-[0_18px_70px_rgba(234,179,8,0.14)]' : 'border-white/10 bg-[#0D1017]'}`}>
              {plan.featured && <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-black"><Sparkles size={10} /> Most popular</span>}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-3 pr-6 text-sm leading-relaxed text-white/60">{plan.bestFor}</p>
              <div className="mt-6 border-y border-white/10 py-5">
                <span className="text-4xl font-black tracking-tight">{plan.price}</span><span className="ml-2 text-sm text-white/55">per month</span>
                {plan.saving && <div className="mt-2 text-xs font-semibold text-green-400">{plan.saving}</div>}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.items.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85"><Check size={17} className="mt-0.5 shrink-0 text-yellow-400" /><span>{item}</span></li>)}
              </ul>
              <button type="button" onClick={() => openInquiry('Monthly Membership', plan.name)} className={`mt-8 inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${plan.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-white/10 text-white hover:bg-yellow-400 hover:text-black'}`}>
                Start {plan.name} <ArrowRight size={17} />
              </button>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-white/45">3-month minimum, then month to month. Memberships cover ongoing work; the first website, chatbot or brand setup is quoted separately. Hosting, API, messaging and ad costs are billed at cost.</p>
      </div>
    </section>
  );
};

export default Memberships;
