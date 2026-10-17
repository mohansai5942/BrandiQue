// Content for the four core service pages. One template renders all four,
// so every service page shares the same structure, quality bar and conversion path.
import type { PillarId } from './offers';

export interface ServiceContent {
  id: PillarId;
  eyebrow: string;
  title: string;
  highlight: string;
  intro: string;
  accent: 'cyan' | 'violet' | 'amber' | 'emerald';
  outcomes: { stat: string; label: string }[];
  buildsTitle: string;
  builds: { title: string; text: string; icon: string }[];
  options?: { title: string; text: string; bestFor: string; href: string; cta: string }[];
  useCases: { who: string; what: string }[];
  process: { title: string; text: string }[];
  tools: string[];
  faqs: { q: string; a: string }[];
  /** Optional comparison tables rendered after pricing (plans side by side, and vs. the usual alternative). */
  compare?: ServiceCompare;
  ctaTitle: string;
  ctaText: string;
  inquiry: string;
}

export interface ServiceCompare {
  eyebrow: string;
  title: string;
  text: string;
  /** Plan names as column headers; each row has one cell per column (true = included, false = not included). */
  columns: string[];
  /** Optional column index to highlight as recommended. */
  recommended?: number;
  rows: { feature: string; values: (string | boolean)[] }[];
  versus?: { title: string; columns: [string, string]; rows: { feature: string; values: [string, string] }[]; note: string };
}

export const SERVICE_CONTENT: Record<PillarId, ServiceContent> = {
  web: {
    id: 'web',
    eyebrow: 'Service 01 · Web Development',
    title: 'Websites that turn visitors into',
    highlight: 'paying customers.',
    intro: 'Fast, mobile-first websites that explain your offer in seconds, build trust instantly and make it effortless to call, WhatsApp or book. Custom-coded or easy-to-edit WordPress, built by one accountable team.',
    accent: 'cyan',
    outcomes: [
      { stat: '1–2 weeks', label: 'Typical launch for business websites' },
      { stat: 'Mobile-first', label: 'Designed for the phone your customer uses' },
      { stat: '100%', label: 'Domain, code and content owned by you' },
    ],
    buildsTitle: 'Every website we build is designed to sell',
    builds: [
      { icon: 'layout', title: 'Business websites', text: 'Service pages, trust sections and a clear enquiry journey for local and growing businesses.' },
      { icon: 'cart', title: 'E-commerce stores', text: 'Product catalogue, cart, Razorpay or other gateway checkout and order notifications.' },
      { icon: 'user', title: 'Portfolio & personal brands', text: 'Showcase your work, profile and results with a site that feels premium.' },
      { icon: 'rocket', title: 'Landing pages', text: 'Single-offer pages for ads, launches and admissions that convert paid traffic.' },
      { icon: 'search', title: 'SEO & Google setup', text: 'Technical SEO foundations, Search Console and Google Business Profile setup.' },
      { icon: 'message', title: 'Lead capture built in', text: 'WhatsApp, call and form buttons connected to email or Google Sheets.' },
    ],
    options: [
      { title: 'Custom-coded (React / Next.js)', text: 'Built from scratch for speed, unique design and smooth animations. Best when performance and brand experience matter most.', bestFor: 'Brands, startups and premium businesses', href: '#pricing', cta: 'See website packages' },
      { title: 'WordPress', text: 'A familiar dashboard so your team can edit pages, blogs and products without a developer.', bestFor: 'Teams that update content often', href: '#pricing', cta: 'See website packages' },
    ],
    useCases: [
      { who: 'Coaching centres & schools', what: 'Admissions pages with batches, fees, results and a WhatsApp enquiry button.' },
      { who: 'Clinics & hospitals', what: 'Doctor profiles, services and appointment requests in two taps.' },
      { who: 'Shops & restaurants', what: 'Menus, catalogues and Google Maps so nearby customers find you.' },
      { who: 'Startups & professionals', what: 'A credible first impression for investors, clients and hiring.' },
    ],
    process: [
      { title: 'Discovery call', text: 'We understand your customers, offer and goals, then send a fixed written quote.' },
      { title: 'Structure & design', text: 'Page plan and visual direction approved by you before development.' },
      { title: 'Build & connect', text: 'Responsive development with forms, WhatsApp, SEO and analytics connected.' },
      { title: 'Launch & handover', text: 'Speed and form testing, go-live, and a walkthrough so you own everything.' },
    ],
    tools: ['React', 'Next.js', 'Tailwind CSS', 'WordPress', 'WooCommerce', 'Firebase', 'Razorpay', 'Google Search Console', 'Cloudflare'],
    faqs: [
      { q: 'How long does a website take?', a: 'Most starter and business websites go live in 1 to 2 weeks after we receive your content. E-commerce stores usually take 3 to 4 weeks.' },
      { q: 'Are domain and hosting included?', a: 'Domain and hosting are paid directly by you, so you always own them. We recommend the right option for your budget and handle the complete setup at no extra charge.' },
      { q: 'Custom code or WordPress: which should I choose?', a: 'Choose custom code for the best speed and a unique premium experience. Choose WordPress if your team wants to edit content themselves often. We recommend honestly on the first call.' },
      { q: 'What happens after launch?', a: 'Post-launch fixes are included. For ongoing updates, SEO and new pages, Web Care starts at ₹1,999 a month.' },
    ],
    ctaTitle: 'Ready for a website that actually brings enquiries?',
    ctaText: 'Get a free audit of your current site, or tell us about the one you need. We reply within one working day.',
    inquiry: 'Web Development',
  },
  ai: {
    id: 'ai',
    eyebrow: 'Service 02 · AI Agents & Automations',
    title: 'AI agents that reply, follow up and',
    highlight: 'never miss a lead.',
    intro: 'AI assistants that answer customers on WhatsApp, Telegram or your website in seconds, and n8n workflows that capture leads, send reminders and generate documents automatically, day and night.',
    accent: 'violet',
    outcomes: [
      { stat: 'Seconds', label: 'Typical AI reply time, at any hour' },
      { stat: '24 × 7', label: 'Enquiries answered beyond office hours' },
      { stat: '0', label: 'Leads lost in chats and notebooks' },
    ],
    buildsTitle: 'What we automate for your business',
    builds: [
      { icon: 'message', title: 'WhatsApp AI assistants', text: 'Answer fees, prices, timings and FAQs instantly, then hand over to your team.' },
      { icon: 'bot', title: 'Website & Telegram chatbots', text: 'AI trained on your business that captures leads while you sleep.' },
      { icon: 'sheet', title: 'Lead capture & CRM sync', text: 'Every enquiry from forms, WhatsApp or Instagram saved to Sheets or your CRM.' },
      { icon: 'bell', title: 'Reminders & follow-ups', text: 'Appointment, fee-due and follow-up messages that go out on their own.' },
      { icon: 'file', title: 'Documents on autopilot', text: 'Quotations, invoices, prescriptions and reports generated from your data.' },
      { icon: 'workflow', title: 'Custom n8n workflows', text: 'Connect your tools with APIs and webhooks, with error alerts and fallbacks.' },
    ],
    useCases: [
      { who: 'Coaching centres', what: 'Answer parent enquiries, book demo classes and send fee reminders.' },
      { who: 'Clinics', what: 'Appointment requests, confirmations, follow-up reminders and review requests.' },
      { who: 'Shops & service businesses', what: 'Instant price and stock replies, quotations and order logging.' },
      { who: 'Agencies & teams', what: 'Reports, data entry and hand-offs between tools without manual work.' },
    ],
    process: [
      { title: 'Process mapping', text: 'We map what happens to every enquiry today and where time or leads are lost.' },
      { title: 'Design the flow', text: 'Conversation scripts, AI knowledge and automation steps agreed with you.' },
      { title: 'Build & test', text: 'We build, connect your tools and test against real sample conversations.' },
      { title: 'Launch & tune', text: 'Go-live with human handoff, documentation and two weeks of tuning.' },
    ],
    tools: ['n8n', 'WhatsApp Cloud API', 'Telegram Bot API', 'Google Gemini', 'OpenAI', 'Google Sheets', 'Webhooks & APIs', 'Node.js', 'Supabase', 'Firebase'],
    faqs: [
      { q: 'Will the AI give wrong answers to customers?', a: 'We train it only on your approved information, set clear boundaries and add a human handoff for anything it should not answer. It is tested on real sample conversations before launch.' },
      { q: 'What running costs should I expect?', a: 'WhatsApp Business API messages and AI model usage are billed at cost by the providers. For most small businesses this is a few hundred rupees a month; we estimate it before you approve.' },
      { q: 'Do I need technical knowledge?', a: 'No. We set everything up, document it and train your team. Leads appear in a Google Sheet or the tool you already use.' },
      { q: 'What if something breaks later?', a: 'Workflows include error alerts. AI Care (₹2,999 a month) covers monitoring, fixes and monthly answer reviews.' },
    ],
    ctaTitle: 'Stop losing enquiries after 8 PM.',
    ctaText: 'Tell us how customers reach you today. We will show you exactly what can run on autopilot, free.',
    inquiry: 'AI Automation & Agents',
  },
  design: {
    id: 'design',
    eyebrow: 'Service 03 · Graphic Design',
    title: 'Design that makes your business look',
    highlight: 'premium and trusted.',
    intro: 'Logos, brand identities, social media creatives and ad designs that look consistent everywhere, so customers trust you before they ever speak to you. One-time packs or a monthly design membership.',
    accent: 'amber',
    outcomes: [
      { stat: '48–72 hrs', label: 'Typical turnaround for creative batches' },
      { stat: 'One look', label: 'Consistent across posts, ads and print' },
      { stat: 'Ready', label: 'Exported in sizes for every platform' },
    ],
    buildsTitle: 'Everything your brand needs to look the part',
    builds: [
      { icon: 'pen', title: 'Logo & brand identity', text: 'Logo, colour palette, typography and a usage guide that keeps you consistent.' },
      { icon: 'image', title: 'Social media creatives', text: 'Posts, carousels and stories planned around your offers and calendar.' },
      { icon: 'megaphone', title: 'Ad creatives', text: 'Scroll-stopping designs for Meta and Google ads in every required size.' },
      { icon: 'monitor', title: 'Thumbnails & banners', text: 'YouTube thumbnails, website banners and cover images that get clicks.' },
      { icon: 'file', title: 'Print & collateral', text: 'Business cards, flyers, brochures, menus and standees ready to print.' },
      { icon: 'layers', title: 'Pitch decks & presentations', text: 'Clean, on-brand decks for investors, clients and proposals.' },
    ],
    useCases: [
      { who: 'New businesses', what: 'A complete launch kit: logo, brand colours and launch posts.' },
      { who: 'Coaching & clinics', what: 'Results posts, admission campaigns and festival greetings every month.' },
      { who: 'Shops & restaurants', what: 'Offer creatives, menus and flyers that drive footfall.' },
      { who: 'Creators & professionals', what: 'Thumbnails, banners and personal brand visuals.' },
    ],
    process: [
      { title: 'Brief', text: 'Platform, audience, message, format and references agreed upfront.' },
      { title: 'First designs', text: 'A focused direction delivered within the agreed timeline.' },
      { title: 'Refine', text: 'One consolidated round of feedback, or two on Design Pro.' },
      { title: 'Export & deliver', text: 'Final files in every size and format you need, ready to post or print.' },
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Adobe InDesign', 'Canva', 'Google Fonts'],
    faqs: [
      { q: 'How many revisions do I get?', a: 'Each batch includes one consolidated revision round (two on Design Pro). Extra rounds are quoted upfront, so there are no surprises.' },
      { q: 'Do I get the source files?', a: 'Final PNG, JPG and PDF exports are always included. Editable source files are included in brand identity kits and can be added to other packs.' },
      { q: 'Can you post on my social media too?', a: 'Our design memberships focus on creating the designs and captions. Posting and ad management can be quoted separately.' },
      { q: 'Can you match my existing brand?', a: 'Yes. Share your logo, colours and fonts and we design within them. If you have none, start with the Brand Identity Kit.' },
    ],
    ctaTitle: 'Let’s make your brand impossible to ignore.',
    ctaText: 'Share your platform, audience and deadline. We confirm scope and a fixed quote before any design begins.',
    inquiry: 'Graphic Design',
  },
  voice: {
    id: 'voice',
    eyebrow: 'Service 04 · Voice Calling AI Agents',
    title: 'AI voice agents that call every lead in',
    highlight: 'natural Telugu and English.',
    intro: 'A voice agent that phones new enquiries within seconds, runs bulk reminder and follow-up campaigns, books appointments on the call and writes notes for every conversation. Live the same day, with no monthly or agent fee: you pay only per connected minute, from ₹5 a minute.',
    accent: 'emerald',
    outcomes: [
      { stat: 'Same day', label: 'From sign-up to a live calling agent' },
      { stat: '24 × 7', label: 'Calling all year, no shifts or leave' },
      { stat: '20', label: 'Calls at a time in bulk campaigns' },
    ],
    buildsTitle: 'What your AI voice agent handles',
    builds: [
      { icon: 'phoneOut', title: 'Instant lead calling', text: 'A new form, ad or website lead gets a call within seconds, while interest is highest.' },
      { icon: 'megaphone', title: 'Bulk call campaigns', text: 'Reminders, renewals, fee dues and offers called to your list, up to 20 calls at a time.' },
      { icon: 'languages', title: 'Native Telugu, English mid-call', text: 'Natural Telugu conversations that switch to English mid-call when the customer does.' },
      { icon: 'calendar', title: 'Bookings & WhatsApp follow-up', text: 'Books slots in Google Calendar during the call and sends WhatsApp confirmations and follow-ups.' },
      { icon: 'audio', title: 'Transcripts & call summaries', text: 'Every call transcribed and summarised automatically, with the cost of each call in the call log.' },
      { icon: 'workflow', title: 'CRM, webhook & Pabbly Connect', text: 'Lead details and call outcomes pushed to your CRM or any tool through webhooks and Pabbly Connect.' },
    ],
    useCases: [
      { who: 'Coaching centres & colleges', what: 'Call every admission enquiry instantly, book campus visits and remind parents about fee dues.' },
      { who: 'Clinics & diagnostic centres', what: 'Appointment confirmations and follow-up visit reminders.' },
      { who: 'Real estate & builders', what: 'Call fresh ad leads in seconds and book site visits for your sales team.' },
      { who: 'Shops, finance & service businesses', what: 'Renewal, EMI and service-due reminder campaigns to your customer list.' },
    ],
    process: [
      { title: 'Describe the job', text: 'Tell us who to call, what the agent should say and what a good outcome looks like.' },
      { title: 'Pick the voice', text: 'Choose Starter, Growth or Premium per agent; you can change the tier any time, instantly.' },
      { title: 'Connect your tools', text: 'Your +91 line, CRM, webhooks, Google Calendar and WhatsApp follow-ups connected.' },
      { title: 'Live the same day', text: 'The agent starts calling, with transcripts, summaries and per-call costs in the call log.' },
    ],
    tools: ['Dedicated +91 line (DLT-registered)', 'Google Calendar', 'WhatsApp', 'CRM integrations', 'Webhooks', 'Pabbly Connect'],
    faqs: [
      { q: 'How much does a voice AI agent cost?', a: 'There is no monthly or per-agent fee. You pay only per connected minute: ₹5 on Voice Starter, ₹8 on Voice Growth and ₹11 on Voice Premium. Every agent includes a dedicated +91 calling line and ₹500 of calling credit when it goes live.' },
      { q: 'What is the difference between Starter, Growth and Premium?', a: 'Only the voice and the per-minute rate. Starter (₹5/min) is budget-friendly and covers most day-to-day calling, Growth (₹8/min) is a step up in naturalness, and Premium (₹11/min) is the most lifelike voice, for calls where the first impression matters most. Every plan has exactly the same features, and you can switch an agent’s tier any time.' },
      { q: 'What is included with every agent?', a: 'Same-day setup, a dedicated DLT-registered +91 line, ₹500 calling credit when the agent goes live, bulk campaigns up to 20 calls at a time, native Telugu with English mid-call, automatic transcripts and summaries, CRM, webhook and Pabbly Connect integrations, Google Calendar booking, WhatsApp follow-ups and a 99.9% uptime SLA.' },
      { q: 'How are call minutes billed?', a: 'Per second, rounded up to the nearest 30 seconds, from your prepaid credit. Ring time and unanswered calls are not billed. If the balance runs out mid-call, the agent wraps up with a short goodbye instead of cutting off.' },
      { q: 'Is there a setup fee or long contract?', a: 'No setup fee, no monthly fee and no lock-in. You pay only for connected call minutes from prepaid credit, and you can stop any time.' },
      { q: 'Do I need more than one agent?', a: 'Usually not at first. Each agent works in one mode, instant lead calling or bulk campaigns, so add a second only for a genuinely different job, each with its own script, voice and number.' },
    ],
    compare: {
      eyebrow: 'Compare plans',
      title: 'Same agent, same features. Choose the voice.',
      text: 'Every plan has the same features and no monthly or agent fee. The plan sets the voice quality and the per-minute rate, and you can change it per agent any time.',
      columns: ['Voice Starter', 'Voice Growth', 'Voice Premium'],
      rows: [
        { feature: 'Call rate (per connected minute)', values: ['₹5', '₹8', '₹11'] },
        { feature: 'Voice quality', values: ['Budget-friendly', 'Step up in naturalness', 'Most lifelike'] },
        { feature: 'Best for', values: ['Day-to-day and high-volume reminder calls', 'Great everyday quality', 'Hot new leads, first impressions'] },
        { feature: 'Live the same day', values: [true, true, true] },
        { feature: 'Dedicated +91 calling line (DLT-registered)', values: [true, true, true] },
        { feature: 'Calling credit when your agent goes live', values: ['₹500', '₹500', '₹500'] },
        { feature: 'Bulk campaigns', values: ['Up to 20 calls at a time', 'Up to 20 calls at a time', 'Up to 20 calls at a time'] },
        { feature: 'Native Telugu, switching to English mid-call', values: [true, true, true] },
        { feature: 'Automatic transcripts and call summaries', values: [true, true, true] },
        { feature: 'CRM, webhook and Pabbly Connect integrations', values: [true, true, true] },
        { feature: 'Google Calendar booking mid-call', values: [true, true, true] },
        { feature: 'WhatsApp confirmations and follow-ups', values: [true, true, true] },
        { feature: '99.9% uptime SLA', values: [true, true, true] },
        { feature: 'Setup fee / lock-in contract', values: ['None', 'None', 'None'] },
      ],
      versus: {
        title: 'AI voice agent vs. hiring a telecaller',
        columns: ['BrandiQue voice agent', 'Telecaller'],
        rows: [
          { feature: 'Cost', values: ['Pay only per minute, from ₹5/min', 'Around ₹18,000 a month'] },
          { feature: 'Recruitment cost', values: ['None', '₹5,000–₹20,000 per hire'] },
          { feature: 'Training time', values: ['Same day', '2–6 weeks'] },
          { feature: 'Hours covered', values: ['24/7, all year', 'One shift, minus leave'] },
          { feature: 'Calls at once', values: ['Up to 20 in bulk campaigns', 'One'] },
          { feature: 'Attrition', values: ['None', 'High in this role'] },
          { feature: 'Call notes', values: ['Every call, automatically', 'When there is time'] },
          { feature: 'Scaling up', values: ['Change a setting', 'Hire again'] },
        ],
        note: 'The comparison is not exact: a person handles genuinely new situations better than any AI today. The best setup is the agent taking the repetitive, time-critical calls while your team spends its time on conversations that need judgement.',
      },
    },
    ctaTitle: 'Every lead deserves a call within a minute.',
    ctaText: 'Tell us who you need to call and what the agent should say. We will show you how a voice agent would handle it, free.',
    inquiry: 'Voice Calling AI Agents',
  },
};
