// Voice Calling AI Agents pricing: monthly subscription plans + pay-as-you-go top-ups.
// Single source of truth for the voice pricing block, compare table, Services/Home tiles and hero.
// All prices in INR and exclusive of 18% GST.

export const VOICE_SETUP_FEE_INR = 1999;
export const VOICE_GST_PERCENT = 18;

export interface VoicePlan {
  id: 'starter' | 'pro' | 'growth';
  name: string;
  tagline: string;
  priceInr: number;
  includedMinutes: number;
  /** Effective per-minute rate shown in the pill (price / included minutes, 2 decimals). */
  effectiveRate: string;
  teamMembers: number;
  knowledgeBase: string;
  everythingIn: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const VOICE_PLANS: VoicePlan[] = [
  {
    id: 'starter', name: 'Starter', tagline: 'For your first live voice agent.', priceInr: 2799, includedMinutes: 317, effectiveRate: '8.83',
    teamMembers: 2, knowledgeBase: '10 MB', everythingIn: 'Everything in Free, plus',
    features: ['Voice cloning', 'WhatsApp', 'SIP trunking'], cta: 'Get Starter',
  },
  {
    id: 'pro', name: 'Pro', tagline: 'For teams running a live pilot.', priceInr: 6999, includedMinutes: 1000, effectiveRate: '7.00',
    teamMembers: 5, knowledgeBase: '50 MB', everythingIn: 'Everything in Starter, plus',
    features: ['Live call monitoring', 'Voicemail detection', 'Agent versioning', 'Workflow builder (10,000 runs/mo)'], cta: 'Get Pro', featured: true,
  },
  {
    id: 'growth', name: 'Growth', tagline: 'For teams scaling past the pilot.', priceInr: 22999, includedMinutes: 3571, effectiveRate: '6.44',
    teamMembers: 10, knowledgeBase: '100 MB', everythingIn: 'Everything in Pro, plus',
    features: ['Recording insights', 'Email channel', 'SMS channel', 'Workflow builder (100,000 runs/mo)'], cta: 'Get Growth',
  },
];

// Pay as you go
export const PAYG_MIN_MINUTES = 320;
export const PAYG_MAX_SLIDER_MINUTES = 5000;
export const PAYG_BASE_RATE = 8.9;
export const PAYG_DISCOUNT_RATE = 8.47;
export const PAYG_DISCOUNT_THRESHOLD_INR = 7000;
export const PAYG_BONUS_PERCENT = 2;

/** Indian digit grouping: 1234567 -> "12,34,567". */
export function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export const PAYG_MIN_TOPUP_INR = Math.round(PAYG_MIN_MINUTES * PAYG_BASE_RATE); // ₹2,848

/** Smallest minute count whose top-up at the discounted rate reaches the ₹7,000 threshold. */
export const PAYG_DISCOUNT_MIN_MINUTES = Math.ceil(PAYG_DISCOUNT_THRESHOLD_INR / PAYG_DISCOUNT_RATE); // 827

export interface PaygQuote {
  minutes: number;
  rate: number;
  amountInr: number;
  bonusMinutes: number;
  totalMinutes: number;
  discounted: boolean;
}

/**
 * Pay-as-you-go quote. ₹8.90/min; when the top-up itself is ₹7,000 or more at ₹8.47/min
 * (827+ minutes), the rate drops to ₹8.47/min and 2% bonus minutes are added.
 */
export function paygQuote(rawMinutes: number): PaygQuote {
  const minutes = Math.max(PAYG_MIN_MINUTES, Math.round(Number.isFinite(rawMinutes) ? rawMinutes : PAYG_MIN_MINUTES));
  const discounted = minutes * PAYG_DISCOUNT_RATE >= PAYG_DISCOUNT_THRESHOLD_INR;
  const rate = discounted ? PAYG_DISCOUNT_RATE : PAYG_BASE_RATE;
  const amountInr = Math.round(minutes * rate);
  const bonusMinutes = discounted ? Math.floor((minutes * PAYG_BONUS_PERCENT) / 100) : 0;
  return { minutes, rate, amountInr, bonusMinutes, totalMinutes: minutes + bonusMinutes, discounted };
}

export const VOICE_FROM_MONTHLY = formatInr(VOICE_PLANS[0].priceInr); // ₹2,799
export const VOICE_FROM_PAYG = formatInr(PAYG_MIN_TOPUP_INR); // ₹2,848
