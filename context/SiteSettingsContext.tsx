import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../pages/ProjectsData';

export interface SiteSettings {
  email: string;
  phone: string;
  location: string;
  instagram: string;
  whatsapp: string;
  workingHours: string;
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
  loading: boolean;
  loadingWebsites: boolean;
  loadingProjects: boolean;
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
        loading, 
        loadingWebsites, 
        loadingProjects,
        getRawPhone 
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

