// ─── Catégories (Rubriques de l'architecture éditoriale) ───────────────────
export type CategoryCode = 'economie' | 'securite' | 'chantiers' | 'agriculture' | 'societe' | 'histoire' | 'idees' | (string & {})

export interface SubCategory {
  code: string
  nameFr: string
  nameEn: string
  categoryCode: CategoryCode
  descriptionFr?: string
  descriptionEn?: string
  publishedCount?: number
  isActivated?: boolean
}

export interface Category {
  code: CategoryCode
  nameFr: string
  nameEn: string
  descriptionFr: string
  descriptionEn: string
  slug: string
  color: string
  icon?: string
  order?: number
  subCategories?: SubCategory[]
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
  subCategory?: string
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
  code?: string // Identifiant normé BKN-CH-NNNN (ex: BKN-CH-0007)
  title: string
  titleEn?: string
  slug: string
  description: string
  descriptionEn?: string
  category: CategoryCode
  region: string
  province?: string
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
  linkedIndicatorCodes?: string[] // Codes des indicateurs RELANCE liés (Many-to-Many)
  pndProgram?: string
  reliability?: 'A' | 'B' | 'C'
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
  pillar?: string
  pillarEn?: string
  image?: string
  history: DataPoint[]
  linkedProjectSlugs?: string[] // Slugs des chantiers du Tracker associés (Many-to-Many)
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

// ─── Nomenclature Documentaire & Médias (Charte v3.1 & Note Samba) ──────────
/**
 * Génère un nom de fichier normalisé conforme à la Charte documentaire v3.1 et Note Samba :
 * - Sans accents, minuscules ou majuscules normées, tirets au lieu d'espaces
 * - Format éditorial : AAAA-MM-JJ_BKN_RUBRIQUE_Sujet_LANG_STATUT.ext
 * - Format chantier : AAAA-MM-JJ_BKN-CH-NNNN_ETAT_Nature.ext
 */
export function generateMediaFilename(options: {
  date?: string // AAAA-MM-JJ (par défaut date du jour)
  type: 'editorial' | 'chantier'
  rubriqueOrCode: string // ex: ECONOMIE, BKN-CH-0007
  sujet: string // ex: investissements-miniers, preuve-terrain
  lang?: 'FR' | 'EN' | 'BILINGUE'
  statut?: 'v01' | 'v02' | 'RELU' | 'VERIF' | 'VALIDE' | 'PUBLIE' | 'Preuve-terrain' | 'PV' | 'Decret'
  extension?: string // ex: .jpg, .pdf, .webp
}): string {
  const sanitize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const dateStr = options.date || new Date().toISOString().slice(0, 10)
  const ext = options.extension ? `.${sanitize(options.extension.replace(/^\./, ''))}` : ''

  if (options.type === 'editorial') {
    const rub = sanitize(options.rubriqueOrCode.toUpperCase())
    const subj = sanitize(options.sujet)
    const lang = options.lang || 'FR'
    const st = options.statut || 'PUBLIE'
    return `${dateStr}_BKN_${rub}_${subj}_${lang}_${st}${ext}`
  } else {
    const code = sanitize(options.rubriqueOrCode.toUpperCase())
    const st = options.statut || 'Preuve-terrain'
    const nature = sanitize(options.sujet)
    return `${dateStr}_${code}_${st}_${nature}${ext}`
  }
}

