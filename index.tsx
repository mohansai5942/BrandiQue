import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
// Styles: React Flow's base stylesheet first, then the site's Tailwind build (same cascade order as before).
import '@xyflow/react/dist/style.css';
import './index.css';
import App from './App';
import { preloadRoute } from './routes';
import { redirects } from './seo/site';
import { InquiryProvider } from './context/InquiryContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Error monitoring (Sentry, free tier): only active when a DSN is provided at build time
// via the VITE_SENTRY_DSN env var, and only in production builds. No DSN is hardcoded.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    enabled: import.meta.env.PROD,
    tracesSampleRate: 0.1,
  });
}

const app = (
  <React.StrictMode>
    <SiteSettingsProvider>
      <InquiryProvider>
        <App />
      </InquiryProvider>
    </SiteSettingsProvider>
  </React.StrictMode>
);

// Pages are prerendered with the same component tree, so React hydrates the existing HTML in place
// (no teardown and rebuild of the page, no image reloads or restarted entrance animations). The current
// page's chunk is loaded first so the first render matches the HTML. If the HTML ever differs, React
// re-renders on the client by itself, exactly like before.
const mount = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  // Legacy URLs are 301-redirected by Cloudflare (_redirects); if one is ever served the 404 HTML
  // instead, the client redirect renders a different page, so render fresh rather than hydrate.
  const isClientRedirect = Object.prototype.hasOwnProperty.call(redirects, path);
  if (rootElement.hasChildNodes() && !isClientRedirect) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
};

preloadRoute(window.location.pathname).then(mount, mount);
