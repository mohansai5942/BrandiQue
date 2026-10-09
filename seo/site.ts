// One source of truth for visible founder images and all entity/social references.
// Replace this image in place, or change image here and rebuild the site.
export const SITE_URL = 'https://brandique.in';
export const COMPANY = 'BrandiQue Web Solutions';
export const founder = {
  name: 'Kutikuppala Mohan Rao',
  alternateName: ['K Mohan', 'K. Mohan', 'K Mohan Rao', 'K. Mohan Rao', 'Mohan Rao'],
  image: 'https://cdn.imgchest.com/files/3359d7725202.jpg',
  description: 'Kutikuppala Mohan Rao is the Founder of BrandiQue Web Solutions. His work focuses on web and app engineering, AI agents, workflow automation, UI/UX and branding.',
};
export const organizationId = `${SITE_URL}/#organization`;
export const founderId = `${SITE_URL}/about#founder`;
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export interface PageSEO { title: string; description: string; label: string; service?: string; }
export const pages: Record<string, PageSEO> = {
  '/': { title: 'Websites, Branding & AI Automation | BrandiQue', label: 'Home', description: 'BrandiQue Web Solutions helps businesses build a clearer online presence with responsive websites, practical workflow automation, brand identity and digital marketing.' },
  '/about': { title: 'Kutikuppala Mohan Rao, Founder | BrandiQue Web Solutions', label: 'About', description: 'Meet Kutikuppala Mohan Rao, Founder of BrandiQue Web Solutions. Learn about our web development, AI automation and design work in Visakhapatnam.' },
  '/contact': { title: 'Contact BrandiQue Web Solutions | Visakhapatnam', label: 'Contact', description: 'Discuss a website, AI automation, branding or marketing project with BrandiQue Web Solutions in Visakhapatnam. Contact the team for a project-specific quote.' },
  '/services': { title: 'Website, Branding & Automation Services | BrandiQue', label: 'Services', description: 'Compare clearly scoped website development, brand identity, digital marketing and AI automation services. Explore starting packages and discuss the right solution for your business.' },
  '/web-development': { title: 'Website Design & Development Pricing | BrandiQue', label: 'Website development', service: 'Website design and development', description: 'Compare starting prices for personal, portfolio, business and e-commerce websites. Review inclusions, delivery steps and scope before requesting a project quote from BrandiQue.' },
  '/services/full-stack': { title: 'Full-Stack & React Development | BrandiQue Web Solutions', label: 'Full-stack development', service: 'Full-stack web development', description: 'Custom React websites and full-stack web applications for business sites, portfolios and e-commerce. Explore BrandiQue’s process, features and deliverables.' },
  '/services/wordpress': { title: 'WordPress & E-Commerce Development | BrandiQue', label: 'WordPress development', service: 'WordPress development', description: 'Build a manageable WordPress business website, portfolio or online store. BrandiQue provides responsive design, setup, optimization and handover guidance.' },
  '/services/branding': { title: 'Brand Identity & Logo Design | BrandiQue Web Solutions', label: 'Branding and identity', service: 'Brand identity and logo design', description: 'Create a consistent brand with logo design, color palettes, typography and brand guidelines. Explore branding services from BrandiQue Web Solutions.' },
  '/services/digital-marketing': { title: 'SEO & Digital Marketing Services | BrandiQue', label: 'Digital marketing', service: 'SEO and digital marketing', description: 'Explore SEO, social content and digital marketing services from BrandiQue Web Solutions. Plan campaigns and content around your audience and business goals.' },
  '/services/ai-automation': { title: 'AI Agents, Chatbots & Workflow Automation | BrandiQue', label: 'AI and automation', service: 'AI agents and workflow automation', description: 'Explore practical lead capture, chatbot and workflow automation services from BrandiQue. Every implementation is scoped around the required integrations, operating costs and handover needs.' },
  '/projects': { title: 'Web Design & Automation Projects | BrandiQue', label: 'Projects', description: 'Explore BrandiQue Web Solutions’ website designs, development projects and n8n workflows. Find examples relevant to your next business website or automation.' },
  '/privacy-policy': { title: 'Privacy Policy | BrandiQue Web Solutions', label: 'Privacy policy', description: 'Read how BrandiQue Web Solutions handles contact information, website usage data and privacy enquiries when you use our website and services.' },
  '/terms-and-conditions': { title: 'Terms & Conditions | BrandiQue Web Solutions', label: 'Terms and conditions', description: 'Review the terms for using BrandiQue Web Solutions’ website and engaging our services, including project agreements, responsibilities and intellectual property.' },
  '/cookie-policy': { title: 'Cookie Policy | BrandiQue Web Solutions', label: 'Cookie policy', description: 'Learn how BrandiQue Web Solutions uses cookies and local storage, including theme preferences, and how you can manage browser storage settings.' },
};
export const redirects: Record<string,string> = {
  '/services/full-stack-web-development': '/services/full-stack',
  '/services/wordpress-development': '/services/wordpress',
  '/services/branding-identity': '/services/branding',
};
export function getSEO(path: string) {
  return pages[path] || {title: path === '/login' ? 'Admin Login | BrandiQue' : path === '/admin' ? 'Admin | BrandiQue' : 'Page Not Found | BrandiQue', label: 'Page not found', description: 'This page is not available. Explore BrandiQue Web Solutions services or contact our team.'};
}
export function structuredData(path: string) {
  if (!pages[path]) return null;
  const page = pages[path];
  const graph: Record<string,unknown>[] = [
    {'@type':'Organization','@id': organizationId, name: COMPANY, alternateName: 'BrandiQue', url: `${SITE_URL}/`, founder: {'@id':founderId}, sameAs: ['https://www.instagram.com/brandiquewebsolutions/'], location: {'@type':'Place', name:'Visakhapatnam, India'}},
    {'@type':'WebSite','@id':`${SITE_URL}/#website`, url:`${SITE_URL}/`, name:COMPANY, publisher:{'@id':organizationId}},
    {'@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : path === '/projects' || path === '/services' ? 'CollectionPage' : 'WebPage', '@id':`${absoluteUrl(path)}#webpage`, url:absoluteUrl(path), name:page.title, description:page.description, isPartOf:{'@id':`${SITE_URL}/#website`}, ...(path === '/about' ? {mainEntity:{'@id':founderId}} : {}), ...(path !== '/' ? {breadcrumb:{'@id':`${absoluteUrl(path)}#breadcrumb`}} : {})},
  ];
  if (path === '/about') graph.push({'@type':'Person','@id':founderId, name:founder.name, alternateName:founder.alternateName, jobTitle:'Founder', worksFor:{'@id':organizationId}, url:founderId, image:absoluteUrl(founder.image), description:founder.description});
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
