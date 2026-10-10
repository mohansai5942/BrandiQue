// Single source of truth for BrandiQue offers and prices.
// Home, Pricing and Solutions all read from here so prices never drift apart.

export type PillarId = 'web' | 'ai' | 'design';

export interface Pillar {
  id: PillarId;
  number: string;
  title: string;
  outcome: string;
  description: string;
  href: string;
  startingAt: string;
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
    pillar: 'design', name: 'Monthly Creatives', price: '₹5,000', suffix: 'per month',
    description: 'A steady social presence with a planned batch of brand-aligned creatives every month.',
    items: ['8 static social creatives per month', 'Simple monthly content calendar', 'Caption ideas for each post', 'One revision round per batch', 'Consistent brand look'],
    note: 'Video editing, posting, ad spend and community management are excluded.',
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
    plan: 'Growth plan',
  },
  {
    slug: 'healthcare',
    industry: 'Clinics & diagnostic centres',
    name: 'Patient Autopilot',
    problem: 'Front desks are busy, appointment calls get missed and patients forget their follow-up visits.',
    includes: ['Clinic website with doctor and service pages', 'WhatsApp appointment requests and confirmations', 'Automatic appointment and follow-up reminders', 'Google review request after each visit', 'Digital prescription and bill workflow'],
    setup: '₹24,999',
    plan: 'Growth plan',
  },
  {
    slug: 'local-business',
    industry: 'Shops, restaurants & service businesses',
    name: 'WhatsApp Sales Desk',
    problem: 'Customers ask the same questions about price, stock and timings, and slow replies send them to competitors.',
    includes: ['One-page website with catalogue or menu', 'WhatsApp AI assistant for FAQs and orders', 'Quotation or order details sent automatically', 'Leads and orders logged in Google Sheets', '8 offer creatives every month'],
    setup: '₹19,999',
    plan: 'Growth plan',
  },
  {
    slug: 'launch',
    industry: 'New businesses & personal brands',
    name: 'Business Launch Kit',
    problem: 'A new business needs to look established from day one, without hiring three different agencies.',
    includes: ['Logo and brand identity kit', 'Business website (up to 5 pages)', '10 launch social media creatives', 'Google Business Profile setup', 'WhatsApp enquiry button and lead sheet'],
    setup: '₹24,999',
    plan: 'Care plan',
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
