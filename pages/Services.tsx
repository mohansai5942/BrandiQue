import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code2, Bot, Palette, Layers } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PageHero, { SectionHeading, btnPrimary, btnSecondary } from '../components/ui/PageHero';
import { SERVICE_VISUALS } from '../components/ServiceVisuals';
import Memberships from '../components/Memberships';
import FounderPromise from '../components/FounderPromise';
import { PILLARS, MEMBERSHIPS, PillarId } from '../data/offers';
import { useInquiry } from '../context/InquiryContext';

const ICON: Record<PillarId, React.ElementType> = { web: Code2, ai: Bot, design: Palette };
const TONE: Record<PillarId, string> = { web: 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/10', ai: 'text-violet-600 dark:text-violet-300 bg-violet-500/10', design: 'text-amber-600 dark:text-amber-300 bg-amber-400/15' };

const lowestMembership = (id: PillarId) => MEMBERSHIPS.filter(m => m.track === id)[0]?.price;

const Services: React.FC = () => {
  const { openInquiry } = useInquiry();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#05070A] dark:text-white">
      <PageHero
        eyebrow="Our services"
        eyebrowIcon={Layers}
        title="Three services. One team."
        highlight="One growth system."
        description="Websites that win the enquiry, AI agents that reply and follow up automatically, and graphic design that makes you look trusted. Use one, or let all three work together."
        actions={<>
          <button type="button" onClick={() => openInquiry('Free Growth Audit')} className={btnPrimary}>Get a free growth audit <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
          <Link to="/pricing" className={btnSecondary}>View all pricing</Link>
        </>}
      >
        <nav aria-label="Jump to a service" className="mt-10 grid grid-cols-3 gap-2 sm:mx-auto sm:max-w-xl">
          {PILLARS.map(p => { const Icon = ICON[p.id]; return (
            <a key={p.id} href={`#service-${p.id}`} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-4 text-center text-xs font-bold transition-colors hover:border-yellow-400/60 dark:border-white/10 dark:bg-white/5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE[p.id]}`}><Icon size={19} /></span>{p.title}
            </a>
          ); })}
        </nav>
      </PageHero>

      <div className="space-y-6 px-5 pb-12 md:space-y-10 md:px-6 md:pb-28">
        {PILLARS.map((p, i) => {
          const Visual = SERVICE_VISUALS[p.id];
          const Icon = ICON[p.id];
          return (
            <section key={p.id} id={`service-${p.id}`} className="scroll-mt-24 mx-auto max-w-[100rem]">
              <ScrollReveal>
                <div className="grid items-center gap-3 md:gap-8 overflow-hidden glass glass-glow rounded-[32px] p-4 shadow-sm md:p-10 desk:grid-cols-2 desk:gap-12">
                  <div className={i % 2 === 1 ? 'desk:order-2' : ''}>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONE[p.id]}`}><Icon size={24} /></span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Service {p.number}</span>
                    </div>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h2>
                    <p className="mt-2 text-lg font-semibold text-yellow-700 dark:text-yellow-300">{p.outcome}</p>
                    <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{p.description}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {p.points.map(pt => <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"><Check size={16} className="mt-0.5 shrink-0 text-yellow-500" />{pt}</li>)}
                    </ul>
                    <div className="mt-7 grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                      <div><div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Projects from</div><div className="text-2xl font-black">{p.startingAt}</div></div>
                      <div><div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Membership from</div><div className="text-2xl font-black">{lowestMembership(p.id)}<span className="text-sm font-semibold text-gray-500">/mo</span></div></div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link to={p.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-yellow-400 hover:text-black dark:bg-white dark:text-black dark:hover:bg-yellow-400">Explore {p.title} <ArrowRight size={16} /></Link>
                      <Link to={`/pricing#pricing-${p.id}`} className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-yellow-400 dark:border-white/15">See packages</Link>
                    </div>
                  </div>
                  <div className={`h-[20rem] sm:h-[24rem] ${i % 2 === 1 ? 'desk:order-1' : ''}`}><Visual /></div>
                </div>
              </ScrollReveal>
            </section>
          );
        })}
      </div>

      <section className="px-5 pb-12 md:px-6">
        <ScrollReveal><SectionHeading eyebrow="Better together" title={<>Bundle all three <span className="text-yellow-500">and save.</span></>} text="Most growing businesses need all three. Our bundles cost less than buying each membership separately, and one team owns the results." /></ScrollReveal>
      </section>
      <Memberships showHeading={false} initialTrack="bundle" />
      <FounderPromise />
    </div>
  );
};

export default Services;
