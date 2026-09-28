/**
 * 🇧🇫 BURKINA NEWS — SERVICE API SIGNALEMENTS & ALERTES
 * Recueil citoyen, signalements d'erreurs, alertes et demandes de droit de réponse.
 */

import { apiClient } from './client';
import {
  SubmissionDTO,
  SubmissionFilterParams,
  CreateSubmissionInput,
  UpdateSubmissionStatusInput,
} from './types';

export const signalementsApi = {
  /**
   * PUBLIC : Soumettre un signalement d'erreur, une alerte ou un message
   */
  async submitSignalement(data: CreateSubmissionInput): Promise<SubmissionDTO> {
    const res = await apiClient.post<SubmissionDTO>('/signalements', data);
    return res.data;
  },

  /**
   * ADMIN : Lister tous les signalements
   */
  async adminListSubmissions(params?: SubmissionFilterParams): Promise<{ submissions: SubmissionDTO[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/admin/signalements${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<SubmissionDTO[]>(endpoint);

    return {
      submissions: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
    };
  },

  /**
   * ADMIN : Mettre à jour le statut d'un signalement (pending, resolved, archived)
   */
  async adminUpdateStatus(id: string, data: UpdateSubmissionStatusInput): Promise<void> {
    await apiClient.put<void>(`/admin/signalements/${encodeURIComponent(id)}/status`, data);
  },

  /**
   * ADMIN : Supprimer un signalement
   */
  async adminDeleteSubmission(id: string): Promise<void> {
    await apiClient.delete<void>(`/admin/signalements/${encodeURIComponent(id)}`);
  },
};
