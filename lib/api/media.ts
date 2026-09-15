/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT API MÉDIAS (SEMAINE 3)
 * Téléversement et gestion des médias sur Cloudflare R2 et stockage local
 */

import { apiClient } from './client';
import { ApiResponse, MediaFileDTO, MediaFolder, PaginationMeta } from './types';

export const mediaApi = {
  /**
   * Téléverse un fichier média (photo, PV, PDF, image d'article ou avatar)
   */
  async upload(file: File, folder: MediaFolder = 'content'): Promise<MediaFileDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await apiClient.request<MediaFileDTO>('/media/upload', {
      method: 'POST',
      body: formData,
    });

    return response.data;
  },

  /**
   * Téléverse spécifiquement une photo de profil (avatar)
   */
  async uploadAvatar(file: File): Promise<MediaFileDTO> {
    return this.upload(file, 'avatars');
  },

  /**
   * Liste les fichiers médias avec pagination et filtre optionnel
   */
  async list(
    folder?: MediaFolder,
    page: number = 1,
    limit: number = 20
  ): Promise<{ media: MediaFileDTO[]; meta?: PaginationMeta }> {
    const params = new URLSearchParams();
    if (folder) params.set('folder', folder);
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    const response = await apiClient.get<MediaFileDTO[]>(`/media?${params.toString()}`);
    return {
      media: response.data || [],
      meta: response.meta,
    };
  },

  /**
   * Supprime un média par son identifiant UUID
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/media/${id}`);
  },
};
