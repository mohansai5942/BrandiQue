import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, FileCheck2, KeyRound, LifeBuoy, MessageCircle, Repeat2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { founder, COMPANY } from '../seo/site';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { whatsappLink } from '../data/offers';

const COMMITMENTS = [
  { icon: Clock3, title: 'Reply within one working day', text: 'Every enquiry gets a personal response, not an autoresponder.' },
  { icon: FileCheck2, title: 'Fixed written quote', text: 'Scope, timeline and price agreed in writing before work starts.' },
  { icon: Repeat2, title: 'Progress you can see', text: 'Regular updates and preview links while your project is being built.' },
  { icon: KeyRound, title: 'You own everything', text: 'Domain, code, designs and workflows are handed over to you.' },
  { icon: LifeBuoy, title: 'Support after launch', text: 'Post-launch fixes included, with monthly plans when you want more.' },
];

const FounderPromise: React.FC = () => {
  const { settings } = useSiteSettings();
  const waHref = whatsappLink(settings.whatsapp, 'Hi Mohan, I would like to discuss a project for my business.');
  return (
    <section id="why-brandique" className="scroll-mt-24 py-20 md:py-28 bg-white dark:bg-[#080A0F] border-y border-gray-200 dark:border-white/5">
      <div className="mx-auto grid max-w-[100rem] gap-12 px-5 md:px-8 desk:px-12 2xl:px-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-white/10 dark:bg-[#0D1017]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <img src={founder.image} alt={`${founder.name}, Founder of ${COMPANY}`} loading="lazy" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-yellow-400/40" />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{founder.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Founder, {COMPANY}</div>
              </div>
            </div>
            <blockquote className="relative mt-6 text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
              “Most small businesses don't need a bigger agency. They need one accountable team that builds the website, automates the follow-up and makes the brand look right. That's what we built BrandiQue to be. When you work with us, you work directly with the people building your system.”
            </blockquote>
            <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-500"><MessageCircle size={16} /> Talk to Mohan on WhatsApp</a>
              <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-yellow-400/60 dark:border-white/15 dark:text-gray-200">Our story <ArrowRight size={15} /></Link>
            </div>
          </div>
        </ScrollReveal>
        <div>
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">Our commitments</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Working with us <span className="text-yellow-500">feels different.</span></h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">No vague timelines, surprise invoices or disappearing developers. These are the standards every BrandiQue project runs on.</p>
          </ScrollReveal>
          <div className="mt-8 space-y-3">
            {COMMITMENTS.map((item, i) => (
              <ScrollReveal key={item.title} delay={`delay-${i * 50}`}>
                <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-[#0D1017]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"><item.icon size={20} /></span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderPromise;
