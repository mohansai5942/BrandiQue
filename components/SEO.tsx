import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { absoluteUrl, getSEO, metaEntries, structuredData } from '../seo/site';
export default function SEO() {
 const {pathname: rawPathname} = useLocation();
 const pathname = rawPathname.replace(/\/+$/, '') || '/';
 useEffect(()=>{
  document.title = getSEO(pathname).title;
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical=document.createElement('link'); canonical.rel='canonical'; document.head.append(canonical); }
  canonical.href=absoluteUrl(pathname);
  for (const [attr,key,value] of metaEntries(pathname)) {
    let tag=document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!tag) { tag=document.createElement('meta'); tag.setAttribute(attr,key); document.head.append(tag); }
    tag.content=value;
  }
  document.getElementById('page-schema')?.remove();
  const data=structuredData(pathname);
  if (data) {const script=document.createElement('script'); script.id='page-schema';script.type='application/ld+json';script.textContent=JSON.stringify(data);document.head.append(script);}
 },[pathname]);
 return null;
}
