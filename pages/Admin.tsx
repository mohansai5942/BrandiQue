import React, { useState, useEffect } from 'react';
import { Trash2, Settings, Search, X, Check, BarChart3, LogOut, MessageSquare, Mail, DollarSign, RefreshCw, Clock, Key, Phone, Edit3, Eye, EyeOff, Plus, Database, HardDrive, RotateCcw, FolderPlus, Video, Link2, Tag, ChevronRight, Code, LayoutTemplate, PenTool, Megaphone, Bot, Sparkles, Layers, User, Image as ImageIcon, Globe, ExternalLink, Play, Upload, MapPin, Save, Instagram, LayoutGrid, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings, WebsiteItem } from '../context/SiteSettingsContext';
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

  const { settings: siteSettings, updateSettings, websites, addWebsite, updateWebsite, deleteWebsite, restoreWebsite, permanentlyDeleteWebsite, loadingWebsites } = useSiteSettings();

  const activeWebsites = websites.filter(w => !w.isDeleted);
  const deletedWebsites = websites.filter(w => w.isDeleted);

  // Tab State - Default to 'projects' as requested
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'leads' | 'recycle' | 'storage' | 'site-settings' | 'our-websites'>('projects');
  const [selectedServiceTab, setSelectedServiceTab] = useState<string>('Full-Stack Development');
  const [serviceFormSearch, setServiceFormSearch] = useState('');

  // Websites Management State
  const [newWebName, setNewWebName] = useState('');
  const [newWebUrl, setNewWebUrl] = useState('');
  const [newWebDesc, setNewWebDesc] = useState('');
  const [newWebLogoUrl, setNewWebLogoUrl] = useState('');
  const [newLogoMode, setNewLogoMode] = useState<'upload' | 'url'>('upload');
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [websiteActionMsg, setWebsiteActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingWebsite, setEditingWebsite] = useState<WebsiteItem | null>(null);
  const [editWebName, setEditWebName] = useState('');
  const [editWebUrl, setEditWebUrl] = useState('');
  const [editWebDesc, setEditWebDesc] = useState('');
  const [editWebLogoUrl, setEditWebLogoUrl] = useState('');
  const [editLogoMode, setEditLogoMode] = useState<'upload' | 'url'>('upload');
  const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false);

  // Soft delete & Permanent delete modal states for websites
  const [websiteToDelete, setWebsiteToDelete] = useState<WebsiteItem | null>(null);
  const [websiteToPermanentDelete, setWebsiteToPermanentDelete] = useState<WebsiteItem | null>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setLogoState: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setLogoState(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebName.trim() || !newWebUrl.trim()) return;
    setIsAddingWebsite(true);
    setWebsiteActionMsg(null);
    try {
      await addWebsite(newWebName, newWebUrl, newWebDesc, newWebLogoUrl);
      setNewWebName('');
      setNewWebUrl('');
      setNewWebDesc('');
      setNewWebLogoUrl('');
      setWebsiteActionMsg({ type: 'success', text: 'Website added successfully with logo! Syncing on all devices.' });
      setTimeout(() => setWebsiteActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to add website:', err);
      setWebsiteActionMsg({ type: 'error', text: 'Failed to add website. Please check your connection.' });
    } finally {
      setIsAddingWebsite(false);
    }
  };

  const handleOpenEditWebsite = (web: WebsiteItem) => {
    setEditingWebsite(web);
    setEditWebName(web.name);
    setEditWebUrl(web.url);
    setEditWebDesc(web.description || '');
    setEditWebLogoUrl(web.logoUrl || '');
    setEditLogoMode(web.logoUrl && !web.logoUrl.startsWith('data:') ? 'url' : 'upload');
  };

  const handleUpdateWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWebsite || !editWebName.trim() || !editWebUrl.trim()) return;
    setIsUpdatingWebsite(true);
    try {
      await updateWebsite(editingWebsite.id, editWebName, editWebUrl, editWebDesc, editWebLogoUrl);
      setEditingWebsite(null);
      setWebsiteActionMsg({ type: 'success', text: 'Website link & logo updated on all devices!' });
      setTimeout(() => setWebsiteActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update website:', err);
      setWebsiteActionMsg({ type: 'error', text: 'Failed to update website.' });
    } finally {
      setIsUpdatingWebsite(false);
    }
  };

  const handleConfirmSoftDeleteWebsite = async () => {
    if (!websiteToDelete) return;
    try {
      await deleteWebsite(websiteToDelete.id);
      setWebsiteActionMsg({ type: 'success', text: `"${websiteToDelete.name}" moved to Recycle Bin!` });
      setTimeout(() => setWebsiteActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to move website to recycle bin:', err);
      setWebsiteActionMsg({ type: 'error', text: 'Failed to delete website.' });
    } finally {
      setWebsiteToDelete(null);
    }
  };

  const handleRestoreWebsiteClick = async (web: WebsiteItem) => {
    try {
      await restoreWebsite(web.id);
      setWebsiteActionMsg({ type: 'success', text: `"${web.name}" restored successfully!` });
      setTimeout(() => setWebsiteActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to restore website:', err);
      setWebsiteActionMsg({ type: 'error', text: 'Failed to restore website.' });
    }
  };

  const handleConfirmPermanentDeleteWebsite = async () => {
    if (!websiteToPermanentDelete) return;
    try {
      await permanentlyDeleteWebsite(websiteToPermanentDelete.id);
      setWebsiteActionMsg({ type: 'success', text: `"${websiteToPermanentDelete.name}" permanently deleted.` });
      setTimeout(() => setWebsiteActionMsg(null), 4000);
    } catch (err) {
      console.error('Failed to permanently delete website:', err);
      setWebsiteActionMsg({ type: 'error', text: 'Failed to permanently delete website.' });
    } finally {
      setWebsiteToPermanentDelete(null);
    }
  };

  // Site Settings & Admin Avatar Form State
  const defaultAdminAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';
  const [contactFormEmail, setContactFormEmail] = useState(siteSettings.email);
  const [contactFormPhone, setContactFormPhone] = useState(siteSettings.phone);
  const [contactFormLocation, setContactFormLocation] = useState(siteSettings.location);
  const [contactFormInstagram, setContactFormInstagram] = useState(siteSettings.instagram);
  const [contactFormWhatsapp, setContactFormWhatsapp] = useState(siteSettings.whatsapp);
  const [contactFormHours, setContactFormHours] = useState(siteSettings.workingHours);
  const [contactFormAdminAvatar, setContactFormAdminAvatar] = useState(siteSettings.adminAvatarUrl || defaultAdminAvatar);
  const [adminAvatarUploadMode, setAdminAvatarUploadMode] = useState<'upload' | 'url'>('upload');
  const [isSavingContactSettings, setIsSavingContactSettings] = useState(false);
  const [contactSaveStatus, setContactSaveStatus] = useState<string | null>(null);

  // Sync form inputs when siteSettings change
  useEffect(() => {
    setContactFormEmail(siteSettings.email);
    setContactFormPhone(siteSettings.phone);
    setContactFormLocation(siteSettings.location);
    setContactFormInstagram(siteSettings.instagram);
    setContactFormWhatsapp(siteSettings.whatsapp);
    setContactFormHours(siteSettings.workingHours);
    setContactFormAdminAvatar(siteSettings.adminAvatarUrl || defaultAdminAvatar);
  }, [siteSettings]);

  const handleAdminAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setContactFormAdminAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContactSettings(true);
    setContactSaveStatus(null);
    try {
      await updateSettings({
        email: contactFormEmail.trim(),
        phone: contactFormPhone.trim(),
        location: contactFormLocation.trim(),
        instagram: contactFormInstagram.trim(),
        whatsapp: contactFormWhatsapp.trim(),
        workingHours: contactFormHours.trim(),
        adminAvatarUrl: contactFormAdminAvatar.trim() || defaultAdminAvatar,
      });
      setContactSaveStatus('success');
      setTimeout(() => setContactSaveStatus(null), 4000);
    } catch (err) {
      console.error('Failed to update contact settings:', err);
      setContactSaveStatus('error');
    } finally {
      setIsSavingContactSettings(false);
    }
  };

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
  const [recycleSubTab, setRecycleSubTab] = useState<'projects' | 'contact' | 'services' | 'websites'>('projects');

  // Message Delete & Restore Confirmation States
  const [deletingMessageDoc, setDeletingMessageDoc] = useState<Message | null>(null);
  const [restoringMessageDoc, setRestoringMessageDoc] = useState<Message | null>(null);
  const [deletingMessagePermanentDoc, setDeletingMessagePermanentDoc] = useState<Message | null>(null);

  // States for Consolidated Admin Credentials modal
  const [isAdminCredentialsOpen, setIsAdminCredentialsOpen] = useState(false);
  const [credentialsActiveTab, setCredentialsActiveTab] = useState<'avatar' | 'id' | 'password'>('avatar');
  const [avatarSaveStatus, setAvatarSaveStatus] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // States for Password Change
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // States for Admin ID Change
  const [isChangeAdminIdOpen, setIsChangeAdminIdOpen] = useState(false);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');
  const [adminIdCurrentPass, setAdminIdCurrentPass] = useState('');
  const [adminIdError, setAdminIdError] = useState('');
  const [adminIdSuccess, setAdminIdSuccess] = useState('');
  const [showAdminIdPass, setShowAdminIdPass] = useState(false);

  const handleSaveAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAvatar(true);
    setAvatarSaveStatus(null);
    try {
      await updateSettings({
        adminAvatarUrl: contactFormAdminAvatar.trim() || defaultAdminAvatar,
      });
      setAvatarSaveStatus('success');
      setTimeout(() => setAvatarSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save avatar:', err);
      setAvatarSaveStatus('error');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!oldPassword) {
      setPassError('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setPassError('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPassSuccess(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setPassSuccess('');
      }, 3000);
    } else {
      setPassError(res.message);
    }
  };

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

      const deduplicatedMap = new Map<string, Project>();
      const duplicateDocIdsToDelete: string[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        const projectItem: Project = { ...data, id: docSnap.id };
        const titleKey = (projectItem.title || '').trim().toLowerCase();

        if (!titleKey) return;

        if (!deduplicatedMap.has(titleKey)) {
          deduplicatedMap.set(titleKey, projectItem);
        } else {
          // Keep the non-deleted version or primary version and delete redundant doc from Firestore
          const existing = deduplicatedMap.get(titleKey)!;
          let keep = existing;
          let remove = projectItem;

          if (existing.isDeleted && !projectItem.isDeleted) {
            keep = projectItem;
            remove = existing;
          }

          deduplicatedMap.set(titleKey, keep);
          if (remove.id) {
            duplicateDocIdsToDelete.push(remove.id);
          }
        }
      });

      // Asynchronously delete duplicate documents from Firestore
      if (duplicateDocIdsToDelete.length > 0) {
        duplicateDocIdsToDelete.forEach(async (dupId) => {
          try {
            await deleteDoc(doc(db, 'projects', dupId));
          } catch (e) {
            console.warn("Failed to delete duplicate project doc:", dupId, e);
          }
        });
      }

      const projectsList = Array.from(deduplicatedMap.values());

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
            parsed.forEach((p: Project) => {
              if (p && p.title) {
                const key = p.title.trim().toLowerCase();
                if (!cachedMap.has(key)) cachedMap.set(key, p);
              }
            });
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
    <div className="admin-container min-h-screen pt-36 sm:pt-40 md:pt-44 pb-10 md:pb-20 px-3 sm:px-4 md:px-6 max-w-[1600px] mx-auto w-full relative">
      <style>{`
        @media (max-width: 767px) {
          /* Complete Mobile View Scaling for Admin Panel */
          .admin-container {
            font-size: 0.725rem !important; /* ~11.5px base font on mobile */
          }

          /* Headings */
          .admin-container h1 {
            font-size: 1.35rem !important; /* ~21px vs 36px desktop */
            line-height: 1.25 !important;
          }
          .admin-container h2 {
            font-size: 1.15rem !important; /* ~18px */
            line-height: 1.25 !important;
          }
          .admin-container h3 {
            font-size: 0.95rem !important;
            line-height: 1.25 !important;
          }
          .admin-container h4 {
            font-size: 0.85rem !important;
          }
          .admin-container h5 {
            font-size: 0.8rem !important;
          }

          /* Padding & Spacing */
          .admin-container .p-8 {
            padding: 0.75rem !important;
          }
          .admin-container .p-6 {
            padding: 0.625rem !important;
          }
          .admin-container .p-5 {
            padding: 0.5rem !important;
          }
          .admin-container .p-4 {
            padding: 0.4rem !important;
          }
          .admin-container .px-8 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .admin-container .py-5 {
            padding-top: 0.4rem !important;
            padding-bottom: 0.4rem !important;
          }
          .admin-container .gap-6,
          .admin-container .gap-8 {
            gap: 0.5rem !important;
          }
          .admin-container .gap-4,
          .admin-container .gap-3 {
            gap: 0.35rem !important;
          }
          .admin-container .mb-12 {
            margin-bottom: 1rem !important;
          }
          .admin-container .mb-8,
          .admin-container .mb-6 {
            margin-bottom: 0.625rem !important;
          }

          /* Action Buttons & Navigation Tabs */
          .admin-container button {
            font-size: 0.675rem !important; /* ~10.8px */
            padding-top: 0.35rem !important;
            padding-bottom: 0.35rem !important;
            padding-left: 0.55rem !important;
            padding-right: 0.55rem !important;
            border-radius: 0.45rem !important;
          }
          .admin-container button svg {
            width: 12px !important;
            height: 12px !important;
          }

          /* Input Fields, Textareas, Selects */
          .admin-container input,
          .admin-container select,
          .admin-container textarea {
            font-size: 0.7rem !important;
            padding-top: 0.35rem !important;
            padding-bottom: 0.35rem !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            border-radius: 0.45rem !important;
          }

          /* Media & Images on mobile */
          .admin-container img,
          .admin-container video,
          .admin-container iframe {
            max-height: 150px !important;
            object-fit: cover !important;
          }

          /* Badges & Text Sizes */
          .admin-container .text-xs,
          .admin-container .text-sm,
          .admin-container .text-base {
            font-size: 0.675rem !important;
          }
          .admin-container .text-\\[10px\\],
          .admin-container .text-\\[11px\\],
          .admin-container .text-\\[9px\\] {
            font-size: 0.6rem !important;
          }

          /* Modals & Dialogs */
          .admin-container .fixed.inset-0 > div,
          body .fixed.inset-0 > div {
            padding: 0.75rem !important;
            max-width: 92vw !important;
            border-radius: 1rem !important;
          }
        }
      `}</style>
      
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
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto whitespace-nowrap flex-nowrap max-w-full pb-1 md:pb-0 scrollbar-none">
          <button 
            onClick={() => setActiveTab('storage')}
            className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
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
              setOldPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
              setPassError('');
              setPassSuccess('');
              setCredentialsActiveTab('avatar');
              setIsAdminCredentialsOpen(true);
            }}
            className="shrink-0 p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-neon-purple/10 via-blue-500/10 to-cyan-500/10 hover:from-neon-purple/20 hover:to-cyan-500/20 border border-neon-purple/30 text-gray-900 dark:text-white hover:border-cyan-400 transition-all flex items-center gap-2 font-bold text-xs md:text-sm shadow-sm"
          >
            <Shield size={16} className="text-cyan-400" />
            <span>Admin Credentials</span>
          </button>
          <button 
            onClick={logout}
            className="shrink-0 p-2.5 md:p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all group flex items-center gap-2 font-bold text-xs md:text-sm shadow-sm"
            title="Logout"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Single line horizontal scroll on mobile */}
      <div className="flex items-center gap-2 md:gap-3 mb-8 bg-gray-100/50 dark:bg-[#0A0C11]/30 p-2 rounded-2xl border border-gray-200 dark:border-white/5 max-w-full overflow-x-auto whitespace-nowrap flex-nowrap scrollbar-none opacity-0 animate-fade-up">
        {/* 1. PROJECTS (Blue Theme) */}
        <button
          onClick={() => setActiveTab('projects')}
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
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
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
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
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
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
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'recycle'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-red-400 hover:bg-red-500/10'
          }`}
        >
          <Trash2 size={14} />
          Recycle Bin ({deletedProjects.length + deletedContactMessages.length + deletedServiceMessages.length})
        </button>

        {/* 5. CONTACT DETAILS & SETTINGS (Amber / Gold Theme) */}
        <button
          onClick={() => setActiveTab('site-settings')}
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'site-settings'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10'
          }`}
        >
          <Settings size={14} />
          Contact Details
        </button>

        {/* 6. OUR WEBSITES MANAGER (Cyan / Teal Theme) */}
        <button
          onClick={() => setActiveTab('our-websites')}
          className={`shrink-0 px-3.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'our-websites'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          <Globe size={14} />
          Our Websites ({websites.length})
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
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-gray-100 dark:bg-[#0F1320] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/5">
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
                    className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 md:px-8 py-4 md:py-5 items-start md:items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] group transition-colors duration-200 opacity-0 animate-fade-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Name & Email */}
                    <div className="w-full md:col-span-3">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">{msg.name}</h4>
                      <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:underline">{msg.email}</a>
                    </div>

                    {/* Service Required */}
                    <div className="w-full md:col-span-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                        {msg.service || 'Web Development'}
                      </span>
                    </div>

                    {/* Budget */}
                    <div className="w-full md:col-span-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{msg.budget || 'Not specified'}</span>
                    </div>

                    {/* Submitted At */}
                    <div className="w-full md:col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{msg.createdAt ? formatDate(msg.createdAt) : '-'}</span>
                    </div>

                    {/* Actions */}
                    <div className="w-full md:col-span-2 flex items-center justify-start md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5">
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
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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

              <button
                onClick={() => setRecycleSubTab('websites')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  recycleSubTab === 'websites'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Globe size={14} />
                <span>Our Websites ({deletedWebsites.length})</span>
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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

            {/* SUB-TAB 4: OUR WEBSITES */}
            {recycleSubTab === 'websites' && (
              deletedWebsites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deletedWebsites.map(web => (
                    <div key={web.id} className="bg-gray-50 dark:bg-[#05070A]/30 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between group animate-fade-up">
                      <div>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-white/5">
                          <div className="min-w-0 pr-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{web.name}</h4>
                            <p className="text-xs text-cyan-500 font-mono truncate">{web.url}</p>
                          </div>
                          <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase shrink-0">Soft Deleted</span>
                        </div>
                        {web.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 bg-white dark:bg-[#0F1320] p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 mb-3">
                            {web.description}
                          </p>
                        )}
                        {web.deletedAt && (
                          <p className="text-[10px] text-red-400 flex items-center gap-1">
                            <Clock size={10} /> Deleted on {formatDate(web.deletedAt)}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center gap-3">
                        <button
                          onClick={() => handleRestoreWebsiteClick(web)}
                          className="flex-1 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          Restore
                        </button>
                        <button
                          onClick={() => setWebsiteToPermanentDelete(web)}
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
                  <p className="text-sm font-light">No deleted websites in Recycle Bin.</p>
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

      {/* --- 5. GLOBAL CONTACT DETAILS & SITE SETTINGS TAB --- */}
      {activeTab === 'site-settings' && (
        <div className="space-y-8 animate-fade-up">
          {/* Header Banner */}
          <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                  <Settings size={28} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Global Contact Details Management
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Live Sync</span>
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                    Edit company contact details here. When updated, changes automatically sync across all pages (Footer, Contact page, Navbar, Home hero, Policy pages) on every device in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Globe size={14} className="animate-spin-slow" />
                <span>Syncs via Google Firestore</span>
              </div>
            </div>
          </div>

          {/* Success Status Banner */}
          {contactSaveStatus === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-fade-in text-sm font-semibold">
              <Check className="w-5 h-5 p-1 bg-emerald-500 text-white rounded-full shrink-0" />
              <span>Contact details updated successfully! Changes are now live across all pages and devices.</span>
            </div>
          )}

          {contactSaveStatus === 'error' && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 animate-fade-in text-sm font-semibold">
              <X className="w-5 h-5 p-1 bg-red-500 text-white rounded-full shrink-0" />
              <span>Failed to save contact settings. Please check your network connection and try again.</span>
            </div>
          )}

          {/* --- ADMIN LOGIN AVATAR MANAGEMENT SECTION --- */}
          <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple/20 via-fuchsia-500/20 to-cyan-500/20 border border-neon-purple/30 flex items-center justify-center text-neon-purple shrink-0 shadow-lg shadow-neon-purple/10">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Admin Login Profile Image
                    <span className="text-[10px] bg-neon-purple/10 text-neon-purple dark:text-cyan-400 border border-neon-purple/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Live Preview</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Upload an image or enter a URL link to customize the circular profile avatar on the Admin Login screen (/login).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Avatar Source Inputs */}
              <div className="lg:col-span-7 space-y-5">
                {/* Mode Selector Tabs */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Select Avatar Input Method
                  </label>
                  <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#151A25] rounded-xl border border-gray-200 dark:border-white/10 w-fit">
                    <button
                      type="button"
                      onClick={() => setAdminAvatarUploadMode('upload')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        adminAvatarUploadMode === 'upload'
                          ? 'bg-gradient-to-r from-neon-purple to-cyan-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Upload size={14} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminAvatarUploadMode('url')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        adminAvatarUploadMode === 'url'
                          ? 'bg-gradient-to-r from-neon-purple to-cyan-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Globe size={14} />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {/* Upload Mode UI */}
                {adminAvatarUploadMode === 'upload' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                      <span>Upload Avatar Image File</span>
                      <span className="text-[10px] text-gray-400 font-normal">Max 2MB (PNG, JPG, WEBP)</span>
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-neon-purple dark:hover:border-cyan-400 rounded-2xl p-6 text-center transition-all bg-gray-50/50 dark:bg-[#0F1320]/50 group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAdminAvatarFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Click to browse or drag & drop avatar image here
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Supports PNG, JPEG, SVG or WEBP
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* URL Mode UI */
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                      Image Direct Link (URL)
                    </label>
                    <input
                      type="url"
                      value={contactFormAdminAvatar}
                      onChange={(e) => setContactFormAdminAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-sm font-medium transition-colors"
                    />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      Paste any direct image URL link from Unsplash, Imgur, or CDN.
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactFormAdminAvatar(defaultAdminAvatar)}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Reset to Default Avatar</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Side-by-Side Live Round Preview Panel */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-900/90 dark:bg-[#07090F] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                {/* Ambience Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-neon-purple/30 via-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center w-full">
                  <div className="flex items-center gap-2 mb-4 text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                    <Eye size={12} />
                    <span>Live Admin Login Preview</span>
                  </div>

                  {/* Round Profile Avatar with Glowing Ring */}
                  <div className="relative mb-4 group">
                    {/* Outer Glow Ring in Website Neon Purple / Cyan Theme */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-purple via-fuchsia-500 to-cyan-400 opacity-80 blur-md group-hover:opacity-100 transition duration-500 animate-pulse"></div>

                    {/* Profile Ring Container */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-r from-neon-purple via-violet-500 to-cyan-400 shadow-[0_0_25px_rgba(176,38,255,0.4)]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0F1320] flex items-center justify-center border-2 border-white/20">
                        <img
                          src={contactFormAdminAvatar || defaultAdminAvatar}
                          alt="Admin Profile Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAdminAvatar;
                          }}
                        />
                      </div>
                    </div>

                    {/* Badge Icon */}
                    <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-gradient-to-r from-neon-purple to-cyan-400 p-0.5 shadow-lg flex items-center justify-center border border-white/40">
                      <div className="w-full h-full bg-[#0A0D16] rounded-full flex items-center justify-center text-cyan-300">
                        <LayoutGrid size={12} className="text-cyan-400" />
                      </div>
                    </div>
                  </div>

                  {/* Login Card Mock details */}
                  <h4 className="text-sm font-extrabold bg-gradient-to-r from-white via-gray-200 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
                    Admin Login
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 max-w-[220px] leading-tight">
                    Enter the admin ID & Password to access the dashboard.
                  </p>

                  <div className="mt-3 w-full max-w-[220px] bg-white/5 border border-white/10 rounded-xl p-2 text-left space-y-1.5 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded border border-white/5">
                      <User size={10} className="text-cyan-400" />
                      <span>Admin ID: admin</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded border border-white/5">
                      <Lock size={10} className="text-neon-purple" />
                      <span>Password: ••••••••</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form & Live Preview Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <form onSubmit={handleSaveContactDetails} className="space-y-6">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-neon-purple" />
                    Company Email Address
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={contactFormEmail} 
                    onChange={(e) => setContactFormEmail(e.target.value)} 
                    placeholder="brandiquewebsolutions@gmail.com" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Updates email links in Footer, Contact page, and Legal policy pages.</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone size={14} className="text-blue-500" />
                    Primary Phone / Mobile Number
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={contactFormPhone} 
                    onChange={(e) => setContactFormPhone(e.target.value)} 
                    placeholder="+91 70933 20572" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Updates call buttons and phone cards on all devices.</p>
                </div>

                {/* HQ Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" />
                    HQ / Office Location
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={contactFormLocation} 
                    onChange={(e) => setContactFormLocation(e.target.value)} 
                    placeholder="Visakhapatnam, India" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Updates location cards and Google Maps navigation targets.</p>
                </div>

                {/* Instagram URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Instagram size={14} className="text-pink-500" />
                    Instagram Profile Link
                  </label>
                  <input 
                    type="url" 
                    required 
                    value={contactFormInstagram} 
                    onChange={(e) => setContactFormInstagram(e.target.value)} 
                    placeholder="https://www.instagram.com/brandiquewebsolutions/" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Updates social icons in Header, Footer, and mobile navigation drawer.</p>
                </div>

                {/* WhatsApp Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MessageSquare size={14} className="text-green-500" />
                    WhatsApp Direct Link
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={contactFormWhatsapp} 
                    onChange={(e) => setContactFormWhatsapp(e.target.value)} 
                    placeholder="https://wa.me/917093320572" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Updates instant WhatsApp action links and floating buttons.</p>
                </div>

                {/* Working Hours */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-amber-500" />
                    Business Working Hours
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={contactFormHours} 
                    onChange={(e) => setContactFormHours(e.target.value)} 
                    placeholder="Mon - Sat: 9:00 AM - 8:00 PM IST" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Displayed in contact info badges and inquiry dialogs.</p>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-end">
                  <button 
                    type="submit" 
                    disabled={isSavingContactSettings}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingContactSettings ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Publishing Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Update Contact Details</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Live Preview Side Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Eye size={16} className="text-amber-500" />
                    Live Website Preview
                  </h3>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">Real-time</span>
                </div>

                {/* Card 1: Email Box */}
                <div className="bg-gray-50 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Us</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{contactFormEmail || 'brandiquewebsolutions@gmail.com'}</p>
                  </div>
                </div>

                {/* Card 2: Phone Box */}
                <div className="bg-gray-50 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Call Us</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{contactFormPhone || '+91 70933 20572'}</p>
                  </div>
                </div>

                {/* Card 3: Location Box */}
                <div className="bg-gray-50 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Visit HQ</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{contactFormLocation || 'Visakhapatnam, India'}</p>
                  </div>
                </div>

                {/* Card 4: Working Hours */}
                <div className="bg-gray-50 dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Working Hours</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{contactFormHours || 'Mon - Sat: 9:00 AM - 8:00 PM IST'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Sparkles size={14} className="shrink-0" />
                  <span>Clicking "Update Contact Details" saves changes instantly to Google Cloud Firestore.</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- OUR WEBSITES MANAGER SECTION --- */}
      {activeTab === 'our-websites' && (
        <div className="space-y-8 opacity-0 animate-fade-up">
          {/* Header Banner */}
          <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  <Globe size={22} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Our Websites Manager</h2>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove website links shown under "Our Websites" submenu in the header on all devices.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-emerald-500 text-xs font-bold shrink-0">
              <Sparkles size={14} />
              <span>Real-Time Sync Active Across All Devices</span>
            </div>
          </div>

          {websiteActionMsg && (
            <div className={`p-4 rounded-2xl border text-xs md:text-sm font-bold flex items-center gap-2 ${
              websiteActionMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {websiteActionMsg.type === 'success' ? <Check size={16} /> : <X size={16} />}
              <span>{websiteActionMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add New Website Form Column */}
            <div className="lg:col-span-5 glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-white/5">
                <Plus size={18} className="text-cyan-500" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white uppercase tracking-wider">Add New Website</h3>
              </div>

              <form onSubmit={handleAddWebsiteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Website Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newWebName} 
                    onChange={(e) => setNewWebName(e.target.value)} 
                    placeholder="e.g. Creator Prompts" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Target URL / Link <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newWebUrl} 
                    onChange={(e) => setNewWebUrl(e.target.value)} 
                    placeholder="e.g. https://creator.brandique.in/" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">When clicked in header submenu, this URL will open in a new browser tab.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Short Description (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={newWebDesc} 
                    onChange={(e) => setNewWebDesc(e.target.value)} 
                    placeholder="e.g. AI Prompt Library for Digital Creators" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium transition-colors"
                  />
                </div>

                {/* Logo Upload & URL Options */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Website Logo (Optional)
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setNewLogoMode('upload')}
                        className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                          newLogoMode === 'upload' 
                            ? 'bg-cyan-500 text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Upload size={12} /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewLogoMode('url')}
                        className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                          newLogoMode === 'url' 
                            ? 'bg-cyan-500 text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Link2 size={12} /> Image URL
                      </button>
                    </div>
                  </div>

                  {newLogoMode === 'upload' ? (
                    <div className="space-y-2">
                      {newWebLogoUrl ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center p-1 shrink-0">
                            <img src={newWebLogoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Logo Uploaded</p>
                            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><Check size={10} /> Ready to save</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewWebLogoUrl('')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Remove logo"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-[#151A25] hover:border-cyan-500/50 cursor-pointer transition-colors group">
                          <Upload size={20} className="text-gray-400 group-hover:text-cyan-500 mb-1 transition-colors" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Click or drag image file here</span>
                          <span className="text-[10px] text-gray-400">PNG, JPG, SVG, WebP (Max 2MB)</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleLogoFileUpload(e, setNewWebLogoUrl)}
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="url" 
                        value={newWebLogoUrl} 
                        onChange={(e) => setNewWebLogoUrl(e.target.value)} 
                        placeholder="e.g. https://example.com/logo.png" 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium transition-colors"
                      />
                    </div>
                  )}
                </div>

                {/* Live Submenu Card Preview Panel */}
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C101A] to-slate-900 border border-violet-500/30 text-white space-y-2 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                        <Sparkles size={13} className="animate-pulse text-violet-400" />
                        <span>Live Submenu Card Preview</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                        Header Preview
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-100/10 dark:border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {newWebLogoUrl ? (
                          <div className="w-8 h-8 rounded-lg bg-white border border-violet-500/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                            <img src={newWebLogoUrl} alt="Logo" className="w-full h-full object-contain rounded" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shrink-0 shadow-sm">
                            <Globe size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-white block truncate">
                            {newWebName.trim() || 'Website Name'}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate font-medium mt-0.5">
                            {newWebDesc.trim() || 'Short description will appear here...'}
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-gray-400 shrink-0 ml-2" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isAddingWebsite || !newWebName.trim() || !newWebUrl.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingWebsite ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Adding Website...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add to Our Websites Submenu</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Existing Websites List Column */}
            <div className="lg:col-span-7 glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-cyan-500" />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white uppercase tracking-wider">
                    Existing Submenu Links ({activeWebsites.length})
                  </h3>
                </div>
                {loadingWebsites && (
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin text-cyan-500" /> Loading...
                  </span>
                )}
              </div>

              {activeWebsites.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                  <Globe size={36} className="mx-auto text-gray-400 mb-2 opacity-50" />
                  <p className="text-sm font-bold text-gray-500">No active websites added yet.</p>
                  <p className="text-xs text-gray-400">Use the form on the left to add your first company website link.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                  {activeWebsites.map((web) => (
                    <div 
                      key={web.id} 
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0 flex-1 flex items-start gap-3">
                        {web.logoUrl ? (
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-1 overflow-hidden flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <img src={web.logoUrl} alt={web.name} className="w-full h-full object-contain rounded-lg" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Globe size={18} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                              {web.name}
                            </span>
                            <a 
                              href={web.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-cyan-500 hover:text-cyan-400 p-1 hover:bg-cyan-500/10 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                              title="Test open link"
                            >
                              <ExternalLink size={12} />
                              <span className="hidden sm:inline">Test Link</span>
                            </a>
                          </div>
                          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono truncate">{web.url}</p>
                          {web.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{web.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button 
                          onClick={() => handleOpenEditWebsite(web)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => setWebsiteToDelete(web)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT WEBSITE MODAL --- */}
      {editingWebsite && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 md:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setEditingWebsite(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Globe size={20} className="text-cyan-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Website Link & Logo</h3>
            </div>

            <form onSubmit={handleUpdateWebsiteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Website Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={editWebName} 
                  onChange={(e) => setEditWebName(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Target URL / Link <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={editWebUrl} 
                  onChange={(e) => setEditWebUrl(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <input 
                  type="text" 
                  value={editWebDesc} 
                  onChange={(e) => setEditWebDesc(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              {/* Logo Controls in Edit Modal */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Website Logo (Optional)
                  </label>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setEditLogoMode('upload')}
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                        editLogoMode === 'upload' 
                          ? 'bg-cyan-500 text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Upload size={12} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditLogoMode('url')}
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                        editLogoMode === 'url' 
                          ? 'bg-cyan-500 text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Link2 size={12} /> Image URL
                    </button>
                  </div>
                </div>

                {editLogoMode === 'upload' ? (
                  <div className="space-y-2">
                    {editWebLogoUrl ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10">
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center p-1 shrink-0">
                          <img src={editWebLogoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Logo Ready</p>
                          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><Check size={10} /> Custom logo attached</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditWebLogoUrl('')}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Remove logo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-[#151A25] hover:border-cyan-500/50 cursor-pointer transition-colors group">
                        <Upload size={20} className="text-gray-400 group-hover:text-cyan-500 mb-1 transition-colors" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Click or drag image file here</span>
                        <span className="text-[10px] text-gray-400">PNG, JPG, SVG, WebP (Max 2MB)</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoFileUpload(e, setEditWebLogoUrl)}
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    <input 
                      type="url" 
                      value={editWebLogoUrl} 
                      onChange={(e) => setEditWebLogoUrl(e.target.value)} 
                      placeholder="e.g. https://example.com/logo.png" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 text-sm font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Live Submenu Preview Panel in Edit Modal */}
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C101A] to-slate-900 border border-violet-500/30 text-white space-y-2 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                      <Sparkles size={13} className="animate-pulse text-violet-400" />
                      <span>Live Submenu Card Preview</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                      Header Preview
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-gray-100/10 dark:border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      {editWebLogoUrl ? (
                        <div className="w-8 h-8 rounded-lg bg-white border border-violet-500/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                          <img src={editWebLogoUrl} alt="Logo" className="w-full h-full object-contain rounded" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shrink-0 shadow-sm">
                          <Globe size={16} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white block truncate">
                          {editWebName.trim() || 'Website Name'}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate font-medium mt-0.5">
                          {editWebDesc.trim() || 'Short description will appear here...'}
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-gray-400 shrink-0 ml-2" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingWebsite(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdatingWebsite || !editWebName.trim() || !editWebUrl.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdatingWebsite ? "Updating..." : "Save Link Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


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

      {/* --- WEBSITE SOFT DELETE CONFIRMATION MODAL --- */}
      {websiteToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Move to Recycle Bin?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong className="text-gray-800 dark:text-gray-200">"{websiteToDelete.name}"</strong> ({websiteToDelete.url})? It will be removed from the header menu on all devices and moved to the Recycle Bin.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setWebsiteToDelete(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSoftDeleteWebsite}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Confirm Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- WEBSITE PERMANENT DELETE CONFIRMATION MODAL --- */}
      {websiteToPermanentDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Confirm Permanent Deletion?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Warning: Are you sure you want to permanently delete <strong className="text-gray-800 dark:text-gray-200">"{websiteToPermanentDelete.name}"</strong>? This action is irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setWebsiteToPermanentDelete(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPermanentDeleteWebsite}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONSOLIDATED ADMIN CREDENTIALS & AVATAR MODAL --- */}
      {isAdminCredentialsOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 dark:bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0A0D16] w-full max-w-4xl rounded-[28px] border border-gray-200 dark:border-cyan-500/30 shadow-2xl p-6 md:p-8 relative animate-scale-in max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header & Close */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-neon-purple/20">
                  <div className="w-full h-full bg-[#0A0D16] rounded-[14px] flex items-center justify-center text-cyan-400">
                    <Shield size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    Admin Credentials & Security
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Manage your Admin Login Avatar, Admin ID, and Account Password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminCredentialsOpen(false)}
                className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-[#151A25] rounded-2xl border border-gray-200 dark:border-white/10 my-4 shrink-0 overflow-x-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => setCredentialsActiveTab('avatar')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                  credentialsActiveTab === 'avatar'
                    ? 'bg-gradient-to-r from-neon-purple to-cyan-500 text-white shadow-lg shadow-neon-purple/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User size={15} />
                <span>Login Avatar Image</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialsActiveTab('id')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                  credentialsActiveTab === 'id'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Shield size={15} />
                <span>Change Admin ID</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialsActiveTab('password')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                  credentialsActiveTab === 'password'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Key size={15} />
                <span>Change Password</span>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-6 pt-2">
              
              {/* TAB 1: LOGIN AVATAR IMAGE */}
              {credentialsActiveTab === 'avatar' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {avatarSaveStatus === 'success' && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Check size={16} className="p-0.5 bg-emerald-500 text-white rounded-full shrink-0" />
                      <span>Admin Login Profile Image updated successfully! Synced on all devices.</span>
                    </div>
                  )}

                  {avatarSaveStatus === 'error' && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                      <X size={16} className="p-0.5 bg-red-500 text-white rounded-full shrink-0" />
                      <span>Failed to update avatar. Please check your network connection.</span>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    {/* Left Column: Input options */}
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                          Select Image Method
                        </label>
                        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#151A25] rounded-xl border border-gray-200 dark:border-white/10 w-fit">
                          <button
                            type="button"
                            onClick={() => setAdminAvatarUploadMode('upload')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                              adminAvatarUploadMode === 'upload'
                                ? 'bg-gradient-to-r from-neon-purple to-cyan-500 text-white'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Upload size={13} />
                            <span>Upload File</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminAvatarUploadMode('url')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                              adminAvatarUploadMode === 'url'
                                ? 'bg-gradient-to-r from-neon-purple to-cyan-500 text-white'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Globe size={13} />
                            <span>Image URL</span>
                          </button>
                        </div>
                      </div>

                      {adminAvatarUploadMode === 'upload' ? (
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                            <span>Upload Avatar File</span>
                            <span className="text-[10px] text-gray-400 font-normal">Max 2MB (PNG, JPG, WEBP)</span>
                          </label>
                          <div className="relative border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-neon-purple rounded-2xl p-5 text-center bg-gray-50/50 dark:bg-[#0F1320]/50 transition-all group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAdminAvatarFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                                <Upload size={18} />
                              </div>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Click or drag & drop avatar image here
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Supports PNG, JPEG, SVG or WEBP
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                            Image Direct Link (URL)
                          </label>
                          <input
                            type="url"
                            value={contactFormAdminAvatar}
                            onChange={(e) => setContactFormAdminAvatar(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-xs font-medium transition-colors"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">
                            Paste direct CDN or image link.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setContactFormAdminAvatar(defaultAdminAvatar)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw size={12} />
                          <span>Reset Default Avatar</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAvatarSubmit}
                          disabled={isSavingAvatar}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-cyan-500 hover:from-neon-purple/90 hover:to-cyan-500/90 text-white font-bold text-xs shadow-lg shadow-neon-purple/20 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isSavingAvatar ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                          <span>Update Avatar Image</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Live Round Preview Panel */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-900/90 dark:bg-[#07090F] border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-tr from-neon-purple/30 via-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                      <div className="relative z-10 flex flex-col items-center text-center w-full">
                        <div className="flex items-center gap-1.5 mb-3 text-[9px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                          <Eye size={11} />
                          <span>Live Login Screen Preview</span>
                        </div>

                        {/* Round Profile Avatar with Glowing Ring */}
                        <div className="relative mb-3 group">
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-purple via-fuchsia-500 to-cyan-400 opacity-80 blur-md animate-pulse"></div>
                          <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-r from-neon-purple via-violet-500 to-cyan-400 shadow-[0_0_25px_rgba(176,38,255,0.4)]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-[#0F1320] flex items-center justify-center border-2 border-white/20">
                              <img
                                src={contactFormAdminAvatar || defaultAdminAvatar}
                                alt="Admin Profile Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultAdminAvatar;
                                }}
                              />
                            </div>
                          </div>

                          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple to-cyan-400 p-0.5 shadow-lg flex items-center justify-center border border-white/40">
                            <div className="w-full h-full bg-[#0A0D16] rounded-full flex items-center justify-center text-cyan-300">
                              <LayoutGrid size={10} className="text-cyan-400" />
                            </div>
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold bg-gradient-to-r from-white via-gray-200 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
                          Admin Login
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 max-w-[200px] leading-tight">
                          Enter the admin ID & Password to access the dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHANGE ADMIN ID */}
              {credentialsActiveTab === 'id' && (
                <form onSubmit={handleChangeAdminIdSubmit} className="space-y-4 max-w-lg mx-auto animate-fade-in">
                  
                  {adminIdSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Check size={16} className="p-0.5 bg-emerald-500 text-white rounded-full shrink-0" />
                      <span>{adminIdSuccess}</span>
                    </div>
                  )}

                  {adminIdError && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                      <X size={16} className="p-0.5 bg-red-500 text-white rounded-full shrink-0" />
                      <span>{adminIdError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Current Password (Required for Security)
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminIdPass ? "text" : "password"}
                        required
                        value={adminIdCurrentPass}
                        onChange={(e) => setAdminIdCurrentPass(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminIdPass(!showAdminIdPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showAdminIdPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      New Admin ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminIdInput}
                      onChange={(e) => setNewAdminIdInput(e.target.value)}
                      placeholder="e.g. mohan or admin@brandique.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs font-medium"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Current ID: <span className="text-cyan-400 font-mono">{adminId}</span></p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} />
                      <span>Save New Admin ID</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: CHANGE PASSWORD */}
              {credentialsActiveTab === 'password' && (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-lg mx-auto animate-fade-in">
                  
                  {passSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Check size={16} className="p-0.5 bg-emerald-500 text-white rounded-full shrink-0" />
                      <span>{passSuccess}</span>
                    </div>
                  )}

                  {passError && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                      <X size={16} className="p-0.5 bg-red-500 text-white rounded-full shrink-0" />
                      <span>{passError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-xs font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-xs font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple text-xs font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
