import React from 'react';
import { Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero, { btnPrimary, btnSecondary, SectionHeading } from '../components/ui/PageHero';
import RoiCalculator from '../components/RoiCalculator';
import Memberships from '../components/Memberships';
import { whatsappLink } from '../data/offers';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useInquiry } from '../context/InquiryContext';

const RoiCalculatorPage: React.FC = () => {
  const { openInquiry } = useInquiry();
  const { settings } = useSiteSettings();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white transition-colors duration-300">
      <PageHero
        eyebrow="ROI calculator"
        eyebrowIcon={Calculator}
        title="Every missed enquiry"
        highlight="has a price tag."
        description="Move the sliders to your reality. Most businesses are shocked at the monthly number — then they fix it with an AI agent that replies in seconds, day and night."
        actions={<>
          <a href="#calculator" className={btnPrimary}>Calculate my loss <ArrowRight size={18} /></a>
          <a href={whatsappLink(settings.whatsapp, 'Hi BrandiQue, I used your ROI calculator and want to discuss recovering my lost enquiries.')} target="_blank" rel="noopener noreferrer" className={btnSecondary}><MessageCircle size={18} /> Discuss on WhatsApp</a>
        </>}
      />

      <div id="calculator" className="scroll-mt-24">
        <RoiCalculator />
      </div>

      <section className="px-5 pb-12 md:px-8 md:pb-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <SectionHeading
              eyebrow="The fix"
              title={<>An AI agent that <span className="metallic-gold">never sleeps.</span></>}
              text="Replies in seconds on WhatsApp, your website or Telegram. Captures every lead. Follows up automatically. You approve the answers — it does the chasing."
            />
          </ScrollReveal>
          <ScrollReveal delay="delay-100">
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => openInquiry('AI Automation & Agents', 'AI Chatbot')} className={btnPrimary}>
                Get my AI agent <ArrowRight size={18} />
              </button>
              <a href={whatsappLink(settings.whatsapp, 'Hi BrandiQue, I want an AI agent for my business. Please share the details.')} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Memberships />
    </div>
  );
};

export default RoiCalculatorPage;
