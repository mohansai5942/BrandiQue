import SEO from './components/SEO';
import NotFound from './pages/NotFound';
import { redirects } from './seo/site';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';
import ClickSpark from './components/ClickSpark';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WebDevelopment from './pages/WebDevelopment';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Solutions from './pages/Solutions';
import AIAutomation from './pages/services/AIAutomation';
import GraphicDesign from './pages/services/GraphicDesign';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import FloatingPromotions from './components/FloatingPromotions';
import DarlingAIChatbot from './components/DarlingAIChatbot';

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const clean = pathname.replace(/\/+$/, '') || '/';
    document.documentElement.classList.toggle('legacy-scale', clean === '/projects' || clean === '/contact');
  }, [pathname]);
  
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SEO />
      <SplashCursor />
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
        
        <main className="flex-grow">
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
            <Route path="/services/ai-automation" element={<AIAutomation />} />
            <Route path="/services/graphic-design" element={<GraphicDesign />} />

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
        </main>

        <Footer />
        <FloatingPromotions />
        <DarlingAIChatbot isIntroFinished={true} />
      </ClickSpark>
    </BrowserRouter>
  );
};

export default App;