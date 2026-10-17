import { safeExternalUrl } from '../utils/security';
// Single source of truth for BrandiQue offers and prices.
// Home, Pricing and Solutions all read from here so prices never drift apart.

export type PillarId = 'web' | 'ai' | 'design' | 'voice';

export interface Pillar {
  id: PillarId;
  number: string;
  title: string;
  outcome: string;
  description: string;
  href: string;
  startingAt: string;
  /** Optional unit after the starting price, e.g. '/min' for usage-priced services. */
  startingSuffix?: string;
  /** Optional second price fact shown instead of "Membership from" on the Services page. */
  secondary?: { label: string; value: string; suffix?: string };
  /** Optional line shown under this pillar's plan cards (e.g. how voice tiers differ). */
  plansNote?: string;
  points: string[];
}

export const PILLARS: Pillar[] = [
  {
    id: 'web',
    number: '01',
    title: 'Web Development',
    outcome: 'Get found. Win the enquiry.',
    description: 'Fast, mobile-first websites that explain your offer in seconds and make it easy for customers to call, WhatsApp or book.',
    href: '/web-development',
    startingAt: '₹9,000',
    points: ['Business, portfolio and e-commerce websites', 'Custom React or easy-to-edit WordPress', 'WhatsApp, call and enquiry buttons on every page', 'SEO foundations and Google-ready structure'],
  },
  {
    id: 'ai',
    number: '02',
    title: 'AI Agents & Automations',
    outcome: 'Reply instantly. Follow up automatically.',
    description: 'AI assistants and n8n workflows that answer common questions 24/7, capture every lead and handle the repetitive follow-up your team forgets.',
    href: '/services/ai-automation',
    startingAt: '₹12,000',
    points: ['WhatsApp, Telegram and website AI chatbots', 'Lead capture into Google Sheets or your CRM', 'Automatic reminders, quotations and follow-ups', 'Human handoff, testing and a documented setup'],
  },
  {
    id: 'design',
    number: '03',
    title: 'Graphic Design',
    outcome: 'Look trusted everywhere.',
    description: 'Consistent, professional visuals for social media, ads and print, so your business looks as good as the work you do.',
    href: '/services/graphic-design',
    startingAt: '₹4,500',
    points: ['Social media posts and ad creatives', 'Logo and brand identity kits', 'Thumbnails, banners, flyers and presentations', 'Monthly creative plans for steady posting'],
  },
  {
    id: 'voice',
    number: '04',
    title: 'Voice Calling AI Agents',
    outcome: 'Call every lead. In their language.',
    description: 'AI voice agents that call new leads within seconds and run bulk reminder and follow-up campaigns in natural Telugu, switching to English mid-call, with every call transcribed and summarised.',
    href: '/services/voice-ai-agents',
    startingAt: '₹5',
    startingSuffix: '/min',
    secondary: { label: 'Setup or monthly fee', value: 'None', suffix: '' },
    plansNote: 'For example, use Voice Starter for high-volume reminder campaigns and Voice Premium for hot new leads. You can change an agent’s tier any time, and it takes effect immediately.',
    points: ['Instant lead calling and bulk campaigns, up to 20 calls at a time', 'Native Telugu, switching to English mid-call', 'Automatic transcripts and call summaries', 'CRM, webhook, Google Calendar and WhatsApp integrations'],
  },
];

export interface Package {
  pillar: PillarId;
  name: string;
  price: string;
  suffix: string;
  description: string;
  items: string[];
  note: string;
  featured?: boolean;
  /** Optional tier badge shown under the price (voice plans: the voice quality). */
  tier?: { label: string; line: string };
}

export const PACKAGES: Package[] = [
  // Web Development
  {
    pillar: 'web', name: 'Website Starter', price: '₹9,000', suffix: 'one-time · up to 3 pages',
    description: 'A clean, mobile-first site for a new business or personal brand that needs to look credible fast.',
    items: ['Up to 3 agreed pages', 'Responsive design with WhatsApp and call buttons', 'Contact or enquiry form', 'Basic on-page SEO', 'One consolidated revision round'],
    note: 'Domain, hosting and paid plugins billed separately where needed.',
  },
  {
    pillar: 'web', name: 'Business Website', price: '₹15,000', suffix: 'one-time · up to 5 pages', featured: true,
    description: 'The complete business website: service pages, trust sections and a clear enquiry journey.',
    items: ['Up to 5 agreed pages', 'Service, about and FAQ sections', 'Enquiry form connected to email or Sheets', 'Google Business Profile and SEO setup', 'Handover walkthrough and one revision round'],
    note: 'Domain, hosting and paid plugins billed separately where needed.',
  },
  {
    pillar: 'web', name: 'E-commerce Store', price: '₹25,000', suffix: 'one-time · starting at',
    description: 'An online store with product catalogue, cart, checkout and payment gateway integration.',
    items: ['Product listing and categories', 'Cart, checkout and payment gateway setup', 'Order notification emails', 'Mobile-first store design', 'Training to add your own products'],
    note: 'Gateway fees, paid themes/plugins and large catalogues are quoted separately.',
  },
  // AI Agents & Automations
  {
    pillar: 'ai', name: 'Lead Automation', price: '₹12,000', suffix: 'one-time · one workflow',
    description: 'Never lose an enquiry again: every lead is captured, logged and followed up automatically.',
    items: ['One lead source (website form, WhatsApp or Instagram)', 'Leads saved to Google Sheets', 'Instant owner notification', 'Automatic first follow-up message', 'Testing and documented handover'],
    note: 'API, messaging and AI usage charges are excluded and approved before work starts.',
  },
  {
    pillar: 'ai', name: 'AI Chatbot', price: '₹15,000', suffix: 'one-time · starting at', featured: true,
    description: 'An AI assistant trained on your business that answers customers on your website, WhatsApp or Telegram 24/7.',
    items: ['Trained on your services, prices and FAQs', 'Website, WhatsApp or Telegram channel', 'Lead capture and human handoff', 'Conversation testing before launch', 'Two weeks of post-launch tuning'],
    note: 'WhatsApp Business API and AI model usage are billed at cost.',
  },
  {
    pillar: 'ai', name: 'Custom AI Agent & Workflows', price: '₹20,000', suffix: 'one-time · starting at',
    description: 'Multi-step automations for operations: quotations, invoices, reports, reminders and system integrations.',
    items: ['Process mapping session', 'Multi-step n8n workflows with APIs and webhooks', 'Document generation (quotations, bills, reports)', 'Error alerts and fallback paths', 'Documentation and team training'],
    note: 'Third-party tools, hosting and API usage are quoted separately.',
  },
  // Graphic Design
  {
    pillar: 'design', name: 'Design Starter Pack', price: '₹4,500', suffix: 'one-time · 5 designs',
    description: 'A focused batch of on-brand visuals for a launch, offer or campaign.',
    items: ['Up to 5 static designs', 'Sized for your chosen platforms', 'Consistent with your brand colours', 'Final PNG/JPG exports', 'One consolidated revision round'],
    note: 'Copywriting, stock assets and source files quoted separately.',
  },
  {
    pillar: 'design', name: 'Brand Identity Kit', price: '₹8,000', suffix: 'one-time · starting at', featured: true,
    description: 'A recognisable visual identity so your business looks consistent everywhere.',
    items: ['Primary logo and one variation', 'Colour palette and typography', 'Mini brand usage guide', 'Social profile and favicon exports', 'One refinement round'],
    note: 'Naming, packaging systems and editable source files may need a separate quote.',
  },
  {
    pillar: 'design', name: 'Campaign Pack', price: '₹7,500', suffix: 'one-time · 12 designs',
    description: 'Everything for one launch, offer or admission campaign, ready for social media and ads.',
    items: ['8 social posts or carousels', '4 ad creatives in feed and story sizes', 'One consistent campaign look', 'Final PNG/JPG exports for every platform', 'One consolidated revision round'],
    note: 'Need designs every month? Design memberships start at ₹5,000. Ad spend and posting are excluded.',
  },
  // Voice Calling AI Agents: billed only per connected minute (no agent or monthly fee), identical features on every plan.
  // The plan is the voice tier, which sets voice quality and the per-minute rate.
  {
    pillar: 'voice', name: 'Voice Starter', price: '₹5/min', suffix: 'per connected minute',
    tier: { label: 'Budget-friendly voice', line: 'Covers most day-to-day calling' },
    description: 'Budget-friendly voice that covers most day-to-day calling, ideal for high-volume reminder campaigns.',
    items: ['One AI voice agent, live the same day', 'Dedicated +91 calling line (DLT-registered)', '₹500 calling credit when your agent goes live', 'Bulk campaigns, up to 20 calls at a time', 'Native Telugu, switching to English mid-call', 'Automatic transcripts and call summaries', 'CRM, webhook and Pabbly Connect integrations', 'Google Calendar booking and WhatsApp follow-ups', '99.9% uptime SLA, no setup fee, no lock-in'],
    note: 'Same features on every plan; only the voice and per-minute rate change. Ring time and unanswered calls are not billed.',
  },
  {
    pillar: 'voice', name: 'Voice Growth', price: '₹8/min', suffix: 'per connected minute',
    tier: { label: 'Great everyday quality', line: 'A step up in naturalness' },
    description: 'Great everyday quality, a clear step up in naturalness for regular lead and customer calls.',
    items: ['One AI voice agent, live the same day', 'Dedicated +91 calling line (DLT-registered)', '₹500 calling credit when your agent goes live', 'Bulk campaigns, up to 20 calls at a time', 'Native Telugu, switching to English mid-call', 'Automatic transcripts and call summaries', 'CRM, webhook and Pabbly Connect integrations', 'Google Calendar booking and WhatsApp follow-ups', '99.9% uptime SLA, no setup fee, no lock-in'],
    note: 'Same features on every plan; only the voice and per-minute rate change. Ring time and unanswered calls are not billed.',
  },
  {
    pillar: 'voice', name: 'Voice Premium', price: '₹11/min', suffix: 'per connected minute',
    tier: { label: 'The most lifelike voice', line: 'For calls where the first impression matters most' },
    description: 'Our most lifelike voice, for calls where the first impression matters most, like hot new leads.',
    items: ['One AI voice agent, live the same day', 'Dedicated +91 calling line (DLT-registered)', '₹500 calling credit when your agent goes live', 'Bulk campaigns, up to 20 calls at a time', 'Native Telugu, switching to English mid-call', 'Automatic transcripts and call summaries', 'CRM, webhook and Pabbly Connect integrations', 'Google Calendar booking and WhatsApp follow-ups', '99.9% uptime SLA, no setup fee, no lock-in'],
    note: 'Same features on every plan; only the voice and per-minute rate change. Ring time and unanswered calls are not billed.',
  },
];

export interface GrowthPlan {
  name: string;
  price: string;
  period: string;
  bestFor: string;
  items: string[];
  featured?: boolean;
}

// Monthly plans: the recurring part of BrandiQue's business model.
export const GROWTH_PLANS: GrowthPlan[] = [
  {
    name: 'Care',
    price: '₹1,999',
    period: 'per month',
    bestFor: 'Businesses that already have a website and want it maintained.',
    items: ['Up to 2 hours of website updates', 'Enquiry form and key page checks', 'Monthly backup and update checklist', 'Monthly change summary', 'WhatsApp support in working hours'],
  },
  {
    name: 'Growth',
    price: '₹6,999',
    period: 'per month',
    bestFor: 'Businesses ready to turn their website and WhatsApp into a lead machine.',
    featured: true,
    items: ['Everything in Care', 'AI chatbot upkeep and monthly answer tuning', 'Lead automation monitoring and fixes', '8 social media creatives', 'Monthly leads and enquiries report'],
  },
  {
    name: 'Scale',
    price: '₹14,999',
    period: 'per month',
    bestFor: 'Growing teams that want a dedicated digital growth partner.',
    items: ['Everything in Growth', 'One new automation or landing page each month', '16 social media creatives', 'Google Business Profile updates', 'Monthly strategy call and priority support'],
  },
];

export interface IndustrySolution {
  slug: string;
  industry: string;
  name: string;
  problem: string;
  includes: string[];
  setup: string;
  plan: string;
  /** 3-bullet ROI pitch: why this package pays for itself. */
  roi: string[];
  /** Prefilled WhatsApp message naming the product. */
  whatsappMessage: string;
}

// Productised bundles: one setup + one monthly plan, aimed at a specific industry.
export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    slug: 'education',
    industry: 'Coaching centres & schools',
    name: 'Admission Autopilot',
    problem: 'Parent enquiries arrive on WhatsApp at all hours, and admissions slip away when nobody replies or follows up.',
    includes: ['Admissions website or landing page', 'WhatsApp AI assistant for fees, batches and timings', 'Automatic follow-up until the parent visits', 'Fee-due and attendance alerts to parents', 'Monthly enquiry-to-admission report'],
    setup: '₹24,999',
    plan: 'Growth bundle',
    roi: [
      'One admission is worth ₹30,000–₹1,00,000 — a single saved admission pays for the setup',
      'Parents enquire at 10 PM — the AI replies in seconds while competitors sleep',
      'Automatic follow-ups until the parent visits — no more “we’ll think about it”',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Admission Autopilot for my coaching centre/school. Please share the details and a demo.',
  },
  {
    slug: 'healthcare',
    industry: 'Clinics & diagnostic centres',
    name: 'Patient Autopilot',
    problem: 'Front desks are busy, appointment calls get missed and patients forget their follow-up visits.',
    includes: ['Clinic website with doctor and service pages', 'WhatsApp appointment requests and confirmations', 'Automatic appointment and follow-up reminders', 'Google review request after each visit', 'Digital prescription and bill workflow'],
    setup: '₹24,999',
    plan: 'Growth bundle',
    roi: [
      '10 missed calls a day × ₹500 a visit = ₹1.5L a month walking to another clinic',
      'Appointment reminders fill slots and cut no-shows — automatically',
      'Review requests after every visit build 5-star trust on autopilot',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Patient Autopilot for my clinic. Please share the details and a demo.',
  },
  {
    slug: 'local-business',
    industry: 'Shops, restaurants & service businesses',
    name: 'WhatsApp Sales Desk',
    problem: 'Customers ask the same questions about price, stock and timings, and slow replies send them to competitors.',
    includes: ['One-page website with catalogue or menu', 'WhatsApp AI assistant for FAQs and orders', 'Quotation or order details sent automatically', 'Leads and orders logged in Google Sheets', '8 offer creatives every month'],
    setup: '₹19,999',
    plan: 'Growth bundle',
    roi: [
      'A 5-minute-late reply sends the customer to the shop next door',
      'Instant answers on price, stock and timings — even at midnight',
      'Every order logged in a sheet automatically — no more lost notebook orders',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the WhatsApp Sales Desk for my business. Please share the details and a demo.',
  },
  {
    slug: 'launch',
    industry: 'New businesses & personal brands',
    name: 'Business Launch Kit',
    problem: 'A new business needs to look established from day one, without hiring three different agencies.',
    includes: ['Logo and brand identity kit', 'Business website (up to 5 pages)', '10 launch social media creatives', 'Google Business Profile setup', 'WhatsApp enquiry button and lead sheet'],
    setup: '₹24,999',
    plan: 'Web Care',
    roi: [
      'Look established from day one — trust wins the first customer',
      'Logo, website and launch creatives from one team — no agency juggling',
      'Live in weeks, not months, with everything needed to start selling',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Business Launch Kit for my new business. Please share the details.',
  },
];

export const PRICING_FAQ = [
  { q: 'Are these final prices?', a: 'They are starting prices for the scope listed. After a short call we send a fixed written quote, so the price you approve is the price you pay.' },
  { q: 'How do payments work?', a: 'Usually 50% to start and 50% before launch. Monthly plans are billed at the start of each month.' },
  { q: 'Is there a long contract for monthly plans?', a: 'Monthly plans need a 3-month minimum so the work has time to show results. After that you can continue month to month.' },
  { q: 'What costs are not included?', a: 'Domain, hosting, paid plugins, WhatsApp Business API and AI usage, ad spend and taxes are billed at cost or quoted separately. We tell you about them before you approve anything.' },
  { q: 'Who owns the website and automations?', a: 'You do. After final payment you own your website, content, designs and workflows, and we hand over the access.' },
  { q: 'How long does a project take?', a: 'Most starter websites and single automations launch in 1 to 2 weeks. Larger websites, stores and industry solutions usually take 2 to 4 weeks after we receive your content.' },
];

// Builds a WhatsApp click-to-chat link with a prefilled message.
export function whatsappLink(base: string, message: string): string {
  const url = safeExternalUrl(base, 'https://wa.me/917093320572');
  return `${url}${url.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`;
}

// Monthly memberships: recurring revenue for each of the three services, plus all-in-one bundles.
export type MembershipTrack = PillarId | 'bundle';

export interface Membership {
  track: MembershipTrack;
  name: string;
  price: string;
  bestFor: string;
  items: string[];
  featured?: boolean;
  saving?: string;
}

export const MEMBERSHIP_TRACKS: { id: MembershipTrack; label: string; short: string }[] = [
  { id: 'bundle', label: 'All-in-one bundles', short: 'Bundles' },
  { id: 'web', label: 'Web Development', short: 'Web' },
  { id: 'ai', label: 'AI Agents & Automations', short: 'AI' },
  { id: 'design', label: 'Graphic Design', short: 'Design' },
  { id: 'voice', label: 'Voice Calling AI Agents', short: 'Voice' },
];

export const MEMBERSHIPS: Membership[] = [
  // Web
  { track: 'web', name: 'Web Care', price: '₹1,999', bestFor: 'Keep an existing website secure, updated and working.', items: ['Up to 2 hours of edits a month', 'Form, speed and uptime checks', 'Monthly backup and update checklist', 'Monthly change summary', 'WhatsApp support in working hours'] },
  { track: 'web', name: 'Web Growth', price: '₹3,999', bestFor: 'Keep improving the site so it brings more enquiries.', featured: true, items: ['Everything in Web Care', 'Up to 5 hours of edits a month', 'One new landing page or section monthly', 'On-page SEO and Google Business updates', 'Monthly traffic and enquiry report'] },
  // AI
  { track: 'ai', name: 'AI Care', price: '₹2,999', bestFor: 'Keep your chatbot and automations running reliably.', items: ['Workflow monitoring and error fixes', 'Monthly chatbot answer review', 'Up to 1 hour of changes a month', 'API and token usage check', 'WhatsApp support in working hours'] },
  { track: 'ai', name: 'AI Operations', price: '₹5,999', bestFor: 'Keep automating more of your business every month.', featured: true, items: ['Everything in AI Care', 'Chatbot tuning from real conversations', 'One new workflow or improvement monthly', 'Up to 4 hours of changes a month', 'Monthly leads and automation report'] },
  // Design
  { track: 'design', name: 'Design Lite', price: '₹5,000', bestFor: 'A steady, consistent social media presence.', items: ['8 social media creatives a month', 'Monthly content calendar', 'Caption ideas for every post', 'One revision round per batch', 'Brand-consistent templates'] },
  { track: 'design', name: 'Design Pro', price: '₹9,999', bestFor: 'Brands running offers, ads and frequent campaigns.', featured: true, items: ['16 social media creatives a month', '4 ad creatives in multiple sizes', '2 thumbnails, banners or flyers', 'Two revision rounds per batch', 'Priority 48-hour turnaround'] },
  // Bundles
  { track: 'bundle', name: 'Growth', price: '₹6,999', bestFor: 'Website, AI assistant and social media, handled by one team.', featured: true, saving: 'Worth ₹9,998 separately', items: ['Web Care included', 'AI Care included', 'Design Lite included (8 creatives)', 'One monthly growth check-in', 'Monthly leads and enquiries report'] },
  { track: 'bundle', name: 'Scale', price: '₹14,999', bestFor: 'A dedicated digital growth partner for growing teams.', saving: 'Worth ₹19,997 separately', items: ['Web Growth included', 'AI Operations included', 'Design Pro included (16 creatives)', 'Monthly strategy call', 'Priority support and same-day replies'] },
];

// Care plans: the recurring-revenue reframe of memberships.
// Simple, per-need monthly plans — billed monthly, cancel anytime.
// Rendered by components/Memberships.tsx. (MEMBERSHIPS above is kept for
// pages/Services.tsx "lowest membership" hints.)
export interface CarePlan {
  name: string;
  price: string;
  bestFor: string;
  items: string[];
  featured?: boolean;
  whatsappMessage: string;
}

export const CARE_PLANS: CarePlan[] = [
  {
    name: 'Website Care',
    price: '₹2,999',
    bestFor: 'Your website stays fast, secure and updated — we handle the tech.',
    items: [
      'Up to 3 hours of website edits a month',
      'Uptime, speed and form checks',
      'Monthly backups and plugin updates',
      'Broken-link and enquiry monitoring',
      'WhatsApp support in working hours',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Website Care plan (₹2,999/mo). Please share the subscription details.',
  },
  {
    name: 'AI Agent Monitoring',
    price: '₹4,999',
    bestFor: 'Your AI assistant and automations watched, tuned and fixed.',
    items: [
      'Workflow monitoring with instant error fixes',
      'Monthly chatbot answer tuning from real chats',
      'Up to 2 hours of improvements a month',
      'AI and WhatsApp API usage check',
      'Monthly automation and leads report',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the AI Agent Monitoring plan (₹4,999/mo). Please share the subscription details.',
  },
  {
    name: 'Growth',
    price: '₹6,999',
    bestFor: 'Website, AI and social media handled by one team.',
    featured: true,
    items: [
      'Website Care included',
      'AI Agent Monitoring included',
      '8 social media creatives a month',
      'One monthly growth check-in',
      'Monthly leads and enquiries report',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Growth plan (₹6,999/mo). Please share the subscription details.',
  },
  {
    name: 'Scale',
    price: '₹14,999',
    bestFor: 'A dedicated digital growth partner for growing teams.',
    items: [
      'Everything in Growth',
      'One new automation or landing page each month',
      '16 social media creatives a month',
      'Monthly strategy call',
      'Priority support with same-day replies',
    ],
    whatsappMessage: 'Hi BrandiQue, I want the Scale plan (₹14,999/mo). Please share the subscription details.',
  },
];
