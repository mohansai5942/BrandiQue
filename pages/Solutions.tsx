import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MessageCircle, Bot, Code2, Palette } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero, { btnPrimary, btnSecondary } from '../components/ui/PageHero';
import IndustrySolutions from '../components/IndustrySolutions';
import Memberships from '../components/Memberships';
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <PageHero
        eyebrow="Industry solutions"
        eyebrowIcon={Layers}
        title="One growth system,"
        highlight="made for your industry."
        description="Instead of buying a website from one agency, a chatbot from another and designs from a freelancer, get all three working together, set up for how your industry actually gets customers."
        actions={<>
          <button type="button" onClick={() => openInquiry('Free Growth Audit')} className={btnPrimary}>Get a free growth audit <ArrowRight size={18} /></button>
          <Link to="/pricing" className={btnSecondary}>See all pricing</Link>
        </>}
      />

      <section className="px-5 md:px-8 desk:px-12 2xl:px-16 pt-10">
        <div className="max-w-[100rem] mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <Memberships />
    </div>
  );
};

export default Solutions;
