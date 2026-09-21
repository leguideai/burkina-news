/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT API ARTICLES & INVESTIGATION
 * Connecté aux endpoints RESTful du Backend Go (Semaine 4 / Phase F4)
 */

import { apiClient } from './client';
import {
  ArticleDTO,
  ArticleDetailDTO,
  ArticleFilterParams,
  ArticleStatus,
  CreateArticleInput,
  PaginationMeta,
  UpdateArticleInput,
} from './types';

function buildQueryString(params?: ArticleFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.category && params.category !== 'all') searchParams.set('category', params.category);
  if (params.sub_category && params.sub_category !== 'all') searchParams.set('sub_category', params.sub_category);
  if (params.type && params.type !== 'all') searchParams.set('type', params.type);
  if (params.format && params.format !== 'all') searchParams.set('format', params.format);
  if (params.confidence_level && params.confidence_level !== 'all') {
    searchParams.set('confidence_level', params.confidence_level);
  }
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.tag) searchParams.set('tag', params.tag);
  if (params.search) searchParams.set('search', params.search);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const articlesApi = {
  /**
   * Consultation publique paginée des articles d'investigation
   * Ne retourne que les articles au statut `published`
   */
  async listArticles(params?: ArticleFilterParams): Promise<{ articles: ArticleDTO[]; meta?: PaginationMeta }> {
    const qs = buildQueryString(params);
    const res = await apiClient.get<ArticleDTO[]>(`/articles${qs}`);
    return {
      articles: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Consultation publique d'un article par son slug avec articles connexes suggérés
   */
  async getArticle(slug: string): Promise<ArticleDetailDTO> {
    const res = await apiClient.get<ArticleDetailDTO>(`/articles/${encodeURIComponent(slug)}`);
    return res.data;
  },

  /**
   * Consultation admin paginée des articles de la rédaction (tous statuts : draft, review, published, archived)
   */
  async adminListArticles(params?: ArticleFilterParams): Promise<{ articles: ArticleDTO[]; meta?: PaginationMeta }> {
    const qs = buildQueryString(params);
    const res = await apiClient.get<ArticleDTO[]>(`/admin/articles${qs}`);
    return {
      articles: res.data || [],
      meta: res.meta,
    };
  },

  /**
   * Récupération d'un article complet pour le formulaire d'édition back-office
   */
  async adminGetArticle(id: string): Promise<ArticleDTO> {
    const res = await apiClient.get<ArticleDTO>(`/admin/articles/${encodeURIComponent(id)}`);
    return res.data;
  },

  /**
   * Création d'un nouvel article d'investigation (Admin)
   */
  async createArticle(input: CreateArticleInput): Promise<ArticleDTO> {
    const payload = {
      ...input,
      image: input.image || input.featured_image || '/images/lead.jpeg',
      featured_image: input.featured_image || input.image || '/images/lead.jpeg',
    };
    const res = await apiClient.post<ArticleDTO>('/admin/articles', payload);
    return res.data;
  },

  /**
   * Mise à jour intégrale d'un article (Admin)
   */
  async updateArticle(id: string, input: UpdateArticleInput): Promise<ArticleDTO> {
    const payload = {
      ...input,
      image: input.image || input.featured_image,
      featured_image: input.featured_image || input.image,
    };
    const res = await apiClient.put<ArticleDTO>(`/admin/articles/${encodeURIComponent(id)}`, payload);
    return res.data;
  },

  /**
   * Transition de statut éditorial (draft ➔ review ➔ published ➔ archived)
   */
  async updateArticleStatus(id: string, status: ArticleStatus): Promise<ArticleDTO> {
    const res = await apiClient.patch<ArticleDTO>(`/admin/articles/${encodeURIComponent(id)}/status`, { status });
    return res.data;
  },

  /**
   * Suppression sécurisée d'un article (Superadmin & Directeur éditorial)
   */
  async deleteArticle(id: string): Promise<void> {
    await apiClient.delete<null>(`/admin/articles/${encodeURIComponent(id)}`);
  },
};
