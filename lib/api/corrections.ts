/**
 * 🇧🇫 BURKINA NEWS — SERVICE API CORRECTIONS DÉONTOLOGIQUES
 * Registre public permanent des rectifications factuelles.
 */

import { apiClient } from './client';
import {
  CorrectionDTO,
  CorrectionFilterParams,
  CreateCorrectionInput,
  UpdateCorrectionInput,
} from './types';

export const correctionsApi = {
  /**
   * Récupère la liste publique des corrections
   */
  async listCorrections(params?: CorrectionFilterParams): Promise<{ corrections: CorrectionDTO[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/corrections${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<CorrectionDTO[]>(endpoint);

    return {
      corrections: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
    };
  },

  /**
   * ADMIN : Lister toutes les corrections
   */
  async adminListCorrections(params?: CorrectionFilterParams): Promise<{ corrections: CorrectionDTO[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/admin/corrections${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<CorrectionDTO[]>(endpoint);

    return {
      corrections: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
    };
  },

  /**
   * ADMIN : Inscrire une nouvelle correction au registre public
   */
  async adminCreateCorrection(data: CreateCorrectionInput): Promise<CorrectionDTO> {
    const res = await apiClient.post<CorrectionDTO>('/admin/corrections', data);
    return res.data;
  },

  /**
   * ADMIN : Mettre à jour une correction
   */
  async adminUpdateCorrection(id: string, data: UpdateCorrectionInput): Promise<CorrectionDTO> {
    const res = await apiClient.put<CorrectionDTO>(`/admin/corrections/${encodeURIComponent(id)}`, data);
    return res.data;
  },

  /**
   * ADMIN : Supprimer une correction du registre
   */
  async adminDeleteCorrection(id: string): Promise<void> {
    await apiClient.delete<void>(`/admin/corrections/${encodeURIComponent(id)}`);
  },
};
