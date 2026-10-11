import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { notifyAdmin } from '../notifyAdmin';
import { db } from '../firebase';
import { Project, N8nProject, N8nProjectForm } from '../types';
import { INITIAL_PROJECTS } from '../pages/ProjectsData';
import { INITIAL_N8N_PROJECTS } from '../pages/N8nProjectsData';

export interface SiteSettings {
  email: string;
  phone: string;
  location: string;
  instagram: string;
  whatsapp: string;
  workingHours: string;
  adminAvatarUrl?: string;
}

export interface WebsiteItem {
  id: string;
  name: string;
  url: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  email: 'brandiquewebsolutions@gmail.com',
  phone: '+91 70933 20572',
  location: 'Visakhapatnam, India',
  instagram: 'https://www.instagram.com/brandiquewebsolutions/',
  whatsapp: 'https://wa.me/917093320572',
  workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  adminAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
};

export const DEFAULT_WEBSITES: WebsiteItem[] = [
  {
    id: 'creator-prompts-default',
    name: 'Creator Prompts',
    url: 'https://creator.brandique.in/',
    description: 'AI-driven prompt hub for digital creators & brands',
    createdAt: '2026-08-17T00:00:00.000Z'
  }
];

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  websites: WebsiteItem[];
  addWebsite: (name: string, url: string, description?: string, logoUrl?: string) => Promise<void>;
  updateWebsite: (id: string, name: string, url: string, description?: string, logoUrl?: string) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  restoreWebsite: (id: string) => Promise<void>;
  permanentlyDeleteWebsite: (id: string) => Promise<void>;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updatedFields: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  restoreProject: (id: string) => Promise<void>;
  permanentlyDeleteProject: (id: string) => Promise<void>;
  n8nProjects: N8nProject[];
  addN8nProject: (project: Omit<N8nProject, 'id'>) => Promise<void>;
  updateN8nProject: (id: string, updatedFields: Partial<N8nProject>) => Promise<void>;
  deleteN8nProject: (id: string) => Promise<void>;
  restoreN8nProject: (id: string) => Promise<void>;
  permanentlyDeleteN8nProject: (id: string) => Promise<void>;
  n8nForms: N8nProjectForm[];
  addN8nFormSubmission: (submission: Omit<N8nProjectForm, 'id' | 'createdAt'>) => Promise<void>;
  deleteN8nFormSubmission: (id: string) => Promise<void>;
  restoreN8nFormSubmission: (id: string) => Promise<void>;
  permanentlyDeleteN8nFormSubmission: (id: string) => Promise<void>;
  loading: boolean;
  loadingWebsites: boolean;
  loadingProjects: boolean;
  loadingN8nProjects: boolean;
  loadingN8nForms: boolean;
  getRawPhone: () => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [websites, setWebsites] = useState<WebsiteItem[]>(DEFAULT_WEBSITES);
  const [loadingWebsites, setLoadingWebsites] = useState(true);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [n8nProjects, setN8nProjects] = useState<N8nProject[]>(INITIAL_N8N_PROJECTS);
  const [loadingN8nProjects, setLoadingN8nProjects] = useState(true);

  const [n8nForms, setN8nForms] = useState<N8nProjectForm[]>([]);
  const [loadingN8nForms, setLoadingN8nForms] = useState(true);

  // Real-time n8n_project_forms listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'n8n_project_forms'), (snapshot) => {
      const list: N8nProjectForm[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data()
        } as N8nProjectForm);
      });
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setN8nForms(list);
      setLoadingN8nForms(false);
    }, (err) => {
      console.warn("Real-time n8n_project_forms listener error:", err);
      setLoadingN8nForms(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'contact');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SiteSettings>;
          setSettings({
            email: data.email || DEFAULT_SETTINGS.email,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            location: data.location || DEFAULT_SETTINGS.location,
            instagram: data.instagram || DEFAULT_SETTINGS.instagram,
            whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
            workingHours: data.workingHours || DEFAULT_SETTINGS.workingHours,
            adminAvatarUrl: data.adminAvatarUrl || DEFAULT_SETTINGS.adminAvatarUrl,
          });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Error fetching site settings from Firestore, using defaults:', error);
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Websites listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'websites'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          const defaultItem = DEFAULT_WEBSITES[0];
          const docRef = doc(db, 'websites', defaultItem.id);
          await setDoc(docRef, {
            name: defaultItem.name,
            url: defaultItem.url,
            description: defaultItem.description || '',
            createdAt: defaultItem.createdAt
          });
          setWebsites([defaultItem]);
        } catch (err) {
          console.warn("Seeding default website link skipped:", err);
          setWebsites(DEFAULT_WEBSITES);
        }
        setLoadingWebsites(false);
        return;
      }

      const items: WebsiteItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...docSnap.data()
        } as WebsiteItem);
      });

      items.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      setWebsites(items);
      setLoadingWebsites(false);
    }, (err) => {
      console.warn("Real-time websites listener error, using defaults:", err);
      setWebsites(DEFAULT_WEBSITES);
      setLoadingWebsites(false);
    });

    return () => unsub();
  }, []);

  // Real-time Projects listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          const seeded: Project[] = [];
          for (const p of INITIAL_PROJECTS) {
            const { id, ...dataWithoutId } = p;
            const docRef = await addDoc(collection(db, 'projects'), dataWithoutId);
            seeded.push({ ...dataWithoutId, id: docRef.id });
          }
          const finalList = seeded.length > 0 ? seeded : INITIAL_PROJECTS;
          setProjects(finalList);
        } catch (seedErr) {
          console.warn("Seeding projects to Firestore failed:", seedErr);
          setProjects(INITIAL_PROJECTS);
        }
        setLoadingProjects(false);
        return;
      }

      const deduplicatedMap = new Map<string, Project>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        const projectItem: Project = { ...data, id: docSnap.id };
        const titleKey = (projectItem.title || '').trim().toLowerCase();

        if (!titleKey) return;

        if (!deduplicatedMap.has(titleKey)) {
          deduplicatedMap.set(titleKey, projectItem);
        } else {
          const existing = deduplicatedMap.get(titleKey)!;
          let keep = existing;
          if (existing.isDeleted && !projectItem.isDeleted) {
            keep = projectItem;
          }
          deduplicatedMap.set(titleKey, keep);
        }
      });

      const list = Array.from(deduplicatedMap.values());
      list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      setProjects(list);
      setLoadingProjects(false);
    }, (err) => {
      console.warn("Real-time projects listener error, using initial defaults:", err);
      setProjects(INITIAL_PROJECTS);
      setLoadingProjects(false);
    });

    return () => unsub();
  }, []);

  // Real-time n8n Projects listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'n8n_projects'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          const seeded: N8nProject[] = [];
          for (const item of INITIAL_N8N_PROJECTS) {
            const docRef = doc(db, 'n8n_projects', item.id);
            await setDoc(docRef, item);
            seeded.push(item);
          }
          const finalList = seeded.length > 0 ? seeded : INITIAL_N8N_PROJECTS;
          setN8nProjects(finalList);
        } catch (seedErr) {
          console.warn("Seeding n8n projects to Firestore failed:", seedErr);
          setN8nProjects(INITIAL_N8N_PROJECTS);
        }
        setLoadingN8nProjects(false);
        return;
      }

      const list: N8nProject[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as N8nProject;
        list.push({
          ...data,
          id: docSnap.id
        });
      });

      list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      setN8nProjects(list);
      setLoadingN8nProjects(false);
    }, (err) => {
      console.warn("Real-time n8n projects listener error, using defaults:", err);
      setN8nProjects(INITIAL_N8N_PROJECTS);
      setLoadingN8nProjects(false);
    });

    return () => unsub();
  }, []);

  const getRawPhone = () => {
    return settings.phone.replace(/[^\d+]/g, '');
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const docRef = doc(db, 'settings', 'contact');
    const updatedData = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(docRef, updatedData, { merge: true });
    setSettings(updatedData);
  };

  const addWebsite = async (name: string, url: string, description?: string, logoUrl?: string) => {
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const newItem = {
      name: name.trim(),
      url: formattedUrl,
      description: description ? description.trim() : '',
      logoUrl: logoUrl ? logoUrl.trim() : '',
      createdAt: new Date().toISOString()
    };
    try {
      const docRef = await addDoc(collection(db, 'websites'), newItem);
      const addedItem = { id: docRef.id, ...newItem };
      setWebsites(prev => [...prev.filter(w => w.id !== addedItem.id), addedItem]);
    } catch (err) {
      console.warn("Firestore addWebsite error, updating local state:", err);
      const localItem = { id: 'local-' + Date.now(), ...newItem };
      setWebsites(prev => [...prev, localItem]);
    }
  };

  const updateWebsite = async (id: string, name: string, url: string, description?: string, logoUrl?: string) => {
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const updatedData = {
      name: name.trim(),
      url: formattedUrl,
      description: description ? description.trim() : '',
      logoUrl: logoUrl !== undefined ? logoUrl.trim() : '',
      updatedAt: new Date().toISOString()
    };
    
    // Optimistic UI update
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w));

    try {
      const docRef = doc(db, 'websites', id);
      await setDoc(docRef, updatedData, { merge: true });
    } catch (err) {
      console.warn("Firestore updateWebsite error, kept in local state:", err);
    }
  };

  const deleteWebsite = async (id: string) => {
    const updateData = {
      isDeleted: true,
      deletedAt: new Date().toISOString()
    };
    // Optimistic UI update
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updateData } : w));

    try {
      const docRef = doc(db, 'websites', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore deleteWebsite error:", err);
    }
  };

  const restoreWebsite = async (id: string) => {
    const updateData = {
      isDeleted: false,
      deletedAt: ''
    };
    // Optimistic UI update
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updateData } : w));

    try {
      const docRef = doc(db, 'websites', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore restoreWebsite error:", err);
    }
  };

  const permanentlyDeleteWebsite = async (id: string) => {
    // Optimistic UI update
    setWebsites(prev => prev.filter(w => w.id !== id));

    try {
      const docRef = doc(db, 'websites', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore permanentlyDeleteWebsite error:", err);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProj = {
      ...projectData,
      createdAt: projectData.createdAt || new Date().toISOString()
    };
    try {
      const docRef = await addDoc(collection(db, 'projects'), newProj);
      const added = { ...newProj, id: docRef.id };
      setProjects(prev => [...prev.filter(p => p.id !== added.id), added]);
    } catch (err) {
      console.warn("Firestore addProject error:", err);
      const localItem = { id: 'local-' + Date.now(), ...newProj };
      setProjects(prev => [...prev, localItem]);
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    try {
      const docRef = doc(db, 'projects', id);
      await setDoc(docRef, updatedFields, { merge: true });
    } catch (err) {
      console.warn("Firestore updateProject error:", err);
    }
  };

  const deleteProject = async (id: string) => {
    const updateData = {
      isDeleted: true,
      deletedAt: new Date().toISOString()
    };
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    try {
      const docRef = doc(db, 'projects', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore deleteProject error:", err);
    }
  };

  const restoreProject = async (id: string) => {
    const updateData = {
      isDeleted: false,
      deletedAt: ''
    };
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    try {
      const docRef = doc(db, 'projects', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore restoreProject error:", err);
    }
  };

  const permanentlyDeleteProject = async (id: string) => {
    // Optimistic UI update
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore permanentlyDeleteProject error:", err);
    }
  };

  const addN8nProject = async (data: Omit<N8nProject, 'id'>) => {
    let nodeCount = 0;
    try {
      const parsed = JSON.parse(data.workflowJson);
      nodeCount = (parsed.nodes || (Array.isArray(parsed) ? parsed : [])).length;
    } catch (e) {
      nodeCount = 0;
    }

    const newN8n = {
      ...data,
      nodeCount: nodeCount || data.nodeCount || 0,
      createdAt: data.createdAt || new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'n8n_projects'), newN8n);
      const added = { ...newN8n, id: docRef.id };
      setN8nProjects(prev => [...prev.filter(p => p.id !== added.id), added]);
    } catch (err) {
      console.warn("Firestore addN8nProject error:", err);
      const localItem = { id: 'local-' + Date.now(), ...newN8n };
      setN8nProjects(prev => [...prev, localItem]);
    }
  };

  const updateN8nProject = async (id: string, updatedFields: Partial<N8nProject>) => {
    if (updatedFields.workflowJson) {
      try {
        const parsed = JSON.parse(updatedFields.workflowJson);
        updatedFields.nodeCount = (parsed.nodes || (Array.isArray(parsed) ? parsed : [])).length;
      } catch (e) {
        // Keep existing nodeCount if invalid JSON
      }
    }

    setN8nProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    try {
      const docRef = doc(db, 'n8n_projects', id);
      await setDoc(docRef, updatedFields, { merge: true });
    } catch (err) {
      console.warn("Firestore updateN8nProject error:", err);
    }
  };

  const deleteN8nProject = async (id: string) => {
    const existing = n8nProjects.find(p => p.id === id);
    const updateData = {
      ...(existing || {}),
      isDeleted: true,
      deletedAt: new Date().toISOString()
    };
    setN8nProjects(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    try {
      const docRef = doc(db, 'n8n_projects', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore deleteN8nProject error:", err);
    }
  };

  const restoreN8nProject = async (id: string) => {
    const updateData = {
      isDeleted: false,
      deletedAt: ''
    };
    setN8nProjects(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    try {
      const docRef = doc(db, 'n8n_projects', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore restoreN8nProject error:", err);
    }
  };

  const permanentlyDeleteN8nProject = async (id: string) => {
    setN8nProjects(prev => prev.filter(p => p.id !== id));
    try {
      const docRef = doc(db, 'n8n_projects', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore permanentlyDeleteN8nProject error:", err);
    }
  };

  const addN8nFormSubmission = async (submission: Omit<N8nProjectForm, 'id' | 'createdAt'>) => {
    const newItem = {
      ...submission,
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
    const tempId = 'form-' + Date.now();
    const tempForm = { id: tempId, ...newItem };
    setN8nForms(prev => [tempForm, ...prev.filter(f => f.id !== tempId)]);

    try {
      const docRef = await addDoc(collection(db, 'n8n_project_forms'), newItem);
      notifyAdmin('n8n_project_forms', docRef.id);
      const added = { id: docRef.id, ...newItem };
      setN8nForms(prev => [added, ...prev.filter(f => f.id !== tempId && f.id !== added.id)]);
    } catch (err) {
      console.warn("Firestore addN8nFormSubmission error:", err);
    }
  };

  const deleteN8nFormSubmission = async (id: string) => {
    const updateData = { isDeleted: true, deletedAt: new Date().toISOString() };
    setN8nForms(prev => prev.map(f => f.id === id ? { ...f, ...updateData } : f));
    try {
      const docRef = doc(db, 'n8n_project_forms', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore deleteN8nFormSubmission error:", err);
    }
  };

  const restoreN8nFormSubmission = async (id: string) => {
    const updateData = { isDeleted: false, deletedAt: '' };
    setN8nForms(prev => prev.map(f => f.id === id ? { ...f, ...updateData } : f));
    try {
      const docRef = doc(db, 'n8n_project_forms', id);
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.warn("Firestore restoreN8nFormSubmission error:", err);
    }
  };

  const permanentlyDeleteN8nFormSubmission = async (id: string) => {
    setN8nForms(prev => prev.filter(f => f.id !== id));
    try {
      const docRef = doc(db, 'n8n_project_forms', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore permanentlyDeleteN8nFormSubmission error:", err);
    }
  };

  return (
    <SiteSettingsContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        websites, 
        addWebsite, 
        updateWebsite, 
        deleteWebsite, 
        restoreWebsite,
        permanentlyDeleteWebsite,
        projects,
        addProject,
        updateProject,
        deleteProject,
        restoreProject,
        permanentlyDeleteProject,
        n8nProjects,
        addN8nProject,
        updateN8nProject,
        deleteN8nProject,
        restoreN8nProject,
        permanentlyDeleteN8nProject,
        n8nForms,
        addN8nFormSubmission,
        deleteN8nFormSubmission,
        restoreN8nFormSubmission,
        permanentlyDeleteN8nFormSubmission,
        loading, 
        loadingWebsites, 
        loadingProjects,
        loadingN8nProjects,
        loadingN8nForms,
        getRawPhone 
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

