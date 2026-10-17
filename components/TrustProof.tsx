import React from 'react';
import CountUp from './CountUp';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { INITIAL_PROJECTS } from '../pages/ProjectsData';
import { INITIAL_N8N_PROJECTS } from '../pages/N8nProjectsData';

const STACK = ['React', 'Next.js', 'WordPress', 'n8n', 'WhatsApp Cloud API', 'Telegram Bots', 'Google Gemini', 'OpenAI', 'Firebase', 'Google Sheets', 'Figma', 'Adobe Illustrator'];

// Real, verifiable numbers only: counts come from the live portfolio data.
const TrustProof: React.FC = () => {
  const { projects, n8nProjects } = useSiteSettings();
  const projectCount = Math.max(projects.filter(p => !p.isDeleted).length, INITIAL_PROJECTS.length);
  const workflowCount = Math.max((n8nProjects || []).filter(p => !p.isDeleted).length, INITIAL_N8N_PROJECTS.length);

  const stats = [
    { value: `${projectCount}+`, label: 'Websites & design projects in our portfolio' },
    { value: `${workflowCount}+`, label: 'AI agents & automation workflows built' },
    { value: '3-in-1', label: 'Web, AI and design under one roof' },
    { value: '100%', label: 'Code, designs and workflows handed to you' },
  ];

  return (
    <section aria-label="Why businesses trust BrandiQue" className="relative border-y border-gray-200 bg-white py-12 md:py-20 dark:border-white/5 dark:bg-[#080A0F]">
      <div className="mx-auto max-w-[100rem] px-5 md:px-8 desk:px-12 2xl:px-16">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-yellow-700 dark:text-yellow-300">Real work. Real numbers.</p>
        <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {stats.map(stat => (
            <div key={stat.label} className="motion-card glass rounded-3xl p-5 md:p-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl"><CountUp value={stat.value} /></dd>
              <dd className="mt-3 text-xs leading-snug text-gray-600 dark:text-gray-300 md:text-sm">{stat.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-white/10">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400">Built with tools trusted by modern businesses</p>
          <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-marquee-half">
              {[...STACK, ...STACK].map((tool, i) => (
                <span key={`${tool}-${i}`} aria-hidden={i >= STACK.length ? true : undefined} className="mr-3 whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustProof;
