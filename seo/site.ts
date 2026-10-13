// One source of truth for visible founder images and all entity/social references.
// Replace this image in place, or change image here and rebuild the site.
export const SITE_URL = 'https://brandique.in';
export const COMPANY = 'BrandiQue Web Solutions';
export const founder = {
  name: 'Kutikuppala Mohan Rao',
  alternateName: ['K. Mohan Rao', 'K Mohan Rao', 'Mohan Rao Kutikuppala', 'Mohan Rao K', 'Mohan Rao', 'Mohan Sai', 'Mohan K', 'K. Mohan', 'K Mohan', 'Kutikuppala Mohan', 'BrandiQue Founder', 'Mohan'],
  givenName: 'Mohan Rao',
  familyName: 'Kutikuppala',
  // Self-hosted, optimised WebP ("BrandiQue Founder" photo). srcSet lists the responsive sizes in public/images.
  image: '/images/brandique-founder.webp',
  srcSet: '/images/brandique-founder-160.webp 160w, /images/brandique-founder-320.webp 320w, /images/brandique-founder-640.webp 640w, /images/brandique-founder.webp 960w',
  width: 960,
  height: 960,
  alt: 'K. Mohan Rao, Founder of BrandiQue Web Solutions',
  title: 'BrandiQue Founder, K. Mohan Rao',
  description: 'Kutikuppala Mohan Rao (K. Mohan Rao, also known as Mohan Sai) is the Founder of BrandiQue Web Solutions, Visakhapatnam. His work focuses on web and app engineering, AI agents, workflow automation, UI/UX and branding.',
};
export const organizationId = `${SITE_URL}/#organization`;
export const founderId = `${SITE_URL}/about#founder`;
export const founderSameAs = ['https://x.com/Mohan_Creator', 'https://www.threads.com/@mohan_creator/', 'https://github.com/mohansai5942', 'https://www.instagram.com/brandiquewebsolutions/'];
export const LOGO_URL = `${SITE_URL}/images/brandique-logo.png`;
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export interface PageSEO { title: string; description: string; label: string; service?: string; }
export const pages: Record<string, PageSEO> = {
  '/': { title: 'BrandiQue Web Solutions | Web Development, AI Agents & Graphic Design', label: 'Home', description: 'BrandiQue Web Solutions, founded by Kutikuppala Mohan Rao (K. Mohan Rao) in Visakhapatnam, builds websites that win enquiries, AI agents that reply 24/7 and graphic design that earns trust.' },
  '/about': { title: 'Kutikuppala Mohan Rao (K. Mohan Rao), Founder of BrandiQue Web Solutions', label: 'About', description: 'Kutikuppala Mohan Rao (K. Mohan Rao, Mohan Sai) is the Founder of BrandiQue Web Solutions, Visakhapatnam: web development, AI agents, automation and design.' },
  '/contact': { title: 'Contact BrandiQue Web Solutions | Visakhapatnam', label: 'Contact', description: 'Discuss a website, AI automation, branding or marketing project with BrandiQue Web Solutions in Visakhapatnam. Contact the team for a project-specific quote.' },
  '/services': { title: 'Web Development, AI Automation & Graphic Design Services | BrandiQue', label: 'Services', description: 'Explore BrandiQue’s three core services: business-focused website development, AI agents and workflow automation, and graphic design. Supporting brand and content services are available too.' },
  '/pricing': { title: 'Website, AI Automation & Graphic Design Pricing | BrandiQue', label: 'Pricing', description: 'Compare BrandiQue starting prices for websites, AI chatbots and automations, graphic design, monthly growth plans and industry solutions. Every project starts with a fixed written quote.' },
  '/solutions': { title: 'Industry Growth Solutions for Coaching, Clinics & Local Business | BrandiQue', label: 'Solutions', description: 'Ready-made growth systems that combine a website, WhatsApp AI assistant, automations and design for coaching centres, clinics, local businesses and new brands.' },
  '/web-development': { title: 'Website Design & Development Pricing | BrandiQue', label: 'Website development', service: 'Website design and development', description: 'Compare starting prices for personal, portfolio, business and e-commerce websites. Review inclusions, delivery steps and scope before requesting a project quote from BrandiQue.' },
  '/services/ai-automation': { title: 'AI Agents, Chatbots & Workflow Automation | BrandiQue', label: 'AI and automation', service: 'AI agents and workflow automation', description: 'Explore practical lead capture, chatbot and workflow automation services from BrandiQue. Every implementation is scoped around the required integrations, operating costs and handover needs.' },
  '/services/graphic-design': { title: 'Graphic Design for Brands, Social Media & Ads | BrandiQue', label: 'Graphic design', service: 'Graphic design and creative production', description: 'Get consistent graphic design for social media, advertising, thumbnails, banners, presentations and brand collateral. Explore the process and request a scoped quote from BrandiQue.' },
  '/projects': { title: 'Web Design & Automation Projects | BrandiQue', label: 'Projects', description: 'Explore BrandiQue Web Solutions’ website designs, development projects and n8n workflows. Find examples relevant to your next business website or automation.' },
  '/privacy-policy': { title: 'Privacy Policy | BrandiQue Web Solutions', label: 'Privacy policy', description: 'Read how BrandiQue Web Solutions handles contact information, website usage data and privacy enquiries when you use our website and services.' },
  '/terms-and-conditions': { title: 'Terms & Conditions | BrandiQue Web Solutions', label: 'Terms and conditions', description: 'Review the terms for using BrandiQue Web Solutions’ website and engaging our services, including project agreements, responsibilities and intellectual property.' },
  '/cookie-policy': { title: 'Cookie Policy | BrandiQue Web Solutions', label: 'Cookie policy', description: 'Learn how BrandiQue Web Solutions uses cookies and local storage, including theme preferences, and how you can manage browser storage settings.' },
};
export const redirects: Record<string,string> = {
  '/services/full-stack-web-development': '/web-development',
  '/services/wordpress-development': '/web-development',
  '/services/full-stack': '/web-development',
  '/services/wordpress': '/web-development',
  '/services/branding-identity': '/services/graphic-design',
  '/services/branding': '/services/graphic-design',
  '/services/digital-marketing': '/services/graphic-design',
};
export function getSEO(path: string) {
  return pages[path] || {title: path === '/login' ? 'Admin Login | BrandiQue' : path === '/admin' ? 'Admin | BrandiQue' : 'Page Not Found | BrandiQue', label: 'Page not found', description: 'This page is not available. Explore BrandiQue Web Solutions services or contact our team.'};
}
export function structuredData(path: string) {
  if (!pages[path]) return null;
  const page = pages[path];
  const graph: Record<string,unknown>[] = [
    {'@type':'Organization','@id': organizationId, name: COMPANY, alternateName: 'BrandiQue', url: `${SITE_URL}/`, logo: {'@type':'ImageObject', url: LOGO_URL, width: 192, height: 192}, image: LOGO_URL, founder: {'@id':founderId}, sameAs: ['https://www.instagram.com/brandiquewebsolutions/'], location: {'@type':'Place', name:'Visakhapatnam, India'}},
    {'@type':'WebSite','@id':`${SITE_URL}/#website`, url:`${SITE_URL}/`, name:COMPANY, publisher:{'@id':organizationId}},
    {'@type': path === '/about' ? ['AboutPage','ProfilePage'] : path === '/contact' ? 'ContactPage' : path === '/projects' || path === '/services' || path === '/solutions' ? 'CollectionPage' : 'WebPage', '@id':`${absoluteUrl(path)}#webpage`, url:absoluteUrl(path), name:page.title, description:page.description, isPartOf:{'@id':`${SITE_URL}/#website`}, ...(path === '/about' ? {mainEntity:{'@id':founderId}} : {}), ...(path !== '/' ? {breadcrumb:{'@id':`${absoluteUrl(path)}#breadcrumb`}} : {})},
  ];
  if (path === '/about' || path === '/') graph.push({'@type':'Person','@id':founderId, name:founder.name, alternateName:founder.alternateName, givenName:founder.givenName, familyName:founder.familyName, jobTitle:'Founder of BrandiQue Web Solutions', homeLocation:{'@type':'Place', name:'Visakhapatnam, Andhra Pradesh, India'}, knowsAbout:['Web Development','AI Agents','Workflow Automation','UI/UX Design','Branding','Graphic Design'], worksFor:{'@id':organizationId}, url:founderId, image:{'@type':'ImageObject', '@id':`${SITE_URL}/#founder-image`, url:absoluteUrl(founder.image), contentUrl:absoluteUrl(founder.image), width:founder.width, height:founder.height, caption:founder.alt, name:'BrandiQue Founder'}, sameAs:founderSameAs, description:founder.description});
  if (path === '/') (graph[2] as Record<string,unknown>).about = {'@id':organizationId};
  if (page.service) graph.push({'@type':'Service','@id':`${absoluteUrl(path)}#service`, name:page.service, serviceType:page.service, description:page.description, url:absoluteUrl(path), provider:{'@id':organizationId}, mainEntityOfPage:{'@id':`${absoluteUrl(path)}#webpage`}});
  if (path !== '/') {
    const crumbs = [{name:'Home',item:`${SITE_URL}/`}, ...(path.startsWith('/services/') ? [{name:'Services',item:`${SITE_URL}/services`}] : []), {name:page.label,item:absoluteUrl(path)}];
    graph.push({'@type':'BreadcrumbList','@id':`${absoluteUrl(path)}#breadcrumb`, itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
  }
  return {'@context':'https://schema.org','@graph':graph};
}
export function metaEntries(path: string) {
  const page = getSEO(path);
  const image = path === '/about' ? absoluteUrl(founder.image) : `${SITE_URL}/images/brandique-social.png`;
  return [
    ['name','description',page.description],['name','robots',pages[path] ? 'index, follow, max-image-preview:large' : 'noindex, follow'],
    ['property','og:site_name',COMPANY],['property','og:title',page.title],['property','og:description',page.description],['property','og:url',absoluteUrl(path)],['property','og:type','website'],['property','og:locale','en_IN'],['property','og:image',image],['property','og:image:alt',path === '/about' ? `${founder.name}, Founder of ${COMPANY}` : COMPANY],
    ['name','twitter:card',path === '/about' ? 'summary' : 'summary_large_image'],['name','twitter:title',page.title],['name','twitter:description',page.description],['name','twitter:image',image],['name','twitter:image:alt',path === '/about' ? `${founder.name}, Founder of ${COMPANY}` : COMPANY],
  ];
}
const escape = (s: string) => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function headHTML(path: string) {
 const data = structuredData(path);
 return `<title>${escape(getSEO(path).title)}</title>\n<link rel="canonical" href="${escape(absoluteUrl(path))}" />\n` + metaEntries(path).map(([attr,key,value])=>`<meta ${attr}="${key}" content="${escape(value)}" />`).join('\n') + (data ? `\n<script id="page-schema" type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>` : '');
}
