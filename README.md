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
- `public/_redirects`, `public/_headers`: Cloudflare Pages routing, indexing and security headers (production). `vercel.json` is not used in production.

Change `founder.image` in `seo/site.ts` (or replace its referenced local file), then rebuild. Both About portraits, Person schema and social metadata use the same source. No duplicate portrait copies are needed.

Original mobile sizes, CSS, layouts and animations are preserved. Toolchain: Node 22, Vite 8 (build target pinned to the old Vite 5 browser set, CSS minified with esbuild), React Router 7, Tailwind 3.4. Add any future route to the router, `seo/site.ts` and `seo/render.tsx`. Keep default public data current for static rendering.

See `SEO-IMPLEMENTATION.md` for restoration details, retained SEO and validation limitations.

## Security

- Hosting is Cloudflare Pages; security headers (HSTS, CSP, frame, referrer, permissions) live in `public/_headers`. The CSP allows the two inline scripts in `index.html` by SHA-256 hash; `scripts/prerender.mjs` recomputes the hashes on every build and `npm run test:seo` fails if they drift. If you add a new third-party script, API or font host, add its origin to the CSP.
- The public site only reads published content and creates form submissions. Admin work happens in the BrandiQue Data Console (data.brandique.in, Firebase Admin SDK); `/admin` and `/login` here only redirect there.
- `firestore.rules` must be published manually in the Firebase console (Firestore Database -> Rules). Public visitors may only create validated `messages` / `n8n_project_forms` documents and read `settings`, `websites`, `projects`, `n8n_projects`.
- `storage.rules` documents that the public site needs no Cloud Storage access (deny all). The bucket is shared with the Data Console, whose own rules (BrandiQue-DataBase `storage.rules.example`) are the ones to publish; do not publish this file over them.
- `firebase-applet-config.json` is the public Firebase web config (not a secret); access is controlled by the Firestore rules.
- Form input is cleaned and validated in `utils/security.ts`; Firestore URLs are restricted to http(s) before they reach links or media.
