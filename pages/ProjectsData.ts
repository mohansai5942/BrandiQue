import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  // MAIN PROJECTS
  {
    id: 'initial-main-1',
    title: 'CREATOR PROMPTS',
    category: 'SAAS Ecosystem',
    desc: 'A dedicated ecosystem for digital creators and personal brands, offering AI-driven tools, resource hubs, and streamlined branding assets.',
    tags: ['Next.js', 'AI Tools', 'UI/UX'],
    image: 'https://cdn.imgchest.com/files/f7d1c1ce40b3.jpg',
    video: 'https://cdn.imgchest.com/files/800f6ef2e71a.mp4',
    link: 'https://creator.brandique.in',
    type: 'main',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:00.000Z'
  },
  {
    id: 'initial-main-2',
    title: 'BRANDIQUE DEALS',
    category: 'E-Commerce',
    desc: 'A curated e-commerce and deals platform designed for conversion, featuring high-end digital products and exclusive commercial offers.',
    tags: ['Vite', 'Stripe', 'Dynamics'],
    image: 'https://cdn.imgchest.com/files/ff941a55a86f.jpg',
    link: 'https://deals.brandique.in',
    type: 'main',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:01.000Z'
  },
  {
    id: 'initial-main-3',
    title: 'JJH GLOBAL SOLUTIONS',
    category: 'Corporate Enterprise',
    desc: 'A sophisticated global business platform providing enterprise-level solutions, corporate consultancy, and international market integration.',
    tags: ['Enterprise', 'Business', 'Global'],
    image: 'https://cdn.imgchest.com/files/b69e3d734cab.jpg',
    link: 'https://www.jjhglobalsolutions.com',
    type: 'main',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:02.000Z'
  },
  {
    id: 'initial-main-4',
    title: 'JJH INTERIORS',
    category: 'Architecture & Design',
    desc: 'A luxury interior design portfolio showcasing high-end residential and commercial architectural projects with a focus on minimalist elegance.',
    tags: ['Design', 'Luxury', 'Portfolio'],
    image: 'https://cdn.imgchest.com/files/c881793b1aa7.jpg',
    link: 'https://interiors.jjhglobalsolutions.com',
    type: 'main',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:03.000Z'
  },

  // PORTFOLIO PROJECTS
  {
    id: 'initial-portfolio-1',
    title: 'MY FIRST PORTFOLIO',
    category: 'Handcrafted Web Presence',
    desc: 'Developed with complete handcrafted code, showcasing my early web design skills and clean layout structures.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    image: 'https://cdn.imgchest.com/files/2139b17e3f2c.png',
    link: 'https://mohanwebdeveloper.netlify.app/',
    type: 'portfolio',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:04.000Z'
  },
  {
    id: 'initial-portfolio-2',
    title: 'MY SECOND PORTFOLIO',
    category: 'Advanced Personal Hub',
    desc: 'Crafted entirely through custom code, leveraging highly optimized react components and smooth responsive flow.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Motion'],
    image: 'https://cdn.imgchest.com/files/c3409d9bab31.png',
    link: 'https://mohanwebdeveloperr.netlify.app/',
    type: 'portfolio',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:05.000Z'
  },
  {
    id: 'initial-portfolio-3',
    title: 'MY THIRD PORTFOLIO',
    category: 'AI-Augmented Architecture',
    desc: 'Designed and built with advanced AI assistance to deliver modern web layouts, lightning-fast rendering speeds, and pristine component layouts.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'AI Hybrid'],
    image: 'https://cdn.imgchest.com/files/d81f1c6d666b.png',
    link: 'https://mohan.brandique.in/',
    type: 'portfolio',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:06.000Z'
  },

  // FIGMA PROJECTS
  {
    id: 'initial-figma-1',
    title: 'ARCAR | SPORTS CAR STORE',
    category: 'UI/UX Interactive Design',
    desc: 'Immersive e-commerce store layout built in Figma targeting high-end luxury sports cars, structured with customized 3D spatial grids.',
    tags: ['Figma', 'UI/UX Layout', 'Visual Concept'],
    image: 'https://cdn.imgchest.com/files/ffa2d64a507b.png',
    link: 'https://www.figma.com/design/krZKRq4Zs2xXXVcI4z6qJw/Car-animation-3D?node-id=0-1&p=f',
    type: 'figma',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:07.000Z'
  },
  {
    id: 'initial-figma-2',
    title: 'MOHAN STORE | APPLE BRAND',
    category: 'App Design Blueprint',
    desc: 'Sleek electronic e-commerce store wireframes designed in Figma featuring optimized checkout pathways and high-fidelity mockups.',
    tags: ['Figma', 'Mobile UI', 'Prototyping'],
    image: 'https://cdn.imgchest.com/files/897a32eccb2e.png',
    link: 'https://www.figma.com/design/hV0EWIq8kgpNAfeOpsdLVz/MOHAN-STORE-app?node-id=34-213',
    type: 'figma',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:08.000Z'
  },
  {
    id: 'initial-figma-3',
    title: 'POSITIVUS | DIGITAL MARKETING',
    category: 'Premium Landing Page Design',
    desc: 'Clean digital advertising agency prototype created in Figma displaying harmonious element scaling, typography grids and color accents.',
    tags: ['Figma', 'Typography', 'Landing Page'],
    image: 'https://cdn.imgchest.com/files/8e2e7168297c.png',
    link: 'https://www.figma.com/design/fYVRNHkDiTNB5jEnOkammo/Positivus-Landing-Page-Design--Community-?node-id=25-145&p=f',
    type: 'figma',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:09.000Z'
  },

  // CLIENT PERSONAL PROJECTS
  {
    id: 'initial-client-1',
    title: 'MOHAN SALAAR CREATE',
    category: 'Digital Artwork & Poster Editing',
    desc: 'An elaborate cinematic character poster design and detailed image manipulation project crafted to client specifications.',
    tags: ['Photoshop', 'Digital Design', 'Graphic Manipulation'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/20250308_012135.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/mohan%20salaar%20create.png',
    type: 'client',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:10.000Z'
  },
  {
    id: 'initial-client-2',
    title: 'VATIKA PRODUCT DESIGN',
    category: 'Commercial Advertisement Mockup',
    desc: 'An eye-catching commercial design and product render highlighting herbal elements and premium container mockups.',
    tags: ['Product Design', 'Branding', 'Ad Graphics'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/vatika.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/MOHAN%20product%20Vatika.jpg',
    type: 'client',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:11.000Z'
  },
  {
    id: 'initial-client-3',
    title: 'BLENDER 3D CREATION',
    category: '3D modeling & render visualization',
    desc: 'A custom, detailed environmental render with optimized lighting simulations and cinematic video layout, compiled completely in Blender.',
    tags: ['Blender 3D', '3D Modeling', 'Render Rendering'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/Blender-Symbol.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/videos/mohan%20blender%20creation.mp4',
    type: 'client',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:12.000Z'
  },
  {
    id: 'initial-client-4',
    title: 'MOHAN LOGO DESIGN',
    category: 'Enterprise Visual Redesign',
    desc: 'A clean and professional visual redesign concept targeting corporate logos to deliver peak geometric precision and modern brand identity.',
    tags: ['Identity Design', 'Vector logo', 'Redesign Brand'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/Cigna-Logo.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/mohan%20logo%20design.jpg',
    type: 'client',
    isDeleted: false,
    createdAt: '2026-08-11T00:00:13.000Z'
  }
];
