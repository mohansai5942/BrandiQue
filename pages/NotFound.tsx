import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Home, MessageCircle } from 'lucide-react';
import PageHero, { btnPrimary, btnSecondary } from '../components/ui/PageHero';

const POPULAR = [
  { to: '/web-development', label: 'Web development' },
  { to: '/services/ai-automation', label: 'AI agents & automation' },
  { to: '/services/graphic-design', label: 'Graphic design' },
  { to: '/services/voice-ai-agents', label: 'Voice calling AI agents' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/projects', label: 'Projects' },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh]">
      <PageHero
        eyebrow="Error 404"
        eyebrowIcon={Compass}
        title="Page"
        highlight="not found"
        description="The address may have changed, or this page no longer exists. Head back home or jump straight to what you were looking for."
        actions={
          <>
            <Link to="/" className={btnPrimary}>
              <Home size={18} /> Back to home <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className={btnSecondary}>
              <MessageCircle size={18} /> Contact us
            </Link>
          </>
        }
      >
        <nav aria-label="Popular pages" className="mt-8 flex flex-wrap justify-center gap-2">
          {POPULAR.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-yellow-400 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </PageHero>
    </div>
  );
}
