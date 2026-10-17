import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, MessageCircle, TrendingDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { whatsappLink } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/** Interactive ROI calculator: missed enquiries × deal value = lost revenue. */
const RoiCalculator: React.FC = () => {
  const { settings } = useSiteSettings();
  const [missedPerDay, setMissedPerDay] = useState(5);
  const [dealValue, setDealValue] = useState(2000);

  const { monthly, yearly } = useMemo(() => {
    const m = missedPerDay * dealValue * 30;
    return { monthly: m, yearly: m * 12 };
  }, [missedPerDay, dealValue]);

  const waHref = whatsappLink(
    settings.whatsapp,
    `Hi BrandiQue, my business is losing about ${inr(monthly)}/month to missed enquiries (${missedPerDay}/day × ${inr(dealValue)}). I want an AI agent to recover it.`
  );

  return (
    <section className="px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="overflow-hidden rounded-[28px] glass">
            <div className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] px-5 py-5 md:px-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">
                <Calculator size={14} /> Missed-enquiry cost calculator
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                What are slow replies costing you?
              </h2>
            </div>

            <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
              <div className="space-y-7">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="roi-missed" className="text-sm font-bold text-gray-900 dark:text-white">
                      Missed enquiries per day
                    </label>
                    <span className="rounded-lg bg-yellow-400/15 px-3 py-1 text-lg font-black text-yellow-700 dark:text-yellow-300">{missedPerDay}</span>
                  </div>
                  <input
                    id="roi-missed"
                    type="range"
                    min={0}
                    max={50}
                    value={missedPerDay}
                    onChange={e => setMissedPerDay(Number(e.target.value))}
                    className="mt-3 w-full accent-yellow-500"
                    aria-label="Missed enquiries per day"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Calls, WhatsApps and DMs you couldn't answer in time.</p>
                </div>

                <div>
                  <label htmlFor="roi-deal" className="text-sm font-bold text-gray-900 dark:text-white">
                    Average deal value (₹)
                  </label>
                  <input
                    id="roi-deal"
                    type="number"
                    min={0}
                    max={10000000}
                    step={100}
                    value={dealValue}
                    onChange={e => setDealValue(Math.max(0, Number(e.target.value) || 0))}
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-bold text-gray-900 outline-none transition-colors focus:border-yellow-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">What one customer is worth to you on average.</p>
                </div>
              </div>

              <div className="hairline-gold flex flex-col justify-center rounded-2xl p-5 md:p-7">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
                  <TrendingDown size={14} /> Estimated revenue lost
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
                  {inr(monthly)}<span className="text-base font-bold text-gray-500 dark:text-gray-400">/month</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  That's {inr(yearly)} every year — walking to competitors.
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
                >
                  <MessageCircle size={17} /> Recover it with an AI agent <ArrowRight size={16} />
                </a>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                  Rough estimate for illustration — we calculate your exact number on a free call.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RoiCalculator;
