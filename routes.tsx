import { lazyRoute, LazyRoute } from './lazyRoute';
import { redirects } from './seo/site';

// Every page is its own chunk; only the page being opened is downloaded before first render.
export const Home = lazyRoute(() => import('./pages/Home'));
export const About = lazyRoute(() => import('./pages/About'));
export const Contact = lazyRoute(() => import('./pages/Contact'));
export const WebDevelopment = lazyRoute(() => import('./pages/WebDevelopment'));
export const Projects = lazyRoute(() => import('./pages/Projects'));
export const Services = lazyRoute(() => import('./pages/Services'));
export const Pricing = lazyRoute(() => import('./pages/Pricing'));
export const Solutions = lazyRoute(() => import('./pages/Solutions'));
export const AIAutomation = lazyRoute(() => import('./pages/services/AIAutomation'));
export const GraphicDesign = lazyRoute(() => import('./pages/services/GraphicDesign'));
export const PrivacyPolicy = lazyRoute(() => import('./pages/PrivacyPolicy'));
export const TermsAndConditions = lazyRoute(() => import('./pages/TermsAndConditions'));
export const CookiePolicy = lazyRoute(() => import('./pages/CookiePolicy'));
export const NotFound = lazyRoute(() => import('./pages/NotFound'));

export const routeComponents: Record<string, LazyRoute> = {
  '/': Home,
  '/about': About,
  '/contact': Contact,
  '/web-development': WebDevelopment,
  '/projects': Projects,
  '/services': Services,
  '/pricing': Pricing,
  '/solutions': Solutions,
  '/services/ai-automation': AIAutomation,
  '/services/graphic-design': GraphicDesign,
  '/privacy-policy': PrivacyPolicy,
  '/terms-and-conditions': TermsAndConditions,
  '/cookie-policy': CookiePolicy,
};

/** Preload the chunk for a URL path (unknown paths get the 404 page; /login and /admin need none). */
export function preloadRoute(pathname: string): Promise<void> {
  let path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  path = (redirects as Record<string, string>)[path] || path;
  if (path === '/login' || path === '/admin') return Promise.resolve();
  return (routeComponents[path] || NotFound).preload();
}

/** Warm every page chunk in the background (no recovery/reload if one fails). */
export function preloadAllRoutes(): Promise<unknown> {
  return Promise.allSettled([...Object.values(routeComponents), NotFound].map((r) => r.prefetch()));
}
