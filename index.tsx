import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { InquiryProvider } from './context/InquiryContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <InquiryProvider>
        <App />
      </InquiryProvider>
    </AuthProvider>
  </React.StrictMode>
);