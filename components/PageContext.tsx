import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pages } from '../seo/site';
import { serviceContent } from '../seo/service-content';
export function Breadcrumbs() {
 const { pathname: rawPathname } = useLocation(); const pathname=rawPathname.replace(/\/+$/, '') || '/';
 if (!pages[pathname] || pathname === '/') return null;
 return <nav aria-label="Breadcrumb" className="px-6 pt-28 max-w-[1500px] mx-auto text-sm"><ol className="flex flex-wrap gap-2"><li><Link to="/">Home</Link></li>{pathname.startsWith('/services/') && <li><span aria-hidden="true"> / </span><Link to="/services">Services</Link></li>}<li><span aria-hidden="true"> / </span><span aria-current="page">{pages[pathname].label}</span></li></ol></nav>;
}
export default function PageContext() {
 const { pathname: rawPathname } = useLocation(); const pathname=rawPathname.replace(/\/+$/, '') || '/'; const content=serviceContent[pathname];
 if (!content) return null;
 return <section className="seo-content" aria-labelledby="project-planning"><h2 id="project-planning">Planning your {pages[pathname].label.toLowerCase()} project</h2><h3>Who this service is for</h3><p>{content.audience}</p><h3>What to prepare and agree on</h3><p>{content.preparation}</p><h2>Frequently asked questions</h2>{content.faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p className="mt-3">{answer}</p></details>)}<h2 className="mt-8">Related services and next steps</h2><ul>{content.related.map(path=><li key={path}><Link to={path}>{pages[path].label}</Link></li>)}</ul><p className="mt-6">Learn about <Link to="/about">BrandiQue Web Solutions and our founder</Link>, explore <Link to="/projects">our projects</Link>, or <Link to="/contact">discuss your requirements with the team</Link>.</p></section>;
}
