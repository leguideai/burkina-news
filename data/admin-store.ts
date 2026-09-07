import { articles as initialArticles } from './mock/articles';
import { projects as initialProjects } from './mock/projects';
import { indicators as initialIndicators } from './mock/indicators';
import { briefs as initialBriefs } from './mock/briefs';
import { issues as initialIssues } from './mock/issues';
import { categories as initialCategories } from './mock/categories';
import { Article, Project, Indicator, Brief, Issue, Category, Correction, ProjectStatus } from './types';
import fs from 'fs';
import path from 'path';

// Initial Public Corrections Registry
export const initialCorrections: Correction[] = [
  {
    id: 'corr-1',
    date: '2026-08-15',
    articleTitle: 'Le Burkina produit-il plus d\'or ?',
    articleSlug: 'burkina-faso-production-or-analyse',
    previousText: 'Production nationale consolidée de 59 tonnes en 2025 selon les prévisions préliminaires.',
    correctedText: 'Production nationale de 57,6 tonnes en 2025 selon les chiffres officiels consolidés de la DGMG.',
    reason: 'Correction suite à la publication du rapport annuel définitif de la Direction Générale des Mines et de la Géologie (DGMG).',
    validatedBy: 'Alfred Ouédraogo (Directeur éditorial)'
  },
  {
    id: 'corr-2',
    date: '2026-07-28',
    articleTitle: 'Centrale solaire de Zina',
    articleSlug: 'centrale-solaire-koudougou',
    previousText: 'Mise en service et raccordement au réseau national intervenus en mai 2026.',
    correctedText: 'Raccordement effectif au réseau interconnecté de la SONABEL opéré en juin 2026.',
    reason: 'Précision du calendrier technique sur la base du procès-verbal de synchronisation de la SONABEL.',
    validatedBy: 'Samba Diop (Superadmin)'
  }
];

// Initial Homepage Curation Configuration
export interface HomepageConfig {
  leadArticleId: string;
  secondaryArticleIds: string[];
  terrainArticleId: string;
  factCheckArticleId: string;
  featuredQuote: {
    quoteFr: string;
    quoteEn: string;
    author: string;
    contextFr: string;
    contextEn: string;
  };
}

export const initialHomepageConfig: HomepageConfig = {
  leadArticleId: 'art-01',
  secondaryArticleIds: ['art-02', 'art-03'],
  terrainArticleId: 'art-04',
  factCheckArticleId: 'art-05',
  featuredQuote: {
    quoteFr: '« Le développement n\'est pas un décret mais une somme de chantiers rigoureusement mesurés. »',
    quoteEn: '“Development is not a decree, but the sum of rigorously measured milestones.”',
    author: 'Alfred Ouédraogo',
    contextFr: 'Directeur éditorial · Carnet de terrain Bobo-Dioulasso',
    contextEn: 'Editorial Director · Field notes, Bobo-Dioulasso'
  }
};

// Initial Editorial Users for Back-office
export type AdminRole = 
  | 'Superadmin'
  | 'Directeur éditorial'
  | 'Rédacteur / Enquêteur'
  | 'Desk Données & Tracker'
  | 'Desk IA & Veille'
  | 'Auditeur Déontologique';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar: string;
  status: 'active' | 'suspended';
  title?: string;
  password?: string;
  lastLogin?: string;
  createdAt: string;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-diop',
    email: 'diop@burkinanews.bf',
    name: 'Samba Diop',
    role: 'Superadmin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    title: 'Superadministrateur & Architecte des Données',
    password: 'admin',
    lastLogin: '2026-09-07T12:00:00Z',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-alfred',
    email: 'alfred@burkinanews.bf',
    name: 'Alfred Ouédraogo',
    role: 'Directeur éditorial',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    title: 'Directeur de la Publication & des Enquêtes',
    password: 'admin',
    lastLogin: '2026-09-06T18:30:00Z',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-micum',
    email: 'micum@burkinanews.bf',
    name: 'Desk IA Burkina News',
    role: 'Desk IA & Veille',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    title: 'Intelligence Artificielle & Veille Documentaire',
    password: 'admin',
    lastLogin: '2026-09-07T08:15:00Z',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'usr-mariam',
    email: 'mariam@burkinanews.bf',
    name: 'Mariam Kaboré',
    role: 'Rédacteur / Enquêteur',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    title: 'Grand Reporter Mines, Économie & Industrie',
    password: 'admin',
    lastLogin: '2026-09-05T14:20:00Z',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'usr-issa',
    email: 'issa@burkinanews.bf',
    name: 'Issa Sawadogo',
    role: 'Desk Données & Tracker',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    status: 'active',
    title: 'Analyste Tracker Projets & Infrastructures PND',
    password: 'admin',
    lastLogin: '2026-09-07T10:45:00Z',
    createdAt: '2026-02-15T00:00:00Z'
  }
];

// In-Memory Global Store with file backup for persistence
interface AdminState {
  articles: Article[];
  projects: Project[];
  indicators: Indicator[];
  briefs: Brief[];
  issues: Issue[];
  categories: Category[];
  corrections: Correction[];
  homepageConfig: HomepageConfig;
  users: AdminUser[];
}

declare global {
  var __burkinaAdminStore: AdminState | undefined;
}

export function saveAdminUsers(users: AdminUser[]) {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'submissions');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'admin-users.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving admin-users.json', e);
  }
}

export function getPersistedAdminUsers(): AdminUser[] | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'submissions', 'admin-users.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading admin-users.json', e);
  }
  return null;
}

export function saveHomepageConfig(config: HomepageConfig) {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'submissions');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'homepage-config.json');
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving homepage-config.json', e);
  }
}

export function getPersistedHomepageConfig(): HomepageConfig | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'submissions', 'homepage-config.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading homepage-config.json', e);
  }
  return null;
}

function getInitialState(): AdminState {
  const persistedConfig = getPersistedHomepageConfig();
  const persistedUsers = getPersistedAdminUsers();
  return {
    articles: [...initialArticles],
    projects: [...initialProjects],
    indicators: [...initialIndicators],
    briefs: [...initialBriefs],
    issues: [...initialIssues],
    categories: [...initialCategories],
    corrections: [...initialCorrections],
    homepageConfig: persistedConfig || { ...initialHomepageConfig },
    users: persistedUsers || [...ADMIN_USERS],
  };
}

export function getAdminStore(): AdminState {
  if (!globalThis.__burkinaAdminStore) {
    globalThis.__burkinaAdminStore = getInitialState();
  }
  return globalThis.__burkinaAdminStore;
}

export function getSubmissionsContacts() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'submissions', 'contacts.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading contacts.json', e);
  }
  return [];
}

export function getSubmissionsNewsletter() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'submissions', 'newsletter.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading newsletter.json', e);
  }
  return [];
}
