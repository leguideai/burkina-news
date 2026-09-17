/**
 * 🇧🇫 BURKINA NEWS — SERVICE DE GESTION DES RUBRIQUES & SOUS-RUBRIQUES
 * Câblé sur les endpoints /api/v1/categories et /api/v1/admin/categories du Backend Go
 */

import { apiClient } from './client';
import {
  CategoryDTO,
  SubCategoryDTO,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from './types';

export const categoriesApi = {
  /**
   * Liste complète des rubriques et sous-rubriques (publiques ou toutes si all=true)
   */
  async listCategories(includeInactive: boolean = false): Promise<CategoryDTO[]> {
    const endpoint = includeInactive ? '/categories?all=true' : '/categories';
    const res = await apiClient.get<CategoryDTO[]>(endpoint);
    return res.data || [];
  },

  /**
   * Récupère une rubrique par son code ou son slug
   */
  async getCategory(codeOrSlug: string): Promise<CategoryDTO> {
    const res = await apiClient.get<CategoryDTO>(`/categories/${encodeURIComponent(codeOrSlug)}`);
    return res.data;
  },

  /**
   * Crée une nouvelle rubrique (Admin)
   */
  async createCategory(input: CreateCategoryInput): Promise<CategoryDTO> {
    const res = await apiClient.post<CategoryDTO>('/admin/categories', input);
    return res.data;
  },

  /**
   * Met à jour une rubrique existante (Admin)
   */
  async updateCategory(code: string, input: UpdateCategoryInput): Promise<CategoryDTO> {
    const res = await apiClient.put<CategoryDTO>(`/admin/categories/${encodeURIComponent(code)}`, input);
    return res.data;
  },

  /**
   * Supprime une rubrique et ses sous-rubriques (Admin)
   */
  async deleteCategory(code: string): Promise<{ code: string }> {
    const res = await apiClient.delete<{ code: string }>(`/admin/categories/${encodeURIComponent(code)}`);
    return res.data;
  },

  /**
   * Crée une sous-rubrique rattachée à une rubrique (Admin)
   */
  async createSubCategory(categoryCode: string, input: CreateSubCategoryInput): Promise<SubCategoryDTO> {
    const res = await apiClient.post<SubCategoryDTO>(`/admin/categories/${encodeURIComponent(categoryCode)}/subcategories`, input);
    return res.data;
  },

  /**
   * Met à jour une sous-rubrique (Admin)
   */
  async updateSubCategory(id: string, input: UpdateSubCategoryInput): Promise<SubCategoryDTO> {
    const res = await apiClient.put<SubCategoryDTO>(`/admin/subcategories/${encodeURIComponent(id)}`, input);
    return res.data;
  },

  /**
   * Supprime une sous-rubrique (Admin)
   */
  async deleteSubCategory(id: string): Promise<{ id: string }> {
    const res = await apiClient.delete<{ id: string }>(`/admin/subcategories/${encodeURIComponent(id)}`);
    return res.data;
  },
};
