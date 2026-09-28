/**
 * 🇧🇫 BURKINA NEWS — CLIENT API RÉFÉRENTIEL TERRITORIAL OFFICIEL
 * Couvre les 17 régions, 47 provinces et 351 communes du Burkina Faso
 * Câblé sur les endpoints /api/v1/territories du Backend Go avec fallback autonome
 */

import { apiClient } from './client';
import { TerritoryDTO } from './types';
import {
  BURKINA_REGIONS_17,
  BURKINA_COMMUNES_351,
  getProvincesByRegion,
  getCommunesByCondition,
} from '@/data/mock/referentiel-territoire';

export const territoriesApi = {
  /**
   * Récupère la liste des 17 régions administratives officielles
   */
  async getRegions(): Promise<string[]> {
    try {
      const res = await apiClient.get<string[]>('/territories/regions');
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback résilient en cas d'indisponibilité du backend
    }
    return BURKINA_REGIONS_17;
  },

  /**
   * Récupère la liste des 47 provinces (filtrée conditionnellement par région si spécifiée)
   */
  async getProvinces(region?: string): Promise<string[]> {
    try {
      const query = region ? `?region=${encodeURIComponent(region)}` : '';
      const res = await apiClient.get<string[]>(`/territories/provinces${query}`);
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback résilient
    }
    return getProvincesByRegion(region);
  },

  /**
   * Récupère la liste des 351 communes (conditionnée par région et/ou province)
   */
  async getCommunes(region?: string, province?: string): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      if (region) params.set('region', region);
      if (province) params.set('province', province);
      const query = params.toString() ? `?${params.toString()}` : '';

      const res = await apiClient.get<string[]>(`/territories/communes${query}`);
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback résilient
    }
    return getCommunesByCondition(province, region);
  },

  /**
   * Récupère l'ensemble du découpage territorial sous forme d'objets structurés
   */
  async getAll(): Promise<TerritoryDTO[]> {
    try {
      const res = await apiClient.get<TerritoryDTO[]>('/territories');
      if (res && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback résilient
    }
    return BURKINA_COMMUNES_351.map((c, idx) => ({
      id: `terr-${idx + 1}`,
      code: `BF-${c.province.substring(0, 3).toUpperCase()}-${c.commune.substring(0, 3).toUpperCase()}`,
      region: c.region,
      province: c.province,
      commune: c.commune,
      type: c.typeCommune.includes('urbaine') ? 'urbaine' : 'rurale',
      is_chef_lieu_prov: (c.statutChefLieu || '').toLowerCase().includes('province'),
      is_chef_lieu_reg: (c.statutChefLieu || '').toLowerCase().includes('région'),
    }));
  },
};
