import { createServer } from 'vite';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { render, prepare } = await vite.ssrLoadModule('/seo/render.tsx');
 await prepare();
 const { pages, headHTML, SITE_URL, redirects, founder, absoluteUrl } = await vite.ssrLoadModule('/seo/site.ts');
 const template = await readFile('dist/index.html','utf8');
 // Performance: each page's own JS chunk (pages are code-split in routes.tsx) is preloaded from its HTML,
 // so it downloads in parallel with the main bundle instead of after it.
 const manifest=JSON.parse(await readFile('dist/.vite/manifest.json','utf8'));
 const entry=Object.values(manifest).find(c=>c.isEntry);
 const pageSource={'/':'pages/Home.tsx','/about':'pages/About.tsx','/contact':'pages/Contact.tsx','/web-development':'pages/WebDevelopment.tsx','/projects':'pages/Projects.tsx','/services':'pages/Services.tsx','/pricing':'pages/Pricing.tsx','/solutions':'pages/Solutions.tsx','/services/ai-automation':'pages/services/AIAutomation.tsx','/services/graphic-design':'pages/services/GraphicDesign.tsx','/privacy-policy':'pages/PrivacyPolicy.tsx','/terms-and-conditions':'pages/TermsAndConditions.tsx','/cookie-policy':'pages/CookiePolicy.tsx','/404':'pages/NotFound.tsx'};
 const loaded=new Set([entry.file,...(entry.imports||[]).map(k=>manifest[k].file)]);
 const chunkFiles=(key,acc=new Set())=>{const c=manifest[key];if(!c||acc.has(c.file))return acc;acc.add(c.file);for(const i of c.imports||[])chunkFiles(i,acc);return acc;};
 const preloadLinks=path=>{const key=pageSource[path];if(!key)return '';if(!manifest[key])throw new Error(`manifest: no chunk for ${key}`);return [...chunkFiles(key)].filter(f=>!loaded.has(f)).map(f=>`<link rel="modulepreload" crossorigin href="/${f}">`).join('\n    ');};
 // Images imported by components (e.g. assets/brand/*.webp) resolve to their source path during SSR; point the
 // prerendered HTML at the hashed build file the client bundle uses, so hydration matches.
 const assetUrls=Object.entries(manifest).filter(([k,c])=>!/\.(tsx?|jsx?|css|html)$/.test(k)&&c.file&&k.startsWith('assets/')).map(([k,c])=>[`/${k}`,`/${c.file}`]);
 const fixAssets=html=>assetUrls.reduce((h,[from,to])=>h.split(`"${from}"`).join(`"${to}"`),html);
 // Performance/CLS: the above-the-fold Inter weights are preloaded so they arrive with the CSS instead of after
 // layout; otherwise the hero text re-wraps when they swap in and the hero card jumps (layout shift).
 const {readdir}=await import('node:fs/promises');
 const assetFiles=await readdir('dist/assets');
 const PRELOAD_FONTS=(process.env.PRELOAD_FONTS||'inter-latin-400-normal,inter-latin-500-normal,inter-latin-600-normal,inter-latin-700-normal').split(',').filter(Boolean);
 const fontLinks=PRELOAD_FONTS.map(n=>{const f=assetFiles.find(a=>a.startsWith(n+'-')&&a.endsWith('.woff2'));if(!f)throw new Error(`prerender: font ${n} not found in dist/assets`);return `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}">`;}).join('\n    ');
 for (const path of Object.keys(pages)) if(!pageSource[path]) throw new Error(`prerender: add ${path} to pageSource`);
 for (const path of [...Object.keys(pages),'/404','/login','/admin']) {
  const links=preloadLinks(path);
  const html=template.replace('<!--seo-head-->',headHTML(path)).replace('<!--app-html-->', path === '/admin' || path === '/login' ? '' : fixAssets(render(path))).replace('</head>', `  ${[fontLinks,links].filter(Boolean).join('\n    ')}\n  </head>`);
  const filename=path==='/' ? 'dist/index.html' : path==='/404' ? 'dist/404.html' : `dist${path}/index.html`;
  await mkdir(filename.slice(0,filename.lastIndexOf('/')),{recursive:true});
  await writeFile(filename,html);
 }
 // Image sitemap: the founder photo ("BrandiQue Founder") is listed for the home and About pages.
 const founderImage=`  <image:image><image:loc>${absoluteUrl(founder.image)}</image:loc></image:image>`;
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${Object.keys(pages).map(p=>p==='/'||p==='/about'?`  <url><loc>${SITE_URL}${p}</loc>\n  ${founderImage}\n  </url>`:`  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
 await writeFile('dist/sitemap.xml',sitemap);
 try { await writeFile('public/sitemap.xml',sitemap); } catch (_) {}
 // Content-Security-Policy: allow exactly the inline <script> blocks of index.html by hash.
 const hashes=[...template.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(m=>!/ld\+json/.test(m[1]))
  .map(m=>`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
 const headersFile='dist/_headers';
 const headers=await readFile(headersFile,'utf8');
 const updated=headers.replace(/(script-src [^;]*?)((?: 'sha256-[A-Za-z0-9+/=]+')+)(;)/,(_,pre,_old,end)=>`${pre} ${hashes.join(' ')}${end}`);
 if(!/script-src [^;]*'sha256-/.test(updated)) throw new Error('dist/_headers: script-src hash list not found');
 await writeFile(headersFile,updated);
 await rm('dist/.vite',{recursive:true,force:true});
 console.log(`Prerendered ${Object.keys(pages).length} public pages, private shells and 404; generated sitemap.`);
} finally { await vite.close(); }
