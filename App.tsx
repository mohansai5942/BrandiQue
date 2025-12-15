import React, { useState, useLayoutEffect, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WebDevelopment from './pages/WebDevelopment';
import Services from './pages/Services';
import FullStack from './pages/services/FullStack';
import WordPress from './pages/services/WordPress';
import Branding from './pages/services/Branding';
import DigitalMarketing from './pages/services/DigitalMarketing';
import CustomCursor from './components/CustomCursor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App: React.FC = () => {
  // Initialize state to delay rendering until we confirm URL state
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    // We want to force start at Home ('/') on every load to avoid flashing other pages.
    // We check if there is a hash that isn't the root.
    if (window.location.hash && window.location.hash !== '#/') {
      // Directly setting window.location.hash is safer than history.replaceState 
      // in 'blob:' or sandboxed environments where replaceState can throw SecurityErrors.
      // This synchronously updates the hash to '#/', which HashRouter will see when it mounts.
      window.location.hash = '/';
    }
    
    // Mark as ready to render the Router
    setIsReady(true);
  }, []);

  // Prevent Router from mounting until we've sanitized the URL
  if (!isReady) return null;

  return (
    <HashRouter>
      <ScrollToTop />
      <CustomCursor />
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white selection:bg-neon-purple selection:text-white transition-colors duration-300">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            
            {/* Service Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/full-stack" element={<FullStack />} />
            <Route path="/services/wordpress" element={<WordPress />} />
            <Route path="/services/branding" element={<Branding />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            {/* Catch-all route: Redirects any unknown paths to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;