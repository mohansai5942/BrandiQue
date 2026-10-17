import React from 'react';
import { Check, MessageCircle, Repeat, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { CARE_PLANS, whatsappLink, MembershipTrack } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';

// Legacy props kept so existing callers (Home, Pricing, Services, Solutions,
// CoreServicePage) keep compiling; the section now always shows the care plans.
interface MembershipsProps { showHeading?: boolean; initialTrack?: MembershipTrack; lockTrack?: boolean; }

const Memberships: React.FC<MembershipsProps> = ({ showHeading = true }) => {
  const { settings } = useSiteSettings();

  return (
    <section id="growth-plans" className="scroll-mt-24 relative overflow-hidden bg-gray-50 px-4 py-12 text-gray-900 dark:bg-[#06080C] dark:text-white md:px-6 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[100rem]">
        {showHeading && (
          <ScrollReveal>
            <div className="mx-auto mb-7 max-w-3xl text-center md:mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-300"><Repeat size={14} /> Monthly care plans</span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">Stay maintained. <span className="text-yellow-400">Stay growing.</span></h2>
              <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-white/65 md:text-lg">Recurring care plans that keep your website, AI and design improving every month. Billed monthly, cancel anytime.</p>
            </div>
          </ScrollReveal>
        )}

        <div className="mx-auto max-w-6xl items-stretch flex snap-x snap-mandatory overflow-x-auto scrollbar-none -mx-5 px-5 pb-2 gap-3 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:gap-5 md:grid-cols-2">
          {CARE_PLANS.map(plan => (
            <article key={plan.name} className={`w-[84%] shrink-0 snap-start md:w-auto relative flex h-full flex-col rounded-[28px] border p-4 transition-all duration-300 hover:-translate-y-1 md:p-8 ${plan.featured ? 'border-yellow-400/70 bg-gradient-to-b from-yellow-50 to-white dark:from-[#1A1A0F] dark:to-[#0D1017] shadow-[0_18px_70px_rgba(234,179,8,0.14)]' : 'border-gray-200 bg-white dark:border-white/10 dark:bg-[#0D1017]'}`}>
              {plan.featured && <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-black"><Sparkles size={10} /> Most popular</span>}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-3 pr-6 text-sm leading-relaxed text-gray-600 dark:text-white/60">{plan.bestFor}</p>
              <div className="mt-6 border-y border-gray-200 dark:border-white/10 py-5">
                <span className="text-4xl font-black tracking-tight">{plan.price}</span><span className="ml-2 text-sm text-gray-500 dark:text-white/55">per month</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.items.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-700 dark:text-white/85"><Check size={17} className="mt-0.5 shrink-0 text-yellow-400" /><span>{item}</span></li>)}
              </ul>
              <a href={whatsappLink(settings.whatsapp, plan.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${plan.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-black dark:bg-white/10'}`}>
                <MessageCircle size={17} /> Subscribe on WhatsApp
              </a>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-gray-500 dark:text-white/45">Billed monthly, cancel anytime. Care plans cover ongoing work; the first website, chatbot or brand setup is quoted separately. Hosting, API, messaging and ad costs are billed at cost.</p>
      </div>
    </section>
  );
};

export default Memberships;
