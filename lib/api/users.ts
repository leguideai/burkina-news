/**
 * 🇧🇫 BURKINA NEWS — SERVICE DE GESTION DES UTILISATEURS DU DESK
 * Câblé sur les endpoints /api/v1/admin/users du Backend Go
 */

import { apiClient } from './client';
import {
  AdminUserDTO,
  UserCreateInput,
  UserUpdateInput,
  UserStatusUpdateInput,
  PaginationMeta,
  normalizeRoleCode,
} from './types';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface ListUsersResult {
  users: AdminUserDTO[];
  meta?: PaginationMeta;
  message_fr: string;
  message_en: string;
}

export const usersApi = {
  /**
   * Liste paginée des membres de l'équipe rédactionnelle
   */
  async listUsers(params: ListUsersParams = {}): Promise<ListUsersResult> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search && params.search.trim()) query.set('search', params.search.trim());
    if (params.role && params.role !== 'all') query.set('role', normalizeRoleCode(params.role));
    if (params.status && params.status !== 'all') query.set('status', params.status);

    const queryString = query.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';

    const res = await apiClient.get<AdminUserDTO[]>(endpoint);
    return {
      users: res.data || [],
      meta: res.meta,
      message_fr: res.message_fr,
      message_en: res.message_en,
    };
  },

  /**
   * Récupère un utilisateur par son ID
   */
  async getUser(id: string): Promise<AdminUserDTO> {
    const res = await apiClient.get<AdminUserDTO>(`/admin/users/${id}`);
    return res.data;
  },

  /**
   * Crée un nouveau membre du Desk
   */
  async createUser(input: UserCreateInput): Promise<AdminUserDTO> {
    const payload = {
      ...input,
      role: normalizeRoleCode(input.role),
    };
    const res = await apiClient.post<AdminUserDTO>('/admin/users', payload);
    return res.data;
  },

  /**
   * Met à jour les informations d'un membre
   */
  async updateUser(id: string, input: UserUpdateInput): Promise<AdminUserDTO> {
    const payload = {
      ...input,
      role: input.role ? normalizeRoleCode(input.role) : undefined,
    };
    const res = await apiClient.put<AdminUserDTO>(`/admin/users/${id}`, payload);
    return res.data;
  },

  /**
   * Suspend ou réactive un compte
   */
  async updateUserStatus(id: string, status: 'active' | 'suspended'): Promise<AdminUserDTO> {
    const res = await apiClient.patch<AdminUserDTO>(`/admin/users/${id}/status`, { status });
    return res.data;
  },

  /**
   * Supprime un compte utilisateur
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },
};
