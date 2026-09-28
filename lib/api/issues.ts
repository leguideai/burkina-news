import { apiClient } from './client';
import { 
  IssueDTO, 
  IssueFilterParams, 
  CreateIssueInput, 
  UpdateIssueInput, 
  ApiResponse 
} from './types';

export const issuesApi = {
  /**
   * Récupère la liste des parutions mensuelles publiées (Kiosque public)
   */
  async listIssues(params?: IssueFilterParams): Promise<{ issues: IssueDTO[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = query ? `/numeros?${query}` : '/numeros';
    const res = await apiClient.get<IssueDTO[]>(endpoint);

    return {
      issues: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
    };
  },

  /**
   * Récupère le détail d'un numéro par son slug ou son ID avec articles associés
   */
  async getIssueBySlug(slug: string): Promise<IssueDTO | null> {
    try {
      const res = await apiClient.get<IssueDTO>(`/numeros/${slug}`);
      return res.data || null;
    } catch (e) {
      console.warn(`[issuesApi] Impossible de charger le numéro ${slug} :`, e);
      return null;
    }
  },

  /**
   * Liste l'ensemble des parutions pour le desk rédactionnel (Admin)
   */
  async adminListIssues(params?: IssueFilterParams): Promise<{ issues: IssueDTO[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = query ? `/admin/numeros?${query}` : '/admin/numeros';
    const res = await apiClient.get<IssueDTO[]>(endpoint);

    return {
      issues: res.data || [],
      total: res.meta?.total || (res.data ? res.data.length : 0),
    };
  },

  /**
   * Crée un nouveau numéro dans le catalogue (Admin)
   */
  async adminCreateIssue(input: CreateIssueInput): Promise<IssueDTO> {
    const res = await apiClient.post<IssueDTO>('/admin/numeros', input);
    return res.data;
  },

  /**
   * Met à jour une parution existante (Admin)
   */
  async adminUpdateIssue(id: string, input: UpdateIssueInput): Promise<IssueDTO> {
    const res = await apiClient.put<IssueDTO>(`/admin/numeros/${id}`, input);
    return res.data;
  },

  /**
   * Supprime un numéro du catalogue (Admin)
   */
  async adminDeleteIssue(id: string): Promise<void> {
    await apiClient.delete(`/admin/numeros/${id}`);
  },
};
