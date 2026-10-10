import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, Code2, Palette, Sparkles, Workflow, LayoutTemplate, PenTool, Megaphone } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const PRIMARY_SERVICES = [
  {
    number: '01',
    title: 'Web Development',
    eyebrow: 'Turn attention into enquiries',
    description: 'Fast, responsive websites built to explain your offer, earn trust and make the next step obvious—from a focused landing page to a custom business platform.',
    icon: Code2,
    href: '/web-development',
    points: ['Custom React and WordPress builds', 'Mobile-first UX and technical SEO foundations', 'Clear enquiry and conversion journeys'],
    accent: 'from-cyan-400/20 via-blue-500/10 to-transparent',
    iconClass: 'text-cyan-300',
  },
  {
    number: '02',
    title: 'AI Agents & Automations',
    eyebrow: 'Give repetitive work to systems',
    description: 'Practical AI assistants and connected workflows that capture leads, answer routine questions and move information between the tools your business already uses.',
    icon: Bot,
    href: '/services/ai-automation',
    points: ['Website, Telegram and WhatsApp chatbot solutions', 'n8n workflows, APIs and webhooks', 'Human handoff, testing and documented setup'],
    accent: 'from-violet-400/20 via-fuchsia-500/10 to-transparent',
    iconClass: 'text-violet-300',
  },
  {
    number: '03',
    title: 'Graphic Design',
    eyebrow: 'Look credible at every touchpoint',
    description: 'Consistent, polished visuals for brands that need to stand out—social creatives, ad assets, thumbnails, presentations and practical brand collateral.',
    icon: Palette,
    href: '/services/graphic-design',
    points: ['Social posts, ads and campaign creatives', 'Thumbnails, banners and presentation visuals', 'Brand-aligned exports with clear deliverables'],
    accent: 'from-amber-300/20 via-orange-400/10 to-transparent',
    iconClass: 'text-amber-300',
  },
];

const SUPPORTING_SERVICES = [
  { title: 'WordPress & CMS', text: 'Manageable websites your team can update.', icon: LayoutTemplate, href: '/services/wordpress' },
  { title: 'Brand Identity', text: 'Logo direction, visual systems and guidelines.', icon: PenTool, href: '/services/branding' },
  { title: 'Content & Digital Marketing', text: 'Content planning and campaign creative support.', icon: Megaphone, href: '/services/digital-marketing' },
];

const Services: React.FC = () => (
  <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-6 bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
    <section className="relative max-w-6xl mx-auto text-center pb-14 md:pb-20">
      <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-3xl rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
      <ScrollReveal>
        <span className="relative inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-yellow-700 dark:text-yellow-300">
          <Sparkles size={14} /> Three clear ways to grow
        </span>
        <h1 className="relative mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Build better.<br /><span className="text-yellow-500">Grow smarter.</span>
        </h1>
        <p className="relative mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          BrandiQue combines websites, AI-powered operations and high-quality design into practical digital systems. Start with the problem you need to solve—not a long list of services.
        </p>
        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/pricing" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 font-bold text-black transition-colors hover:bg-yellow-300">
            Explore pricing <ArrowRight size={17} />
          </Link>
          <Link to="/contact" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-6 py-3.5 font-semibold transition-colors hover:border-yellow-400/60">
            Discuss your project
          </Link>
        </div>
      </ScrollReveal>
    </section>

    <section className="max-w-6xl mx-auto grid gap-5 lg:gap-6 lg:grid-cols-3">
      {PRIMARY_SERVICES.map((service, index) => (
        <ScrollReveal key={service.number} delay={index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0D1017]">
            <div className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${service.accent} opacity-70 pointer-events-none`} />
            <div className="relative flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 ${service.iconClass}`}>
                <service.icon size={25} />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400">{service.number}</span>
            </div>
            <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 dark:text-yellow-300">{service.eyebrow}</p>
            <h2 className="relative mt-3 text-2xl font-bold tracking-tight">{service.title}</h2>
            <p className="relative mt-4 min-h-[112px] text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.description}</p>
            <ul className="relative mt-6 space-y-3">
              {service.points.map(point => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-yellow-500" /> {point}
                </li>
              ))}
            </ul>
            <Link to={service.href} className="relative mt-8 inline-flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400">
              Explore service <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </article>
        </ScrollReveal>
      ))}
    </section>

    <section className="max-w-6xl mx-auto mt-16 md:mt-24">
      <ScrollReveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">Additional capabilities</p>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight">The right support, when you need it.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">Need a specific platform, a consistent brand identity or help planning content? These supporting services fit around the three core offerings.</p>
        </div>
      </ScrollReveal>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {SUPPORTING_SERVICES.map((service, index) => (
          <ScrollReveal key={service.title} delay={index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}>
            <Link to={service.href} className="group flex h-full items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-yellow-400/60 dark:border-white/10 dark:bg-[#0D1017]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><service.icon size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{service.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.text}</span>
              </span>
              <ArrowRight size={17} className="mt-1 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-yellow-500" />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>

    <section className="max-w-6xl mx-auto mt-16 md:mt-24">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-[28px] border border-yellow-400/20 bg-gray-100 p-7 md:p-12 dark:bg-[#0D1017]">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
          <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-yellow-700 dark:text-yellow-300"><Workflow size={15} /> A practical first step</span>
              <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight">Want all three working together?</h2>
              <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">Our industry solutions combine a website, WhatsApp AI assistant, automations and design into one package for coaching centres, clinics, local businesses and new brands, with one setup price and one monthly plan.</p>
            </div>
            <div className="relative flex flex-col gap-3">
              <Link to="/solutions" className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 font-bold text-black transition-colors hover:bg-yellow-300">See industry solutions <ArrowRight size={17} /></Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-6 py-3.5 font-semibold transition-colors hover:border-yellow-400/60">Plan a custom project</Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>
);

export default Services;
