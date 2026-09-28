/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT API BAROMÈTRE RELANCE
 * Connecté aux endpoints RESTful du Backend Go (Semaine 6 / Phase F6)
 */

import { apiClient } from './client';
import {
  CreateDataPointInput,
  CreateIndicatorInput,
  IndicatorDataPointDTO,
  IndicatorDTO,
  IndicatorFilterParams,
  UpdateIndicatorInput,
} from './types';

function buildQueryString(params?: IndicatorFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.category && params.category !== 'all') searchParams.set('category', params.category);
  if (params.pillar && params.pillar !== 'all') searchParams.set('pillar', params.pillar);
  if (params.search) searchParams.set('search', params.search);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const barometreApi = {
  /**
   * Consultation publique de tous les indicateurs structurants avec séries historiques
   */
  async listIndicators(params?: IndicatorFilterParams): Promise<IndicatorDTO[]> {
    const qs = buildQueryString(params);
    const res = await apiClient.get<IndicatorDTO[]>(`/barometre/indicators${qs}`);
    return res.data || [];
  },

  /**
   * Consultation d'un indicateur par son code unique (ex: PIB-CROISSANCE)
   */
  async getIndicator(code: string): Promise<IndicatorDTO> {
    const res = await apiClient.get<IndicatorDTO>(`/barometre/indicators/${encodeURIComponent(code)}`);
    return res.data;
  },

  // ─── Administration Desk Données & Baromètre ──────────────────────────────

  /**
   * Création d'un nouvel indicateur (authentifié)
   */
  async adminCreateIndicator(input: CreateIndicatorInput): Promise<IndicatorDTO> {
    const res = await apiClient.post<IndicatorDTO>('/admin/barometre', input);
    return res.data;
  },

  /**
   * Mise à jour des informations d'un indicateur (authentifié)
   */
  async adminUpdateIndicator(id: string, input: UpdateIndicatorInput): Promise<IndicatorDTO> {
    const res = await apiClient.put<IndicatorDTO>(`/admin/barometre/${encodeURIComponent(id)}`, input);
    return res.data;
  },

  /**
   * Ajout d'un jalon de mesure annuel dans la série historique (authentifié)
   */
  async adminAddDataPoint(indicatorId: string, input: CreateDataPointInput): Promise<IndicatorDataPointDTO> {
    const res = await apiClient.post<IndicatorDataPointDTO>(
      `/admin/barometre/${encodeURIComponent(indicatorId)}/points`,
      input
    );
    return res.data;
  },

  /**
   * Suppression d'un indicateur et de ses séries (authentifié)
   */
  async adminDeleteIndicator(id: string): Promise<void> {
    await apiClient.delete(`/admin/barometre/${encodeURIComponent(id)}`);
  },
};
