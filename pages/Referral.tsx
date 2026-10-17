import React from 'react';
import { Users, MessageCircle, ArrowRight, HandCoins, PhoneCall, BadgeCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero, { btnPrimary, SectionHeading } from '../components/ui/PageHero';
import { whatsappLink } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useInquiry } from '../context/InquiryContext';

const STEPS = [
  {
    icon: PhoneCall,
    title: '1. Send us the referral',
    text: 'Share the business name, owner name and phone number in a one-step form or on WhatsApp. No paperwork.',
  },
  {
    icon: Users,
    title: '2. We do the selling',
    text: 'We call them, run a free growth audit, send a fixed quote and close the project. You don’t lift a finger.',
  },
  {
    icon: HandCoins,
    title: '3. You earn 10%',
    text: 'When they pay for their first project, 10% of the project value is yours — sent via UPI or bank transfer.',
  },
];

const Referral: React.FC = () => {
  const { settings } = useSiteSettings();
  const { openInquiry } = useInquiry();
  const openReferral = (source: string) => openInquiry('Referral Program', 'Refer a business', {
    extra: { Reward: '10% of first project value' }, source,
    businessLabel: 'Business you are referring',
    messageLabel: 'Their contact details',
    messagePlaceholder: 'Owner name, phone number and what they need (website, AI agent, design ...)',
    submitLabel: 'Send referral',
  });
  const waHref = whatsappLink(
    settings.whatsapp,
    'Hi BrandiQue, I want to refer a business.\nName:\nBusiness:\nPhone:'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <PageHero
        eyebrow="Referral program"
        eyebrowIcon={Users}
        title="Refer a business."
        highlight="Earn 10%."
        description="Know a business that needs a website, an AI agent or better design? Refer them to BrandiQue and earn 10% of their first project value — for doing nothing more than an introduction."
        actions={<>
          <button type="button" onClick={() => openReferral('Referral page · hero')} className={btnPrimary}>
            Refer a business <ArrowRight size={18} />
          </button>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline dark:text-green-400">
            <MessageCircle size={16} /> Refer on WhatsApp
          </a>
        </>}
      />

      <section className="px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-[100rem]">
          <ScrollReveal>
            <SectionHeading
              eyebrow="How it works"
              title={<>Three steps. <span className="text-yellow-400">Zero effort.</span></>}
            />
          </ScrollReveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-3 md:gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <ScrollReveal key={step.title} delay={`delay-${index * 100}`}>
                <div className="h-full rounded-[28px] border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 dark:border-white/10 dark:bg-[#0D1017] md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300">
                    <step.icon size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay="delay-200">
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-yellow-400/25 bg-yellow-400/5 p-6 text-center md:p-8">
              <BadgeCheck size={28} className="mx-auto text-yellow-500" />
              <h3 className="mt-4 text-xl font-bold">The fine print (short and fair)</h3>
              <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <li>· Your 10% is paid after the referred client pays their first invoice.</li>
                <li>· No cap — refer five businesses, earn on all five.</li>
                <li>· Works for websites, AI agents, design and industry solutions.</li>
                <li>· We treat your contact with respect — no spam, ever.</li>
              </ul>
              <button type="button" onClick={() => openReferral('Referral page · fine print')} className={`${btnPrimary} mt-6`}>
                Refer now <ArrowRight size={18} />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Referral;
