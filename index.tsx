import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PromptProvider } from './context/PromptContext';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PromptProvider>
        <App />
      </PromptProvider>
    </AuthProvider>
  </React.StrictMode>
);