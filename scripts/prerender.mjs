import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { render } = await vite.ssrLoadModule('/seo/render.tsx');
 const { pages, headHTML, SITE_URL, redirects } = await vite.ssrLoadModule('/seo/site.ts');
 const template = await readFile('dist/index.html','utf8');
 for (const path of [...Object.keys(pages),'/404','/login','/admin']) {
  const html=template.replace('<!--seo-head-->',headHTML(path)).replace('<!--app-html-->', path === '/admin' || path === '/login' ? '' : render(path));
  const filename=path==='/' ? 'dist/index.html' : path==='/404' ? 'dist/404.html' : `dist${path}/index.html`;
  await mkdir(filename.slice(0,filename.lastIndexOf('/')),{recursive:true});
  await writeFile(filename,html);
 }
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages).map(p=>`  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
 await writeFile('dist/sitemap.xml',sitemap);
 try { await writeFile('public/sitemap.xml',sitemap); } catch (_) {}
 console.log(`Prerendered ${Object.keys(pages).length} public pages, private shells and 404; generated sitemap.`);
} finally { await vite.close(); }
