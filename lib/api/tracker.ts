/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT API TRACKER DES CHANTIERS
 * Connecté aux endpoints RESTful du Backend Go (Semaine 6 / Phase F6)
 */

import { apiClient } from './client';
import {
  ChangeProjectStatusInput,
  CreateProjectInput,
  PaginationMeta,
  ProjectDTO,
  ProjectFilterParams,
  ProjectStatsDTO,
  UpdateProjectInput,
} from './types';

function buildQueryString(params?: ProjectFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.region && params.region !== 'all') searchParams.set('region', params.region);
  if (params.sector && params.sector !== 'all') searchParams.set('sector', params.sector);
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.category && params.category !== 'all') searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const trackerApi = {
  /**
   * Consultation publique paginée des chantiers
   */
  async listProjects(params?: ProjectFilterParams): Promise<{ projects: ProjectDTO[]; meta?: PaginationMeta }> {
    const qs = buildQueryString(params);
    const res = await apiClient.get<ProjectDTO[]>(`/tracker/projects${qs}`);
    return {
      projects: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Consultation publique d'un chantier par son slug avec historique immuable et acteurs
   */
  async getProject(slug: string): Promise<ProjectDTO> {
    const res = await apiClient.get<ProjectDTO>(`/tracker/projects/${encodeURIComponent(slug)}`);
    return res.data;
  },

  /**
   * Consultation publique des statistiques globales agrégées du Tracker
   */
  async getStats(): Promise<ProjectStatsDTO> {
    const res = await apiClient.get<ProjectStatsDTO>('/tracker/stats');
    return res.data;
  },

  // ─── Administration Desk Tracker ──────────────────────────────────────────

  /**
   * Création d'un nouveau chantier (authentifié)
   */
  async adminCreateProject(input: CreateProjectInput): Promise<ProjectDTO> {
    const res = await apiClient.post<ProjectDTO>('/admin/tracker', input);
    return res.data;
  },

  /**
   * Modification d'un chantier sans écraser son historique (authentifié)
   */
  async adminUpdateProject(id: string, input: UpdateProjectInput): Promise<ProjectDTO> {
    const res = await apiClient.put<ProjectDTO>(`/admin/tracker/${encodeURIComponent(id)}`, input);
    return res.data;
  },

  /**
   * Enregistrement d'une transition de statut dans l'historique immuable avec preuve officielle obligatoire (authentifié)
   */
  async adminChangeProjectStatus(id: string, input: ChangeProjectStatusInput): Promise<ProjectDTO> {
    const res = await apiClient.patch<ProjectDTO>(`/admin/tracker/${encodeURIComponent(id)}/status`, input);
    return res.data;
  },

  /**
   * Suppression d'un chantier et de son historique (authentifié)
   */
  async adminDeleteProject(id: string): Promise<void> {
    await apiClient.delete(`/admin/tracker/${encodeURIComponent(id)}`);
  },
};
