import React from 'react';

interface PageHeroProps {
  eyebrow: string;
  eyebrowIcon?: React.ElementType;
  title: React.ReactNode;
  highlight?: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  children?: React.ReactNode;
  accent?: 'yellow' | 'cyan' | 'violet' | 'amber' | 'emerald';
}

const GLOW: Record<NonNullable<PageHeroProps['accent']>, string> = {
  yellow: 'bg-yellow-400/10',
  cyan: 'bg-cyan-400/15',
  violet: 'bg-violet-500/15',
  amber: 'bg-amber-400/15',
  emerald: 'bg-emerald-400/15',
};
const HIGHLIGHT: Record<NonNullable<PageHeroProps['accent']>, string> = {
  yellow: 'from-yellow-400 via-amber-300 to-yellow-500',
  cyan: 'from-cyan-500 via-sky-400 to-blue-500',
  violet: 'from-violet-500 via-fuchsia-400 to-purple-500',
  amber: 'from-amber-400 via-orange-400 to-rose-400',
  emerald: 'from-emerald-500 via-teal-400 to-cyan-500',
};

/** Shared hero used by every BrandiQue page so the site reads as one product. */
const PageHero: React.FC<PageHeroProps> = ({ eyebrow, eyebrowIcon: Icon, title, highlight, description, actions, visual, children, accent = 'yellow' }) => (
  <section className="relative overflow-hidden bg-gray-50 pb-8 pt-[6.75rem] dark:bg-[#05070A] md:pb-20 md:pt-36 desk:pt-40">
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
    <div className={`pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full blur-[140px] ${GLOW[accent]}`} />
    <div className={`relative z-10 mx-auto grid max-w-[100rem] items-center gap-6 md:gap-12 px-5 md:px-8 desk:px-12 2xl:px-16 ${visual ? 'desk:grid-cols-[1.05fr_0.95fr]' : ''}`}>
      <div className={visual ? '' : 'mx-auto max-w-4xl text-center'}>
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300 md:text-[11px]">
          {Icon && <Icon size={13} />} {eyebrow}
        </span>
        <h1 className="mt-6 text-[2.4rem] font-bold leading-[1.06] tracking-tight text-gray-900 dark:text-white sm:text-5xl desk:text-[4rem]">
          {title}{highlight && <> <span className={`bg-gradient-to-r bg-clip-text text-transparent ${HIGHLIGHT[accent]}`}>{highlight}</span></>}
        </h1>
        <p className={`mt-6 text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg ${visual ? 'max-w-xl' : 'mx-auto max-w-2xl'}`}>{description}</p>
        {actions && <div className={`mt-6 md:mt-8 flex flex-row flex-wrap gap-2.5 md:gap-3 ${visual ? '' : 'justify-center'}`}>{actions}</div>}
        {children}
      </div>
      {visual && (
        <div className="relative mx-auto w-full max-w-[32rem]">
          <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-yellow-400/15 via-transparent to-violet-500/15 blur-2xl" />
          <div className="relative h-[21rem] sm:h-[25rem]">{visual}</div>
        </div>
      )}
    </div>
  </section>
);

export const btnPrimary = 'group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm md:px-7 md:py-4 md:text-base font-bold text-black shadow-[0_12px_40px_rgba(234,179,8,0.3)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300';
export const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm md:px-7 md:py-4 md:text-base font-bold text-gray-900 transition-colors hover:border-yellow-400 dark:border-white/15 dark:bg-white/5 dark:text-white';

export const SectionHeading: React.FC<{ eyebrow: string; title: React.ReactNode; text?: React.ReactNode; center?: boolean }> = ({ eyebrow, title, text, center = true }) => (
  <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">{title}</h2>
    {text && <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">{text}</p>}
  </div>
);

export default PageHero;
