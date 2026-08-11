import React, { useState, useEffect } from 'react';
import { Trash2, Settings, Search, X, Check, BarChart3, LogOut, MessageSquare, Mail, DollarSign, RefreshCw, Clock, Key, Phone, Edit3, Eye, EyeOff, Plus, Database, HardDrive, RotateCcw, FolderPlus, Video, Link2, Tag, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Message, Project } from '../types';
import { INITIAL_PROJECTS } from './ProjectsData';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

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

const Admin: React.FC = () => {
  const { logout, changePassword } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'leads' | 'projects' | 'recycle' | 'storage'>('leads');

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
  const [newLink, setNewLink] = useState('');
  const [newType, setNewType] = useState<'main' | 'portfolio' | 'figma' | 'client'>('main');
  const [isAddingProject, setIsAddingProject] = useState(false);

  // States for Edit Project
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editType, setEditType] = useState<'main' | 'portfolio' | 'figma' | 'client'>('main');
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);

  // State for soft delete and permanent delete confirmation
  const [deletingProjectDoc, setDeletingProjectDoc] = useState<Project | null>(null);
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

  // States for custom delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const messagesList: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() } as Message);
      });
      // Sort messages by createdAt descending
      messagesList.sort((a, b) => {
        const valA = a.createdAt || a.id;
        const valB = b.createdAt || b.id;
        return valB.localeCompare(valA);
      });
      setMessages(messagesList);
      setIsUsingFallback(false);
    } catch (error) {
      setIsUsingFallback(true);
      setMessages([]);
      handleFirestoreError(error, OperationType.GET, 'messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    const cached = localStorage.getItem('brandique_projects');
    let cachedList: Project[] = [];
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedList = parsed;
        }
      } catch (e) {
        // Fallback
      }
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList: Project[] = [];
      querySnapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as Project);
      });

      if (projectsList.length === 0) {
        if (cachedList.length > 0) {
          setProjects(cachedList);
        } else {
          // If Firestore and localStorage are both empty, seed initial projects
          const seededList: Project[] = [];
          try {
            for (const p of INITIAL_PROJECTS) {
              const { id, ...dataWithoutId } = p;
              const docRef = await addDoc(collection(db, 'projects'), dataWithoutId);
              seededList.push({ id: docRef.id, ...dataWithoutId });
            }
          } catch (seedErr) {
            console.warn("Seeding to Firestore skipped or failed:", seedErr);
          }
          const finalList = seededList.length > 0 ? seededList : INITIAL_PROJECTS;
          setProjects(finalList);
          localStorage.setItem('brandique_projects', JSON.stringify(finalList));
        }
      } else {
        // Merge Firestore items with cached deleted status
        const cachedMap = new Map<string, Project>();
        cachedList.forEach(p => {
          if (p.id) cachedMap.set(p.id, p);
          if (p.title) cachedMap.set(p.title, p);
        });

        const mergedList: Project[] = projectsList.map(p => {
          const cachedItem = cachedMap.get(p.id) || cachedMap.get(p.title);
          if (cachedItem) {
            return {
              ...p,
              isDeleted: p.isDeleted ?? cachedItem.isDeleted ?? false,
              deletedAt: p.deletedAt || cachedItem.deletedAt
            };
          }
          return p;
        });

        // Preserve any soft-deleted projects in cached list
        cachedList.forEach(c => {
          if (c.isDeleted && !mergedList.some(m => m.id === c.id || m.title === c.title)) {
            mergedList.push(c);
          }
        });

        mergedList.sort((a, b) => {
          const valA = a.createdAt || a.id || '';
          const valB = b.createdAt || b.id || '';
          return valB.localeCompare(valA);
        });

        setProjects(mergedList);
        localStorage.setItem('brandique_projects', JSON.stringify(mergedList));
      }
    } catch (error) {
      let fallbackList = cachedList.length > 0 ? cachedList : INITIAL_PROJECTS;
      fallbackList.sort((a, b) => {
        const valA = a.createdAt || a.id || '';
        const valB = b.createdAt || b.id || '';
        return valB.localeCompare(valA);
      });
      setProjects(fallbackList);
      handleFirestoreError(error, OperationType.GET, 'projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      localStorage.setItem('brandique_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProject(true);
    try {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      const newProjectData = {
        title: newTitle.trim(),
        category: newCategory.trim(),
        desc: newDesc.trim(),
        tags: tagsArray,
        image: newImage.trim(),
        video: newVideo.trim(),
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
      setNewLink('');
      setNewType('main');
    } catch (error) {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      const tempId = 'local-added-' + Date.now();
      const fallbackProject = {
        id: tempId,
        title: newTitle.trim(),
        category: newCategory.trim(),
        desc: newDesc.trim(),
        tags: tagsArray,
        image: newImage.trim(),
        video: newVideo.trim(),
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
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);
      const docRef = doc(db, 'projects', editingProject.id);
      const updatedData = {
        title: editTitle.trim(),
        category: editCategory.trim(),
        desc: editDesc.trim(),
        tags: tagsArray,
        image: editImage.trim(),
        video: editVideo.trim(),
        link: editLink.trim(),
        type: editType,
      };

      await updateDoc(docRef, updatedData);

      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updatedData } : p));
      setIsEditProjectOpen(false);
      setEditingProject(null);
    } catch (error) {
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);
      const updatedData = {
        title: editTitle.trim(),
        category: editCategory.trim(),
        desc: editDesc.trim(),
        tags: tagsArray,
        image: editImage.trim(),
        video: editVideo.trim(),
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

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
      handleFirestoreError(error, OperationType.DELETE, 'messages/' + id);
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

  const filteredMessages = messages.filter(msg => {
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
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-neon-purple hover:border-neon-purple/40 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <Key size={18} />
            Change Password
          </button>
          <button 
            onClick={logout}
            className="p-3 rounded-xl bg-white dark:bg-[#0F1320] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-all group flex items-center gap-2 font-bold text-sm"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Fallback Warning Banner */}
      {isUsingFallback && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs md:text-sm leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
          <div className="flex items-start md:items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">!</span>
            <p>
              <strong>🔒 Connection & Permissions Notice:</strong> Browser privacy partition rules inside this preview iframe restrict direct Firestore database syncing. No fake data or mock leads are ever created in your database, keeping your storage perfectly clean. To view your live database sync and authentic inquiries, simply click the <strong>Open in New Tab</strong> button.
            </p>
          </div>
          <button 
            onClick={() => window.open(window.location.origin + '/admin', '_blank')}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm self-start md:self-auto"
          >
            Open in New Tab
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-100/50 dark:bg-[#0A0C11]/30 p-2 rounded-2xl border border-gray-200 dark:border-white/5 max-w-fit opacity-0 animate-fade-up">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'leads'
              ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <MessageSquare size={14} />
          Inquiries ({filteredMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'projects'
              ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <FolderPlus size={14} />
          Projects ({projects.filter(p => !p.isDeleted).length})
        </button>
        <button
          onClick={() => setActiveTab('recycle')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'recycle'
              ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Trash2 size={14} />
          Recycle Bin ({projects.filter(p => p.isDeleted).length})
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'storage'
              ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
              : 'text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Database size={14} />
          Storage & Stats
        </button>
      </div>

      {/* CONDITIONAL SECTIONS */}
      {activeTab === 'leads' && (
        <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 opacity-0 animate-fade-up flex flex-col min-h-[500px] shadow-sm dark:shadow-none">
          {/* Messages Toolbar */}
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageSquare size={16} />
              <span className="font-medium">All Lead Inquiries</span>
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
                        onClick={() => setDeletingId(msg.id)} 
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
                      {activeProjectsInType.map(p => (
                        <div key={p.id} className="bg-gray-50 dark:bg-[#05070A]/30 border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-neon-purple/30 hover:shadow-[0_10px_30px_rgba(160,32,240,0.05)] transition-all duration-300">
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
                                onClick={() => {
                                  setEditingProject(p);
                                  setEditTitle(p.title);
                                  setEditCategory(p.category);
                                  setEditDesc(p.desc);
                                  setEditTags(p.tags?.join(', ') || '');
                                  setEditImage(p.image);
                                  setEditVideo(p.video || '');
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
                                onClick={() => handleSoftDeleteProject(p)}
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
        <div className="glass-morphism bg-white dark:bg-[#0A0C11]/50 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0A0C11]/50 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Trash2 className="text-red-500" size={16} />
              <span className="font-semibold text-gray-900 dark:text-white">Deleted Projects (Recycle Bin)</span>
              <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-xs font-bold font-mono">{projects.filter(p => p.isDeleted).length}</span>
            </div>
            <p className="text-xs text-gray-400">Restore deleted projects or delete them permanently from the database.</p>
          </div>

          <div className="flex-1 p-6">
            {projectsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="w-10 h-10 text-neon-purple animate-spin mb-3" />
                <p className="text-gray-400 text-xs">Loading deleted projects...</p>
              </div>
            ) : projects.filter(p => p.isDeleted).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => p.isDeleted).map(p => (
                  <div key={p.id} className="bg-gray-50 dark:bg-[#05070A]/30 border border-red-500/10 dark:border-red-500/5 rounded-2xl overflow-hidden flex flex-col justify-between group animate-fade-up">
                    <div>
                      {/* Image Preview with overlay */}
                      <div className="relative aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden border-b border-gray-200 dark:border-white/5 opacity-70">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale"
                        />
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase bg-black/60 text-white backdrop-blur-sm border border-white/10">
                          {formatBytes(getProjectStorageSize(p))}
                        </div>
                        <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center">
                          <span className="bg-red-500 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                            Soft Deleted
                          </span>
                        </div>
                      </div>

                      {/* Project details */}
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

                    {/* Footer with Restore & Permanent Delete */}
                    <div className="p-5 pt-0 mt-4 flex items-center gap-3">
                      <button
                        onClick={() => handleRestoreProject(p)}
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
                <p className="text-sm font-light">Your recycle bin is clean and empty.</p>
              </div>
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

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Lead Submission?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete this lead inquiry? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (deletingId) {
                    await handleDeleteMessage(deletingId);
                    setDeletingId(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-sm font-bold shadow-lg shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
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
                  setDeletingId(selectedMessage.id);
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

      {/* --- ADD PROJECT MODAL --- */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in max-h-[92vh] flex flex-col">
            <button 
              onClick={() => setIsAddProjectOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FolderPlus size={22} className="text-neon-purple" />
              Upload New Project
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Publish a new visual design, artifact, or portfolio development.</p>

            <form onSubmit={handleAddProject} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Title</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. BrandiQue Creative"
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle / Category</label>
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    placeholder="e.g. Branding & Development"
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

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image Thumbnail URL</label>
                  <input 
                    type="url" 
                    value={newImage} 
                    onChange={(e) => setNewImage(e.target.value)}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Showcase Video URL (Optional)</label>
                  <input 
                    type="url" 
                    value={newVideo} 
                    onChange={(e) => setNewVideo(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  placeholder="Write a clear, inspiring description of the project, its goals, and solutions..."
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                />
              </div>

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
          </div>
        </div>
      )}

      {/* --- EDIT PROJECT MODAL --- */}
      {isEditProjectOpen && editingProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-xl rounded-[24px] border border-gray-200 dark:border-white/10 shadow-2xl p-8 relative animate-scale-in max-h-[92vh] flex flex-col">
            <button 
              onClick={() => {
                setIsEditProjectOpen(false);
                setEditingProject(null);
              }}
              className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Edit3 size={22} className="text-neon-purple" />
              Edit Project Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Modify any parameters or sections for this project.</p>

            <form onSubmit={handleUpdateProject} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle / Category</label>
                  <input 
                    type="text" 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value)}
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

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image Thumbnail URL</label>
                  <input 
                    type="url" 
                    value={editImage} 
                    onChange={(e) => setEditImage(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Showcase Video URL (Optional)</label>
                  <input 
                    type="url" 
                    value={editVideo} 
                    onChange={(e) => setEditVideo(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  value={editDesc} 
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#05070A] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-all resize-none"
                />
              </div>

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
          </div>
        </div>
      )}

      {/* --- PROJECT DELETE CONFIRMATION MODAL --- */}
      {deletingProjectDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0F1320] w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {isPermanentDelete ? "Confirm Permanent Deletion?" : "Confirm to Delete?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {isPermanentDelete 
                ? "Warning: This action is irreversible. It will permanently delete this project and all its storage size from the database."
                : "Are you sure you want to delete this project? It will be moved to the Deleted Projects Recycle Bin and hidden from the website."}
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
                {isPermanentDelete ? "Delete Permanently" : "Move to Recycle Bin"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Admin;
