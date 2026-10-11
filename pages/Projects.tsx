import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Code2, Globe, Layout, Smartphone, RefreshCw, Bot, Layers, Eye, Copy, Check, X, Phone, Mail, Send, CheckCircle2, FileText, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero, { btnPrimary, btnSecondary } from '../components/ui/PageHero';
import { cleanText, isValidEmail, isValidPhone, LIMITS } from '../utils/security';
import { Project, N8nProject } from '../types';
import { INITIAL_PROJECTS } from './ProjectsData';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { N8nWorkflowViewer } from '../components/N8nWorkflowViewer';

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
      videoRef.current.play().catch(() => {
        /* autoplay can be blocked by the browser; the image stays visible */
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
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
          className={`absolute inset-0 ${objectFitClass} grayscale-0 desk:grayscale desk:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out select-none pointer-events-none ${
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
          className={`absolute inset-0 ${objectFitClass} grayscale-0 desk:grayscale desk:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out select-none pointer-events-none ${
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
  const { projects, n8nProjects, loadingProjects: loading, addN8nFormSubmission } = useSiteSettings();

  const [selectedN8nProject, setSelectedN8nProject] = useState<N8nProject | null>(null);
  const [copiedJsonId, setCopiedJsonId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'main' | 'portfolio' | 'n8n' | 'figma' | 'client'>('all');

  // Client Request Form Modal State
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [clientWebsite, setClientWebsite] = useState(''); // honeypot: real visitors never see or fill this

  const handleClientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting) return;
    setFormError(null);

    const name = cleanText(clientName, LIMITS.name);
    const email = cleanText(clientEmail, LIMITS.email);
    const phone = cleanText(clientPhone, LIMITS.phone);
    const message = cleanText(clientMessage, LIMITS.message, { multiline: true });

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setFormError('Please enter a valid phone number (7 to 15 digits).');
      return;
    }

    if (!selectedN8nProject) return;

    const resetForm = () => {
      setFormSuccess(false);
      setIsClientFormOpen(false);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientMessage('');
      setClientWebsite('');
    };

    // Bots fill the hidden field: pretend success without storing anything.
    if (clientWebsite) {
      setFormSuccess(true);
      setTimeout(resetForm, 2500);
      return;
    }

    setFormSubmitting(true);
    try {
      await addN8nFormSubmission({
        projectId: selectedN8nProject.id,
        projectTitle: selectedN8nProject.title,
        name: name || 'Interested Client',
        email,
        phone,
        message
      });

      setFormSubmitting(false);
      setFormSuccess(true);
      setTimeout(resetForm, 2500);
    } catch (err) {
      console.error('Workflow request could not be saved:', err);
      setFormSubmitting(false);
      setFormError('Sorry, your request could not be sent. Please check your connection and try again, or message us on WhatsApp.');
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
      href={project.link || undefined}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      className="group relative cursor-pointer block"
    >
       {/* Image / Visual Card */}
       <div className="relative aspect-[16/10] bg-gray-100 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-700 group-hover:bg-neon-purple/5 group-hover:border-neon-purple/20 group-hover:translate-y-[-10px] group-hover:shadow-[0_25px_60px_rgba(234,179,8,0.15)]">
          <ProjectMedia 
             image={project.image} 
             video={project.video}
             images={project.images}
             videos={project.videos}
             title={project.title}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 md:gap-6">
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform">
                   <ExternalLink size={16} className="sm:hidden" />
                   <ExternalLink size={20} className="hidden sm:block" />
                </div>
                {type === 'client' && (
                  <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest mt-1 sm:mt-2 bg-black/40 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                     Click to view project
                  </span>
                )}
             </div>
          </div>
       </div>

       {/* Info */}
       <div className="mt-2 sm:mt-4 md:mt-8 px-1 sm:px-2 md:px-4">
          <p className="text-[8px] sm:text-[10px] font-semibold text-neon-purple dark:text-neon-blue tracking-wider sm:tracking-[0.3em] uppercase mb-0.5 sm:mb-1.5 md:mb-3">{project.category}</p>
          <h3 className={`text-xs sm:text-lg ${type === 'figma' || type === 'client' ? 'md:text-[28px]' : type === 'portfolio' ? 'md:text-[29px]' : 'md:text-3xl'} font-heading font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 md:mb-4 group-hover:text-neon-purple dark:group-hover:text-neon-blue transition-colors uppercase line-clamp-2`}>{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-[9px] sm:text-[11px] md:text-sm leading-tight sm:leading-relaxed mb-1.5 sm:mb-3 md:mb-6 line-clamp-2">{project.desc}</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-1.5 sm:mb-3">
             {project.tags?.map((tag: string, tIndex: number) => (
               <span key={tIndex}>{tag} {tIndex < project.tags.length - 1 ? "•" : ""}</span>
             ))}
          </div>
          {type === 'client' && (
            <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[9px] md:text-[11px] font-bold text-neon-purple dark:text-neon-blue group-hover:underline uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">
              CLICK HERE TO VIEW PROJECT <ExternalLink size={9} className="sm:hidden text-neon-purple dark:text-neon-blue" /><ExternalLink size={11} className="hidden sm:block text-neon-purple dark:text-neon-blue" />
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
      className="bg-gray-50 dark:bg-[#05070A] text-gray-900 dark:text-white min-h-screen pb-12 md:pb-20 transition-colors duration-300"
    >
      <PageHero
        eyebrow="Our work"
        eyebrowIcon={Sparkles}
        title="Real projects."
        highlight="Real results."
        description="Websites, AI automation workflows and design work we have built for businesses, brands and products. Explore the work, then let’s build yours."
        actions={<>
          <Link to="/contact" className={btnPrimary}>Start your project <ArrowRight size={18} /></Link>
          <Link to="/services" className={btnSecondary}>Explore services</Link>
        </>}
      />
      <div className="mx-auto w-full max-w-[100rem] px-5 md:px-8 desk:px-12 2xl:px-16 pt-4">
        {/* Category Filter Pills / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-16 scrollbar-none max-w-full justify-start md:justify-center">
          {[
            { id: 'all', label: 'ALL', count: activeProjects.length + activeN8nProjects.length },
            { id: 'main', label: 'MAIN PROJECTS', count: mainProjects.length },
            { id: 'portfolio', label: 'PORTFOLIO PROJECTS', count: portfolioProjects.length },
            { id: 'n8n', label: 'N8N AUTOMATIONS', count: activeN8nProjects.length },
            { id: 'figma', label: 'FIGMA DESIGNS', count: figmaProjects.length },
            { id: 'client', label: 'CLIENT PROJECTS', count: clientProjects.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                window.scrollTo({ top: 520, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border ${
                activeCategory === tab.id
                  ? 'bg-gray-900 text-white border-transparent shadow-lg dark:bg-yellow-400 dark:text-black scale-105'
                  : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-white/10 hover:border-neon-purple/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeCategory === tab.id ? 'bg-white/20 text-current' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Back button when a specific category tab is selected */}
        {activeCategory !== 'all' && (
          <div className="mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200/70 dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:text-neon-purple dark:hover:text-neon-blue text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
            >
              <ArrowLeft size={14} />
              <span>← View All Categories</span>
            </button>
          </div>
        )}

        {/* Section: Main Projects */}
        {(activeCategory === 'all' || activeCategory === 'main') && (
          <div className="mb-12 md:mb-36">
            <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between">
              <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
                // MAIN PROJECTS
              </h2>
              {activeCategory === 'all' && mainProjects.length > 3 && (
                <button
                  onClick={() => {
                    setActiveCategory('main');
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neon-purple dark:text-neon-blue hover:underline flex items-center gap-1"
                >
                  View More ({mainProjects.length}) <ArrowRight size={12} />
                </button>
              )}
            </div>
            {mainProjects.length > 0 ? (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 desk:grid-cols-3 gap-3 sm:gap-6 desk:gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 desk:[&>*:last-child:nth-child(odd)]:col-span-1"
                >
                   {(activeCategory === 'all' ? mainProjects.slice(0, 3) : mainProjects).map((project, i) => renderProjectCard(project, i, 'main'))}
                </motion.div>

                {activeCategory === 'all' && mainProjects.length > 3 && (
                  <div className="mt-8 md:mt-12 text-center">
                    <button
                      onClick={() => {
                        setActiveCategory('main');
                        window.scrollTo({ top: 520, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-neon-purple dark:hover:text-neon-blue hover:border-neon-purple/50 dark:hover:border-neon-blue/50 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <span>View More Main Projects ({mainProjects.length})</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-light italic">No main projects uploaded.</p>
            )}
          </div>
        )}

        {/* Section: Portfolio Projects */}
        {(activeCategory === 'all' || activeCategory === 'portfolio') && (
          <div className="mb-12 md:mb-36">
            <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between">
              <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
                // PORTFOLIO PROJECTS
              </h2>
              {activeCategory === 'all' && portfolioProjects.length > 3 && (
                <button
                  onClick={() => {
                    setActiveCategory('portfolio');
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neon-purple dark:text-neon-blue hover:underline flex items-center gap-1"
                >
                  View More ({portfolioProjects.length}) <ArrowRight size={12} />
                </button>
              )}
            </div>
            {portfolioProjects.length > 0 ? (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 desk:grid-cols-3 gap-3 sm:gap-6 desk:gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 desk:[&>*:last-child:nth-child(odd)]:col-span-1"
                >
                   {(activeCategory === 'all' ? portfolioProjects.slice(0, 3) : portfolioProjects).map((project, i) => renderProjectCard(project, i, 'portfolio'))}
                </motion.div>

                {activeCategory === 'all' && portfolioProjects.length > 3 && (
                  <div className="mt-8 md:mt-12 text-center">
                    <button
                      onClick={() => {
                        setActiveCategory('portfolio');
                        window.scrollTo({ top: 520, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-neon-purple dark:hover:text-neon-blue hover:border-neon-purple/50 dark:hover:border-neon-blue/50 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <span>View More Portfolio Projects ({portfolioProjects.length})</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-light italic">No portfolio projects uploaded.</p>
            )}
          </div>
        )}

        {/* Section: N8N Projects & 24/7 Automation Workflows */}
        {(activeCategory === 'all' || activeCategory === 'n8n') && (
          <div className="mb-12 md:mb-36">
            <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-[10px] sm:text-sm md:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase text-orange-500 dark:text-orange-400 flex items-center gap-1.5 sm:gap-2">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 shrink-0" />
                <span>// N8N PROJECTS & 24/7 AUTOMATION WORKFLOWS</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block text-[10px] md:text-xs font-mono text-gray-500 dark:text-gray-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                  Interactive Canvas
                </span>
                {activeCategory === 'all' && activeN8nProjects.length > 4 && (
                  <button
                    onClick={() => {
                      setActiveCategory('n8n');
                      window.scrollTo({ top: 520, behavior: 'smooth' });
                    }}
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400 hover:underline flex items-center gap-1 ${
                      activeN8nProjects.length <= 6 ? 'desk:hidden' : ''
                    }`}
                  >
                    View More ({activeN8nProjects.length}) <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            {activeN8nProjects.length > 0 ? (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-2 desk:grid-cols-3 gap-3 sm:gap-6 md:gap-8"
                >
                  {(activeCategory === 'all' ? activeN8nProjects.slice(0, 6) : activeN8nProjects).map((project, i) => {
                    let nodeCount = project.nodeCount || 0;
                    try {
                      if (!nodeCount && project.workflowJson) {
                        const parsed = JSON.parse(project.workflowJson);
                        nodeCount = (parsed.nodes || []).length;
                      }
                    } catch (e) {}

                    const isExtraMobileCard = activeCategory === 'all' && i >= 4;

                    return (
                      <motion.div
                        key={`n8n-${project.id || i}`}
                        variants={cardVariants}
                        onClick={() => setSelectedN8nProject(project)}
                        className={`group relative cursor-pointer bg-white dark:bg-[#0F1320] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-orange-500/50 hover:shadow-[0_20px_50px_rgba(255,109,0,0.15)] transition-all duration-500 flex flex-col justify-between ${
                          isExtraMobileCard ? 'hidden desk:flex' : ''
                        }`}
                      >
                        {/* Visual Workflow Canvas Header */}
                        <div className="h-28 sm:h-48 md:h-52 bg-[#f4f5f7] dark:bg-[#17181c] relative overflow-hidden border-b border-gray-200 dark:border-white/10 pointer-events-none">
                          <N8nWorkflowViewer workflowJson={project.workflowJson} height="100%" showControls={false} fitPadding={0.18} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1320]/80 via-transparent to-transparent" />
                          
                          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10">
                            <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[8px] sm:text-[10px] font-bold text-orange-400 flex items-center gap-1 sm:gap-1.5 shadow-lg">
                              <Layers size={10} className="sm:hidden" />
                              <Layers size={12} className="hidden sm:block" />
                              {nodeCount} Nodes
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-orange-500 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md inline-block mb-1 sm:mb-2">
                              {project.category || 'n8n Automation'}
                            </span>
                            <h3 className="text-xs sm:text-xl font-heading font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 line-clamp-2 leading-tight sm:leading-relaxed">
                              {project.desc || 'Interactive n8n automation workflow diagram.'}
                            </p>

                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-4">
                                {project.tags.map((tag, tIdx) => (
                                  <span 
                                    key={tIdx}
                                    className="text-[7px] sm:text-[9px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-1 py-0.5 sm:px-2 sm:py-0.5 rounded font-mono"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer CTA */}
                          <div className="mt-2.5 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[8px] sm:text-xs font-bold text-orange-500 dark:text-orange-400">
                            <span className="flex items-center gap-1 sm:gap-1.5 group-hover:translate-x-1 transition-transform truncate">
                              <Eye size={10} className="sm:hidden shrink-0" />
                              <Eye size={14} className="hidden sm:block shrink-0" />
                              <span className="hidden sm:inline">Interactive Workflow Canvas</span>
                              <span className="sm:hidden truncate">Workflow Canvas</span>
                            </span>
                            <span className="text-[7px] sm:text-[10px] bg-orange-500/10 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                              Inspect →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {activeCategory === 'all' && activeN8nProjects.length > 4 && (
                  <div className={`mt-8 md:mt-12 text-center ${activeN8nProjects.length <= 6 ? 'desk:hidden' : ''}`}>
                    <button
                      onClick={() => {
                        setActiveCategory('n8n');
                        window.scrollTo({ top: 520, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/50 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <span>View More n8n Workflows ({activeN8nProjects.length})</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-light italic">No n8n workflow projects available yet.</p>
            )}
          </div>
        )}

        {/* Section: Figma Projects */}
        {(activeCategory === 'all' || activeCategory === 'figma') && (
          <div className="mb-12 md:mb-36">
            <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between">
              <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
                // FIGMA PROJECTS
              </h2>
              {activeCategory === 'all' && figmaProjects.length > 3 && (
                <button
                  onClick={() => {
                    setActiveCategory('figma');
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neon-purple dark:text-neon-blue hover:underline flex items-center gap-1"
                >
                  View More ({figmaProjects.length}) <ArrowRight size={12} />
                </button>
              )}
            </div>
            {figmaProjects.length > 0 ? (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 desk:grid-cols-3 gap-3 sm:gap-6 desk:gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 desk:[&>*:last-child:nth-child(odd)]:col-span-1"
                >
                    {(activeCategory === 'all' ? figmaProjects.slice(0, 3) : figmaProjects).map((project, i) => renderProjectCard(project, i, 'figma'))}
                </motion.div>

                {activeCategory === 'all' && figmaProjects.length > 3 && (
                  <div className="mt-8 md:mt-12 text-center">
                    <button
                      onClick={() => {
                        setActiveCategory('figma');
                        window.scrollTo({ top: 520, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-neon-purple dark:hover:text-neon-blue hover:border-neon-purple/50 dark:hover:border-neon-blue/50 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <span>View More Figma Designs ({figmaProjects.length})</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-light italic">No Figma projects uploaded.</p>
            )}
          </div>
        )}

        {/* Section: Client & Personal Projects */}
        {(activeCategory === 'all' || activeCategory === 'client') && (
          <div className="mb-12 md:mb-36">
            <div className="border-b border-gray-200 dark:border-white/10 pb-4 md:pb-6 mb-8 md:mb-14 flex items-center justify-between">
              <h2 className="text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-neon-purple dark:text-neon-blue">
                // CLIENT & PERSONAL PROJECTS
              </h2>
              {activeCategory === 'all' && clientProjects.length > 5 && (
                <button
                  onClick={() => {
                    setActiveCategory('client');
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neon-purple dark:text-neon-blue hover:underline flex items-center gap-1"
                >
                  View More ({clientProjects.length}) <ArrowRight size={12} />
                </button>
              )}
            </div>
            {clientProjects.length > 0 ? (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-3 desk:grid-cols-5 gap-3 sm:gap-5 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1"
                >
                   {(activeCategory === 'all' ? clientProjects.slice(0, 5) : clientProjects).map((project, i) => (
                     <motion.a
                       key={`client-${project.id || i}`}
                       href={project.link || undefined}
                       target="_blank"
                       rel="noopener noreferrer"
                       variants={cardVariants}
                       onContextMenu={(e) => e.preventDefault()}
                       className="group relative cursor-pointer block select-none"
                     >
                        {/* Visual Logo Card */}
                        <div 
                          className="relative aspect-square bg-white dark:bg-white/[0.02] rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-500 group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.05] group-hover:border-neon-purple/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(234,179,8,0.08)] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none"
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
                        <div className="mt-2 sm:mt-4 text-center transition-all duration-300 opacity-60 group-hover:opacity-100">
                           <p className="inline-flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-white/30 group-hover:text-neon-purple dark:group-hover:text-neon-blue tracking-wider sm:tracking-[0.2em] uppercase transition-colors">
                              View Creation 
                              <ExternalLink size={8} className="sm:hidden text-neon-purple dark:text-neon-blue" />
                              <ExternalLink size={9} className="hidden sm:block text-neon-purple dark:text-neon-blue" />
                           </p>
                        </div>
                     </motion.a>
                   ))}
                </motion.div>

                {activeCategory === 'all' && clientProjects.length > 5 && (
                  <div className="mt-8 md:mt-12 text-center">
                    <button
                      onClick={() => {
                        setActiveCategory('client');
                        window.scrollTo({ top: 520, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-neon-purple dark:hover:text-neon-blue hover:border-neon-purple/50 dark:hover:border-neon-blue/50 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <span>View More Client Projects ({clientProjects.length})</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-light italic">No client or personal projects uploaded.</p>
            )}
          </div>
        )}


        {/* Process Section */}
        <div className="mt-8 md:mt-60 border-t border-gray-200 dark:border-white/5 pt-10 md:pt-40">
           <div className="max-w-4xl mx-auto">
              <div>
                 <h2 className="text-3xl md:text-5xl desk:text-6xl font-bold tracking-tighter leading-[1.1] mb-8 md:mb-12 uppercase text-gray-900 dark:text-white">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Methodology</span> Behind The Build.</h2>
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
        <div className="relative my-12 overflow-hidden rounded-[32px] border border-gray-200 bg-white p-5 text-gray-900 shadow-sm dark:border-transparent dark:bg-[#0B0D12] dark:text-white dark:shadow-none md:my-20 md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="relative grid gap-5 md:gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Want results like these for your business?</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-white/65 md:text-lg">Tell us what you need: a website, an AI agent or design work. We reply within one working day with a clear plan and a fixed quote.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/contact" className={btnPrimary}>Start your project <ArrowRight size={18} /></Link>
              <a href="https://wa.me/917093320572?text=Hello!%20I%20have%20a%20project%20idea.%20Can%20we%20discuss%20it%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-white/20 px-7 py-4 font-bold text-gray-900 dark:text-white transition-colors hover:border-green-400 hover:text-green-400">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive n8n Workflow Modal Popup */}
      {selectedN8nProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#13151b] border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[78vh] sm:h-[88vh] max-h-[85vh] sm:max-h-none flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-3 py-2 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-[#191b22] gap-1.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
                  <Bot size={15} className="sm:hidden" />
                  <Bot size={22} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md inline-block">
                    {selectedN8nProject.category || 'n8n Workflow'}
                  </span>
                  <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mt-0.5 truncate">
                    {selectedN8nProject.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                {selectedN8nProject.testWorkflowUrl && (
                  <a
                    href={selectedN8nProject.testWorkflowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 sm:px-3.5 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-[9px] sm:text-xs rounded-lg sm:rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <ExternalLink size={10} className="sm:hidden" />
                    <ExternalLink size={14} className="hidden sm:block" />
                    Test Workflow
                  </a>
                )}

                {selectedN8nProject.allowClientRequest !== false && (
                  <button
                    onClick={() => setIsClientFormOpen(true)}
                    className="px-2 py-1 sm:px-3.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-[9px] sm:text-xs rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <FileText size={10} className="sm:hidden" />
                    <FileText size={14} className="hidden sm:block" />
                    Request Custom Setup
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedN8nProject(null);
                    setIsClientFormOpen(false);
                  }}
                  className="p-1 sm:p-2 text-gray-400 hover:text-white rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors ml-0.5 sm:ml-0"
                >
                  <X size={16} className="sm:hidden" />
                  <X size={20} className="hidden sm:block" />
                </button>
              </div>
            </div>

            {/* Modal Canvas Body */}
            <div className="flex-1 relative w-full h-full bg-[#f4f5f7] dark:bg-[#17181c]">
              <N8nWorkflowViewer 
                workflowJson={selectedN8nProject.workflowJson} 
                height="100%" 
                showControls={true}
                fitPadding={0.15}
              />
            </div>

            {/* Modal Footer Description */}
            {selectedN8nProject.desc && (
              <div className="p-2.5 sm:p-4 md:p-6 bg-gray-50 dark:bg-[#191b22] border-t border-gray-200 dark:border-white/10 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 sm:gap-4">
                <p className="line-clamp-2 leading-tight sm:leading-relaxed text-[10px] sm:text-xs md:text-sm">{selectedN8nProject.desc}</p>
                <button
                  onClick={() => setIsClientFormOpen(true)}
                  className="shrink-0 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1 sm:gap-1.5"
                >
                  <FileText size={11} className="sm:hidden" />
                  <FileText size={13} className="hidden sm:block" />
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
          <div className="bg-white dark:bg-[#13151b] border border-orange-500/30 rounded-3xl w-full max-w-lg p-4 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Custom Workflow Setup</h3>
                  <p className="text-xs text-orange-400 font-medium truncate max-w-[260px]">
                    {selectedN8nProject.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsClientFormOpen(false)}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Request Received!</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Thank you! We have received your request for <strong>{selectedN8nProject.title}</strong>. Our team will get in touch with you shortly on your provided phone & email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClientFormSubmit} className="space-y-4" noValidate>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={clientWebsite} onChange={e => setClientWebsite(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1c24] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail size={12} /> Email Address * (Mandatory)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    maxLength={LIMITS.email}
                    autoComplete="email"
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="e.g. rahul@company.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1c24] border border-orange-500/30 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
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
                    maxLength={LIMITS.phone}
                    autoComplete="tel"
                    inputMode="tel"
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1c24] border border-emerald-500/30 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Specific Business Requirements / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={clientMessage}
                    maxLength={LIMITS.message}
                    onChange={e => setClientMessage(e.target.value)}
                    placeholder="Tell us about your workflow automation goals or custom integration needs..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1c24] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs text-red-400 font-semibold bg-red-950/50 p-2.5 rounded-xl border border-red-800/50">
                    {formError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsClientFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
