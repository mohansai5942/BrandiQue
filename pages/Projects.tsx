import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Code2, Globe, Layout, Smartphone, RefreshCw, Bot, Layers, Eye, Copy, Check, X, Phone, Mail, Send, CheckCircle2, FileText } from 'lucide-react';
import { collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Project, N8nProject } from '../types';
import { INITIAL_PROJECTS } from './ProjectsData';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { N8nWorkflowViewer } from '../components/N8nWorkflowViewer';

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
  fitMode?: 'cover' | 'contain';
}

function ProjectMedia({ image, video, images = [], videos = [], title, fitMode = 'cover' }: ProjectMediaProps) {
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

  const objectFitClass = fitMode === 'contain' ? 'object-contain max-w-[85%] max-h-[85%] m-auto' : 'object-cover w-full h-full';

  return (
    <div 
      className="relative w-full h-full overflow-hidden group/media flex items-center justify-center select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Image layer */}
      {currentImg && (
        <img
          src={currentImg}
          alt={title}
          referrerPolicy="no-referrer"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
          className={`absolute inset-0 ${objectFitClass} grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out select-none pointer-events-none ${
            showVideo && currentVid ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        />
      )}

      {/* Video layer */}
      {currentVid && (
        <video
          ref={videoRef}
          src={currentVid}
          muted
          playsInline
          onEnded={handleVideoEnded}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
          className={`absolute inset-0 ${objectFitClass} grayscale-0 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out select-none pointer-events-none ${
            showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}

      {/* Multi-image indicators if more than 1 image exists */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-2 z-20 flex gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 opacity-90 group-hover/media:opacity-100 transition-opacity pointer-events-auto">
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
              onContextMenu={(e) => e.preventDefault()}
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
          const map = new Map<string, Project>();
          parsed.forEach((p: Project) => {
            if (p && p.title) {
              const key = p.title.trim().toLowerCase();
              if (!map.has(key)) map.set(key, p);
            }
          });
          return Array.from(map.values());
        }
      } catch (e) {
        // Fallback
      }
    }
    const initMap = new Map<string, Project>();
    INITIAL_PROJECTS.forEach((p) => {
      if (p && p.title) {
        const key = p.title.trim().toLowerCase();
        if (!initMap.has(key)) initMap.set(key, p);
      }
    });
    return Array.from(initMap.values());
  };

  const { projects, n8nProjects, loadingProjects: loading, addN8nFormSubmission } = useSiteSettings();

  const [selectedN8nProject, setSelectedN8nProject] = useState<N8nProject | null>(null);
  const [copiedJsonId, setCopiedJsonId] = useState<string | null>(null);

  // Client Request Form Modal State
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleClientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/[^\d]/g, '').length < 7) {
      setFormError('Please enter a valid phone number.');
      return;
    }

    if (!selectedN8nProject) return;

    setFormSubmitting(true);
    try {
      await addN8nFormSubmission({
        projectId: selectedN8nProject.id,
        projectTitle: selectedN8nProject.title,
        name: clientName.trim() || 'Interested Client',
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        message: clientMessage.trim()
      });

      setFormSubmitting(false);
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setIsClientFormOpen(false);
        setClientName('');
        setClientEmail('');
        setClientPhone('');
        setClientMessage('');
      }, 2500);
    } catch (err) {
      setFormSubmitting(false);
      setFormError('Failed to submit inquiry. Please try again.');
    }
  };

  const activeProjects = projects.filter(p => !p.isDeleted);
  const activeN8nProjects = (n8nProjects || []).filter(p => !p.isDeleted);
  const mainProjects = activeProjects.filter(p => p.type === 'main');
  const portfolioProjects = activeProjects.filter(p => p.type === 'portfolio');
  const figmaProjects = activeProjects.filter(p => p.type === 'figma');
  const clientProjects = activeProjects.filter(p => p.type === 'client');

  const renderProjectCard = (project: any, i: number, type: string) => (
    <motion.a
      key={`${type}-${project.id || i}-${i}`}
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
              animate="visible"
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
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
            >
               {portfolioProjects.map((project, i) => renderProjectCard(project, i, 'portfolio'))}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No portfolio projects uploaded.</p>
          )}
        </div>

        {/* Section: N8N Projects & 24/7 Automation Workflows */}
        <div className="mb-20 md:mb-36">
          <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between">
            <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-orange-500 dark:text-orange-400 flex items-center gap-2">
              <Bot className="w-5 h-5 md:w-7 md:h-7" />
              // N8N PROJECTS & 24/7 AUTOMATION WORKFLOWS
            </h2>
            <span className="text-[10px] md:text-xs font-mono text-gray-500 dark:text-gray-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
              Interactive Canvas
            </span>
          </div>

          {activeN8nProjects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeN8nProjects.map((project, i) => {
                let nodeCount = project.nodeCount || 0;
                try {
                  if (!nodeCount && project.workflowJson) {
                    const parsed = JSON.parse(project.workflowJson);
                    nodeCount = (parsed.nodes || []).length;
                  }
                } catch (e) {}

                return (
                  <motion.div
                    key={`n8n-${project.id || i}`}
                    variants={cardVariants}
                    onClick={() => setSelectedN8nProject(project)}
                    className="group relative cursor-pointer bg-white dark:bg-[#0F1320] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-orange-500/50 hover:shadow-[0_20px_50px_rgba(255,109,0,0.15)] transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Visual Workflow Canvas Header */}
                    <div className="h-48 md:h-52 bg-[#17181c] relative overflow-hidden border-b border-gray-200 dark:border-white/10 pointer-events-none">
                      <N8nWorkflowViewer workflowJson={project.workflowJson} height="100%" showControls={false} fitPadding={0.18} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1320]/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-orange-400 flex items-center gap-1.5 shadow-lg">
                          <Layers size={12} />
                          {nodeCount} Nodes
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md inline-block mb-2">
                          {project.category || 'n8n Automation'}
                        </span>
                        <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {project.desc || 'Interactive n8n automation workflow diagram.'}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {project.tags.map((tag, tIdx) => (
                              <span 
                                key={tIdx}
                                className="text-[9px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-orange-500 dark:text-orange-400">
                        <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                          <Eye size={14} />
                          Interactive Workflow Canvas
                        </span>
                        <span className="text-[10px] bg-orange-500/10 px-2.5 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                          Inspect Flow →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-light italic">No n8n workflow projects available yet.</p>
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
              animate="visible"
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
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
            >
               {clientProjects.map((project, i) => (
                 <motion.a
                   key={`client-${project.id || i}`}
                   href={project.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   variants={cardVariants}
                   onContextMenu={(e) => e.preventDefault()}
                   className="group relative cursor-pointer block select-none"
                 >
                    {/* Visual Logo Card */}
                    <div 
                      className="relative aspect-square bg-white dark:bg-white/[0.02] rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-500 group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.05] group-hover:border-neon-purple/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(176,38,255,0.08)] flex items-center justify-center p-6 md:p-10 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                       <ProjectMedia 
                         image={project.image} 
                         video={project.video}
                         images={project.images}
                         videos={project.videos}
                         title={project.title}
                         fitMode="contain"
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

      {/* Interactive n8n Workflow Modal Popup */}
      {selectedN8nProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-white/10 rounded-3xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191b22]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <Bot size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-md">
                    {selectedN8nProject.category || 'n8n Workflow'}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white mt-0.5">
                    {selectedN8nProject.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {selectedN8nProject.testWorkflowUrl && (
                  <a
                    href={selectedN8nProject.testWorkflowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <ExternalLink size={14} />
                    Test Workflow
                  </a>
                )}

                {selectedN8nProject.allowClientRequest !== false && (
                  <button
                    onClick={() => setIsClientFormOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <FileText size={14} />
                    Request Custom Setup
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedN8nProject(null);
                    setIsClientFormOpen(false);
                  }}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Canvas Body */}
            <div className="flex-1 relative w-full h-full bg-[#17181c]">
              <N8nWorkflowViewer 
                workflowJson={selectedN8nProject.workflowJson} 
                height="100%" 
                showControls={true}
                fitPadding={0.15}
              />
            </div>

            {/* Modal Footer Description */}
            {selectedN8nProject.desc && (
              <div className="p-4 md:p-6 bg-[#191b22] border-t border-white/10 text-xs md:text-sm text-gray-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="line-clamp-2 leading-relaxed">{selectedN8nProject.desc}</p>
                <button
                  onClick={() => setIsClientFormOpen(true)}
                  className="shrink-0 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <FileText size={13} />
                  Request Custom Setup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLIENT INQUIRY FORM POPUP MODAL */}
      {isClientFormOpen && selectedN8nProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#13151b] border border-orange-500/30 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Request Custom Workflow Setup</h3>
                  <p className="text-xs text-orange-400 font-medium truncate max-w-[260px]">
                    {selectedN8nProject.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsClientFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-white">Request Received!</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Thank you! We have received your request for <strong>{selectedN8nProject.title}</strong>. Our team will get in touch with you shortly on your provided phone & email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClientFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail size={12} /> Email Address * (Mandatory)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="e.g. rahul@company.com"
                    className="w-full px-4 py-2.5 bg-[#1a1c24] border border-orange-500/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone size={12} /> Phone Number * (Mandatory)
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#1a1c24] border border-emerald-500/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Specific Business Requirements / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={clientMessage}
                    onChange={e => setClientMessage(e.target.value)}
                    placeholder="Tell us about your workflow automation goals or custom integration needs..."
                    className="w-full px-4 py-2.5 bg-[#1a1c24] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-400 font-semibold bg-red-950/50 p-2.5 rounded-xl border border-red-800/50">
                    {formError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsClientFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
