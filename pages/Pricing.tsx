import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, HelpCircle, MessageCircle, ShieldCheck, FileText, Repeat } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero, { btnPrimary, btnSecondary } from '../components/ui/PageHero';
import GrowthOffers from '../components/GrowthOffers';
import Memberships from '../components/Memberships';
import IndustrySolutions from '../components/IndustrySolutions';
import { PRICING_FAQ, whatsappLink } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useInquiry } from '../context/InquiryContext';

const JUMP_LINKS = [
  { label: 'Web Development', href: '#pricing-web' },
  { label: 'AI Agents & Automations', href: '#pricing-ai' },
  { label: 'Graphic Design', href: '#pricing-design' },
  { label: 'Voice AI Agents', href: '#pricing-voice' },
  { label: 'Memberships', href: '#growth-plans' },
  { label: 'Industry Solutions', href: '#solutions' },
];

const HOW_IT_WORKS = [
  { icon: MessageCircle, title: '1. Free 20-minute call', text: 'Tell us what you sell, who you sell to and what is slowing you down. We recommend the smallest scope that solves it.' },
  { icon: FileText, title: '2. Fixed written quote', text: 'You get the exact deliverables, timeline and price in writing. No surprises, and nothing starts until you approve.' },
  { icon: Repeat, title: '3. Launch, then grow', text: 'We build and launch with 50% upfront. Afterwards, an optional monthly plan keeps everything updated and improving.' },
];

const Pricing: React.FC = () => {
  const { openInquiry } = useInquiry();
  const { settings } = useSiteSettings();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <PageHero
        eyebrow="Pricing & memberships"
        eyebrowIcon={BadgeCheck}
        title="Transparent pricing."
        highlight="Built to pay for itself."
        description="One-time packages to launch your design, website or AI automation, voice agent plans billed only per connected minute, monthly memberships to keep it growing, and bundles that save when you use all three. Every project starts with a fixed written quote."
        actions={<>
          <button type="button" onClick={() => openInquiry('Free Growth Audit')} className={btnPrimary}>Get a free growth audit <ArrowRight size={18} /></button>
          <a href={whatsappLink(settings.whatsapp, 'Hi BrandiQue, I have a question about your pricing.')} target="_blank" rel="noopener noreferrer" className={btnSecondary}><MessageCircle size={18} /> Ask on WhatsApp</a>
        </>}
      >
        <nav aria-label="Pricing sections" className="mt-10 flex flex-wrap justify-center gap-2">
          {JUMP_LINKS.map(link => (
            <a key={link.href} href={link.href} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-yellow-400/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{link.label}</a>
          ))}
        </nav>
      </PageHero>

      <GrowthOffers showHeading={false} />
      <Memberships />
      <IndustrySolutions compact />

      <section className="px-5 md:px-8 desk:px-12 2xl:px-16 py-12 md:py-24 bg-white dark:bg-[#080A0F] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-[100rem] mx-auto">
          <ScrollReveal>
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">How pricing works</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-3 md:gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <ScrollReveal key={step.title} delay={`delay-${index * 100}`}>
                <div className="h-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0D1017] p-4 md:p-8">
                  <div className="w-11 h-11 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300 flex items-center justify-center"><step.icon size={22} /></div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-faq" className="px-5 md:px-8 desk:px-12 2xl:px-16 py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">Pricing questions</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRICING_FAQ.map(item => (
              <ScrollReveal key={item.q}>
                <div className="h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1017] p-4 md:p-6">
                  <h3 className="flex items-start gap-2 font-bold"><HelpCircle size={17} className="mt-0.5 shrink-0 text-yellow-500" />{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-yellow-400/25 bg-yellow-400/5 p-4 md:p-8 text-center">
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
