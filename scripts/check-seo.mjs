import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parseHTML} from 'linkedom';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap URLs');
const titles=new Set(), descriptions=new Set(), documents=new Map();
for (const url of urls) {
 const {pathname}=new URL(url);
 assert.equal(new URL(url).origin,'https://brandique.in');
 const file=pathname==='/' ? 'dist/index.html' : `dist${pathname}/index.html`;
 const {document}=parseHTML(await readFile(file,'utf8')); documents.set(pathname,document);
 assert.equal(document.querySelectorAll('title').length,1,`${pathname}: title count`);
 const title=document.querySelector('title').textContent;
 assert(!titles.has(title),`${pathname}: duplicate title`); titles.add(title);
 const desc=document.querySelectorAll('meta[name="description"]'); assert.equal(desc.length,1);
 assert(!descriptions.has(desc[0].content),`${pathname}: duplicate description`);descriptions.add(desc[0].content);
 assert.equal(document.querySelectorAll('h1').length,1,`${pathname}: exactly one H1`);
 assert.equal(document.querySelectorAll('link[rel="canonical"]').length,1);
 assert.equal(document.querySelector('link[rel="canonical"]').href,url);
 assert.equal(document.querySelectorAll('meta[name="robots"]').length,1);
 assert(!document.querySelector('meta[name="robots"]').content.includes('noindex'));
 for(const selector of ['meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','meta[property="og:image"]','meta[name="twitter:card"]']) assert(document.querySelector(selector),`${pathname}: ${selector}`);
 for(const img of document.querySelectorAll('img')) {
  assert(img.hasAttribute('alt'),`${pathname}: missing alt`);
  if(img.src.startsWith('/')) await access(`dist${img.src}`);
 }
 const graph=JSON.parse(document.querySelector('#page-schema').textContent)['@graph'];
 const org=graph.find(n=>n['@type']==='Organization');assert.equal(org.founder['@id'],'https://brandique.in/about#founder');
 assert(!JSON.stringify(graph).includes('Praveen'));
 const people=graph.filter(n=>n['@type']==='Person'); assert.equal(people.length,pathname==='/about'||pathname==='/'?1:0);
 if(people.length) {assert(people[0].image.url.startsWith('https://brandique.in/images/brandique-founder'),`${pathname}: founder image`);assert.equal(people[0]['@id'],'https://brandique.in/about#founder');}
 if(pathname==='/about') {
  assert.equal(people[0].name,'Kutikuppala Mohan Rao');assert.match(people[0].jobTitle,/^Founder/);assert.equal(people[0].worksFor['@id'],org['@id']);
  const image=document.querySelector('#founder img').src;
  assert.equal(people[0].image.url,new URL(image,url).href);
  assert.equal(document.querySelector('meta[property="og:image"]').content,people[0].image.url);
  assert(!/Chief Executive Officer|\bCEO\b/.test(document.querySelector('main').textContent));
  assert.equal((document.querySelector('main').textContent.match(/Co-Founder/g)||[]).length,2,'Requested display labels');
 }
}
for (const [path,document] of documents) for(const a of document.querySelectorAll('a[href]')) {
 const href=a.getAttribute('href');
 if(!href || href==='#' || /^(mailto:|tel:|javascript:)/.test(href))continue;
 const target=new URL(href,`https://brandique.in${path}`);
 if(target.origin!=='https://brandique.in')continue;
 assert(documents.has(target.pathname)||['/login','/admin'].includes(target.pathname),`${path}: broken internal link ${href}`);
 if(target.hash && documents.has(target.pathname)) assert(documents.get(target.pathname).getElementById(decodeURIComponent(target.hash.slice(1))),`${path}: broken fragment ${href}`);
}
for(const path of ['404.html','login/index.html','admin/index.html']) {
 const {document}=parseHTML(await readFile(`dist/${path}`,'utf8'));assert(document.querySelector('meta[name="robots"]').content.includes('noindex'));
}
const robots=await readFile('dist/robots.txt','utf8');assert(robots.includes('Sitemap: https://brandique.in/sitemap.xml'));assert(!robots.includes('Disallow: /\n'));
assert(!urls.some(url=>/admin|login|404/.test(url)));
await access('dist/images/brandique-social.png');
console.log(`PASS: ${urls.length} pages; unique metadata, responsive heading structure, canonical URLs, JSON-LD, founder image consistency, internal links/fragments, image alt text, sitemap and private/404 noindex.`);
// Security: production headers, CSP inline-script hashes and no sensitive files in the output.
{
 const headers=await readFile('dist/_headers','utf8');
 const csp=(headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)||[])[1];
 assert(csp,'dist/_headers: Content-Security-Policy missing');
 for(const h of ['Strict-Transport-Security','X-Content-Type-Options','Referrer-Policy','Permissions-Policy','X-Frame-Options','Cross-Origin-Opener-Policy']) assert(new RegExp(`^\\s*${h}:`,'m').test(headers),`dist/_headers: ${h} missing`);
 const scriptSrc=csp.split(';').map(d=>d.trim()).find(d=>d.startsWith('script-src '));
 assert(scriptSrc && !scriptSrc.includes("'unsafe-inline'") && !scriptSrc.includes("'unsafe-eval'"),'script-src must not allow unsafe-inline/unsafe-eval');
 const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]))).flat();
 const files=await walk('dist');
 for(const f of files){
  assert(!/\.map$|\.env|tmp\.txt|patch_fix|firebase-applet-config|firebase-blueprint|metadata\.json|\.md$|(firestore|storage)\.rules|package(-lock)?\.json$/.test(f),`sensitive or dev file shipped: ${f}`);
  if(!f.endsWith('.html'))continue;
  const html=await readFile(f,'utf8');
  for(const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)){
   if(/ld\+json/.test(m[1]))continue;
   const hash=`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`;
   assert(scriptSrc.includes(hash),`${f}: inline script not allowed by CSP (${hash})`);
  }
 }
 for(const f of files.filter(f=>f.endsWith('.js'))){const js=await readFile(f,'utf8');assert(!/sourceMappingURL=/.test(js),`${f}: source map reference`);}
 console.log('PASS: security headers present, CSP hashes match every inline script, no source maps or dev/secret files in dist.');
}
// A founder source replacement must update both visible profile images and head data.
const {createServer}=await import('vite');
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try {
 const site=await vite.ssrLoadModule('/seo/site.ts');
 const {render,prepare}=await vite.ssrLoadModule('/seo/render.tsx');
 if(prepare) await prepare();
 const original=site.founder.image;
 try {
  site.founder.image='/images/replacement-test.webp';
  const {document}=parseHTML(site.headHTML('/about')+render('/about'));
  assert.equal(document.querySelector('#founder img').src,site.founder.image);
  assert.equal(document.querySelectorAll('img[src="/images/replacement-test.webp"]').length,2);
  const person=site.structuredData('/about')['@graph'].find(n=>n['@type']==='Person');
  assert.equal(person.image.url,'https://brandique.in/images/replacement-test.webp');
  assert.equal(document.querySelector('meta[property="og:image"]').content,person.image.url);
  assert.equal(document.querySelector('meta[name="twitter:image"]').content,person.image.url);
 } finally {site.founder.image=original;}
 console.log('PASS: replacing the shared founder image updates both portraits, Person, Open Graph and Twitter metadata.');
} finally {await vite.close();}
