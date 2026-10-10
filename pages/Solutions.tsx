import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MessageCircle, Bot, Code2, Palette } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import IndustrySolutions from '../components/IndustrySolutions';
import GrowthPlans from '../components/GrowthPlans';
import { useInquiry } from '../context/InquiryContext';

const LAYERS = [
  { icon: Palette, title: 'Design', text: 'A brand and social presence that looks trusted before anyone calls you.' },
  { icon: Code2, title: 'Website', text: 'A fast website that explains your offer and turns visitors into enquiries.' },
  { icon: Bot, title: 'AI & Automation', text: 'An AI assistant and workflows that reply, follow up and log every lead.' },
  { icon: MessageCircle, title: 'Monthly growth', text: 'Ongoing updates, creatives and reports so results keep improving.' },
];

const Solutions: React.FC = () => {
  const { openInquiry } = useInquiry();
  return (
    <div className="min-h-screen pt-32 md:pt-40 bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <section className="relative px-4 md:px-6 pb-8 md:pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_55%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.22em] uppercase text-yellow-600 dark:text-yellow-300">
              <Layers size={14} /> Industry Solutions
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              One growth system.<br /><span className="text-yellow-500">Made for your business.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Instead of buying a website from one agency, a chatbot from another and designs from a freelancer, get all three working together, set up for how your industry actually gets customers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button type="button" onClick={() => openInquiry('Free Growth Audit')} className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 font-bold text-black hover:bg-yellow-300 transition-colors">
                Get a free growth audit <ArrowRight size={17} />
              </button>
              <Link to="/pricing" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-6 py-3.5 font-semibold hover:border-yellow-400/60 transition-colors">
                See all pricing
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 md:px-6 pt-10">
        <div className="max-w-6xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((layer, index) => (
            <ScrollReveal key={layer.title} delay={`delay-${index * 100}`}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#0D1017]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><layer.icon size={20} /></span>
                  <span className="text-xs font-bold text-gray-400">0{index + 1}</span>
                </div>
                <h2 className="mt-4 font-bold">{layer.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{layer.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <IndustrySolutions />
      <GrowthPlans />
    </div>
  );
};

export default Solutions;
