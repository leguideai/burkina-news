/**
 * 🇧🇫 BURKINA NEWS — SERVICE API CURATION DE LA UNE
 * Pilotage éditorial en temps réel de la page d'accueil (Go Backend).
 */

import { apiClient } from './client';
import { HomepageConfigDTO, UpdateHomepageConfigInput } from './types';

export const homepageApi = {
  /**
   * PUBLIC : Récupérer la sélection active de la page d'accueil
   */
  async getHomepage(): Promise<HomepageConfigDTO> {
    const res = await apiClient.get<HomepageConfigDTO>('/homepage');
    return res.data;
  },

  /**
   * ADMIN : Récupérer la configuration courante de la Une
   */
  async getAdminHomepage(): Promise<HomepageConfigDTO> {
    const res = await apiClient.get<HomepageConfigDTO>('/admin/homepage');
    return res.data;
  },

  /**
   * ADMIN : Mettre à jour la curation de la Une
   */
  async updateAdminHomepage(data: UpdateHomepageConfigInput): Promise<HomepageConfigDTO> {
    const res = await apiClient.put<HomepageConfigDTO>('/admin/homepage', data);
    return res.data;
  },
};
