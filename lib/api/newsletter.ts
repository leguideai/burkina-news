/**
 * 🇧🇫 BURKINA NEWS — SERVICE API LETTRE D'INFORMATION (NEWSLETTER)
 * Inscriptions lecteurs, gestion des abonnés et exportations (Go Backend).
 */

import { apiClient, API_BASE_URL } from './client';
import {
  NewsletterSubscriberDTO,
  NewsletterStatsDTO,
  NewsletterListResponse,
  SubscribeNewsletterInput,
} from './types';

export const newsletterApi = {
  /**
   * PUBLIC : S'inscrire à la lettre d'information
   */
  async subscribe(data: SubscribeNewsletterInput): Promise<NewsletterSubscriberDTO> {
    const res = await apiClient.post<NewsletterSubscriberDTO>('/newsletter/subscribe', data);
    return res.data;
  },

  /**
   * PUBLIC : Se désinscrire de la lettre d'information
   */
  async unsubscribe(email: string): Promise<{ unsubscribed: boolean }> {
    const res = await apiClient.post<{ unsubscribed: boolean }>('/newsletter/unsubscribe', { email });
    return res.data;
  },

  /**
   * ADMIN : Lister les abonnés avec statistiques et pagination
   */
  async adminList(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<NewsletterListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/admin/newsletter${queryString ? `?${queryString}` : ''}`;
    
    // The backend returns { success: true, data: subscribers, stats: stats, meta: meta }
    const res = await apiClient.get<any>(endpoint);
    return {
      subscribers: res.data || [],
      stats: res.stats,
      meta: res.meta,
    };
  },

  /**
   * ADMIN : Supprimer un abonné
   */
  async adminDelete(id: string): Promise<void> {
    await apiClient.delete<void>(`/admin/newsletter/${encodeURIComponent(id)}`);
  },

  /**
   * ADMIN : URL directe de téléchargement de l'export CSV
   */
  getExportCSVUrl(): string {
    return `${API_BASE_URL}/admin/newsletter/export`;
  },
};
