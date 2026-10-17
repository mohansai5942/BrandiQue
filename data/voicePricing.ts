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
    teamMembers: 2, knowledgeBase: '10 MB', everythingIn: 'Includes',
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
/** Slider and input move in steps of 10 minutes (320, 330, 340, …). */
export const PAYG_STEP_MINUTES = 10;
export const PAYG_BASE_RATE = 8.9;
export const PAYG_DISCOUNT_RATE = 8.47;
export const PAYG_DISCOUNT_THRESHOLD_INR = 7000;
export const PAYG_BONUS_PERCENT = 2;

/** Indian digit grouping: 1234567 -> "12,34,567". */
export function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export const PAYG_MIN_TOPUP_INR = Math.round(PAYG_MIN_MINUTES * PAYG_BASE_RATE); // ₹2,848

/** Smallest selectable minute count (multiple of 10) whose top-up at the discounted rate reaches ₹7,000. */
export const PAYG_DISCOUNT_MIN_MINUTES =
  Math.ceil(PAYG_DISCOUNT_THRESHOLD_INR / PAYG_DISCOUNT_RATE / PAYG_STEP_MINUTES) * PAYG_STEP_MINUTES; // 830

/** Snap any typed/slid value to a multiple of 10 minutes, never below the 320-minute minimum. */
export function snapPaygMinutes(raw: number): number {
  const n = Number.isFinite(raw) ? raw : PAYG_MIN_MINUTES;
  return Math.max(PAYG_MIN_MINUTES, Math.round(n / PAYG_STEP_MINUTES) * PAYG_STEP_MINUTES);
}

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
 * (830+ minutes in 10-minute steps), the rate drops to ₹8.47/min and 2% bonus minutes are added.
 */
export function paygQuote(rawMinutes: number): PaygQuote {
  const minutes = snapPaygMinutes(rawMinutes);
  const discounted = minutes * PAYG_DISCOUNT_RATE >= PAYG_DISCOUNT_THRESHOLD_INR;
  const rate = discounted ? PAYG_DISCOUNT_RATE : PAYG_BASE_RATE;
  const amountInr = Math.round(minutes * rate);
  const bonusMinutes = discounted ? Math.floor((minutes * PAYG_BONUS_PERCENT) / 100) : 0;
  return { minutes, rate, amountInr, bonusMinutes, totalMinutes: minutes + bonusMinutes, discounted };
}

export const VOICE_FROM_MONTHLY = formatInr(VOICE_PLANS[0].priceInr); // ₹2,799
export const VOICE_FROM_PAYG = formatInr(PAYG_MIN_TOPUP_INR); // ₹2,848

// Usage rates and support (monthly plans), shown in the compare table, FAQs, chatbot and DB catalogue.
export const CHAT_MESSAGE_RATE_INR = '0.84';
export const WHATSAPP_MESSAGE_RATE_INR = '0.84';
export const WHATSAPP_BROADCASTS_PER_MONTH: Record<VoicePlan['id'], number | null> = { starter: null, pro: 2000, growth: 10000 };
export const VOICE_SUPPORT: Record<VoicePlan['id'], { channel: string; response: string }> = {
  starter: { channel: 'Email', response: '24-hour response' },
  pro: { channel: 'Email', response: '24-hour response' },
  growth: { channel: 'Email, Slack and WhatsApp', response: '12-hour response' },
};

/** Voice pricing & billing FAQs: voice service page, Pricing page and FAQ JSON-LD. */
export const VOICE_FAQS: { q: string; a: string }[] = [
  { q: 'Can I change my plan anytime?', a: 'Yes. You can upgrade or downgrade between Starter, Pro and Growth at any time, or move to pay as you go. Changes are prorated and take effect immediately.' },
  { q: 'What happens if I exceed my limits?', a: 'When your included minutes run out, calls continue from your top-up balance. Top up anytime at ₹8.90 a minute (₹8.47 a minute with 2% bonus minutes on ₹7,000+ top-ups), or move to a higher plan for a lower rate: ₹7.00 a minute on Pro and ₹6.44 a minute on Growth. If your balance runs out mid-call, the agent wraps up with a short goodbye instead of cutting off.' },
  { q: 'Is there a free trial?', a: 'We do not offer a free trial, but we will give you a free demo call: tell us who you need to call and what the agent should say, and we show you how your voice agent would handle it before you pay anything.' },
  { q: 'Do you offer enterprise discounts?', a: 'Our self-serve plans are Starter, Pro and Growth. If you need more minutes than Growth (3,571 a month) or have a large calling volume, contact us for custom volume pricing on request.' },
  { q: 'What kind of support do you provide?', a: 'Starter and Pro get email support with a 24-hour response. Growth adds Slack and WhatsApp support with a 12-hour response.' },
  { q: 'Can I integrate with my existing systems?', a: 'Yes. BrandiQue voice agents connect to your CRM, webhooks, Pabbly Connect, Google Calendar and WhatsApp, and every plan includes integrations and SIP trunking for your existing phone line.' },
  { q: 'How do plan credits and top-ups work?', a: 'Your monthly price is prepaid balance for voice minutes and messages: Starter ₹2,799 covers 317 minutes at ₹8.83 a minute, Pro ₹6,999 covers 1,000 minutes at ₹7.00, and Growth ₹22,999 covers 3,571 minutes at ₹6.44. Your plan decides which features you get. Top-ups add more balance, and top-ups of ₹7,000 or more get ₹8.47 a minute with 2% bonus minutes, but top-ups do not unlock plan features.' },
  { q: 'Can I use BrandiQue Voice AI without a subscription?', a: 'Yes. With pay as you go you buy minutes when you need them at ₹8.90 a minute, from 320 minutes (₹2,848) in steps of 10 minutes, with no monthly plan. Top up ₹7,000 or more for ₹8.47 a minute and 2% bonus minutes. Monthly plans lower your per-minute rate and unlock features such as voice cloning, WhatsApp and SIP trunking, and you can upgrade anytime. Your balance carries over.' },
  { q: 'Is there a prompt limit?', a: 'For the best call quality, keep an agent prompt under about 10,000 to 13,000 characters (around 3,500 tokens). We write and tune the agent script with you during setup.' },
  { q: 'What additional fees should I expect?', a: 'A one-time setup fee of ₹1,999, and 18% GST on every plan and top-up. Chatbot and WhatsApp messages are billed at ₹0.84 each. Meta bills its own WhatsApp template charges to your WhatsApp Business account, and anything extra, such as more phone numbers or more calls at the same time, is quoted before you approve it.' },
  { q: 'How is WhatsApp messaging billed?', a: 'Every message your agent sends is billed once at a flat ₹0.84, whether it is an agent reply or a campaign message. Incoming messages from your customers are free. Broadcast campaigns are included up to 2,000 messages a month on Pro and 10,000 a month on Growth.' },
  { q: 'Do marketing WhatsApp messages cost more than support or utility messages?', a: 'No. BrandiQue charges the same ₹0.84 for every outgoing message, templates and free text alike. Meta’s own charges are not included in this rate: Meta bills your WhatsApp Business account separately for template messages, and those charges vary by category (marketing, utility, authentication) and destination country.' },
  { q: 'Is GST added to WhatsApp message charges?', a: 'Not per message. Messages are deducted from your prepaid balance, so nothing is added to each message. 18% GST is charged when you pay for your plan or top-up and appears on that invoice.' },
  { q: 'Are there any other charges for WhatsApp?', a: 'WhatsApp calls use the voice AI per-minute rate of your plan. Outgoing WhatsApp messages use the separate ₹0.84 per-message rate. Incoming messages and conversations have no separate charge, and there is no WhatsApp setup or monthly fee beyond the one-time ₹1,999 agent setup.' },
];
