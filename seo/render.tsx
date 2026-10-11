import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { InquiryProvider } from '../context/InquiryContext';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import { AppLayout } from '../App';
import { preloadAllRoutes } from '../routes';

/** Load every page chunk so the code-split routes render synchronously during prerendering. */
export async function prepare() {
 await preloadAllRoutes();
}

// Renders exactly the tree the browser renders first (index.tsx), so the client can hydrate it.
export function render(path: string) {
 return renderToString(<StaticRouter location={path}><SiteSettingsProvider><InquiryProvider><AppLayout /></InquiryProvider></SiteSettingsProvider></StaticRouter>);
}
