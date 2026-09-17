/**
 * 🇧🇫 BURKINA NEWS — TYPES & DTOs DE L'API RESTFUL
 * Synchronisés avec internal/models et pkg/response du Backend Go
 */

// ─── Structure enveloppe standard de l'API Go ────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message_fr: string;
  message_en: string;
  meta?: PaginationMeta;
}

export interface ApiValidationErrorDetail {
  field: string;
  message_fr: string;
  message_en: string;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error_code: string;
  message_fr: string;
  message_en: string;
  details?: ApiValidationErrorDetail[];
}

// ─── Rôles & Utilisateurs du Desk Rédactionnel ────────────────────────────

// Codes de rôles officiels en base PostgreSQL (GORM / Backend Go)
export type BackendAdminRole =
  | 'superadmin'
  | 'editorial_director'
  | 'journalist'
  | 'tracker_data'
  | 'desk_ai'
  | 'auditor';

// Statuts officiels d'un compte
export type UserStatus = 'active' | 'suspended';

// DTO d'un utilisateur retourné par le Backend Go
export interface AdminUserDTO {
  id: string;
  email: string;
  name: string;
  role: BackendAdminRole | string;
  avatar: string;
  title: string;
  status: UserStatus;
  last_login_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// Session d'authentification utilisateur
export interface AuthLoginData {
  user: AdminUserDTO;
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
}

// DTOs de saisie pour le CRUD utilisateurs
export interface UserCreateInput {
  email: string;
  password?: string;
  name: string;
  role: BackendAdminRole | string;
  title?: string;
  avatar?: string;
  status?: UserStatus;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  name?: string;
  role?: BackendAdminRole | string;
  title?: string;
  avatar?: string;
  status?: UserStatus;
}

export interface UserStatusUpdateInput {
  status: UserStatus;
}

// ─── Helpers de Libellés et de Rôles Déontologiques ──────────────────────

export interface RoleInfo {
  code: BackendAdminRole;
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  color: string;
}

export const OFFICIAL_ROLES: Record<BackendAdminRole, RoleInfo> = {
  superadmin: {
    code: 'superadmin',
    labelFr: 'Superadmin',
    labelEn: 'Superadmin',
    descriptionFr: 'Accès total déontologique, gestion des accès et architecture système.',
    color: '#b91c1c', // red-700
  },
  editorial_director: {
    code: 'editorial_director',
    labelFr: 'Directeur éditorial',
    labelEn: 'Editorial Director',
    descriptionFr: 'Validation finale des publications, déclarations et ligne déontologique.',
    color: '#087443', // burkina-green
  },
  journalist: {
    code: 'journalist',
    labelFr: 'Rédacteur / Enquêteur',
    labelEn: 'Investigative Reporter',
    descriptionFr: 'Rédaction d’enquêtes, recueil de preuves (Niveaux A/B/C) et dépêches du Fil.',
    color: '#1d4ed8', // blue-700
  },
  tracker_data: {
    code: 'tracker_data',
    labelFr: 'Desk Données & Tracker',
    labelEn: 'Data & Tracker Desk',
    descriptionFr: 'Alimentation des chantiers (6 statuts), procès-verbaux et indicateurs RELANCE.',
    color: '#c2410c', // orange-700
  },
  desk_ai: {
    code: 'desk_ai',
    labelFr: 'Desk IA & Veille',
    labelEn: 'AI & OSINT Desk',
    descriptionFr: 'Veille documentaire assistée par IA, détection d’alertes et synthèses primaires.',
    color: '#6d28d9', // purple-700
  },
  auditor: {
    code: 'auditor',
    labelFr: 'Auditeur Déontologique',
    labelEn: 'Ethics Auditor',
    descriptionFr: 'Contrôle a posteriori de l’exactitude factuelle et validation des erratums.',
    color: '#475569', // slate-600
  },
};

/**
 * Normalise un code ou libellé de rôle vers le code backend officiel
 */
export function normalizeRoleCode(role: string): BackendAdminRole {
  const r = (role || '').toLowerCase().trim();
  if (r === 'superadmin') return 'superadmin';
  if (r === 'directeur éditorial' || r === 'editorial_director' || r === 'directeur editorial') return 'editorial_director';
  if (r === 'rédacteur / enquêteur' || r === 'journalist' || r === 'redacteur' || r === 'enqueteur') return 'journalist';
  if (r === 'desk données & tracker' || r === 'tracker_data' || r === 'donnees' || r === 'tracker') return 'tracker_data';
  if (r === 'desk ia & veille' || r === 'desk_ai' || r === 'ia' || r === 'veille') return 'desk_ai';
  if (r === 'auditeur déontologique' || r === 'auditor' || r === 'auditeur') return 'auditor';
  return 'journalist';
}

/**
 * Récupère le libellé d'affichage d'un rôle
 */
export function getRoleLabel(role: string, lang: 'fr' | 'en' = 'fr'): string {
  const code = normalizeRoleCode(role);
  const info = OFFICIAL_ROLES[code];
  if (!info) return role;
  return lang === 'en' ? info.labelEn : info.labelFr;
}

/**
 * Titres et fonctions rédactionnelles par défaut associées à chaque rôle déontologique
 */
export const DEFAULT_ROLE_TITLES: Record<BackendAdminRole, string> = {
  superadmin: 'Superadministrateur Système & Gouvernance',
  editorial_director: 'Directeur de la Rédaction & des Publications',
  journalist: 'Grand Reporter & Journaliste d’Investigation',
  tracker_data: 'Analyste Données & Chef de Projet Tracker PND',
  desk_ai: 'Responsable Desk IA & Veille Documentaire',
  auditor: 'Auditeur Déontologique & Contrôle Qualité Factuelle',
};

/**
 * Récupère la fonction / titre rédactionnel par défaut correspondant à un rôle
 */
export function getDefaultTitleForRole(role: string): string {
  const code = normalizeRoleCode(role);
  return DEFAULT_ROLE_TITLES[code] || 'Membre de la Rédaction';
}

// ─── Médias & Stockage Cloudflare R2 / Local (Semaine 3) ─────────────────

export type MediaFolder = 'avatars' | 'content' | 'sources' | 'projects' | 'issues';
export type StorageType = 'r2' | 'local';

export interface MediaFileDTO {
  id: string;
  filename: string;
  original_name: string;
  folder: MediaFolder;
  mime_type: string;
  size: number;
  url: string;
  storage_type: StorageType;
  uploaded_by_id?: string | null;
  uploaded_by?: AdminUserDTO | null;
  created_at: string;
  updated_at?: string;
}

// ─── Rubriques & Sous-rubriques (Semaine 4 / Jalon S4.0) ──────────────────

export interface SubCategoryDTO {
  id: string;
  code: string;
  category_code: string;
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  order_num?: number;
  is_activated: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryDTO {
  code: string;
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  slug: string;
  color: string;
  icon?: string;
  order_num: number;
  is_active: boolean;
  sub_categories?: SubCategoryDTO[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryInput {
  code: string;
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  slug?: string;
  color?: string;
  icon?: string;
  order_num?: number;
  is_active?: boolean;
}

export interface UpdateCategoryInput {
  name_fr?: string;
  name_en?: string;
  description_fr?: string;
  description_en?: string;
  slug?: string;
  color?: string;
  icon?: string;
  order_num?: number;
  is_active?: boolean;
}

export interface CreateSubCategoryInput {
  code: string;
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  order_num?: number;
  is_activated?: boolean;
}

export interface UpdateSubCategoryInput {
  name_fr?: string;
  name_en?: string;
  description_fr?: string;
  description_en?: string;
  order_num?: number;
  is_activated?: boolean;
}

