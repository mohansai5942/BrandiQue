import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Code2, Globe, Layout, Smartphone } from 'lucide-react';

interface ProjectMediaProps {
  image: string;
  video?: string;
  title: string;
}

function ProjectMedia({ image, video, title }: ProjectMediaProps) {
  const [showVideo, setShowVideo] = useState(!!video);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!showVideo && video) {
      timeoutId = setTimeout(() => {
        setShowVideo(true);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showVideo, video]);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.log("Auto-play prevented (expected in certain browser policies):", err);
      });
    }
  }, [showVideo]);

  const handleVideoEnded = () => {
    setShowVideo(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image layer */}
      <img
        src={image}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
          showVideo && video ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      />

      {/* Video layer */}
      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
            showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
}

const MAIN_PROJECTS = [
  {
    title: 'CREATOR PROMPTS',
    category: 'SAAS Ecosystem',
    desc: 'A dedicated ecosystem for digital creators and personal brands, offering AI-driven tools, resource hubs, and streamlined branding assets.',
    tags: ['Next.js', 'AI Tools', 'UI/UX'],
    image: 'https://cdn.imgchest.com/files/f7d1c1ce40b3.jpg',
    video: 'https://cdn.imgchest.com/files/800f6ef2e71a.mp4',
    link: 'https://creator.brandique.in',
  },
  {
    title: 'BRANDIQUE DEALS',
    category: 'E-Commerce',
    desc: 'A curated e-commerce and deals platform designed for conversion, featuring high-end digital products and exclusive commercial offers.',
    tags: ['Vite', 'Stripe', 'Dynamics'],
    image: 'https://cdn.imgchest.com/files/ff941a55a86f.jpg',
    link: 'https://deals.brandique.in',
  },
  {
    title: 'JJH GLOBAL SOLUTIONS',
    category: 'Corporate Enterprise',
    desc: 'A sophisticated global business platform providing enterprise-level solutions, corporate consultancy, and international market integration.',
    tags: ['Enterprise', 'Business', 'Global'],
    image: 'https://cdn.imgchest.com/files/b69e3d734cab.jpg',
    link: 'https://www.jjhglobalsolutions.com',
  },
  {
    title: 'JJH INTERIORS',
    category: 'Architecture & Design',
    desc: 'A luxury interior design portfolio showcasing high-end residential and commercial architectural projects with a focus on minimalist elegance.',
    tags: ['Design', 'Luxury', 'Portfolio'],
    image: 'https://cdn.imgchest.com/files/c881793b1aa7.jpg',
    link: 'https://interiors.jjhglobalsolutions.com',
  }
];

const PORTFOLIO_PROJECTS = [
  {
    title: 'MY FIRST PORTFOLIO',
    category: 'Handcrafted Web Presence',
    desc: 'Developed with complete handcrafted code, showcasing my early web design skills and clean layout structures.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    image: 'https://cdn.imgchest.com/files/2139b17e3f2c.png',
    link: 'https://mohanwebdeveloper.netlify.app/',
  },
  {
    title: 'MY SECOND PORTFOLIO',
    category: 'Advanced Personal Hub',
    desc: 'Crafted entirely through custom code, leveraging highly optimized react components and smooth responsive flow.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Motion'],
    image: 'https://cdn.imgchest.com/files/c3409d9bab31.png',
    link: 'https://mohanwebdeveloperr.netlify.app/',
  },
  {
    title: 'MY THIRD PORTFOLIO',
    category: 'AI-Augmented Architecture',
    desc: 'Designed and built with advanced AI assistance to deliver modern web layouts, lightning-fast rendering speeds, and pristine component layouts.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'AI Hybrid'],
    image: 'https://cdn.imgchest.com/files/d81f1c6d666b.png',
    link: 'https://mohan.brandique.in/',
  }
];

const FIGMA_PROJECTS = [
  {
    title: 'ARCAR | SPORTS CAR STORE',
    category: 'UI/UX Interactive Design',
    desc: 'Immersive e-commerce store layout built in Figma targeting high-end luxury sports cars, structured with customized 3D spatial grids.',
    tags: ['Figma', 'UI/UX Layout', 'Visual Concept'],
    image: 'https://cdn.imgchest.com/files/ffa2d64a507b.png',
    link: 'https://www.figma.com/design/krZKRq4Zs2xXXVcI4z6qJw/Car-animation-3D?node-id=0-1&p=f',
  },
  {
    title: 'MOHAN STORE | APPLE BRAND',
    category: 'App Design Blueprint',
    desc: 'Sleek electronic e-commerce store wireframes designed in Figma featuring optimized checkout pathways and high-fidelity mockups.',
    tags: ['Figma', 'Mobile UI', 'Prototyping'],
    image: 'https://cdn.imgchest.com/files/897a32eccb2e.png',
    link: 'https://www.figma.com/design/hV0EWIq8kgpNAfeOpsdLVz/MOHAN-STORE-app?node-id=34-213',
  },
  {
    title: 'POSITIVUS | DIGITAL MARKETING',
    category: 'Premium Landing Page Design',
    desc: 'Clean digital advertising agency prototype created in Figma displaying harmonious element scaling, typography grids and color accents.',
    tags: ['Figma', 'Typography', 'Landing Page'],
    image: 'https://cdn.imgchest.com/files/8e2e7168297c.png',
    link: 'https://www.figma.com/design/fYVRNHkDiTNB5jEnOkammo/Positivus-Landing-Page-Design--Community-?node-id=25-145&p=f',
  }
];

const CLIENT_PERSONAL_PROJECTS = [
  {
    title: 'MOHAN SALAAR CREATE',
    category: 'Digital Artwork & Poster Editing',
    desc: 'An elaborate cinematic character poster design and detailed image manipulation project crafted to client specifications.',
    tags: ['Photoshop', 'Digital Design', 'Graphic Manipulation'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/20250308_012135.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/mohan%20salaar%20create.png',
  },
  {
    title: 'VATIKA PRODUCT DESIGN',
    category: 'Commercial Advertisement Mockup',
    desc: 'An eye-catching commercial design and product render highlighting herbal elements and premium container mockups.',
    tags: ['Product Design', 'Branding', 'Ad Graphics'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/vatika.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/MOHAN%20product%20Vatika.jpg',
  },
  {
    title: 'BLENDER 3D CREATION',
    category: '3D modeling & render visualization',
    desc: 'A custom, detailed environmental render with optimized lighting simulations and cinematic video layout, compiled completely in Blender.',
    tags: ['Blender 3D', '3D Modeling', 'Render Rendering'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/Blender-Symbol.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/videos/mohan%20blender%20creation.mp4',
  },
  {
    title: 'MOHAN LOGO DESIGN',
    category: 'Enterprise Visual Redesign',
    desc: 'A clean and professional visual redesign concept targeting corporate logos to deliver peak geometric precision and modern brand identity.',
    tags: ['Identity Design', 'Vector logo', 'Redesign Brand'],
    image: 'https://mohanwebdeveloperr.netlify.app/assets/images/Cigna-Logo.png',
    link: 'https://mohanwebdeveloperr.netlify.app/assets/images/mohan%20logo%20design.jpg',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, // Ultra smooth, high-end cubic bezier curve
    },
  },
};

export default function Projects() {
  const renderProjectCard = (project: any, i: number, type: string) => (
    <motion.a
      key={`${type}-${i}`}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      className="group relative cursor-pointer block"
    >
       {/* Image / Visual Card */}
       <div className="relative aspect-[16/10] bg-gray-100 dark:bg-white/[0.03] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-700 group-hover:bg-neon-purple/5 group-hover:border-neon-purple/20 group-hover:translate-y-[-10px] group-hover:shadow-[0_25px_60px_rgba(176,38,255,0.15)]">
          <ProjectMedia 
             image={project.image} 
             video={project.video}
             title={project.title}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
             <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform">
                   <ExternalLink size={20} />
                </div>
                {type === 'client' && (
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-2 bg-black/40 px-3 py-1 rounded-full">
                     Click to view project
                  </span>
                )}
             </div>
          </div>
       </div>

       {/* Info */}
       <div className="mt-4 md:mt-8 px-2 md:px-4">
          <p className="text-[10px] font-semibold text-neon-purple dark:text-neon-blue tracking-[0.3em] uppercase mb-1.5 md:mb-3">{project.category}</p>
          <h3 className={`text-lg ${type === 'figma' || type === 'client' ? 'md:text-[28px]' : type === 'portfolio' ? 'md:text-[29px]' : 'md:text-3xl'} font-heading font-bold text-gray-900 dark:text-white mb-2 md:mb-4 group-hover:text-neon-purple dark:group-hover:text-neon-blue transition-colors uppercase`}>{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-[11px] md:text-sm leading-relaxed mb-3 md:mb-6">{project.desc}</p>
          <div className="flex flex-wrap gap-2 text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-3">
             {project.tags.map((tag: string, tIndex: number) => (
               <span key={tIndex}>{tag} {tIndex < project.tags.length - 1 ? "•" : ""}</span>
             ))}
          </div>
          {type === 'client' && (
            <div className="inline-flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-neon-purple dark:text-neon-blue group-hover:underline uppercase tracking-widest mt-1">
              CLICK HERE TO VIEW PROJECT <ExternalLink size={11} className="text-neon-purple dark:text-neon-blue" />
            </div>
          )}
       </div>
    </motion.a>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white min-h-screen pt-28 md:pt-36 pb-20 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-[1500px]">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-32 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-neon-purple dark:text-neon-blue tracking-[0.4em] md:tracking-[0.5em] uppercase mb-3 md:mb-4 block"
          >
            Showcase
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 md:mb-8 uppercase text-balance leading-[1.1]"
          >
            DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">ARTIFACTS.</span>
          </motion.h1>
          <p className="text-sm md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl text-balance font-light">
            A curated selection of my work across custom software engineering, coding portfolios, and premium Figma prototypes.
          </p>
        </div>

        {/* Section: Main Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // MAIN PROJECTS
            </h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
          >
             {MAIN_PROJECTS.map((project, i) => renderProjectCard(project, i, 'main'))}
          </motion.div>
        </div>

        {/* Section: Portfolio Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // PORTFOLIO PROJECTS
            </h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
          >
             {PORTFOLIO_PROJECTS.map((project, i) => renderProjectCard(project, i, 'portfolio'))}
          </motion.div>
        </div>

        {/* Section: Figma Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // FIGMA PROJECTS
            </h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12"
          >
              {FIGMA_PROJECTS.map((project, i) => renderProjectCard(project, i, 'figma'))}
          </motion.div>
        </div>

        {/* Section: Client & Personal Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // CLIENT & PERSONAL PROJECTS
            </h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
          >
             {CLIENT_PERSONAL_PROJECTS.map((project, i) => (
               <motion.a
                 key={`client-${i}`}
                 href={project.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 variants={cardVariants}
                 className="group relative cursor-pointer block"
               >
                  {/* Visual Logo Card */}
                  <div className="relative aspect-square bg-white dark:bg-white/[0.02] rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-500 group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.05] group-hover:border-neon-purple/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(176,38,255,0.08)] flex items-center justify-center p-6 md:p-10">
                     <img 
                        src={project.image} 
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="max-w-[85%] max-h-[85%] object-contain filter grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                     />
                  </div>

                  {/* Hover Information Below the Card */}
                  <div className="mt-4 text-center transition-all duration-300 opacity-60 group-hover:opacity-100">
                     <p className="inline-flex items-center gap-1.5 text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-white/30 group-hover:text-neon-purple dark:group-hover:text-neon-blue tracking-[0.2em] uppercase transition-colors">
                        View Creation 
                        <ExternalLink size={9} className="text-neon-purple dark:text-neon-blue" />
                     </p>
                  </div>
               </motion.a>
             ))}
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="mt-12 md:mt-60 border-t border-gray-200 dark:border-white/5 pt-10 md:pt-40">
           <div className="max-w-4xl mx-auto">
              <div>
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-8 md:mb-12 uppercase text-gray-900 dark:text-white">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Methodology</span> Behind The Build.</h2>
                 <div className="space-y-6 md:space-y-12">
                    {[
                      { step: "01", title: "STRATEGIC AUDIT", desc: "Before a single line of code is written, I audit the existing business logic and brand signals to ensure the product has a clear path to domination." },
                      { step: "02", title: "ARCHITECTURAL BLUEPRINT", desc: "Designing high-performance systems requires a mechanical mindset. I build blueprints that account for scalability, edge cases, and peak load handling." },
                      { step: "03", title: "MASTER CRAFTSMANSHIP", desc: "The build phase is rigorous. I use the latest stable tech stacks to ensure 60fps performance and absolute pixel perfection across all devices." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 md:gap-8 group">
                         <span className="text-lg md:text-2xl font-bold text-neon-purple/20 group-hover:text-neon-purple dark:text-neon-blue/20 dark:group-hover:text-neon-blue transition-colors">{item.step}</span>
                         <div>
                            <h4 className="text-base md:text-xl font-bold mb-1.5 md:mb-3 tracking-widest uppercase text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-[11px] md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-light">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 md:py-20">
           <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 uppercase text-gray-900 dark:text-white">Have a vision?</h2>
           <p className="text-xs md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto mb-8 md:mb-12 font-light">
             Currently open for strategic partnerships and high-impact digital transformations. Let's build something that stands out.
           </p>
           <motion.a
             href="https://wa.me/917093320572?text=Hello!%20I%20have%20a%20project%20idea.%20Can%20we%20discuss%20it%3F"
             target="_blank"
             rel="noopener noreferrer"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="inline-block px-8 md:px-12 py-4 md:py-5 bg-neon-purple text-white font-bold text-[10px] md:text-xs tracking-[0.3em] rounded-xl md:rounded-2xl shadow-[0_4px_35px_rgba(176,38,255,0.25)] uppercase hover:bg-black transition-all duration-300"
           >
              START A PROJECT
           </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
