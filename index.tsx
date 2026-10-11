import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { InquiryProvider } from './context/InquiryContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SiteSettingsProvider>
      <InquiryProvider>
        <App />
      </InquiryProvider>
    </SiteSettingsProvider>
  </React.StrictMode>
);