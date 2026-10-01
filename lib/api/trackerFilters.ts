/**
 * 🇧🇫 BURKINA NEWS — SERVICE CLIENT FILTRES DYNAMIQUES DU TRACKER
 * Fournit les secteurs, bailleurs et régions gérés dynamiquement depuis le Back-office
 * Tous les retours sont garantis triés par ordre alphabétique strict.
 */

import { TrackerSector, TrackerBailleur, TrackerFiltersConfig } from '@/data/types';
import { INITIAL_TRACKER_FILTERS_CONFIG } from '@/data/mock/tracker-filters';

export interface DynamicFiltersResponse {
  sectors: string[];
  bailleurs: string[];
  regions: string[];
  rawSectors: TrackerSector[];
  rawBailleurs: TrackerBailleur[];
  updatedAt?: string;
}

export const trackerFiltersApi = {
  /**
   * Récupère tous les filtres dynamiques (secteurs, bailleurs, régions) triés par ordre alphabétique
   */
  async getFilters(lang: 'fr' | 'en' = 'fr'): Promise<DynamicFiltersResponse> {
    try {
      const res = await fetch(`/api/tracker/filters?lang=${lang}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        return {
          sectors: (data.sectors || []).sort((a: string, b: string) => a.localeCompare(b, lang)),
          bailleurs: (data.bailleurs || []).sort((a: string, b: string) => a.localeCompare(b, lang)),
          regions: (data.regions || []).sort((a: string, b: string) => a.localeCompare(b, lang)),
          rawSectors: (data.rawSectors || []).sort((a: TrackerSector, b: TrackerSector) => 
            (lang === 'en' && a.nameEn ? a.nameEn : a.name).localeCompare(lang === 'en' && b.nameEn ? b.nameEn : b.name, lang)
          ),
          rawBailleurs: (data.rawBailleurs || []).sort((a: TrackerBailleur, b: TrackerBailleur) => a.name.localeCompare(b.name, lang)),
          updatedAt: data.updatedAt,
        };
      }
    } catch (err) {
      console.warn('[trackerFiltersApi] Repli sur les filtres par défaut :', err);
    }

    // Repli de secours avec tri alphabétique
    const sectors = INITIAL_TRACKER_FILTERS_CONFIG.sectors
      .map(s => (lang === 'en' && s.nameEn ? s.nameEn : s.name))
      .sort((a, b) => a.localeCompare(b, lang));

    const bailleurs = INITIAL_TRACKER_FILTERS_CONFIG.bailleurs
      .map(b => b.name)
      .sort((a, b) => a.localeCompare(b, lang));

    const regions = (INITIAL_TRACKER_FILTERS_CONFIG.regions || [])
      .slice()
      .sort((a, b) => a.localeCompare(b, lang));

    return {
      sectors,
      bailleurs,
      regions,
      rawSectors: INITIAL_TRACKER_FILTERS_CONFIG.sectors,
      rawBailleurs: INITIAL_TRACKER_FILTERS_CONFIG.bailleurs,
    };
  },

  /**
   * Créer un nouveau secteur depuis l'admin
   */
  async createSector(sector: Partial<TrackerSector>): Promise<TrackerSector> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_tracker_sector',
        payload: sector,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du secteur');
    return data.item;
  },

  /**
   * Mettre à jour un secteur existant
   */
  async updateSector(id: string, sector: Partial<TrackerSector>): Promise<TrackerSector> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_tracker_sector',
        payload: { id, ...sector },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la modification du secteur');
    return data.item;
  },

  /**
   * Supprimer un secteur
   */
  async deleteSector(id: string): Promise<void> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_tracker_sector',
        payload: { id },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression du secteur');
  },

  /**
   * Créer un nouveau bailleur de fonds depuis l'admin
   */
  async createBailleur(bailleur: Partial<TrackerBailleur>): Promise<TrackerBailleur> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_tracker_bailleur',
        payload: bailleur,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du bailleur');
    return data.item;
  },

  /**
   * Mettre à jour un bailleur existant
   */
  async updateBailleur(id: string, bailleur: Partial<TrackerBailleur>): Promise<TrackerBailleur> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_tracker_bailleur',
        payload: { id, ...bailleur },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la modification du bailleur');
    return data.item;
  },

  /**
   * Supprimer un bailleur
   */
  async deleteBailleur(id: string): Promise<void> {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_tracker_bailleur',
        payload: { id },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression du bailleur');
  }
};
