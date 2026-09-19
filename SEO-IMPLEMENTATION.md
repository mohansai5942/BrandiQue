# BrandiQue SEO implementation — 19 September 2026

## Scope and findings

Audited the tracked repository tree, React Router routes, public page source, shared navigation/footer, settings, metadata, public assets and hosting configuration. The site uses React 18, TypeScript and Vite with Firebase-backed features. The live homepage responded with HTTP 200; its HTML used Tailwind's runtime CDN and a single global head.

Problems found: no page-specific metadata/canonicals; sitemap used www and three nonexistent service paths; missing AI automation/legal sitemap entries; no founder Person/Organization connection; duplicate founder image URLs; inaccurate Praveen CEO/co-founder labels; missing service H1s and duplicated home H1; heading-level gaps; unknown routes redirected to home; all page/admin code loaded eagerly; blocking intro and runtime CSS compilation.

## A. Files changed

- Build and entry: `App.tsx`, `index.tsx`, `index.html`, `package.json`, `package-lock.json`, `tailwind.config.cjs`, `postcss.config.cjs`, `styles.css`. Removed stale `bun.lock`; npm is the documented package manager.
- SEO source: `seo/site.ts`, `seo/service-content.ts`, `seo/render.tsx`.
- Shared components: `components/SEO.tsx`, `PageContext.tsx`, `DeferredWorkflowViewer.tsx`, `Navbar.tsx`, `Footer.tsx`, `ScrollReveal.tsx`, `TextReveal.tsx`.
- Pages: `pages/About.tsx`, `Home.tsx`, `Projects.tsx`, `Services.tsx`, `WebDevelopment.tsx`, `NotFound.tsx`; all five files in `pages/services/`.
- SSR safety: browser-storage guards in `context/AuthContext.tsx` and `pages/Projects.tsx`; existing authentication behavior was not redesigned.
- Hosting/assets: `public/sitemap.xml`, `robots.txt`, `_redirects`, `_headers`, `images/brandique-social.png`, `vercel.json`.
- Validation/documentation: `scripts/prerender.mjs`, `check-seo.mjs`, `serve-static.mjs`, `README.md`, this report.

## B–C. SEO changes and pages optimized

14 public routes now receive real build-time rendered React content, one unique title and description, a canonical URL, index directives, Open Graph, Twitter cards and valid JSON-LD. Client navigation updates the same metadata source. Home has one stable, descriptive H1; service H1s and heading levels were corrected. Service planning guidance adds audiences, scope considerations, FAQs, related services and contact links without extra doorway pages or invented prices.

Routes: `/`, `/about`, `/contact`, `/services`, `/web-development`, `/projects`, `/services/full-stack`, `/services/wordpress`, `/services/branding`, `/services/digital-marketing`, `/services/ai-automation`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`.

Login/admin and 404 output are noindex and excluded from the sitemap. Unknown routes display a real not-found page instead of silently redirecting to home.

## D–E. Structured data and founder identity

Stable linked entities: Organization `https://brandique.in/#organization`, WebSite `/#website`, route WebPage/AboutPage/ContactPage/CollectionPage, Service on six service-related routes, and BreadcrumbList on non-home public pages.

The About page contains one Person: **Kutikuppala Mohan Rao**, `jobTitle: Founder`, `worksFor` referencing the Organization. Organization.founder points to `https://brandique.in/about#founder`. Supported short name variants appear in alternateName; visible copy uses the full name and a natural K. Mohan reference. No invented personal social profiles, credentials or achievements were added. The existing company Instagram is used for Organization.sameAs.

Praveen’s biography describes his team-member web-development/design work. At the owner’s subsequent explicit request, his two visible display labels say “Co-Founder”, despite the owner confirming his actual role is employee. This is a known inconsistency in visible content, not a verified founder claim. No Person schema, founder/employee property, dedicated page or name-targeting metadata was created for him. Search engines may extract the visible label independently of structured data; excluding his founder role from schema cannot prevent that. Use an accurate visible role to remove this inconsistency.

## F. Image SEO

Both founder portraits, Person schema and About social metadata read **founder.image in seo/site.ts**. A regression test changes that source in memory and verifies every reference updates. Rebuild after replacing the source image or path.

The original founder CDN returned a challenge instead of image bytes. Its URL was preserved; no claim of successful compression or modern-format conversion is made. Photo presentation dimensions and eager/lazy loading were added. Other public images have descriptive alt attributes and dimensions; project images load lazily. A local 1200×630 PNG provides a dependable company social card.

## G–H. Sitemap and robots

The sitemap is generated from the same 14 canonical route entries on every build, using `https://brandique.in`. No fabricated last-modified dates or private/parameter URLs. robots.txt permits crawling and references the corrected sitemap. Private noindex pages remain crawlable so crawlers can read the noindex instruction; robots.txt is not an access-control mechanism.

## I–J. Links and performance

Added visible breadcrumbs, founder links to About, service cross-links and project/contact links. All generated internal routes and fragments passed checks. Old sitemap service URLs have permanent redirects. www-to-apex and static 404 hosting rules were added.

Tailwind now compiles locally at build time. Removed the blocking introductory video from the initial app render; retained its source component. Non-home pages/admin load in separate chunks. Workflow visualization waits until near the viewport. Desktop pointer effects are delayed and disabled for touch/reduced-motion conditions. Text appears without per-character animation delay. Mobile base text increased from 11px to 14px. Reduced-motion CSS is included.

The main JavaScript bundle remains approximately 1.14 MB (307 KB gzip), largely due to existing shared application dependencies including Firebase. No Lighthouse, CrUX or numerical Core Web Vitals improvement is claimed.

## K. Remaining limitations

- Browser visual/mobile runtime QA and Lighthouse could not run: no browser was installed, and Chromium/headless-shell download attempts timed out or returned HTTP 502. Responsive source was reviewed, but visual correctness is not fully verified.
- External founder/logo/portfolio image availability remains dependent on their CDNs. Upload original media locally for reliable optimization and serving.
- Prerendered data uses the repository's default public settings/projects; browser Firebase updates remain functional. Keep default data current and rebuild when business information changes.
- Existing application authentication uses client-side fallback behavior and needs a separate security review before treating the admin system as production-secure. This SEO change is not an authentication remediation.
- Existing marketing metrics and testimonials were not independently substantiated. No ratings, review schema, awards or ranking guarantees were added.
- Production routing, hostname redirects and the new build must be checked on the actual host after deployment. Source push is not proof of a completed deployment or indexing.

## L. Validation

Passed:

```sh
npm ci --no-audit --no-fund
npm run lint
npm run build
npm run test:seo
git diff --check
```

Dependencies were installed with npm before the final lint/build/test cycle. The production build generates 14 public HTML pages plus login/admin shells and 404. SEO tests validate metadata uniqueness, H1/heading levels, canonical URLs, schema JSON, founder links and photo propagation, image attributes, internal links/fragments, sitemap and noindex pages.

`node scripts/serve-static.mjs` plus Node fetch checks returned 200 for home/About/full-stack, 301 for the old WordPress service URL, and 404 for an unknown route. This is local verification, not a measurement of the live host.

Attempted browser setup: Playwright `install chromium` and `install chromium --only-shell`; blocked by download timeouts/502 responses. No browser screenshot or mobile performance score is reported.

## M. Google Search Console setup

The existing HTML verification token is preserved. After deployment, verify the domain property/ownership if needed, submit `https://brandique.in/sitemap.xml`, inspect home/About/service URLs and request indexing where useful. Confirm Google's selected canonical, crawl status and rendered content, then monitor Page Indexing and Core Web Vitals. No Search Console submission was performed.

## N. Next steps

Publish original case studies explaining the problem, implementation and outcomes that can be evidenced. Add focused articles answering real customer questions and link them to relevant services. Keep the founder/company identity consistent on legitimate business profiles. If eligible, maintain an accurate Google Business Profile for the real business location. Prioritize local media hosting, third-party dependency reduction and security remediation over creating large numbers of keyword pages.
