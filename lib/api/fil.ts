/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT API LE FIL & STREAMING SSE
 * Connecté aux endpoints RESTful du Backend Go (Semaine 5 / Phase F5)
 */

import { apiClient } from './client';
import {
  BriefDTO,
  BriefFactDTO,
  BriefFilterParams,
  CreateBriefInput,
  CreateFactInput,
  FactFilterParams,
  PaginationMeta,
  UpdateBriefInput,
  UpdateFactInput,
} from './types';

function buildFactQuery(params?: FactFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.brief_id) searchParams.set('brief_id', params.brief_id);
  if (params.category && params.category !== 'all') searchParams.set('category', params.category);
  if (params.date) searchParams.set('date', params.date);
  if (params.search) searchParams.set('search', params.search);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

function buildBriefQuery(params?: BriefFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.year) searchParams.set('year', params.year.toString());
  if (params.week_number) searchParams.set('week_number', params.week_number.toString());
  if (params.search) searchParams.set('search', params.search);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const filApi = {
  /**
   * Consultation publique paginée des faits vérifiés de 60s
   */
  async listFacts(params?: FactFilterParams): Promise<{ facts: BriefFactDTO[]; meta?: PaginationMeta }> {
    const qs = buildFactQuery(params);
    const res = await apiClient.get<BriefFactDTO[]>(`/fil${qs}`);
    return {
      facts: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Consultation publique des éditions hebdomadaires consolidées
   */
  async listBriefs(params?: BriefFilterParams): Promise<{ briefs: BriefDTO[]; meta?: PaginationMeta }> {
    const qs = buildBriefQuery(params);
    const res = await apiClient.get<BriefDTO[]>(`/fil/editions${qs}`);
    return {
      briefs: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Consultation d'une édition complète par son slug (avec ses faits rattachés)
   */
  async getBriefBySlug(slug: string): Promise<BriefDTO> {
    const res = await apiClient.get<BriefDTO>(`/fil/editions/${encodeURIComponent(slug)}`);
    return res.data;
  },

  /**
   * Récupère l'URL absolue du flux temps réel SSE
   */
  getStreamUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/fil/stream`;
  },

  // ─── Administration (Back-Office) ─────────────────────────────────────────

  /**
   * Liste complète des éditions pour l'administration
   */
  async adminListBriefs(params?: BriefFilterParams): Promise<{ briefs: BriefDTO[]; meta?: PaginationMeta }> {
    const qs = buildBriefQuery(params);
    const res = await apiClient.get<BriefDTO[]>(`/admin/fil/editions${qs}`);
    return {
      briefs: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Crée une édition hebdomadaire (Admin)
   */
  async adminCreateBrief(input: CreateBriefInput): Promise<BriefDTO> {
    const res = await apiClient.post<BriefDTO>('/admin/fil/editions', input);
    return res.data;
  },

  /**
   * Met à jour une édition hebdomadaire (Admin)
   */
  async adminUpdateBrief(id: string, input: UpdateBriefInput): Promise<BriefDTO> {
    const res = await apiClient.put<BriefDTO>(`/admin/fil/editions/${encodeURIComponent(id)}`, input);
    return res.data;
  },

  /**
   * Supprime une édition et ses faits en cascade (Admin)
   */
  async adminDeleteBrief(id: string): Promise<void> {
    await apiClient.delete<null>(`/admin/fil/editions/${encodeURIComponent(id)}`);
  },

  /**
   * Publie une dépêche certifiée 60 secondes (Admin, déclenche broadcast SSE)
   */
  async adminCreateFact(input: CreateFactInput): Promise<BriefFactDTO> {
    const res = await apiClient.post<BriefFactDTO>('/admin/fil/facts', input);
    return res.data;
  },

  /**
   * Met à jour une dépêche certifiée (Admin, diffuse mise à jour SSE)
   */
  async adminUpdateFact(id: string, input: UpdateFactInput): Promise<BriefFactDTO> {
    const res = await apiClient.put<BriefFactDTO>(`/admin/fil/facts/${encodeURIComponent(id)}`, input);
    return res.data;
  },

  /**
   * Supprime une dépêche certifiée (Admin)
   */
  async adminDeleteFact(id: string): Promise<void> {
    await apiClient.delete<null>(`/admin/fil/facts/${encodeURIComponent(id)}`);
  },
};
