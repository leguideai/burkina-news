/**
 * 🇧🇫 BURKINA NEWS — SERVICE D'AUTHENTIFICATION API
 * Câblé sur les endpoints /api/v1/auth/* du Backend Go
 */

import { apiClient, tokenStorage } from './client';
import { ApiResponse, AuthLoginData, AdminUserDTO } from './types';

export const authApi = {
  /**
   * Connexion utilisateur
   */
  async login(email: string, password: string): Promise<AuthLoginData> {
    const res = await apiClient.post<AuthLoginData>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    if (res.data?.access_token && res.data?.refresh_token) {
      tokenStorage.setTokens(res.data.access_token, res.data.refresh_token);
    }

    return res.data;
  },

  /**
   * Récupère le profil de l'utilisateur connecté via son jeton Bearer
   */
  async getMe(): Promise<AdminUserDTO | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const res = await apiClient.get<AdminUserDTO>('/auth/me');
      return res.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Déconnexion sécurisée (révocation du refresh token en base)
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (e) {
      console.warn('Erreur lors de la déconnexion distante :', e);
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Vérifie si un token est présent en local
   */
  hasToken(): boolean {
    return !!tokenStorage.getAccessToken();
  },

  /**
   * Met à jour le profil personnel de l'utilisateur connecté (PUT /api/v1/auth/me)
   */
  async updateMe(input: {
    name?: string;
    email?: string;
    title?: string;
    avatar?: string;
    password?: string;
  }): Promise<AdminUserDTO> {
    const res = await apiClient.put<AdminUserDTO>('/auth/me', input);
    return res.data;
  },
};
