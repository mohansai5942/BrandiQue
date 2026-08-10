import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VideoIntro from './components/VideoIntro';
import SplashCursor from './components/SplashCursor';
import ClickSpark from './components/ClickSpark';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WebDevelopment from './pages/WebDevelopment';
import Projects from './pages/Projects';
import Services from './pages/Services';
import FullStack from './pages/services/FullStack';
import WordPress from './pages/services/WordPress';
import Branding from './pages/services/Branding';
import DigitalMarketing from './pages/services/DigitalMarketing';
import AIAutomation from './pages/services/AIAutomation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import Login from './pages/Login';
import Admin from './pages/Admin';
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SplashCursor />
      <VideoIntro />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <FloatingPromotions />
      </ClickSpark>
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;