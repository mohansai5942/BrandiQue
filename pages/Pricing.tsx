import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CircleHelp, MessageCircle, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import GrowthOffers from '../components/GrowthOffers';

const Pricing: React.FC = () => (
  <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
    <section className="relative px-4 md:px-6 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_55%)]" />
      <div className="relative max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.22em] uppercase text-yellow-600 dark:text-yellow-300">
            <BadgeCheck size={14} /> BrandiQue · Pricing
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Clear pricing.<br /><span className="text-yellow-500">No guesswork.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Explore starting packages for websites, branding, content and automation. Pick a practical starting point; we will confirm your requirements, scope and timeline before any work begins.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a href="#packages" className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 font-bold text-black hover:bg-yellow-300 transition-colors">
              Explore packages <ArrowRight size={17} />
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-6 py-3.5 font-semibold hover:border-yellow-400/60 transition-colors">
              Request a custom quote
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-yellow-500" /> Defined deliverables</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-yellow-500" /> Scope confirmed upfront</span>
            <span className="inline-flex items-center gap-2"><MessageCircle size={15} className="text-yellow-500" /> Custom quotes available</span>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <div id="packages" className="scroll-mt-24">
      <GrowthOffers showHeading={false} />
    </div>

    <section className="px-4 md:px-6 pt-12 md:pt-16">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
        <ScrollReveal>
          <div className="h-full rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1017] p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300 flex items-center justify-center"><ShieldCheck size={22} /></div>
            <h2 className="mt-5 text-xl font-bold">What the price includes</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Each package lists its included deliverables and revision scope. Final requirements, milestones and delivery dates are confirmed in writing before the project starts.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay="delay-100">
          <div className="h-full rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1017] p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300 flex items-center justify-center"><CircleHelp size={22} /></div>
            <h2 className="mt-5 text-xl font-bold">Need something custom?</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">E-commerce, advanced integrations, extra pages, custom dashboards and larger marketing campaigns are quoted after requirements are understood.</p>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-yellow-600 dark:text-yellow-300 hover:gap-3 transition-all">Talk through your project <ArrowRight size={16} /></Link>
          </div>
        </ScrollReveal>
      </div>
      <p className="max-w-4xl mx-auto mt-8 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-500 px-2">
        All prices are indicative starting prices. Applicable taxes, domain and hosting, paid themes/plugins, third-party licences, messaging/API usage, ad spend and other external charges are excluded unless explicitly included in a written quote.
      </p>
    </section>
  </div>
);

export default Pricing;
