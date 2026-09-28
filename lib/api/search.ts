import { apiClient } from './client';
import { SearchResultDTO, SearchFilterParams } from './types';

export const searchApi = {
  /**
   * Effectue une recherche globale transversale via le backend Go (PostgreSQL)
   * GET /api/v1/search?q=...&type=all|articles|projects|indicators|facts&limit=10
   */
  async search(params: SearchFilterParams): Promise<SearchResultDTO> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.type && params.type !== 'all') searchParams.set('type', params.type);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.lang) searchParams.set('lang', params.lang);

    const query = searchParams.toString();
    const endpoint = query ? `/search?${query}` : '/search';

    try {
      const res = await apiClient.get<SearchResultDTO>(endpoint);
      return res.data || {
        query: params.q,
        total: 0,
        articles: [],
        projects: [],
        indicators: [],
        facts: [],
      };
    } catch (e) {
      console.warn('[searchApi] Erreur lors de la recherche transversale :', e);
      return {
        query: params.q,
        total: 0,
        articles: [],
        projects: [],
        indicators: [],
        facts: [],
      };
    }
  },
};
