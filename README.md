# BrandiQue Web Solutions

React + TypeScript + Vite, with the original website design and an SEO metadata/static-rendering layer.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run test:seo
```

Deploy `dist` from `npm run build`. Public routes receive rendered HTML and unique SEO metadata. Login/admin remain noindex. Keep the generated page directories and `404.html`; do not rewrite unknown URLs to the homepage.

- `seo/site.ts`: route metadata, canonical origin, founder identity and shared founder image.
- `components/SEO.tsx`: metadata updates during client navigation; renders no visible UI.
- `seo/render.tsx`: static rendering of existing public page components.
- `scripts/prerender.mjs`: generates public HTML and sitemap.
- `scripts/check-seo.mjs`: SEO regression validation.
- `public/_redirects`, `_headers`, `vercel.json`: host routing/indexing rules.

Change `founder.image` in `seo/site.ts` (or replace its referenced local file), then rebuild. Both About portraits, Person schema and social metadata use the same source. No duplicate portrait copies are needed.

Original mobile sizes, CSS, Tailwind CDN setup, layouts and animations are preserved. Add any future route to the router, `seo/site.ts` and `seo/render.tsx`. Keep default public data current for static rendering.

See `SEO-IMPLEMENTATION.md` for restoration details, retained SEO and validation limitations.
