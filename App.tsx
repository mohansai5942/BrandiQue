import SEO from './components/SEO';
import PageContext, { Breadcrumbs } from './components/PageContext';
import NotFound from './pages/NotFound';
import { redirects } from './seo/site';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const SplashCursor = lazy(() => import('./components/SplashCursor'));
import ClickSpark from './components/ClickSpark';
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const WebDevelopment = lazy(() => import('./pages/WebDevelopment'));
const Projects = lazy(() => import('./pages/Projects'));
const Services = lazy(() => import('./pages/Services'));
const FullStack = lazy(() => import('./pages/services/FullStack'));
const WordPress = lazy(() => import('./pages/services/WordPress'));
const Branding = lazy(() => import('./pages/services/Branding'));
const DigitalMarketing = lazy(() => import('./pages/services/DigitalMarketing'));
const AIAutomation = lazy(() => import('./pages/services/AIAutomation'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
import ProtectedRoute from './components/ProtectedRoute';
import FloatingPromotions from './components/FloatingPromotions';

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

const DeferredEffects = () => {
 const [enabled, setEnabled] = useState(false);
 useEffect(() => {
  if (!window.matchMedia('(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) return;
  const timer = window.setTimeout(() => setEnabled(true), 2500);
  return () => window.clearTimeout(timer);
 }, []);
 return enabled ? <Suspense fallback={null}><SplashCursor /></Suspense> : null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SEO />
      <DeferredEffects />
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
          <Breadcrumbs />
          <Suspense fallback={<p className="seo-content" role="status">Loading page…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/projects" element={<Projects />} />
            
            {/* Service Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/full-stack" element={<FullStack />} />
            <Route path="/services/wordpress" element={<WordPress />} />
            <Route path="/services/branding" element={<Branding />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/services/ai-automation" element={<AIAutomation />} />

            {/* Admin & Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            {/* Catch-all route */}
            {Object.entries(redirects).map(([from,to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <PageContext />
        </main>

        <Footer />
        <FloatingPromotions />
      </ClickSpark>
    </BrowserRouter>
  );
};

export default App;