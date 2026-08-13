import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Code2, Globe, Layout, Smartphone, RefreshCw } from 'lucide-react';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Project } from '../types';
import { INITIAL_PROJECTS } from './ProjectsData';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error (Gracefully handled with mock fallback): ', JSON.stringify(errInfo));
}

interface ProjectMediaProps {
  image: string;
  video?: string;
  images?: string[];
  videos?: string[];
  title: string;
}

function ProjectMedia({ image, video, images = [], videos = [], title }: ProjectMediaProps) {
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const allVideos = videos && videos.length > 0 ? videos : (video ? [video] : []);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentImg = allImages[activeImgIndex] || allImages[0] || image;
  const currentVid = allVideos[0] || video;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!showVideo && currentVid) {
      timeoutId = setTimeout(() => {
        setShowVideo(true);
      }, 3500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showVideo, currentVid]);

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
    <div className="relative w-full h-full overflow-hidden group/media">
      {/* Image layer */}
      <img
        src={currentImg}
        alt={title}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
          showVideo && currentVid ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      />

      {/* Video layer */}
      {currentVid && (
        <video
          ref={videoRef}
          src={currentVid}
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out ${
            showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        />
      )}

      {/* Multi-image indicators if more than 1 image exists */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-2 z-20 flex gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 opacity-90 group-hover/media:opacity-100 transition-opacity">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowVideo(false);
                setActiveImgIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                activeImgIndex === idx ? 'bg-neon-purple w-4' : 'bg-white/40 hover:bg-white'
              }`}
              title={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


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
  const getCachedProjects = (): Project[] => {
    const cached = localStorage.getItem('brandique_projects');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PROJECTS;
  };

  const [projects, setProjects] = useState<Project[]>(getCachedProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'projects'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          const seeded: Project[] = [];
          for (const p of INITIAL_PROJECTS) {
            const { id, ...dataWithoutId } = p;
            const docRef = await addDoc(collection(db, 'projects'), dataWithoutId);
            seeded.push({ id: docRef.id, ...dataWithoutId });
          }
          const finalList = seeded.length > 0 ? seeded : INITIAL_PROJECTS;
          localStorage.setItem('brandique_projects', JSON.stringify(finalList));
          setProjects(finalList);
        } catch (seedErr) {
          console.warn("Seeding to Firestore skipped or failed:", seedErr);
          localStorage.setItem('brandique_projects', JSON.stringify(INITIAL_PROJECTS));
          setProjects(INITIAL_PROJECTS);
        }
        setLoading(false);
        return;
      }

      const list: Project[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Project);
      });

      list.sort((a, b) => {
        const valA = a.createdAt || '';
        const valB = b.createdAt || '';
        return valA.localeCompare(valB);
      });

      localStorage.setItem('brandique_projects', JSON.stringify(list));
      setProjects(list);
      setLoading(false);
    }, (err) => {
      console.warn("Real-time projects listener error, using cached fallback:", err);
      const cached = localStorage.getItem('brandique_projects');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        } catch (e) {}
      }
      handleFirestoreError(err, OperationType.GET, 'projects');
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const activeProjects = projects.filter(p => !p.isDeleted);
  const mainProjects = activeProjects.filter(p => p.type === 'main');
  const portfolioProjects = activeProjects.filter(p => p.type === 'portfolio');
  const figmaProjects = activeProjects.filter(p => p.type === 'figma');
  const clientProjects = activeProjects.filter(p => p.type === 'client');

  const renderProjectCard = (project: any, i: number, type: string) => (
    <motion.a
      key={`${type}-${project.id || i}`}
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
             images={project.images}
             videos={project.videos}
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
             {project.tags?.map((tag: string, tIndex: number) => (
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
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">PROJECTS.</span>
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
          {mainProjects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
            >
               {mainProjects.map((project, i) => renderProjectCard(project, i, 'main'))}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No main projects uploaded.</p>
          )}
        </div>

        {/* Section: Portfolio Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // PORTFOLIO PROJECTS
            </h2>
          </div>
          {portfolioProjects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
            >
               {portfolioProjects.map((project, i) => renderProjectCard(project, i, 'portfolio'))}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No portfolio projects uploaded.</p>
          )}
        </div>

        {/* Section: Figma Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // FIGMA PROJECTS
            </h2>
          </div>
          {figmaProjects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12"
            >
                {figmaProjects.map((project, i) => renderProjectCard(project, i, 'figma'))}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No Figma projects uploaded.</p>
          )}
        </div>

        {/* Section: Client & Personal Projects */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
              // CLIENT & PERSONAL PROJECTS
            </h2>
          </div>
          {clientProjects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
            >
               {clientProjects.map((project, i) => (
                 <motion.a
                   key={`client-${project.id || i}`}
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
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No client or personal projects uploaded.</p>
          )}
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
