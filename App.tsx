import SEO from './components/SEO';
import { redirects } from './seo/site';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClickSpark from './components/ClickSpark';
import FloatingPromotions from './components/FloatingPromotions';
import { whenIdle } from './firestoreClient';
import { lazyWidget } from './lazyRoute';
import {
  Home, About, Contact, WebDevelopment, Projects, Services, Pricing, Solutions, Referral, RoiCalculator, AIAutomation,
  GraphicDesign, VoiceAIAgents, PrivacyPolicy, TermsAndConditions, CookiePolicy, NotFound, preloadAllRoutes,
} from './routes';

// Loaded in their own chunks so they never hold up the first paint.
const DarlingAIChatbot = lazyWidget(() => import('./components/DarlingAIChatbot'));
const SplashCursor = lazyWidget(() => import('./components/SplashCursor'));

// The fluid cursor effect is desktop-only (SplashCursor renders nothing on phones/tablets), so phones
// never download it; on desktop it is started once the page is idle.
const isMobileUA = () =>
  typeof navigator !== 'undefined' &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || navigator.vendor || (window as any).opera || '');

const IdleExtras: React.FC = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => whenIdle(() => {
    setReady(true);
    // Warm the other pages so later navigation is instant.
    preloadAllRoutes();
  }, 2500), []);
  if (!ready || isMobileUA()) return null;
  return (
    <Suspense fallback={null}>
      <SplashCursor />
    </Suspense>
  );
};

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Calculate offset to account for fixed navbar
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

const AdminDashboardRedirect: React.FC = () => {
  useEffect(() => {
    window.location.replace('https://data.brandique.in');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 text-gray-700 dark:text-gray-200">
      <p>Opening BrandiQue Admin Dashboard…</p>
    </div>
  );
};

// Renders its children only after the first client render. Used for client-only widgets so the
// prerendered HTML and the first client render are identical (required for hydration).
const AfterMount: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
};

/** The whole site inside the router. Shared by the browser (App) and the prerender (seo/render.tsx),
 *  so the prerendered HTML matches the first client render and React can hydrate it in place. */
export const AppLayout: React.FC = () => {
  return (
    <>
      <SEO />
      <IdleExtras />
      <ScrollToTop />
      <ClickSpark
        sparkColor="#e8eb14"
        sparkSize={28}
        sparkRadius={70}
        sparkCount={9}
        duration={700}
        className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white selection:bg-neon-purple selection:text-white transition-colors duration-300"
      >
        <Navbar />
        
        <main id="main-content" className="flex-grow">
          <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/projects" element={<Projects />} />
            
            {/* Service Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/roi-calculator" element={<RoiCalculator />} />
            <Route path="/services/ai-automation" element={<AIAutomation />} />
            <Route path="/services/graphic-design" element={<GraphicDesign />} />
            <Route path="/services/voice-ai-agents" element={<VoiceAIAgents />} />

            {/* Legacy admin URLs now permanently redirect to the dedicated data dashboard. */}
            <Route path="/login" element={<AdminDashboardRedirect />} />
            <Route path="/admin" element={<AdminDashboardRedirect />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            {/* Catch-all route */}
            {Object.entries(redirects).map(([from,to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>

        <Footer />
        <FloatingPromotions />
        <AfterMount>
          <Suspense fallback={null}>
            <DarlingAIChatbot isIntroFinished={true} />
          </Suspense>
        </AfterMount>
      </ClickSpark>
    </>
  );
};

// React Router 7: startTransition navigation is the default (it was the v7_startTransition future flag).
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;