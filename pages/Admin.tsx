import React, { useState, useEffect } from 'react';
import { Trash2, Settings, Search, X, Check, BarChart3, LogOut, MessageSquare, Mail, DollarSign, RefreshCw, Clock, Key, Phone, Edit3, Eye, EyeOff, Plus, Database, HardDrive, RotateCcw, FolderPlus, Video, Link2, Tag, ChevronRight, Code, LayoutTemplate, PenTool, Megaphone, Bot, Sparkles, Layers, User, Image as ImageIcon, Globe, ExternalLink, Play, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Message, Project } from '../types';
import { INITIAL_PROJECTS } from './ProjectsData';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const SERVICE_CATEGORIES = [
  { 
    id: 'Full-Stack Development', 
    name: 'Full-Stack Development', 
    icon: Code, 
    color: 'text-neon-purple', 
    badgeBg: 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
    keywords: ['full-stack', 'full stack', 'react', 'next.js', 'web development'] 
  },
  { 
    id: 'WordPress Development', 
    name: 'WordPress Development', 
    icon: LayoutTemplate, 
    color: 'text-blue-400', 
    badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    keywords: ['wordpress', 'wp'] 
  },
  { 
    id: 'Branding & Identity', 
    name: 'Branding & Identity', 
    icon: PenTool, 
    color: 'text-pink-400', 
    badgeBg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    keywords: ['branding', 'identity', 'logo'] 
  },
  { 
    id: 'Digital Marketing', 
    name: 'Digital Marketing', 
    icon: Megaphone, 
    color: 'text-green-400', 
    badgeBg: 'bg-green-500/10 border-green-500/20 text-green-400',
    keywords: ['digital marketing', 'marketing', 'social'] 
  },
  { 
    id: 'AI Automation & Agents', 
    name: 'AI Automation & Agents', 
    icon: Bot, 
    color: 'text-cyan-400', 
    badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    keywords: ['ai automation', 'ai', 'agent', 'automation', 'n8n', 'bot'] 
  },
];

const categorizeMessage = (msg: Message): string => {
  const serviceLower = (msg.service || '').toLowerCase();
  for (const cat of SERVICE_CATEGORIES) {
    if (cat.keywords.some(k => serviceLower.includes(k))) {
      return cat.id;
    }
  }
  return 'Full-Stack Development';
};

const isContactFormMessage = (msg: Message): boolean => {
  if (msg.source === 'contact') return true;
  if (msg.source === 'service') return false;
  if (msg.serviceDetails && Object.keys(msg.serviceDetails).length > 0) return false;
  const serviceLower = (msg.service || '').toLowerCase();
  if (SERVICE_CATEGORIES.some(c => c.keywords.some(k => serviceLower.includes(k)))) return false;
  return true;
};

const isServiceFormMessage = (msg: Message): boolean => {
  return !isContactFormMessage(msg);
};

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

interface MultiMediaInputProps {
  label: string;
  type: 'image' | 'video';
  items: string[];
  onChange: (items: string[]) => void;
  maxCount: number;
}

const MultiMediaInput: React.FC<MultiMediaInputProps> = ({ label, type, items, onChange, maxCount }) => {
  const [urlInput, setUrlInput] = useState('');
  const [fileError, setFileError] = useState('');

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (items.length >= maxCount) {
      setFileError(`Maximum ${maxCount} ${type}s allowed.`);
      return;
    }
    onChange([...items, urlInput.trim()]);
    setUrlInput('');
    setFileError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFileError('');

    const newItems = [...items];
    let remainingSlots = maxCount - newItems.length;
    if (remainingSlots <= 0) {
      setFileError(`Maximum ${maxCount} ${type}s allowed.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    let processed = 0;

    filesToProcess.forEach(file => {
      const limitMB = type === 'image' ? 8 : 30;
      if (file.size > limitMB * 1024 * 1024) {
        setFileError(`File ${file.name} exceeds ${limitMB}MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          newItems.push(result);
          processed++;
          if (processed === filesToProcess.length) {
            onChange([...newItems]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2 bg-gray-50/80 dark:bg-[#05070A]/60 p-3 rounded-2xl border border-gray-200/80 dark:border-white/10">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
          {label} ({items.length} / {maxCount})
        </label>
        <span className="text-[10px] font-semibold text-neon-purple uppercase tracking-wider">
          URL or Device Upload
        </span>
      </div>

      {/* Input row: URL box + File Upload button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={type === 'image' ? 'Paste image URL...' : 'Paste YouTube, Vimeo, or MP4 URL...'}
            className="flex-1 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={items.length >= maxCount || !urlInput.trim()}
            className="px-3 py-2 bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 shrink-0"
          >
            Add URL
          </button>
        </div>

        <label className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
          items.length >= maxCount 
            ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed'
            : 'bg-white dark:bg-[#0F1320] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-neon-purple hover:text-neon-purple shadow-sm'
        }`}>
          <Upload size={14} />
          <span>Upload {type === 'image' ? 'Image' : 'Video'}</span>
          <input
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            multiple
            disabled={items.length >= maxCount}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {fileError && (
        <p className="text-[11px] font-semibold text-rose-500">{fileError}</p>
      )}

      {/* Grid of added media items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1 max-h-40 overflow-y-auto custom-scrollbar p-1">
          {items.map((item, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 bg-black aspect-video flex items-center justify-center shadow-sm">
              {type === 'image' ? (
                <img src={item} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black/80">
                  <Play size={14} className="text-neon-purple" />
                  <span className="text-[8px] font-mono mt-0.5">Vid {idx + 1}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-full transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-md"
                title="Remove"
              >
                <X size={10} />
              </button>
              <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/80 text-white text-[8px] font-mono font-bold rounded">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-gray-400 italic">No {type}s added yet. Add via URL or upload from device (up to {maxCount}).</p>
      )}
    </div>
  );
};

const ProjectLivePreviewCard: React.FC<{
  title: string;
  category: string;
  desc: string;
  tags: string;
  image: string;
  video: string;
  images?: string[];
  videos?: string[];
  link: string;
  type: string;
}> = ({ title, category, desc, tags, image, video, images = [], videos = [], link, type }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video' | 'link'>('image');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Derive full list of images and videos
  const imageList = images && images.length > 0 ? images : (image ? [image] : []);
  const videoList = videos && videos.length > 0 ? videos : (video ? [video] : []);

  const currentImage = imageList[selectedImageIndex] || imageList[0] || image || '';
  const currentVideo = videoList[selectedVideoIndex] || videoList[0] || video || '';

  useEffect(() => {
    setImageError(false);
  }, [currentImage]);

  useEffect(() => {
    if (videoList.length > 0) {
      setActiveMediaTab('video');
    } else if (imageList.length > 0) {
      setActiveMediaTab('image');
    }
  }, [videoList.length]);

  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const renderVideoPlayer = (url: string) => {
    if (!url || !url.trim()) {
      return (
        <div className="w-full h-44 rounded-xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
          <Video size={28} className="text-gray-400 dark:text-gray-500" />
          <span className="text-xs font-semibold">No Video Selected</span>
          <span className="text-[10px] text-gray-400">Add an MP4, YouTube, or Vimeo URL/Upload to preview</span>
        </div>
      );
    }

    const trimmed = url.trim();

    // YouTube regex
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${ytMatch[1]}`} 
          className="w-full h-48 rounded-xl border border-gray-200 dark:border-white/10 shadow-md" 
          allowFullScreen 
          title="YouTube Video Preview"
        />
      );
    }

    // Vimeo regex
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} 
          className="w-full h-48 rounded-xl border border-gray-200 dark:border-white/10 shadow-md" 
          allowFullScreen 
          title="Vimeo Video Preview"
        />
      );
    }

    // Direct Video / HTML5 Video player
    return (
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-white/10 shadow-md flex items-center justify-center">
        <video 
          src={trimmed} 
          controls 
          playsInline
          className="w-full h-full object-contain"
          onError={() => {
            console.warn("Video failed to play:", trimmed);
          }}
        />
      </div>
    );
  };

  const renderImageFrame = () => {
    if (!currentImage || !currentImage.trim() || imageError) {
      return (
        <div className="w-full h-44 rounded-xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
          <ImageIcon size={28} className="text-gray-400 dark:text-gray-500" />
          <span className="text-xs font-semibold">Image Preview Unavailable</span>
          <span className="text-[10px] text-gray-400 font-mono">Upload or enter a valid Image URL</span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/30 border border-gray-200 dark:border-white/10 shadow-md group">
        <img 
          src={currentImage} 
          alt={title || 'Project Preview'} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
          Image #{selectedImageIndex + 1} / {imageList.length || 1}
        </div>
      </div>
    );
  };

  const renderLinkTest = () => {
    if (!link || !link.trim()) {
      return (
        <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 text-xs text-gray-400 font-mono">
          No external action link provided.
        </div>
      );
    }

    let hostname = link;
    try {
      const u = new URL(link.startsWith('http') ? link : `https://${link}`);
      hostname = u.hostname;
    } catch (e) {
      hostname = link;
    }

    return (
      <div className="p-3 bg-white dark:bg-[#05070A] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <Globe size={16} className="text-neon-purple shrink-0" />
          <div className="truncate">
            <span className="block text-[9px] font-bold uppercase text-gray-400">Target Host</span>
            <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 truncate block">{hostname}</span>
          </div>
        </div>
        <a 
          href={link.startsWith('http') ? link : `https://${link}`} 
          target="_blank" 
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Test Live Link</span>
          <ExternalLink size={12} />
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Media Type Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-200/60 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 text-xs">
        <button
          type="button"
          onClick={() => setActiveMediaTab('image')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
            activeMediaTab === 'image'
              ? 'bg-white dark:bg-[#0F1320] text-neon-purple shadow-sm border border-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <ImageIcon size={13} /> Images ({imageList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveMediaTab('video')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
            activeMediaTab === 'video'
              ? 'bg-white dark:bg-[#0F1320] text-neon-purple shadow-sm border border-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Video size={13} /> Videos ({videoList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveMediaTab('link')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
            activeMediaTab === 'link'
              ? 'bg-white dark:bg-[#0F1320] text-neon-purple shadow-sm border border-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Globe size={13} /> Link
        </button>
      </div>

      {/* Media Display Area */}
      <div>
        {activeMediaTab === 'image' && (
          <div className="space-y-2">
            {renderImageFrame()}
            {imageList.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-10 rounded-lg overflow-hidden border transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-neon-purple ring-2 ring-neon-purple/30 scale-105'
                        : 'border-gray-200 dark:border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMediaTab === 'video' && (
          <div className="space-y-2">
            {renderVideoPlayer(currentVideo)}
            {videoList.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {videoList.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVideoIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 flex items-center gap-1 ${
                      selectedVideoIndex === idx
                        ? 'bg-neon-purple text-white border-neon-purple'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-neon-purple'
                    }`}
                  >
                    <Play size={10} /> Video #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMediaTab === 'link' && renderLinkTest()}
      </div>

      {/* Website Card Mockup Section */}
      <div className="pt-2 border-t border-gray-200/80 dark:border-white/5">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Website Showcase Card Mockup
        </span>
        <div className="bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">
              {category || 'Category Name'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-gray-100 dark:bg-white/5 text-gray-500 uppercase">
              {type || 'main'}
            </span>
          </div>

          <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase line-clamp-1">
            {title || 'Project Title Placeholder'}
          </h4>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {desc || 'Project description will appear here as you type...'}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {tagList.length > 0 ? (
              tagList.map((tg, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                  {tg}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-gray-400 italic">No tags added</span>
            )}
          </div>

          {link && (
            <div className="pt-2 flex justify-end">
              <a
                href={link.startsWith('http') ? link : `https://${link}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-neon-purple text-white text-[10px] font-bold rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                <span>Launch Project</span>
                <ExternalLink size={10} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { logout, changePassword, changeAdminId, adminId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  // Tab State - Default to 'projects' as requested
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'leads' | 'recycle' | 'storage'>('projects');
  const [selectedServiceTab, setSelectedServiceTab] = useState<string>('Full-Stack Development');
  const [serviceFormSearch, setServiceFormSearch] = useState('');

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  
  // States for Add Project
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newVideos, setNewVideos] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [newType, setNewType] = useState<'main' | 'portfolio' | 'figma' | 'client'>('main');
  const [isAddingProject, setIsAddingProject] = useState(false);

  // States for Edit Project
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [previewingProject, setPreviewingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVideos, setEditVideos] = useState<string[]>([]);
  const [editLink, setEditLink] = useState('');
  const [editType, setEditType] = useState<'main' | 'portfolio' | 'figma' | 'client'>('main');
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);

  // State for soft delete, restore, and permanent delete confirmation
  const [deletingProjectDoc, setDeletingProjectDoc] = useState<Project | null>(null);
  const [restoringProjectDoc, setRestoringProjectDoc] = useState<Project | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  // States for Editing
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editService, setEditService] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editMessageText, setEditMessageText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Recycle Bin Sub-Tab State
  const [recycleSubTab, setRecycleSubTab] = useState<'projects' | 'contact' | 'services'>('projects');

  // Message Delete & Restore Confirmation States
  const [deletingMessageDoc, setDeletingMessageDoc] = useState<Message | null>(null);
  const [restoringMessageDoc, setRestoringMessageDoc] = useState<Message | null>(null);
  const [deletingMessagePermanentDoc, setDeletingMessagePermanentDoc] = useState<Message | null>(null);

  // States for Password Change modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // States for Admin ID Change modal
  const [isChangeAdminIdOpen, setIsChangeAdminIdOpen] = useState(false);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');
  const [adminIdCurrentPass, setAdminIdCurrentPass] = useState('');
  const [adminIdError, setAdminIdError] = useState('');
  const [adminIdSuccess, setAdminIdSuccess] = useState('');
  const [showAdminIdPass, setShowAdminIdPass] = useState(false);

  const handleChangeAdminIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminIdError('');
    setAdminIdSuccess('');

    if (!adminIdCurrentPass) {
      setAdminIdError('Please enter your current password.');
      return;
    }

    if (!newAdminIdInput.trim()) {
      setAdminIdError('Please enter a new Admin ID.');
      return;
    }

    const res = await changeAdminId(adminIdCurrentPass, newAdminIdInput.trim());
    if (res.success) {
      setAdminIdSuccess(res.message);
      setTimeout(() => {
        setIsChangeAdminIdOpen(false);
        setAdminIdCurrentPass('');
        setNewAdminIdInput('');
        setAdminIdSuccess('');
      }, 1500);
    } else {
      setAdminIdError(res.message);
    }
  };

  const fetchMessages = async () => {
    // Manual refresh button trigger, snapshot listener updates automatically
    setMessagesLoading(true);
    setTimeout(() => setMessagesLoading(false), 500);
  };

  const fetchProjects = async () => {
    // Manual refresh button trigger, snapshot listener updates automatically
    setProjectsLoading(true);
    setTimeout(() => setProjectsLoading(false), 500);
  };

  useEffect(() => {
    setMessagesLoading(true);
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const messagesMap = new Map<string, Message>();
      snapshot.forEach((doc) => {
        messagesMap.set(doc.id, { id: doc.id, ...doc.data() } as Message);
      });
      const messagesList = Array.from(messagesMap.values());

      messagesList.sort((a, b) => {
        const valA = a.createdAt || a.id || '';
        const valB = b.createdAt || b.id || '';
        return valB.localeCompare(valA);
      });

      setMessages(messagesList);
      localStorage.setItem('brandique_messages', JSON.stringify(messagesList));
      setMessagesLoading(false);
      setIsUsingFallback(false);
    }, (error) => {
      console.warn("Real-time messages listener error, checking local fallback:", error);
      const cached = localStorage.getItem('brandique_messages');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cachedMap = new Map<string, Message>();
            parsed.forEach((m: Message) => { if (m && m.id) cachedMap.set(m.id, m); });
            setMessages(Array.from(cachedMap.values()));
          }
        } catch (e) {}
      }
      handleFirestoreError(error, OperationType.GET, 'messages');
      setMessagesLoading(false);
    });

    setProjectsLoading(true);
    const unsubProjects = onSnapshot(collection(db, 'projects'), async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore projects collection is empty, seed initial projects
        try {
          const seededList: Project[] = [];
          for (const p of INITIAL_PROJECTS) {
            const { id, ...dataWithoutId } = p;
            const docRef = await addDoc(collection(db, 'projects'), dataWithoutId);
            seededList.push({ id: docRef.id, ...dataWithoutId });
          }
          const finalList = seededList.length > 0 ? seededList : INITIAL_PROJECTS;
          setProjects(finalList);
          localStorage.setItem('brandique_projects', JSON.stringify(finalList));
        } catch (seedErr) {
          console.warn("Seeding projects to Firestore skipped or failed:", seedErr);
          setProjects(INITIAL_PROJECTS);
          localStorage.setItem('brandique_projects', JSON.stringify(INITIAL_PROJECTS));
        }
        setProjectsLoading(false);
        return;
      }

      const projectsMap = new Map<string, Project>();
      snapshot.forEach((doc) => {
        projectsMap.set(doc.id, { id: doc.id, ...doc.data() } as Project);
      });
      const projectsList = Array.from(projectsMap.values());

      projectsList.sort((a, b) => {
        const valA = a.createdAt || a.id || '';
        const valB = b.createdAt || b.id || '';
        return valB.localeCompare(valA);
      });

      setProjects(projectsList);
      localStorage.setItem('brandique_projects', JSON.stringify(projectsList));
      setProjectsLoading(false);
    }, (error) => {
      console.warn("Real-time projects listener error, checking local fallback:", error);
      const cached = localStorage.getItem('brandique_projects');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cachedMap = new Map<string, Project>();
            parsed.forEach((p: Project) => { if (p && p.id) cachedMap.set(p.id, p); });
            setProjects(Array.from(cachedMap.values()));
          }
        } catch (e) {}
      }
      handleFirestoreError(error, OperationType.GET, 'projects');
      setProjectsLoading(false);
    });

    return () => {
      unsubMessages();
      unsubProjects();
    };
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      localStorage.setItem('brandique_projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      localStorage.setItem('brandique_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProject(true);
    try {
      const tagsArray = newType === 'client' ? [] : newTags.split(',').map(t => t.trim()).filter(Boolean);
      const finalCategory = newType === 'client' ? (newCategory.trim() || 'Client Project') : newCategory.trim();
      const finalDesc = newType === 'client' ? (newDesc.trim() || 'Client & Personal Project') : newDesc.trim();
      const finalImages = newImages.length > 0 ? newImages : (newImage.trim() ? [newImage.trim()] : []);
      const finalVideos = newVideos.length > 0 ? newVideos : (newVideo.trim() ? [newVideo.trim()] : []);
      const primaryImage = finalImages[0] || newImage.trim();
      const primaryVideo = finalVideos[0] || newVideo.trim();

      const newProjectData = {
        title: newTitle.trim(),
        category: finalCategory,
        desc: finalDesc,
        tags: tagsArray,
        image: primaryImage,
        video: primaryVideo,
        images: finalImages,
        videos: finalVideos,
        link: newLink.trim(),
        type: newType,
        isDeleted: false,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'projects'), newProjectData);
      const addedProject: Project = { id: docRef.id, ...newProjectData };

      setProjects(prev => [addedProject, ...prev]);
      setIsAddProjectOpen(false);
      
      // Reset form
      setNewTitle('');
      setNewCategory('');
      setNewDesc('');
      setNewTags('');
      setNewImage('');
      setNewVideo('');
      setNewImages([]);
      setNewVideos([]);
      setNewLink('');
      setNewType('main');
    } catch (error) {
      const tagsArray = newType === 'client' ? [] : newTags.split(',').map(t => t.trim()).filter(Boolean);
      const finalCategory = newType === 'client' ? (newCategory.trim() || 'Client Project') : newCategory.trim();
      const finalDesc = newType === 'client' ? (newDesc.trim() || 'Client & Personal Project') : newDesc.trim();
      const finalImages = newImages.length > 0 ? newImages : (newImage.trim() ? [newImage.trim()] : []);
      const finalVideos = newVideos.length > 0 ? newVideos : (newVideo.trim() ? [newVideo.trim()] : []);
      const primaryImage = finalImages[0] || newImage.trim();
      const primaryVideo = finalVideos[0] || newVideo.trim();

      const tempId = 'local-added-' + Date.now();
      const fallbackProject = {
        id: tempId,
        title: newTitle.trim(),
        category: finalCategory,
        desc: finalDesc,
        tags: tagsArray,
        image: primaryImage,
        video: primaryVideo,
        images: finalImages,
        videos: finalVideos,
        link: newLink.trim(),
        type: newType,
        isDeleted: false,
        createdAt: new Date().toISOString()
      };
      setProjects(prev => [fallbackProject, ...prev]);
      setIsAddProjectOpen(false);
      
      // Reset form
      setNewTitle('');
      setNewCategory('');
      setNewDesc('');
      setNewTags('');
      setNewImage('');
      setNewVideo('');
      setNewImages([]);
      setNewVideos([]);
      setNewLink('');
      setNewType('main');

      handleFirestoreError(error, OperationType.WRITE, 'projects/' + tempId);
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsUpdatingProject(true);
    try {
      const tagsArray = editType === 'client' ? [] : editTags.split(',').map(t => t.trim()).filter(Boolean);
      const finalCategory = editType === 'client' ? (editCategory.trim() || 'Client Project') : editCategory.trim();
      const finalDesc = editType === 'client' ? (editDesc.trim() || 'Client & Personal Project') : editDesc.trim();
      const finalImages = editImages.length > 0 ? editImages : (editImage.trim() ? [editImage.trim()] : []);
      const finalVideos = editVideos.length > 0 ? editVideos : (editVideo.trim() ? [editVideo.trim()] : []);
      const primaryImage = finalImages[0] || editImage.trim();
      const primaryVideo = finalVideos[0] || editVideo.trim();

      const docRef = doc(db, 'projects', editingProject.id);
      const updatedData = {
        title: editTitle.trim(),
        category: finalCategory,
        desc: finalDesc,
        tags: tagsArray,
        image: primaryImage,
        video: primaryVideo,
        images: finalImages,
        videos: finalVideos,
        link: editLink.trim(),
        type: editType,
      };

      await updateDoc(docRef, updatedData);

      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updatedData } : p));
      setIsEditProjectOpen(false);
      setEditingProject(null);
    } catch (error) {
      const tagsArray = editType === 'client' ? [] : editTags.split(',').map(t => t.trim()).filter(Boolean);
      const finalCategory = editType === 'client' ? (editCategory.trim() || 'Client Project') : editCategory.trim();
      const finalDesc = editType === 'client' ? (editDesc.trim() || 'Client & Personal Project') : editDesc.trim();
      const finalImages = editImages.length > 0 ? editImages : (editImage.trim() ? [editImage.trim()] : []);
      const finalVideos = editVideos.length > 0 ? editVideos : (editVideo.trim() ? [editVideo.trim()] : []);
      const primaryImage = finalImages[0] || editImage.trim();
      const primaryVideo = finalVideos[0] || editVideo.trim();

      const updatedData = {
        title: editTitle.trim(),
        category: finalCategory,
        desc: finalDesc,
        tags: tagsArray,
        image: primaryImage,
        video: primaryVideo,
        images: finalImages,
        videos: finalVideos,
        link: editLink.trim(),
        type: editType,
      };
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updatedData } : p));
      setIsEditProjectOpen(false);
      setEditingProject(null);
      handleFirestoreError(error, OperationType.UPDATE, 'projects/' + editingProject.id);
    } finally {
      setIsUpdatingProject(false);
    }
  };

  const handleSoftDeleteProject = async (project: Project) => {
    const delTime = new Date().toISOString();
    try {
      const docRef = doc(db, 'projects', project.id);
      await setDoc(docRef, { ...project, isDeleted: true, deletedAt: delTime }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects/' + project.id);
    } finally {
      setProjects(prev => {
        const next = prev.map(p => p.id === project.id ? { ...p, isDeleted: true, deletedAt: delTime } : p);
        localStorage.setItem('brandique_projects', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleRestoreProject = async (project: Project) => {
    try {
      const docRef = doc(db, 'projects', project.id);
      await setDoc(docRef, { ...project, isDeleted: false }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects/' + project.id);
    } finally {
      setProjects(prev => {
        const next = prev.map(p => p.id === project.id ? { ...p, isDeleted: false, deletedAt: undefined } : p);
        localStorage.setItem('brandique_projects', JSON.stringify(next));
        return next;
      });
    }
  };

  const handlePermanentDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'projects/' + id);
    } finally {
      setProjects(prev => {
        const next = prev.filter(p => p.id !== id);
        localStorage.setItem('brandique_projects', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleSoftDeleteMessage = async (msg: Message) => {
    const delTime = new Date().toISOString();
    try {
      const docRef = doc(db, 'messages', msg.id);
      await setDoc(docRef, { ...msg, isDeleted: true, deletedAt: delTime }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'messages/' + msg.id);
    } finally {
      setMessages(prev => {
        const next = prev.map(m => m.id === msg.id ? { ...m, isDeleted: true, deletedAt: delTime } : m);
        localStorage.setItem('brandique_messages', JSON.stringify(next));
        return next;
      });
      setDeletingMessageDoc(null);
      if (selectedMessage?.id === msg.id) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
    }
  };

  const handleRestoreMessage = async (msg: Message) => {
    try {
      const docRef = doc(db, 'messages', msg.id);
      await setDoc(docRef, { ...msg, isDeleted: false, deletedAt: null }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'messages/' + msg.id);
    } finally {
      setMessages(prev => {
        const next = prev.map(m => m.id === msg.id ? { ...m, isDeleted: false, deletedAt: undefined } : m);
        localStorage.setItem('brandique_messages', JSON.stringify(next));
        return next;
      });
      setRestoringMessageDoc(null);
    }
  };

  const handlePermanentDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'messages/' + id);
    } finally {
      setMessages(prev => {
        const next = prev.filter(m => m.id !== id);
        localStorage.setItem('brandique_messages', JSON.stringify(next));
        return next;
      });
      setDeletingMessagePermanentDoc(null);
      if (selectedMessage?.id === id) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
    }
  };

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'messages', editingMessage.id);
      const updatedData = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim(),
        service: editService.trim(),
        budget: editBudget.trim(),
        message: editMessageText.trim(),
      };
      await updateDoc(docRef, updatedData);
      
      setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, ...updatedData } : m));
      setIsEditOpen(false);
      setEditingMessage(null);
      if (selectedMessage?.id === editingMessage.id) {
        setSelectedMessage(prev => prev ? { ...prev, ...updatedData } : null);
      }
    } catch (error) {
      const updatedData = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim(),
        service: editService.trim(),
        budget: editBudget.trim(),
        message: editMessageText.trim(),
      };
      setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, ...updatedData } : m));
      setIsEditOpen(false);
      setEditingMessage(null);
      if (selectedMessage?.id === editingMessage.id) {
        setSelectedMessage(prev => prev ? { ...prev, ...updatedData } : null);
      }
      handleFirestoreError(error, OperationType.UPDATE, 'messages/' + editingMessage.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeContactMessages = messages.filter(msg => !msg.isDeleted && isContactFormMessage(msg));
  const activeServiceMessages = messages.filter(msg => !msg.isDeleted && isServiceFormMessage(msg));
  const deletedContactMessages = messages.filter(msg => msg.isDeleted && isContactFormMessage(msg));
  const deletedServiceMessages = messages.filter(msg => msg.isDeleted && isServiceFormMessage(msg));
  const deletedProjects = projects.filter(p => p.isDeleted);

  const filteredMessages = activeContactMessages.filter(msg => {
    const term = messageSearchTerm.toLowerCase();
    return (
      (msg.name || '').toLowerCase().includes(term) ||
      (msg.email || '').toLowerCase().includes(term) ||
      (msg.service || '').toLowerCase().includes(term) ||
      (msg.message || '').toLowerCase().includes(term)
    );
  });

  // Helper function to format date as DD/MM/YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  };

  // Helper for calculating single project database storage
  const getProjectStorageSize = (p: Project) => {
    let size = 0;
    size += (p.id || '').length;
    size += (p.title || '').length;
    size += (p.category || '').length;
    size += (p.desc || '').length;
    size += (p.image || '').length;
    size += (p.video || '').length;
    size += (p.link || '').length;
    size += (p.type || '').length;
    size += (p.createdAt || '').length;
    if (p.tags) {
      p.tags.forEach(t => {
        size += (t || '').length;
      });
    }
    // Base metadata overhead roughly 100 bytes per doc in Firestore
    return size + 100;
  };

  // Helper for calculating single message database storage
  const getMessageStorageSize = (m: Message) => {
    let size = 0;
    size += (m.id || '').length;
    size += (m.name || '').length;
    size += (m.email || '').length;
    size += (m.phone || '').length;
    size += (m.service || '').length;
    size += (m.budget || '').length;
    size += (m.message || '').length;
    size += (m.createdAt || '').length;
    return size + 80;
  };

  // Format bytes beautifully
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-[1600px] mx-auto w-full relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gray-50 dark:bg-transparent">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 opacity-0 animate-fade-up">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor your contact submissions, lead budgets, and client inquiries.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'storage'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white shadow-sm'
            }`}
          >
            <Database size={16} />
            <span>Storage & Stats</span>
          </button>
          <button 
            onClick={() => {
              setNewAdminIdInput(adminId || 'mohan');
              setAdminIdCurrentPass('');
              setAdminIdError('');
              setAdminIdSuccess('');
              setIsChangeAdminIdOpen(true);
            }}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all flex items-center gap-2 font-bold text-sm shadow-sm"
          >
            <User size={18} className="text-blue-500" />
            Change Admin ID
          </button>
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-neon-purple hover:border-neon-purple/40 transition-all flex items-center gap-2 font-bold text-sm shadow-sm"
          >
            <Key size={18} className="text-neon-purple" />
            Change Password
          </button>
          <button 
            onClick={logout}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all group flex items-center gap-2 font-bold text-sm shadow-sm"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Reordered & Unique Colors for Each Tab */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-100/50 dark:bg-[#0A0C11]/30 p-2 rounded-2xl border border-gray-200 dark:border-white/5 max-w-fit opacity-0 animate-fade-up">
        {/* 1. PROJECTS (Blue Theme) */}
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10'
          }`}
        >
          <FolderPlus size={14} />
          Projects ({projects.filter(p => !p.isDeleted).length})
        </button>

        {/* 2. SERVICES FORM (Neon Purple Theme) */}
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'services'
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10'
          }`}
        >
          <Layers size={14} />
          Services Form ({activeServiceMessages.length})
        </button>

        {/* 3. CONTACT FORM (Emerald / Teal Theme) */}
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'leads'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10'
          }`}
        >
          <MessageSquare size={14} />
          Contact Form ({activeContactMessages.length})
        </button>

        {/* 4. RECYCLE BIN (Red / Rose Theme) */}
        <button
          onClick={() => setActiveTab('recycle')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'recycle'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-red-400 hover:bg-red-500/10'
          }`}
        >
          <Trash2 size={14} />
          Recycle Bin ({deletedProjects.length + deletedContactMessages.length + deletedServiceMessages.length})
        </button>
      </div>

      {/* CONDITIONAL SECTIONS */}
      {activeTab === 'leads' && (
        <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 opacity-0 animate-fade-up flex flex-col min-h-[500px] shadow-sm dark:shadow-none">
          {/* Messages Toolbar */}
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageSquare size={16} />
              <span className="font-bold text-gray-900 dark:text-white">Contact Form Submissions</span>
              <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs text-gray-700 dark:text-white">{filteredMessages.length}</span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name, email, service..." 
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(160,32,240,0.2)] transition-all duration-300"
                />
              </div>
              <button 
                onClick={fetchMessages}
                className="p-2.5 bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30 transition-all flex items-center justify-center gap-2"
                title="Refresh Leads"
              >
                <RefreshCw size={18} className={messagesLoading ? "animate-spin text-neon-purple" : ""} />
              </button>
            </div>
          </div>

          {/* Messages Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-gray-100 dark:bg-[#0F1320] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/5">
            <div className="col-span-3">User Info</div>
            <div className="col-span-3">Service Required</div>
            <div className="col-span-2">Budget</div>
            <div className="col-span-2">Submitted At</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Messages Table Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0A0C11]/30">
            {messagesLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <RefreshCw className="w-12 h-12 text-neon-purple animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-light">Connecting to BrandiQue database and loading messages...</p>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredMessages.map((msg, idx) => (
                  <div 
                    key={msg.id} 
                    className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] group transition-colors duration-200 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Name & Email */}
                    <div className="col-span-3">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">{msg.name}</h4>
                      <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:underline">{msg.email}</a>
                    </div>

                    {/* Service Required */}
                    <div className="col-span-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                        {msg.service || 'Web Development'}
                      </span>
                    </div>

                    {/* Budget */}
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{msg.budget || 'Not specified'}</span>
                    </div>

                    {/* Submitted At */}
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{msg.createdAt ? formatDate(msg.createdAt) : '-'}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedMessage(msg);
                          setIsMessageDetailOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-neon-purple hover:shadow-[0_0_10px_rgba(160,32,240,0.3)] transition-all"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          setEditingMessage(msg);
                          setEditName(msg.name || '');
                          setEditEmail(msg.email || '');
                          setEditPhone(msg.phone || '');
                          setEditService(msg.service || '');
                          setEditBudget(msg.budget || '');
                          setEditMessageText(msg.message || '');
                          setIsEditOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-neon-purple hover:shadow-[0_0_10px_rgba(160,32,240,0.3)] transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeletingMessageDoc(msg)} 
                        className="p-2 rounded-lg bg-gray-100 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
                        title="Delete Submission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>No inquiries found matching "{messageSearchTerm}"</p>
              </div>
            )}
          </div>

          {/* Messages Table Footer */}
          <div className="px-8 py-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F1320] text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filteredMessages.length} of {messages.length} Submissions</span>
          </div>
        </div>
      )}

      {/* --- SERVICES FORM SECTION (5 SERVICES) --- */}
      {activeTab === 'services' && (
        <div className="space-y-8 animate-fade-up">
          {/* Top 5 Services Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SERVICE_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const count = activeServiceMessages.filter(m => categorizeMessage(m) === cat.id).length;
              const isSelected = selectedServiceTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedServiceTab(cat.id)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'bg-white dark:bg-[#0F1320] border-neon-purple shadow-lg shadow-neon-purple/10 ring-2 ring-neon-purple/30'
                      : 'bg-white/60 dark:bg-[#0A0C11]/50 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#0F1320]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.badgeBg}`}>
                        <IconComp size={20} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        count > 0 ? 'bg-neon-purple text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                      }`}>
                        {count} {count === 1 ? 'Form' : 'Forms'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <span>View Submissions</span>
                    <ChevronRight size={14} className={`transition-transform ${isSelected ? 'translate-x-1 text-neon-purple' : 'group-hover:translate-x-1'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submissions List for Selected Service */}
          <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col min-h-[450px] shadow-sm dark:shadow-none">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                {(() => {
                  const currentCat = SERVICE_CATEGORIES.find(c => c.id === selectedServiceTab);
                  const IconComp = currentCat?.icon || Code;
                  return (
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentCat?.badgeBg}`}>
                      <IconComp size={18} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedServiceTab} Forms
                    <span className="bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {activeServiceMessages.filter(m => categorizeMessage(m) === selectedServiceTab).length}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Detailed submissions specifically submitted for {selectedServiceTab}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search in this service..." 
                    value={serviceFormSearch}
                    onChange={(e) => setServiceFormSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
                <button 
                  onClick={fetchMessages}
                  className="p-2 bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-400 hover:text-black dark:hover:text-white transition-all"
                  title="Refresh Messages"
                >
                  <RefreshCw size={16} className={messagesLoading ? "animate-spin text-neon-purple" : ""} />
                </button>
              </div>
            </div>

            {/* Submissions List */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {(() => {
                const serviceMsgs = activeServiceMessages
                  .filter(m => categorizeMessage(m) === selectedServiceTab)
                  .filter(m => {
                    if (!serviceFormSearch.trim()) return true;
                    const q = serviceFormSearch.toLowerCase();
                    return (
                      (m.name && m.name.toLowerCase().includes(q)) ||
                      (m.email && m.email.toLowerCase().includes(q)) ||
                      (m.phone && m.phone.toLowerCase().includes(q)) ||
                      (m.service && m.service.toLowerCase().includes(q)) ||
                      (m.message && m.message.toLowerCase().includes(q))
                    );
                  });

                if (messagesLoading) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <RefreshCw className="w-10 h-10 text-neon-purple animate-spin mb-3" />
                      <p className="text-xs text-gray-400">Loading {selectedServiceTab} form submissions...</p>
                    </div>
                  );
                }

                if (serviceMsgs.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                        <MessageSquare size={28} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No Form Submissions Yet</h4>
                      <p className="text-xs text-gray-500 max-w-sm">Submissions for {selectedServiceTab} from users on the website will appear here in detail.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {serviceMsgs.map((msg) => (
                      <div 
                        key={msg.id}
                        className="bg-gray-50/50 dark:bg-[#05070A]/60 border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-neon-purple/40 hover:shadow-lg hover:shadow-neon-purple/5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Header: Name, Email & Date */}
                          <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-200/60 dark:border-white/5">
                            <div>
                              <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {msg.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <a href={`mailto:${msg.email}`} className="text-neon-purple hover:underline font-medium flex items-center gap-1">
                                  <Mail size={12} /> {msg.email}
                                </a>
                                {msg.phone && (
                                  <a href={`tel:${msg.phone}`} className="hover:underline flex items-center gap-1">
                                    <Phone size={12} /> {msg.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/5 whitespace-nowrap">
                              {msg.createdAt ? formatDate(msg.createdAt) : 'Recent'}
                            </span>
                          </div>

                          {/* Details Badges */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-2.5 bg-white dark:bg-[#0F1320] rounded-xl border border-gray-200/80 dark:border-white/5">
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Service Selected</span>
                              <span className="text-xs font-bold text-neon-purple">{msg.service || selectedServiceTab}</span>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#0F1320] rounded-xl border border-gray-200/80 dark:border-white/5">
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Estimated Budget</span>
                              <span className="text-xs font-bold text-green-600 dark:text-green-400">{msg.budget || 'Not specified'}</span>
                            </div>
                          </div>

                          {/* Extra Service Specific Answers if present */}
                          {msg.serviceDetails && Object.keys(msg.serviceDetails).length > 0 && (
                            <div className="mb-4 p-3 bg-white dark:bg-[#0F1320] rounded-xl border border-gray-200/80 dark:border-white/5 space-y-1.5">
                              <span className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Specific Requirements
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(msg.serviceDetails).map(([k, v]) => {
                                  if (k === 'phone') return null;
                                  return (
                                    <span key={k} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                                      <strong className="text-gray-500 dark:text-gray-400">{k}:</strong> {v}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Message Body */}
                          <div className="p-3 bg-white dark:bg-[#0F1320] rounded-xl border border-gray-200/80 dark:border-white/5 text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto custom-scrollbar mb-4">
                            {msg.message || 'No additional message text.'}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setSelectedMessage(msg);
                              setIsMessageDetailOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                          >
                            <Eye size={14} /> Full Details
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingMessage(msg);
                                setEditName(msg.name || '');
                                setEditEmail(msg.email || '');
                                setEditPhone(msg.phone || '');
                                setEditService(msg.service || '');
                                setEditBudget(msg.budget || '');
                                setEditMessageText(msg.message || '');
                                setIsEditOpen(true);
                              }}
                              className="p-1.5 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingMessageDoc(msg)}
                              className="p-1.5 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Projects Toolbar */}
          <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 border border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <FolderPlus className="text-neon-purple" size={22} />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Website Projects Directory</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total active projects displayed on the website: {projects.filter(p => !p.isDeleted).length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(160,32,240,0.2)] transition-all duration-300"
                />
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="px-5 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/25 flex items-center gap-2 text-xs transition-all duration-300 whitespace-nowrap hover:scale-[1.02]"
              >
                <Plus size={16} />
                Add New Project
              </button>
            </div>
          </div>

          {/* Categorized Projects Lists */}
          {['main', 'portfolio', 'figma', 'client'].map(type => {
            const activeProjectsInType = projects.filter(p => !p.isDeleted && p.type === type && (
              projectSearchTerm === '' ||
              p.title.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
              p.category.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
              p.desc.toLowerCase().includes(projectSearchTerm.toLowerCase())
            ));

            const typeLabel = type === 'main' ? 'Main Projects' :
                              type === 'portfolio' ? 'Portfolio Projects' :
                              type === 'figma' ? 'Figma Projects' : 'Client & Personal Projects';

            return (
              <div key={type} className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="p-6 bg-gray-50 dark:bg-[#0F1320] border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-neon-purple dark:text-neon-blue tracking-wider uppercase flex items-center gap-2">
                    <span>// {typeLabel}</span>
                    <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs text-gray-700 dark:text-white font-mono normal-case">{activeProjectsInType.length}</span>
                  </h4>
                </div>

                <div className="p-6">
                  {projectsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="animate-spin text-neon-purple" size={24} />
                    </div>
                  ) : activeProjectsInType.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeProjectsInType.map((p, idx) => (
                        <div key={`${p.id}-${idx}`} className="bg-gray-50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-neon-purple/30 hover:shadow-[0_10px_30px_rgba(160,32,240,0.05)] transition-all duration-300">
                          <div>
                            {/* Image Preview */}
                            <div className="relative aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden border-b border-gray-200 dark:border-white/5">
                              <img 
                                src={p.image} 
                                alt={p.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  // Fallback for failed image loads
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase bg-black/60 text-white backdrop-blur-sm border border-white/10">
                                {formatBytes(getProjectStorageSize(p))}
                              </div>
                            </div>

                            {/* Project details */}
                            <div className="p-5 space-y-2">
                              <span className="text-[10px] font-bold text-neon-purple tracking-widest uppercase block">{p.category}</span>
                              <h5 className="font-bold text-base text-gray-900 dark:text-white uppercase line-clamp-1">{p.title}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{p.desc}</p>
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {p.tags?.map((tag, tIdx) => (
                                  <span key={tIdx} className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase bg-gray-200/50 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer with actions */}
                          <div className="p-5 pt-0 border-t border-gray-100 dark:border-white/5 mt-4 flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Type: {p.type}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewingProject(p)}
                                className="p-2 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-neon-purple hover:border-neon-purple/30 hover:shadow-[0_0_10px_rgba(160,32,240,0.2)] transition-all"
                                title="Live Media & Card Preview"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProject(p);
                                  setEditTitle(p.title);
                                  setEditCategory(p.category);
                                  setEditDesc(p.desc);
                                  setEditTags(p.tags?.join(', ') || '');
                                  setEditImage(p.image);
                                  setEditVideo(p.video || '');
                                  setEditImages(p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []));
                                  setEditVideos(p.videos && p.videos.length > 0 ? p.videos : (p.video ? [p.video] : []));
                                  setEditLink(p.link);
                                  setEditType(p.type);
                                  setIsEditProjectOpen(true);
                                }}
                                className="p-2 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-neon-purple hover:border-neon-purple/30 hover:shadow-[0_0_10px_rgba(160,32,240,0.2)] transition-all"
                                title="Edit Project"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingProjectDoc(p);
                                  setIsPermanentDelete(false);
                                }}
                                className="p-2 bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all"
                                title="Delete Project (Move to Recycle Bin)"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-xs italic font-light py-4 text-center">No projects in this section.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'recycle' && (
        <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col min-h-[500px] shadow-sm dark:shadow-none animate-fade-up">
          {/* Recycle Bin Top Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trash2 className="text-red-500" size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Recycle Bin</h3>
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {deletedProjects.length + deletedContactMessages.length + deletedServiceMessages.length} Total Deleted
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Restore items back to active views or permanently delete them from the system.</p>
            </div>

            {/* 3 Category Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-200/50 dark:bg-[#05070A]/80 p-1.5 rounded-xl border border-gray-200 dark:border-white/5">
              <button
                onClick={() => setRecycleSubTab('projects')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  recycleSubTab === 'projects'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <FolderPlus size={14} />
                <span>Projects ({deletedProjects.length})</span>
              </button>

              <button
                onClick={() => setRecycleSubTab('contact')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  recycleSubTab === 'contact'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                <span>Contact Form ({deletedContactMessages.length})</span>
              </button>

              <button
                onClick={() => setRecycleSubTab('services')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  recycleSubTab === 'services'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>Services Form ({deletedServiceMessages.length})</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {/* SUB-TAB 1: PROJECTS */}
            {recycleSubTab === 'projects' && (
              projectsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <RefreshCw className="w-10 h-10 text-red-500 animate-spin mb-3" />
                  <p className="text-gray-400 text-xs">Loading deleted projects...</p>
                </div>
              ) : deletedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deletedProjects.map((p, idx) => (
                    <div key={`deleted-${p.id}-${idx}`} className="bg-gray-50 dark:bg-[#05070A]/30 border border-red-500/20 rounded-2xl overflow-hidden flex flex-col justify-between group animate-fade-up">
                      <div>
                        <div className="relative aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden border-b border-gray-200 dark:border-white/5 opacity-70">
                          <img src={p.image} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale" />
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase bg-black/60 text-white backdrop-blur-sm border border-white/10">
                            {formatBytes(getProjectStorageSize(p))}
                          </div>
                          <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center">
                            <span className="bg-red-500 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                              Soft Deleted
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-2">
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">{p.category}</span>
                          <h5 className="font-bold text-base text-gray-900 dark:text-white uppercase line-clamp-1">{p.title}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{p.desc}</p>
                          {p.deletedAt && (
                            <p className="text-[10px] text-red-400 flex items-center gap-1">
                              <Clock size={10} /> Deleted on {formatDate(p.deletedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0 mt-4 flex items-center gap-3">
                        <button
                          onClick={() => setRestoringProjectDoc(p)}
                          className="flex-1 py-2 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          Restore
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProjectDoc(p);
                            setIsPermanentDelete(true);
                          }}
                          className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Delete Perm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Trash2 size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-light">No deleted projects in Recycle Bin.</p>
                </div>
              )
            )}

            {/* SUB-TAB 2: CONTACT FORM MESSAGES */}
            {recycleSubTab === 'contact' && (
              deletedContactMessages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deletedContactMessages.map(msg => (
                    <div key={msg.id} className="bg-gray-50 dark:bg-[#05070A]/30 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between group animate-fade-up">
                      <div>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-white/5">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{msg.name}</h4>
                            <p className="text-xs text-gray-500">{msg.email}</p>
                          </div>
                          <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">Contact Form</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <p><strong className="text-gray-400">Service:</strong> {msg.service || 'Web Development'}</p>
                          <p><strong className="text-gray-400">Budget:</strong> <span className="text-green-500 font-semibold">{msg.budget || 'Not specified'}</span></p>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 bg-white dark:bg-[#0F1320] p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 mt-2">
                            {msg.message || 'No additional message text.'}
                          </p>
                          {msg.deletedAt && (
                            <p className="text-[10px] text-red-400 flex items-center gap-1 mt-2">
                              <Clock size={10} /> Deleted on {formatDate(msg.deletedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center gap-3">
                        <button
                          onClick={() => setRestoringMessageDoc(msg)}
                          className="flex-1 py-2 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          Restore
                        </button>
                        <button
                          onClick={() => setDeletingMessagePermanentDoc(msg)}
                          className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Delete Perm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Trash2 size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-light">No deleted contact forms in Recycle Bin.</p>
                </div>
              )
            )}

            {/* SUB-TAB 3: SERVICES FORM MESSAGES */}
            {recycleSubTab === 'services' && (
              deletedServiceMessages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deletedServiceMessages.map(msg => (
                    <div key={msg.id} className="bg-gray-50 dark:bg-[#05070A]/30 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between group animate-fade-up">
                      <div>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-white/5">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{msg.name}</h4>
                            <p className="text-xs text-gray-500">{msg.email}</p>
                          </div>
                          <span className="text-[9px] font-bold text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded-full uppercase">{msg.service || 'Service Form'}</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          {msg.phone && <p><strong className="text-gray-400">Phone:</strong> {msg.phone}</p>}
                          <p><strong className="text-gray-400">Budget:</strong> <span className="text-green-500 font-semibold">{msg.budget || 'Not specified'}</span></p>
                          {msg.serviceDetails && Object.keys(msg.serviceDetails).length > 0 && (
                            <div className="p-2 bg-white dark:bg-[#0F1320] rounded-xl border border-gray-200/60 dark:border-white/5 text-[11px] space-y-0.5">
                              {Object.entries(msg.serviceDetails).map(([k, v]) => (
                                <p key={k}><strong className="text-gray-400">{k}:</strong> {v}</p>
                              ))}
                            </div>
                          )}
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 bg-white dark:bg-[#0F1320] p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 mt-2">
                            {msg.message || 'No additional message text.'}
                          </p>
                          {msg.deletedAt && (
                            <p className="text-[10px] text-red-400 flex items-center gap-1 mt-2">
                              <Clock size={10} /> Deleted on {formatDate(msg.deletedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center gap-3">
                        <button
                          onClick={() => setRestoringMessageDoc(msg)}
                          className="flex-1 py-2 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          Restore
                        </button>
                        <button
                          onClick={() => setDeletingMessagePermanentDoc(msg)}
                          className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Delete Perm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Trash2 size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-light">No deleted service forms in Recycle Bin.</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {activeTab === 'storage' && (() => {
        const totalProjectsStorage = projects.reduce((acc, p) => acc + getProjectStorageSize(p), 0);
        const totalMessagesStorage = messages.reduce((acc, m) => acc + getMessageStorageSize(m), 0);
        const totalFilledStorage = totalProjectsStorage + totalMessagesStorage;
        const totalLimit = 1073741824; // 1 GB in bytes
        const percentFilled = (totalFilledStorage / totalLimit) * 100;
        const freeStorage = totalLimit - totalFilledStorage;

        return (
          <div className="space-y-6">
            {/* Storage Quota Overview */}
            <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Database className="text-neon-purple" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Firestore Database Storage Summary</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Visual monitoring of your database consumption in real-time.</p>
                </div>
              </div>

              {/* Storage Usage Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1.5 font-bold">
                    <HardDrive size={12} />
                    Database Limit Quota (Google Firestore Free Tier)
                  </span>
                  <span className="font-mono">{percentFilled.toFixed(5)}% Filled</span>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full h-4 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentFilled, 0.25)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-center md:text-left">
                  <div className="p-4 bg-gray-50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Total Filled Storage</p>
                    <p className="text-xl font-bold text-neon-purple">{formatBytes(totalFilledStorage)}</p>
                    <p className="text-[9px] text-gray-400 mt-1">Sum of active & deleted docs</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Total Free Storage</p>
                    <p className="text-xl font-bold text-green-500 dark:text-green-400">{formatBytes(freeStorage)}</p>
                    <p className="text-[9px] text-gray-400 mt-1">Remaining storage allowance</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Firestore Document Limit</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">1.00 GB (1,024 MB)</p>
                    <p className="text-[9px] text-gray-400 mt-1">Cloud Firestore sandbox quota</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Breakdown */}
            <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10">
              <div className="p-6 bg-gray-50 dark:bg-[#0F1320] border-b border-gray-200 dark:border-white/5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 size={16} className="text-neon-purple" />
                  Collection Storage Breakdown
                </h4>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                <div className="grid grid-cols-12 gap-4 p-5 items-center text-xs text-gray-500 font-bold uppercase tracking-wider bg-gray-100/50 dark:bg-[#0F1320]/20">
                  <div className="col-span-4">Collection</div>
                  <div className="col-span-3">Documents Count</div>
                  <div className="col-span-3">Estimated Size</div>
                  <div className="col-span-2 text-right">Percentage</div>
                </div>

                {/* Projects Collection Row */}
                <div className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                  <div className="col-span-4 flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                    <FolderPlus size={16} className="text-neon-purple" />
                    <span>projects</span>
                  </div>
                  <div className="col-span-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {projects.length} docs
                  </div>
                  <div className="col-span-3 text-sm font-bold text-neon-blue">
                    {formatBytes(totalProjectsStorage)}
                  </div>
                  <div className="col-span-2 text-sm text-right font-mono text-gray-500">
                    {totalFilledStorage > 0 ? ((totalProjectsStorage / totalFilledStorage) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>

                {/* Inquiries Collection Row */}
                <div className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                  <div className="col-span-4 flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                    <MessageSquare size={16} className="text-neon-purple" />
                    <span>messages</span>
                  </div>
                  <div className="col-span-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {messages.length} docs
                  </div>
                  <div className="col-span-3 text-sm font-bold text-neon-blue">
                    {formatBytes(totalMessagesStorage)}
                  </div>
                  <div className="col-span-2 text-sm text-right font-mono text-gray-500">
                    {totalFilledStorage > 0 ? ((totalMessagesStorage / totalFilledStorage) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Project Storage Details */}
            <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10">
              <div className="p-6 bg-gray-50 dark:bg-[#0F1320] border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Database size={16} className="text-neon-purple" />
                  Detailed Storage Breakdown per Project
                </h4>
                <span className="text-[10px] font-bold text-neon-purple dark:text-neon-blue tracking-widest font-mono">DESCENDING</span>
              </div>
              
              <div className="p-6">
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {[...projects]
                      .sort((a, b) => getProjectStorageSize(b) - getProjectStorageSize(a))
                      .map((p, idx) => {
                        const size = getProjectStorageSize(p);
                        const pct = totalProjectsStorage > 0 ? (size / totalProjectsStorage) * 100 : 0;
                        return (
                          <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono font-bold text-gray-400">#{idx + 1}</span>
                              <div>
                                <h5 className="font-bold text-sm text-gray-900 dark:text-white uppercase flex items-center gap-2">
                                  {p.title}
                                  {p.isDeleted && <span className="text-[8px] bg-red-500/10 text-red-500 font-bold px-1.5 py-0.5 rounded uppercase font-mono">Deleted</span>}
                                </h5>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Category: {p.category} | Type: {p.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-neon-blue">{formatBytes(size)}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{pct.toFixed(1)}% of projects db</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-xs italic font-light py-4 text-center">No projects in database.</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}


      {/* --- PASSWORD CHANGE MODAL --- */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in">
            <button 
              onClick={() => {
                setIsChangePasswordOpen(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setPassError('');
                setPassSuccess('');
                setShowOldPassword(false);
                setShowNewPassword(false);
                setShowConfirmNewPassword(false);
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Key size={22} className="text-neon-purple" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your BrandiQue Admin credentials.</p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setPassError('');
              setPassSuccess('');

              if (newPassword !== confirmNewPassword) {
                setPassError('New passwords do not match.');
                return;
              }

              const result = await changePassword(oldPassword, newPassword);
              if (result.success) {
                setPassSuccess(result.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setShowOldPassword(false);
                setShowNewPassword(false);
                setShowConfirmNewPassword(false);
                setTimeout(() => {
                  setIsChangePasswordOpen(false);
                  setPassSuccess('');
                }, 1500);
              } else {
                setPassError(result.message);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Old Password</label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmNewPassword ? "text" : "password"} 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {passError && <p className="text-xs text-red-500 font-medium">{passError}</p>}
              {passSuccess && <p className="text-xs text-green-500 font-medium">{passSuccess}</p>}

              <button 
                type="submit"
                className="w-full py-3 mt-2 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADMIN ID CHANGE MODAL --- */}
      {isChangeAdminIdOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in">
            <button 
              onClick={() => {
                setIsChangeAdminIdOpen(false);
                setAdminIdCurrentPass('');
                setNewAdminIdInput('');
                setAdminIdError('');
                setAdminIdSuccess('');
                setShowAdminIdPass(false);
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <User size={22} className="text-blue-500" />
              Change Admin ID
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Current Admin ID: <strong className="text-blue-500 font-mono">{adminId || 'mohan'}</strong>
            </p>

            <form onSubmit={handleChangeAdminIdSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Admin ID</label>
                <input 
                  type="text" 
                  value={newAdminIdInput} 
                  onChange={(e) => setNewAdminIdInput(e.target.value)}
                  placeholder="e.g. admin, mohan, brandique_admin"
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Current Password (To Confirm)</label>
                <div className="relative">
                  <input 
                    type={showAdminIdPass ? "text" : "password"} 
                    value={adminIdCurrentPass} 
                    onChange={(e) => setAdminIdCurrentPass(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminIdPass(!showAdminIdPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showAdminIdPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {adminIdError && <p className="text-xs text-red-500 font-medium">{adminIdError}</p>}
              {adminIdSuccess && <p className="text-xs text-green-500 font-medium">{adminIdSuccess}</p>}

              <button 
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                Update Admin ID
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MESSAGE DETAIL MODAL --- */}
      {isMessageDetailOpen && selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-2xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-scale-in max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsMessageDetailOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors border border-black/5 dark:border-white/5"
            >
              <X size={20} />
            </button>
            
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Message Detail</h2>
                  <p className="text-xs text-gray-500">Submitted on {selectedMessage.createdAt ? formatDate(selectedMessage.createdAt) : 'Unknown Date'}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">From Name</h4>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</h4>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-neon-purple hover:underline flex items-center gap-1.5">
                    <Mail size={14} />
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</h4>
                    <a href={`tel:${selectedMessage.phone}`} className="text-sm font-semibold text-neon-purple hover:underline flex items-center gap-1.5">
                      <Phone size={14} />
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Required Service</h4>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                    {selectedMessage.service}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Budget</h4>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-1">
                    <DollarSign size={14} />
                    {selectedMessage.budget}
                  </p>
                </div>
              </div>

              {/* Dynamic Service Specific Details */}
              {selectedMessage.serviceDetails && Object.keys(selectedMessage.serviceDetails).length > 0 && (
                <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Service Specific Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedMessage.serviceDetails).map(([key, val]) => {
                      if (key === 'phone') return null; // Already rendered above
                      return (
                        <div key={key} className="p-3 bg-gray-50/50 dark:bg-[#05070A]/50 rounded-xl border border-gray-100 dark:border-white/5">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{key}</h5>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{val || 'Not specified'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Message</h4>
                <div className="p-4 bg-gray-50 dark:bg-[#05070A] rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0C11]/50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setEditingMessage(selectedMessage);
                  setEditName(selectedMessage.name || '');
                  setEditEmail(selectedMessage.email || '');
                  setEditPhone(selectedMessage.phone || '');
                  setEditService(selectedMessage.service || '');
                  setEditBudget(selectedMessage.budget || '');
                  setEditMessageText(selectedMessage.message || '');
                  setIsEditOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-sm font-bold flex items-center gap-1.5"
              >
                <Edit3 size={16} /> Edit Inquiry
              </button>
              <button 
                onClick={() => {
                  setDeletingMessageDoc(selectedMessage);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold flex items-center gap-1.5"
              >
                <Trash2 size={16} /> Delete Submission
              </button>
              <button 
                onClick={() => setIsMessageDetailOpen(false)} 
                className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- EDIT INQUIRY MODAL --- */}
      {isEditOpen && editingMessage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in max-h-[92vh] flex flex-col">
            <button 
              onClick={() => {
                setIsEditOpen(false);
                setEditingMessage(null);
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Edit3 size={22} className="text-neon-purple" />
              Edit Lead Inquiry
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Modify the client info or requested details.</p>

            <form onSubmit={handleUpdateMessage} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editPhone} 
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Service Requested</label>
                  <input 
                    type="text" 
                    value={editService} 
                    onChange={(e) => setEditService(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Estimated Budget</label>
                <input 
                  type="text" 
                  value={editBudget} 
                  onChange={(e) => setEditBudget(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Message / Notes</label>
                <textarea 
                  rows={4}
                  value={editMessageText} 
                  onChange={(e) => setEditMessageText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingMessage(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 transition-all text-xs flex items-center gap-1.5"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PROJECT MODAL WITH SIDE PREVIEW --- */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-5xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-6 md:p-8 relative animate-scale-in max-h-[94vh] flex flex-col">
            <button 
              onClick={() => setIsAddProjectOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <FolderPlus size={22} className="text-neon-purple" />
              Upload New Project
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Publish a new visual design, artifact, or portfolio development with live side-by-side media preview.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {/* Form Side */}
              <form onSubmit={handleAddProject} className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      {newType === 'client' ? 'Image Name / Project Title' : 'Project Title'}
                    </label>
                    <input 
                      type="text" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      placeholder={newType === 'client' ? "e.g. Client Design Banner" : "e.g. BrandiQue Creative"}
                      className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Website Section / Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      required
                      className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                    >
                      <option value="main">Main Projects</option>
                      <option value="portfolio">Portfolio Projects</option>
                      <option value="figma">Figma Projects</option>
                      <option value="client">Client & Personal Projects</option>
                    </select>
                  </div>

                  {(newType as string) !== 'client' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle / Category</label>
                      <input 
                        type="text" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                        required={(newType as string) !== 'client'}
                        placeholder="e.g. Branding & Development"
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <MultiMediaInput
                    label="Project Images"
                    type="image"
                    items={newImages}
                    onChange={setNewImages}
                    maxCount={10}
                  />

                  <MultiMediaInput
                    label="Showcase Videos"
                    type="video"
                    items={newVideos}
                    onChange={setNewVideos}
                    maxCount={5}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">External Link / Action URL</label>
                  <input 
                    type="url" 
                    value={newLink} 
                    onChange={(e) => setNewLink(e.target.value)}
                    required
                    placeholder="https://brandique.in"
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                {(newType as string) !== 'client' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tech Stack Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={newTags} 
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="React, Tailwind, Framer Motion"
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Description</label>
                      <textarea 
                        rows={3}
                        value={newDesc} 
                        onChange={(e) => setNewDesc(e.target.value)}
                        required={(newType as string) !== 'client'}
                        placeholder="Write a clear, inspiring description of the project, its goals, and solutions..."
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                  <button 
                    type="button"
                    onClick={() => setIsAddProjectOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isAddingProject}
                    className="px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 transition-all text-xs flex items-center gap-1.5"
                  >
                    {isAddingProject ? "Uploading..." : "Publish Project"}
                  </button>
                </div>
              </form>

              {/* Side Live Preview Panel */}
              <div className="lg:col-span-5 bg-gray-50/70 dark:bg-[#05070A]/50 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={15} className="text-neon-purple" />
                    Side Preview Panel
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                    Live Updates
                  </span>
                </div>

                <ProjectLivePreviewCard
                  title={newTitle}
                  category={newType === 'client' ? (newCategory || 'Client Project') : newCategory}
                  desc={newType === 'client' ? (newDesc || 'Client & Personal Project') : newDesc}
                  tags={newTags}
                  image={newImage}
                  video={newVideo}
                  images={newImages}
                  videos={newVideos}
                  link={newLink}
                  type={newType}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT PROJECT MODAL WITH SIDE PREVIEW --- */}
      {isEditProjectOpen && editingProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-5xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-6 md:p-8 relative animate-scale-in max-h-[94vh] flex flex-col">
            <button 
              onClick={() => {
                setIsEditProjectOpen(false);
                setEditingProject(null);
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Edit3 size={22} className="text-neon-purple" />
              Edit Project Details
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Modify any parameters or media links with live side-by-side preview.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {/* Form Side */}
              <form onSubmit={handleUpdateProject} className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                      {editType === 'client' ? 'Image Name / Project Title' : 'Project Title'}
                    </label>
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Website Section / Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      required
                      className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                    >
                      <option value="main">Main Projects</option>
                      <option value="portfolio">Portfolio Projects</option>
                      <option value="figma">Figma Projects</option>
                      <option value="client">Client & Personal Projects</option>
                    </select>
                  </div>

                  {(editType as string) !== 'client' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle / Category</label>
                      <input 
                        type="text" 
                        value={editCategory} 
                        onChange={(e) => setEditCategory(e.target.value)}
                        required={(editType as string) !== 'client'}
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <MultiMediaInput
                    label="Project Images"
                    type="image"
                    items={editImages}
                    onChange={setEditImages}
                    maxCount={10}
                  />

                  <MultiMediaInput
                    label="Showcase Videos"
                    type="video"
                    items={editVideos}
                    onChange={setEditVideos}
                    maxCount={5}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">External Link / Action URL</label>
                  <input 
                    type="url" 
                    value={editLink} 
                    onChange={(e) => setEditLink(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                {(editType as string) !== 'client' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tech Stack Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={editTags} 
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="React, Tailwind, Framer Motion"
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Description</label>
                      <textarea 
                        rows={3}
                        value={editDesc} 
                        onChange={(e) => setEditDesc(e.target.value)}
                        required={(editType as string) !== 'client'}
                        className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditProjectOpen(false);
                      setEditingProject(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdatingProject}
                    className="px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 transition-all text-xs flex items-center gap-1.5"
                  >
                    {isUpdatingProject ? "Updating..." : "Confirm Changes"}
                  </button>
                </div>
              </form>

              {/* Side Live Preview Panel */}
              <div className="lg:col-span-5 bg-gray-50/70 dark:bg-[#05070A]/50 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={15} className="text-neon-purple" />
                    Side Preview Panel
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                    Live Updates
                  </span>
                </div>

                <ProjectLivePreviewCard
                  title={editTitle}
                  category={editCategory}
                  desc={editDesc}
                  tags={editTags}
                  image={editImage}
                  video={editVideo}
                  images={editImages}
                  videos={editVideos}
                  link={editLink}
                  type={editType}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STANDALONE FULL MEDIA PREVIEW MODAL --- */}
      {previewingProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-2xl rounded-[28px] border border-gray-200 dark:border-white/10 shadow-2xl p-6 md:p-8 relative animate-scale-in max-h-[92vh] flex flex-col">
            <button 
              onClick={() => setPreviewingProject(null)}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Eye size={22} className="text-neon-purple" />
              {previewingProject.title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{previewingProject.category} • Section: {previewingProject.type}</p>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-4">
              <ProjectLivePreviewCard
                title={previewingProject.title}
                category={previewingProject.category}
                desc={previewingProject.desc}
                tags={previewingProject.tags?.join(', ') || ''}
                image={previewingProject.image}
                video={previewingProject.video || ''}
                images={previewingProject.images || []}
                videos={previewingProject.videos || []}
                link={previewingProject.link}
                type={previewingProject.type}
              />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => {
                  const p = previewingProject;
                  setPreviewingProject(null);
                  setEditingProject(p);
                  setEditTitle(p.title);
                  setEditCategory(p.category);
                  setEditDesc(p.desc);
                  setEditTags(p.tags?.join(', ') || '');
                  setEditImage(p.image);
                  setEditVideo(p.video || '');
                  setEditImages(p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []));
                  setEditVideos(p.videos && p.videos.length > 0 ? p.videos : (p.video ? [p.video] : []));
                  setEditLink(p.link);
                  setEditType(p.type);
                  setIsEditProjectOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple font-bold text-xs hover:bg-neon-purple hover:text-white transition-all flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Project
              </button>
              <button
                onClick={() => setPreviewingProject(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PROJECT DELETE CONFIRMATION MODAL --- */}
      {deletingProjectDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {isPermanentDelete ? "Confirm Permanent Deletion?" : "Confirm Delete Project?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {isPermanentDelete 
                ? `Warning: Are you sure you want to permanently delete "${deletingProjectDoc.title}"? This action is irreversible.`
                : `Are you sure you want to delete "${deletingProjectDoc.title}"? It will be moved to the Recycle Bin.`}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingProjectDoc(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (isPermanentDelete) {
                    await handlePermanentDeleteProject(deletingProjectDoc.id);
                  } else {
                    await handleSoftDeleteProject(deletingProjectDoc);
                  }
                  setDeletingProjectDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                {isPermanentDelete ? "Delete Permanently" : "Confirm Move to Recycle Bin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PROJECT RESTORE CONFIRMATION MODAL --- */}
      {restoringProjectDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Restore Project?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to restore "{restoringProjectDoc.title}" back to active projects?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRestoringProjectDoc(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  await handleRestoreProject(restoringProjectDoc);
                  setRestoringProjectDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/90 text-white transition-all text-sm font-bold shadow-lg shadow-neon-purple/20"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSAGE SOFT DELETE CONFIRMATION MODAL --- */}
      {deletingMessageDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Move to Recycle Bin?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete the submission from <strong className="text-gray-800 dark:text-gray-200">{deletingMessageDoc.name}</strong>? It will be moved to the Recycle Bin.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingMessageDoc(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSoftDeleteMessage(deletingMessageDoc)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Confirm Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSAGE RESTORE CONFIRMATION MODAL --- */}
      {restoringMessageDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Restore Form Submission?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to restore the submission from <strong className="text-gray-800 dark:text-gray-200">{restoringMessageDoc.name}</strong> back to active forms?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRestoringMessageDoc(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRestoreMessage(restoringMessageDoc)}
                className="px-4 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/90 text-white transition-all text-sm font-bold shadow-lg shadow-neon-purple/20"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSAGE PERMANENT DELETE CONFIRMATION MODAL --- */}
      {deletingMessagePermanentDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Permanent Deletion?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Warning: Are you sure you want to permanently delete the submission from <strong className="text-gray-800 dark:text-gray-200">{deletingMessagePermanentDoc.name}</strong>? This action is irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingMessagePermanentDoc(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => handlePermanentDeleteMessage(deletingMessagePermanentDoc.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Admin;
