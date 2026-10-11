import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { notifyAdmin } from '../notifyAdmin';
import { loadFirestore, whenIdle } from '../firestoreClient';
import { Project, N8nProject, N8nProjectForm } from '../types';
import { cleanText, isValidEmail, isValidPhone, LIMITS, safeExternalUrl, safeMediaUrl, SUBMIT_TIMEOUT_MS, withTimeout } from '../utils/security';
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
  websites: WebsiteItem[];
  projects: Project[];
  n8nProjects: N8nProject[];
  addN8nFormSubmission: (submission: Omit<N8nProjectForm, 'id' | 'createdAt'>) => Promise<void>;
  loading: boolean;
  loadingWebsites: boolean;
  loadingProjects: boolean;
  loadingN8nProjects: boolean;
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

// Everything below is read from Firestore and rendered into links and media, so every URL is
// checked here once: only http(s) URLs (or same-site paths for media) are allowed through.
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const mediaList = (v: unknown) => (Array.isArray(v) ? v.map(safeMediaUrl).filter(Boolean) : undefined);

function sanitizeSettings(data: Partial<SiteSettings>): SiteSettings {
  const email = str(data.email).trim();
  const phone = str(data.phone).trim();
  return {
    email: email && isValidEmail(email) ? email : DEFAULT_SETTINGS.email,
    phone: phone && isValidPhone(phone) ? phone : DEFAULT_SETTINGS.phone,
    location: str(data.location).trim() || DEFAULT_SETTINGS.location,
    instagram: safeExternalUrl(data.instagram, DEFAULT_SETTINGS.instagram),
    whatsapp: safeExternalUrl(data.whatsapp, DEFAULT_SETTINGS.whatsapp),
    workingHours: str(data.workingHours).trim() || DEFAULT_SETTINGS.workingHours,
    adminAvatarUrl: safeMediaUrl(data.adminAvatarUrl) || DEFAULT_SETTINGS.adminAvatarUrl,
  };
}

function sanitizeWebsite(item: WebsiteItem): WebsiteItem | null {
  const url = safeExternalUrl(item.url);
  if (!url) return null;
  return { ...item, url, logoUrl: safeMediaUrl(item.logoUrl) || undefined };
}

function sanitizeProject(item: Project): Project {
  return {
    ...item,
    link: safeExternalUrl(item.link),
    image: safeMediaUrl(item.image),
    images: mediaList(item.images),
    video: safeMediaUrl(item.video) || undefined,
    videos: mediaList(item.videos),
    tags: Array.isArray(item.tags) ? item.tags.filter((t) => typeof t === 'string') : [],
  };
}

function sanitizeN8nProject(item: N8nProject): N8nProject {
  return {
    ...item,
    workflowJson: str(item.workflowJson),
    testWorkflowUrl: safeExternalUrl(item.testWorkflowUrl) || undefined,
    tags: Array.isArray(item.tags) ? item.tags.filter((t) => typeof t === 'string') : [],
  };
}

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [websites, setWebsites] = useState<WebsiteItem[]>(DEFAULT_WEBSITES);
  const [loadingWebsites, setLoadingWebsites] = useState(true);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [n8nProjects, setN8nProjects] = useState<N8nProject[]>(INITIAL_N8N_PROJECTS);
  const [loadingN8nProjects, setLoadingN8nProjects] = useState(true);

  // Live data from Firestore: published contact settings (managed in the BrandiQue Data Console) and the
  // read-only websites / projects / n8n lists. Started when the browser is idle so the Firebase SDK never
  // delays the first paint; the defaults above are shown until the snapshots arrive (as before).
  useEffect(() => {
    let cancelled = false;
    const unsubs: Array<() => void> = [];
    const cancelIdle = whenIdle(() => {
      loadFirestore().then(({ db, doc, collection, onSnapshot }) => {
        if (cancelled) return;
        // Published contact settings (managed in the BrandiQue Data Console).
        unsubs.push(onSnapshot(
          doc(db, 'settings', 'contact'),
          (snapshot) => {
            setSettings(snapshot.exists() ? sanitizeSettings(snapshot.data() as Partial<SiteSettings>) : DEFAULT_SETTINGS);
            setLoading(false);
          },
          () => {
            setSettings(DEFAULT_SETTINGS);
            setLoading(false);
          }
        ));

        // Websites menu (read-only on the public site).
        unsubs.push(onSnapshot(collection(db, 'websites'), (snapshot) => {
          if (snapshot.empty) {
            setWebsites(DEFAULT_WEBSITES);
            setLoadingWebsites(false);
            return;
          }
          const items: WebsiteItem[] = [];
          snapshot.forEach((docSnap) => {
            const item = sanitizeWebsite({ ...(docSnap.data() as WebsiteItem), id: docSnap.id });
            if (item) items.push(item);
          });
          items.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
          setWebsites(items);
          setLoadingWebsites(false);
        }, () => {
          setWebsites(DEFAULT_WEBSITES);
          setLoadingWebsites(false);
        }));

        // Portfolio projects (read-only on the public site).
        unsubs.push(onSnapshot(collection(db, 'projects'), (snapshot) => {
          if (snapshot.empty) {
            setProjects(INITIAL_PROJECTS);
            setLoadingProjects(false);
            return;
          }

          const deduplicatedMap = new Map<string, Project>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Project;
            const projectItem: Project = sanitizeProject({ ...data, id: docSnap.id });
            const titleKey = (typeof projectItem.title === 'string' ? projectItem.title : '').trim().toLowerCase();

            if (!titleKey) return;

            if (!deduplicatedMap.has(titleKey)) {
              deduplicatedMap.set(titleKey, projectItem);
            } else {
              const existing = deduplicatedMap.get(titleKey)!;
              deduplicatedMap.set(titleKey, existing.isDeleted && !projectItem.isDeleted ? projectItem : existing);
            }
          });

          const list = Array.from(deduplicatedMap.values());
          list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
          setProjects(list);
          setLoadingProjects(false);
        }, () => {
          setProjects(INITIAL_PROJECTS);
          setLoadingProjects(false);
        }));

        // n8n workflow showcase (read-only on the public site).
        unsubs.push(onSnapshot(collection(db, 'n8n_projects'), (snapshot) => {
          if (snapshot.empty) {
            setN8nProjects(INITIAL_N8N_PROJECTS);
            setLoadingN8nProjects(false);
            return;
          }
          const list: N8nProject[] = [];
          snapshot.forEach((docSnap) => {
            list.push(sanitizeN8nProject({ ...(docSnap.data() as N8nProject), id: docSnap.id }));
          });
          list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
          setN8nProjects(list);
          setLoadingN8nProjects(false);
        }, () => {
          setN8nProjects(INITIAL_N8N_PROJECTS);
          setLoadingN8nProjects(false);
        }));
      }).catch(() => {
        if (cancelled) return;
        setSettings(DEFAULT_SETTINGS); setLoading(false);
        setWebsites(DEFAULT_WEBSITES); setLoadingWebsites(false);
        setProjects(INITIAL_PROJECTS); setLoadingProjects(false);
        setN8nProjects(INITIAL_N8N_PROJECTS); setLoadingN8nProjects(false);
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
      unsubs.forEach((u) => u());
    };
  }, []);

  const getRawPhone = useCallback(() => settings.phone.replace(/[^\d+]/g, ''), [settings.phone]);

  // Public "request this workflow" form. Throws on failure so the form can show an error.
  const addN8nFormSubmission = useCallback(async (submission: Omit<N8nProjectForm, 'id' | 'createdAt'>) => {
    const newItem = {
      projectId: cleanText(submission.projectId, LIMITS.short),
      projectTitle: cleanText(submission.projectTitle, LIMITS.short),
      name: cleanText(submission.name, LIMITS.name),
      email: cleanText(submission.email, LIMITS.email).toLowerCase(),
      phone: cleanText(submission.phone, LIMITS.phone),
      message: cleanText(submission.message, LIMITS.message, { multiline: true }),
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
    const docRef = await withTimeout(
      loadFirestore().then(({ db, addDoc, collection }) => addDoc(collection(db, 'n8n_project_forms'), newItem)),
      SUBMIT_TIMEOUT_MS
    );
    notifyAdmin('n8n_project_forms', docRef.id);
  }, []);

  // Memoised so consumers only re-render when the data they read actually changes.
  const value = useMemo(() => ({
    settings,
    websites,
    projects,
    n8nProjects,
    addN8nFormSubmission,
    loading,
    loadingWebsites,
    loadingProjects,
    loadingN8nProjects,
    getRawPhone
  }), [settings, websites, projects, n8nProjects, addN8nFormSubmission, loading, loadingWebsites, loadingProjects, loadingN8nProjects, getRawPhone]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
