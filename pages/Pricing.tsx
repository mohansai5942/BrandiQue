import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, HelpCircle, MessageCircle, ShieldCheck, FileText, Repeat } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import GrowthOffers from '../components/GrowthOffers';
import GrowthPlans from '../components/GrowthPlans';
import IndustrySolutions from '../components/IndustrySolutions';
import { PRICING_FAQ } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';

const JUMP_LINKS = [
  { label: 'Web Development', href: '#pricing-web' },
  { label: 'AI Agents & Automations', href: '#pricing-ai' },
  { label: 'Graphic Design', href: '#pricing-design' },
  { label: 'Monthly Plans', href: '#growth-plans' },
  { label: 'Industry Solutions', href: '#solutions' },
];

const HOW_IT_WORKS = [
  { icon: MessageCircle, title: '1. Free 20-minute call', text: 'Tell us what you sell, who you sell to and what is slowing you down. We recommend the smallest scope that solves it.' },
  { icon: FileText, title: '2. Fixed written quote', text: 'You get the exact deliverables, timeline and price in writing. No surprises, and nothing starts until you approve.' },
  { icon: Repeat, title: '3. Launch, then grow', text: 'We build and launch with 50% upfront. Afterwards, an optional monthly plan keeps everything updated and improving.' },
];

const Pricing: React.FC = () => {
  const { openInquiry } = useInquiry();
  return (
    <div className="min-h-screen pt-32 md:pt-40 bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <section className="relative px-4 md:px-6 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_55%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.22em] uppercase text-yellow-600 dark:text-yellow-300">
              <BadgeCheck size={14} /> BrandiQue · Pricing
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Transparent pricing.<br /><span className="text-yellow-500">Built to pay for itself.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              One-time packages to launch your website, AI automation or brand, monthly plans to keep it growing, and ready-made solutions for specific industries. Every project starts with a fixed written quote.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 font-bold text-black hover:bg-yellow-300 transition-colors">
                Get a free growth audit <ArrowRight size={17} />
              </button>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-6 py-3.5 font-semibold hover:border-yellow-400/60 transition-colors">
                Request a custom quote
              </Link>
            </div>
            <nav aria-label="Pricing sections" className="mt-10 flex flex-wrap justify-center gap-2">
              {JUMP_LINKS.map(link => (
                <a key={link.href} href={link.href} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-yellow-400/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{link.label}</a>
              ))}
            </nav>
          </ScrollReveal>
        </div>
      </section>

      <GrowthOffers showHeading={false} />
      <GrowthPlans />
      <IndustrySolutions compact />

      <section className="px-4 md:px-6 py-20 md:py-24 bg-white dark:bg-[#080A0F] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">How pricing works</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <ScrollReveal key={step.title} delay={`delay-${index * 100}`}>
                <div className="h-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0D1017] p-6 md:p-8">
                  <div className="w-11 h-11 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300 flex items-center justify-center"><step.icon size={22} /></div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-faq" className="px-4 md:px-6 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">Pricing questions</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRICING_FAQ.map(item => (
              <ScrollReveal key={item.q}>
                <div className="h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1017] p-6">
                  <h3 className="flex items-start gap-2 font-bold"><HelpCircle size={17} className="mt-0.5 shrink-0 text-yellow-500" />{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-yellow-400/25 bg-yellow-400/5 p-6 md:p-8 text-center">
            <ShieldCheck size={26} className="mx-auto text-yellow-500" />
            <p className="mt-3 text-sm md:text-base text-gray-700 dark:text-gray-300">Not sure which package fits? Ask for a free audit and we'll recommend one, even if the answer is the smallest package.</p>
            <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white dark:text-black dark:hover:bg-yellow-400">Get my free audit <ArrowRight size={16} /></button>
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-gray-500 px-2">
            All prices are indicative starting prices in Indian Rupees. Applicable taxes, domain and hosting, paid themes/plugins, third-party licences, messaging/API usage, ad spend and other external charges are excluded unless explicitly included in a written quote.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
