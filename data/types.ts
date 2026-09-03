// ─── Catégories (les 6 rubriques de la Charte V3) ─────────────────────────
export type CategoryCode = 'economie' | 'securite' | 'chantiers' | 'agriculture' | 'societe' | 'idees'

export interface Category {
  code: CategoryCode
  nameFr: string
  nameEn: string
  descriptionFr: string
  descriptionEn: string
  slug: string
  color: string
}

// ─── Contenus éditoriaux ──────────────────────────────────────────────────
export type ContentType =
  | 'decryptage'
  | 'terrain'
  | 'vrai-ou-faux'
  | 'edito'
  | 'le-chiffre'
  | 'trois-questions'
  | 'analyse'
  | 'fil'

export type ContentStatus = 'draft' | 'review' | 'published'

export interface Article {
  id: string
  type: ContentType
  title: string
  titleEn?: string
  slug: string
  excerpt: string
  excerptEn?: string
  body: string
  bodyEn?: string
  category: CategoryCode
  image: string
  author: string
  publishedAt: string
  readTime: string
  sourceCount: number
  confidence?: 'high' | 'medium' | 'low'
  tags: string[]
  issueId?: string
  // Compat fields for components that use the simpler interface
  imageUrl?: string
  timeAgo?: string
  isExclusive?: boolean
}

// ─── Tracker : Projets ───────────────────────────────────────────────────
export type ProjectStatus =
  | 'annonce'
  | 'engage'
  | 'en-construction'
  | 'inaugure'
  | 'operationnel'
  | 'impact-mesure'

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'annonce': 'Annoncé',
  'engage': 'Engagé',
  'en-construction': 'En construction',
  'inaugure': 'Inauguré',
  'operationnel': 'Opérationnel',
  'impact-mesure': 'Impact mesuré',
}

export const PROJECT_STATUS_LABELS_EN: Record<ProjectStatus, string> = {
  'annonce': 'Announced',
  'engage': 'Committed',
  'en-construction': 'Under Construction',
  'inaugure': 'Inaugurated',
  'operationnel': 'Operational',
  'impact-mesure': 'Impact Measured',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  'annonce': '#9CA3AF',
  'engage': '#3B82F6',
  'en-construction': '#F46B18',
  'inaugure': '#22C55E',
  'operationnel': '#087443',
  'impact-mesure': '#D97706',
}

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'annonce', 'engage', 'en-construction', 'inaugure', 'operationnel', 'impact-mesure',
]

export interface ProjectStatusEntry {
  status: ProjectStatus
  date: string
  source: string
  note?: string
  noteEn?: string
}

export interface ProjectActor {
  role: string
  roleEn?: string
  name: string
}

export interface ProjectSource {
  title: string
  url: string
  date: string
  institution?: string
}

export interface Project {
  id: string
  title: string
  titleEn?: string
  slug: string
  description: string
  descriptionEn?: string
  category: CategoryCode
  region: string
  sector: string
  currentStatus: ProjectStatus
  statusHistory: ProjectStatusEntry[]
  actors: ProjectActor[]
  amount?: string
  currency?: string
  capacity?: string
  lastVerifiedAt: string
  sources: ProjectSource[]
  linkedArticleIds: string[]
  image: string
}

// ─── Indicateurs RELANCE ─────────────────────────────────────────────────
export interface DataPoint {
  year: number
  value: number
  source: string
}

export interface Indicator {
  id: string
  code: string
  name: string
  nameEn?: string
  definition: string
  definitionEn?: string
  unit: string
  baselineValue: number
  baselineYear: number
  target2028?: number
  target2030?: number
  currentValue: number
  currentYear: number
  trend: 'up' | 'down' | 'stable'
  source: string
  category: CategoryCode
  program?: string
  programEn?: string
  image?: string
  history: DataPoint[]
}

// ─── Numéros (Issues) ────────────────────────────────────────────────────
export interface Issue {
  id: string
  number: number
  title: string
  titleEn?: string
  slug: string
  coverImage: string
  publicationDate: string
  summary: string
  summaryEn?: string
  articleCount: number
  articleIds: string[]
  pdfUrl?: string
}

// ─── Le Fil (Brief hebdomadaire) ─────────────────────────────────────────
export interface BriefFact {
  time: string
  text: string
  textEn?: string
  source: string
  sourceUrl?: string
  category?: CategoryCode
  whyWatch?: string
  whyWatchEn?: string
  image?: string
}

export interface Brief {
  id: string
  title: string
  titleEn?: string
  slug: string
  date: string
  weekNumber: number
  image?: string
  summary?: string
  summaryEn?: string
  facts: BriefFact[]
}

// ─── Corrections ─────────────────────────────────────────────────────────
export interface Correction {
  id: string
  date: string
  articleTitle: string
  articleSlug: string
  previousText: string
  correctedText: string
  reason: string
  validatedBy: string
}

// ─── Navigation ──────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  highlight?: boolean
}
