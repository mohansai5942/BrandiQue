# BrandiQue Web Solutions

React 18 + TypeScript + Vite website with static HTML generation for public routes.

## Development and deployment

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run test:seo
```

Deploy `dist` after `npm run build`. The build includes real rendered public page content, route-specific metadata, JSON-LD, a sitemap, private noindex shells and a 404 document. Use npm and `package-lock.json` for reproducible installs. The legacy Bun lockfile has been removed to avoid conflicting dependency resolution.

`node scripts/serve-static.mjs` serves the generated output locally on port 4173 for checking static routes and 404 responses. It is a verification server, not a production server. `vite preview` is useful for development but its SPA fallback does not verify production 404 status codes.

Cloudflare Pages / Netlify use `public/_redirects` and `_headers`; Vercel uses `vercel.json`. Configure the production hostname as `brandique.in`, redirect `www`, and confirm HTTPS/redirects with the deployed host. Do not configure a catch-all rewrite to the home page. Keep the generated `404.html` and individual page directories.

## SEO maintenance

- `seo/site.ts`: canonical origin, route metadata, Organization and founder identity, social images and aliases.
- `seo/service-content.ts`: visible service planning guidance, FAQs and related services.
- `seo/render.tsx`: renders the actual public React pages at build time.
- `scripts/prerender.mjs`: writes each page and sitemap after Vite builds assets.
- `components/SEO.tsx`: updates metadata on client-side navigation.
- Add every new public route to `App.tsx`, `seo/site.ts` and `seo/render.tsx`. The validation script checks links and metadata in the generated output.
- Rebuild after source content or metadata changes. Firebase-managed content continues to load in the browser; prerendered content uses the repository's default public data. Keep those defaults current and rebuild when changing core business information.

## Founder photo

Change **only `founder.image` in `seo/site.ts`**, or replace the local file it points to and rebuild. Both About portraits, Person schema, Open Graph and Twitter metadata use it. The image currently remains on its original CDN because automated requests returned a challenge instead of image bytes. No replacement portrait or lossy recompression was performed.

For a future local image, add an optimized, correctly oriented photo to `public/images/kutikuppala-mohan-rao-founder-brandique-web-solutions.webp` and set the shared path to `/images/kutikuppala-mohan-rao-founder-brandique-web-solutions.webp`. Keep adequate resolution for the existing 420 CSS-pixel portrait. Do not add separate copies for schema or sharing.

See `SEO-IMPLEMENTATION.md` for validation, deployment and remaining limitations.
