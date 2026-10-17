import React, { useState } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useInquiry } from '../context/InquiryContext';
import {
  VOICE_PLANS, VOICE_SETUP_FEE_INR, VOICE_GST_PERCENT, PAYG_MIN_MINUTES, PAYG_MAX_SLIDER_MINUTES, PAYG_BASE_RATE,
  PAYG_DISCOUNT_RATE, PAYG_DISCOUNT_THRESHOLD_INR, PAYG_BONUS_PERCENT, PAYG_DISCOUNT_MIN_MINUTES, PAYG_STEP_MINUTES, formatInr, paygQuote,
} from '../data/voicePricing';

const SERVICE = 'Voice Calling AI Agents';
type Tab = 'monthly' | 'payg';

const VoicePricing: React.FC = () => {
  const { openInquiry } = useInquiry();
  const [tab, setTab] = useState<Tab>('monthly');
  const [minutesInput, setMinutesInput] = useState(String(PAYG_MIN_MINUTES));
  const q = paygQuote(Number(minutesInput.replace(/[^0-9]/g, '')));
  const toDiscount = PAYG_DISCOUNT_MIN_MINUTES - q.minutes;

  const tabBtn = (id: Tab, label: string) => (
    <button
      type="button" role="tab" id={`voice-tab-${id}`} aria-selected={tab === id} aria-controls={`voice-panel-${id}`}
      onClick={() => setTab(id)}
      className={`rounded-full px-4 py-2.5 text-sm font-bold transition-colors md:px-6 ${tab === id ? 'bg-yellow-400 text-black shadow' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
    >{label}</button>
  );

  return (
    <div data-voice-pricing>
      <div className="flex justify-center">
        <div role="tablist" aria-label="Voice pricing" className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/5">
          {tabBtn('monthly', 'Monthly subscription')}
          {tabBtn('payg', 'Pay as you go')}
        </div>
      </div>

      {tab === 'monthly' ? (
        <div role="tabpanel" id="voice-panel-monthly" aria-labelledby="voice-tab-monthly" className="mt-8 md:mt-10">
          <div className="-mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pb-2 pt-4 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:pt-2 lg:gap-6">
            {VOICE_PLANS.map((p, index) => (
              <ScrollReveal key={p.id} delay={`delay-${index * 100}`} className="w-[84%] shrink-0 snap-start md:w-auto">
                <article className={`relative flex h-full flex-col rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 md:p-8 ${p.featured ? 'border-yellow-400/70 bg-[#11130F] text-white shadow-[0_18px_70px_rgba(234,179,8,0.14)]' : 'border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#0D1017] dark:text-white'}`}>
                  {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow">Most Popular</span>}
                  <h4 className="text-2xl font-bold">{p.name}</h4>
                  <p className={`mt-1.5 text-sm ${p.featured ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>{p.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-black tracking-tight md:text-5xl">{formatInr(p.priceInr)}</span>
                    <span className={`text-base font-semibold ${p.featured ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>/month</span>
                  </div>
                  <span className={`mt-4 self-start rounded-full px-3 py-1.5 text-xs font-bold ${p.featured ? 'bg-yellow-400/15 text-yellow-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>
                    {p.includedMinutes.toLocaleString('en-IN')} mins at ₹{p.effectiveRate}/min
                  </span>
                  <dl className={`mt-6 grid grid-cols-2 gap-3 border-t pt-5 text-sm ${p.featured ? 'border-white/10' : 'border-gray-200 dark:border-white/10'}`}>
                    <div><dt className={`text-[11px] font-semibold uppercase tracking-wider ${p.featured ? 'text-white/50' : 'text-gray-500'}`}>Team members</dt><dd className="mt-0.5 font-bold">{p.teamMembers}</dd></div>
                    <div><dt className={`text-[11px] font-semibold uppercase tracking-wider ${p.featured ? 'text-white/50' : 'text-gray-500'}`}>Knowledge base</dt><dd className="mt-0.5 font-bold">{p.knowledgeBase}</dd></div>
                  </dl>
                  <p className={`mt-6 text-xs font-bold uppercase tracking-[0.14em] ${p.featured ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>{p.everythingIn}</p>
                  <ul className="mt-3 flex-1 space-y-3">
                    {p.features.map(f => <li key={f} className="flex gap-3 text-sm font-medium leading-relaxed"><Check size={17} className="mt-0.5 shrink-0 text-yellow-500" /><span>{f}</span></li>)}
                  </ul>
                  <button type="button" onClick={() => openInquiry(SERVICE, `Voice ${p.name}`, { price: `${formatInr(p.priceInr)}/month`, minutes: `${p.includedMinutes.toLocaleString('en-IN')} mins/month`, rate: `₹${p.effectiveRate}/min`, billingType: 'Monthly subscription', setupFee: formatInr(VOICE_SETUP_FEE_INR), tax: `+ ${VOICE_GST_PERCENT}% GST`, source: `Voice pricing · ${p.cta}` })} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${p.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400'}`}>
                    {p.cta}<ArrowRight size={17} />
                  </button>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            One-time setup fee: {formatInr(VOICE_SETUP_FEE_INR)}. Need more minutes in a month? Top up at the pay-as-you-go rate on any plan. Ring time and unanswered calls are not billed. All prices plus {VOICE_GST_PERCENT}% GST.
          </p>
        </div>
      ) : (
        <div role="tabpanel" id="voice-panel-payg" aria-labelledby="voice-tab-payg" className="mx-auto mt-8 max-w-3xl md:mt-10">
          <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-[#0D1017] md:p-10">
            <h4 className="text-2xl font-bold md:text-3xl">Pay as you go</h4>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
              Top up voice AI minutes from {formatInr(PAYG_MIN_MINUTES * PAYG_BASE_RATE)}, on any plan. Need voice cloning, SIP trunking, WhatsApp or voicemail detection?{' '}
              <button type="button" onClick={() => setTab('monthly')} className="font-bold text-yellow-700 underline underline-offset-4 hover:text-yellow-600 dark:text-yellow-300">Add a monthly plan.</button>
            </p>

            <label htmlFor="voice-payg-minutes" className="mt-8 block text-sm font-bold">Minutes you need</label>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
              <input
                id="voice-payg-minutes" type="number" inputMode="numeric" min={PAYG_MIN_MINUTES} step={PAYG_STEP_MINUTES}
                value={minutesInput}
                onChange={e => setMinutesInput(e.target.value)}
                onBlur={() => setMinutesInput(String(q.minutes))}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-bold text-gray-900 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 dark:border-white/15 dark:bg-white/5 dark:text-white sm:w-40"
              />
              <input
                type="range" aria-label="Minutes you need" min={PAYG_MIN_MINUTES} max={PAYG_MAX_SLIDER_MINUTES} step={PAYG_STEP_MINUTES}
                value={Math.min(q.minutes, PAYG_MAX_SLIDER_MINUTES)}
                onChange={e => setMinutesInput(e.target.value)}
                className="w-full flex-1 accent-yellow-400"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Minimum {PAYG_MIN_MINUTES} minutes, in steps of {PAYG_STEP_MINUTES}.</p>

            <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm font-medium text-gray-800 dark:text-yellow-100">
              <Info size={17} className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-300" />
              <span>Top up {formatInr(PAYG_DISCOUNT_THRESHOLD_INR)}+ for ₹{PAYG_DISCOUNT_RATE.toFixed(2)}/min and +{PAYG_BONUS_PERCENT}% bonus minutes.{!q.discounted && toDiscount > 0 && toDiscount <= 200 ? ` Add ${toDiscount} more minutes to unlock it.` : ''}</span>
            </p>

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-white/10" aria-live="polite">
              <p className="text-2xl font-black tracking-tight md:text-4xl" data-payg-result>
                You get {q.totalMinutes.toLocaleString('en-IN')} minutes for {formatInr(q.amountInr)}*
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400" data-payg-rate>
                ₹{q.rate.toFixed(2)}/min voice AI rate{q.discounted ? ` · includes ${q.bonusMinutes.toLocaleString('en-IN')} bonus minutes (+${PAYG_BONUS_PERCENT}%)` : ''}
              </p>
              <button
                type="button"
                onClick={() => openInquiry(SERVICE, 'Pay as you go top-up', { billingType: 'Pay as you go', paygMinutes: `${q.totalMinutes.toLocaleString('en-IN')} mins${q.bonusMinutes ? ` (incl. ${q.bonusMinutes} bonus)` : ''}`, paygAmount: formatInr(q.amountInr), rate: `₹${q.rate.toFixed(2)}/min`, setupFee: formatInr(VOICE_SETUP_FEE_INR), tax: `+ ${VOICE_GST_PERCENT}% GST`, source: `Voice pricing · Top up ${formatInr(q.amountInr)}` })}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition-colors hover:bg-yellow-300 sm:w-auto"
              >
                Top up {formatInr(q.amountInr)}<ArrowRight size={18} />
              </button>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">*Plus {VOICE_GST_PERCENT}% GST, added at checkout. One-time setup fee: {formatInr(VOICE_SETUP_FEE_INR)}.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePricing;
