import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, Code2, Palette, Repeat, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const packages = [
  {
    name: 'Website Starter',
    price: '₹9,000',
    suffix: 'one-time · starting at',
    description: 'A polished, mobile-first starter site that explains your offer clearly and gives visitors a straightforward way to enquire.',
    icon: Code2,
    featured: false,
    items: ['Up to 3 agreed pages', 'Responsive layout and clear calls to action', 'Contact or enquiry form setup', 'Basic on-page SEO essentials', 'One consolidated revision round'],
    note: 'Domain, hosting, paid themes/plugins and third-party licences are billed separately where needed.',
    href: '/web-development',
    cta: 'Explore website packages',
  },
  {
    name: 'Business Website',
    price: '₹15,000',
    suffix: 'one-time · up to 5 pages',
    description: 'A fuller business website for teams that need clear service pages, stronger credibility and a structured enquiry path.',
    icon: Code2,
    featured: false,
    items: ['Up to 5 agreed pages', 'Responsive service and about sections', 'Enquiry form and contact calls to action', 'Basic on-page SEO essentials', 'Handover and one consolidated revision round'],
    note: 'Domain, hosting, paid themes/plugins and third-party licences are billed separately where needed.',
    href: '/web-development',
    cta: 'Compare website packages',
  },
  {
    name: 'Enquiry Automation',
    price: '₹12,000',
    suffix: 'one-time · scoped setup',
    description: 'Reduce repetitive admin by connecting a defined enquiry source to a simple, trackable follow-up workflow.',
    icon: Bot,
    featured: true,
    items: ['One agreed lead-capture workflow', 'Google Sheets lead tracking', 'One notification or handoff step', 'Testing and documented handover', 'A clear path for future integrations'],
    note: 'API, messaging, hosting and AI usage charges are excluded and approved before work starts.',
    href: '/services/ai-automation',
    cta: 'Explore automation',
  },
  {
    name: 'Graphic Design Starter',
    price: '₹4,500',
    suffix: 'one-time · starter pack',
    description: 'A focused batch of on-brand visuals for businesses that need polished creative assets without a full retainer.',
    icon: Palette,
    featured: false,
    items: ['Up to 5 agreed static design assets', 'Sizes for the agreed platforms', 'Consistent use of supplied brand direction', 'Final PNG/JPG exports', 'One consolidated revision round'],
    note: 'Copywriting, editable source files, stock assets and additional revisions are quoted separately where needed.',
    href: '/services/graphic-design',
    cta: 'Explore graphic design',
  },
  {
    name: 'Brand Identity Starter',
    price: '₹8,000',
    suffix: 'one-time · defined identity scope',
    description: 'Create a consistent visual starting point so your business looks recognisable across digital touchpoints.',
    icon: Sparkles,
    featured: false,
    items: ['Primary logo direction and one variation', 'Practical colour palette and typography pairing', 'Mini brand usage guide', 'Digital-ready exports for agreed use cases', 'One consolidated refinement round'],
    note: 'Naming, extensive research, packaging systems and editable source files can require a separate quote.',
    href: '/services/branding',
    cta: 'Explore brand identity',
  },
  {
    name: 'Content Creative Retainer',
    price: '₹5,000',
    suffix: 'per month · starter plan',
    description: 'Maintain a consistent social presence with a small, planned batch of brand-aligned static content.',
    icon: Sparkles,
    featured: false,
    items: ['8 static social creatives per month', 'A simple monthly content outline', 'Basic caption prompts for each creative', 'One consolidated revision round per batch', 'Consistent use of your brand assets'],
    note: 'Video editing, daily publishing, community management, influencer fees and ad spend are excluded.',
    href: '/services/digital-marketing',
    cta: 'Explore content services',
  },
  {
    name: 'Website Care',
    price: '₹2,000',
    suffix: 'per month · retainer',
    description: 'Keep a business website maintained through small agreed updates and routine checks.',
    icon: Repeat,
    featured: false,
    items: ['Up to 2 hours of small updates monthly', 'Enquiry-form and key-page checks', 'Agreed backup or update checklist', 'Monthly change summary', 'Support within agreed working hours'],
    note: 'Hosting, licence renewals, emergency recovery and redesigns are not included unless quoted.',
    href: '/contact',
    cta: 'Discuss a care plan',
  },
];

interface GrowthOffersProps { showHeading?: boolean; }

const GrowthOffers: React.FC<GrowthOffersProps> = ({ showHeading = true }) => (
  <section className="relative py-20 md:py-28 px-4 md:px-6 bg-white dark:bg-[#080A0F] border-y border-gray-200 dark:border-white/5">
    <div className="max-w-[1320px] mx-auto">
      {showHeading && (
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-600 dark:text-yellow-300">
              <Sparkles size={14} /> Clear scope. Clear pricing.
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Practical digital systems.<br /><span className="text-yellow-500">Built around business goals.</span>
            </h2>
            <p className="mt-5 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
              Start with the one thing your business needs now—then add capabilities as the business grows. Every project begins with an agreed scope, timeline and deliverables.
            </p>
          </div>
        </ScrollReveal>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {packages.map((pkg, index) => (
          <ScrollReveal key={pkg.name} delay={`delay-${(index % 3) * 100}`} className={index === packages.length - 1 && packages.length % 3 === 1 ? 'xl:col-start-2' : undefined}>
            <article className={`relative h-full rounded-[28px] p-6 md:p-8 border flex flex-col transition-all duration-300 hover:-translate-y-1 ${pkg.featured ? 'border-yellow-400/60 bg-[#11130F] text-white shadow-[0_18px_70px_rgba(234,179,8,0.10)]' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0D1017] text-gray-900 dark:text-white'}`}>
              {pkg.featured && <span className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black tracking-wider text-black uppercase">Workflow starter</span>}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pkg.featured ? 'bg-yellow-400 text-black' : 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-300'}`}>
                <pkg.icon size={24} />
              </div>
              <h3 className="mt-6 text-xl md:text-2xl font-bold">{pkg.name}</h3>
              <p className={`mt-3 text-sm leading-relaxed min-h-[72px] ${pkg.featured ? 'text-white/65' : 'text-gray-600 dark:text-gray-400'}`}>{pkg.description}</p>
              <div className="mt-6 border-y border-current/10 py-5">
                <div className="text-3xl md:text-4xl font-black tracking-tight">{pkg.price}</div>
                <div className={`mt-1 text-xs ${pkg.featured ? 'text-white/55' : 'text-gray-500 dark:text-gray-400'}`}>{pkg.suffix}</div>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {pkg.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><Check size={17} className="mt-0.5 text-yellow-500 shrink-0" /><span>{item}</span></li>)}
              </ul>
              <p className={`mt-6 text-xs leading-relaxed ${pkg.featured ? 'text-white/50' : 'text-gray-500 dark:text-gray-400'}`}>{pkg.note}</p>
              <Link to={pkg.href} className={`mt-7 inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${pkg.featured ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-black dark:bg-white/10 dark:hover:bg-yellow-400 dark:hover:text-black'}`}>
                {pkg.cta}<ArrowRight size={17} />
              </Link>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
        Indicative starting prices for clearly scoped work. Final quote depends on requirements. External services, taxes and ongoing third-party costs are quoted separately.
      </p>
    </div>
  </section>
);

export default GrowthOffers;
