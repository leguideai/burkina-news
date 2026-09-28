'use client';

import { Search, X, MapPin } from 'lucide-react';
import { PROJECT_STATUS_LABELS } from '@/data/types';
import { useState, useMemo } from 'react';
import {
  BURKINA_REGIONS_17,
  getProvincesByRegion,
  getCommunesByCondition,
  getRegionByProvinceName,
} from '@/data/mock/referentiel-territoire';

export interface FilterState {
  search: string;
  sector: string;
  region: string;
  province: string;
  commune: string;
  status: string;
}

interface FilterBarProps {
  onFilter: (filters: FilterState) => void;
  lang?: 'fr' | 'en';
}

export default function FilterBar({ onFilter, lang = 'fr' }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sector: '',
    region: '',
    province: '',
    commune: '',
    status: '',
  });

  // Liste conditionnelle des provinces selon la région choisie
  const availableProvinces = useMemo(() => {
    return getProvincesByRegion(filters.region || undefined);
  }, [filters.region]);

  // Liste conditionnelle des communes/villes selon la région et la province choisies
  const availableCommunes = useMemo(() => {
    return getCommunesByCondition(filters.province || undefined, filters.region || undefined);
  }, [filters.region, filters.province]);

  const handleRegionChange = (newRegion: string) => {
    let newProvince = filters.province;
    let newCommune = filters.commune;

    // Si la province actuelle n'appartient pas à la nouvelle région, on la réinitialise
    if (newRegion && newProvince) {
      const parentRegion = getRegionByProvinceName(newProvince);
      if (parentRegion && parentRegion !== newRegion) {
        newProvince = '';
        newCommune = '';
      }
    }

    const next = { ...filters, region: newRegion, province: newProvince, commune: newCommune };
    setFilters(next);
    onFilter(next);
  };

  const handleProvinceChange = (newProvince: string) => {
    let newRegion = filters.region;
    let newCommune = filters.commune;

    if (newProvince) {
      // Déduire automatiquement la région si non sélectionnée
      const parentRegion = getRegionByProvinceName(newProvince);
      if (parentRegion) {
        newRegion = parentRegion;
      }
    }

    // Si la commune n'appartient plus à cette province, réinitialiser
    if (newCommune && newProvince) {
      const validCommunes = getCommunesByCondition(newProvince, newRegion);
      if (!validCommunes.includes(newCommune)) {
        newCommune = '';
      }
    }

    const next = { ...filters, region: newRegion, province: newProvince, commune: newCommune };
    setFilters(next);
    onFilter(next);
  };

  const handleCommuneChange = (newCommune: string) => {
    const next = { ...filters, commune: newCommune };
    setFilters(next);
    onFilter(next);
  };

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const removeFilter = (key: keyof FilterState) => {
    if (key === 'region') {
      const next = { ...filters, region: '', province: '', commune: '' };
      setFilters(next);
      onFilter(next);
    } else if (key === 'province') {
      const next = { ...filters, province: '', commune: '' };
      setFilters(next);
      onFilter(next);
    } else {
      handleChange(key, '');
    }
  };

  const activeFilterCount =
    (filters.sector ? 1 : 0) +
    (filters.region ? 1 : 0) +
    (filters.province ? 1 : 0) +
    (filters.commune ? 1 : 0) +
    (filters.status ? 1 : 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e6dfd5] mb-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Recherche textuelle libre */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs sm:text-sm text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            placeholder={lang === 'fr' ? 'Rechercher un chantier, opérateur, mot-clé...' : 'Search project, operator, keyword...'}
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Filtres sélecteurs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto pb-1">
          {/* Secteur */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Tous les secteurs' : 'All sectors'}</option>
            <option value="Énergie">Énergie</option>
            <option value="Transport">Transport</option>
            <option value="Agro-industrie">Agro-industrie</option>
            <option value="Eau / Irrigation">Eau / Irrigation</option>
            <option value="Santé">Santé</option>
            <option value="Éducation">Éducation</option>
            <option value="Routes">Routes</option>
            <option value="Mines">Mines</option>
            <option value="Agriculture">Agriculture</option>
          </select>

          {/* Étape 1 : Région (17 régions officielles) */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.region}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Toutes les 17 régions' : 'All 17 regions'}</option>
            <option value="National">National (Multi-régions)</option>
            {BURKINA_REGIONS_17.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Étape 2 : Province (Conditionnée par la région choisie) */}
          <select
            className={`border border-[#e6dfd5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627] ${
              filters.region ? 'bg-[#f4efe8] font-medium' : 'bg-[#faf8f5]'
            }`}
            value={filters.province}
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">
              {filters.region
                ? `${lang === 'fr' ? 'Provinces de' : 'Provinces of'} ${filters.region} (${availableProvinces.length})`
                : `${lang === 'fr' ? 'Toutes les 47 provinces' : 'All 47 provinces'}`}
            </option>
            {availableProvinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Étape 3 : Commune / Ville (Conditionnée par la province et région) */}
          <select
            className={`border border-[#e6dfd5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627] ${
              filters.province ? 'bg-[#f4efe8] font-medium' : 'bg-[#faf8f5]'
            }`}
            value={filters.commune}
            onChange={(e) => handleCommuneChange(e.target.value)}
          >
            <option value="">
              {filters.province
                ? `${lang === 'fr' ? 'Villes / Communes de' : 'Towns of'} ${filters.province} (${availableCommunes.length})`
                : `${lang === 'fr' ? 'Toutes les 351 communes' : 'All 351 communes'}`}
            </option>
            {availableCommunes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Statut officiel du chantier */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Tous les statuts (6)' : 'All 6 statuses'}</option>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Badges de filtres actifs avec cascade visuelle */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#f0ece4]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373] mr-1">
            {lang === 'fr' ? 'Filtres actifs :' : 'Active filters :'}
          </span>
          {filters.sector && (
            <span className="inline-flex items-center gap-1 bg-[#f4efe8] text-[#141414] text-xs px-2.5 py-1 rounded-md border border-[#e6dfd5]">
              Secteur : <strong>{filters.sector}</strong>
              <button onClick={() => removeFilter('sector')} className="hover:text-[#c2410c] ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.region && (
            <span className="inline-flex items-center gap-1 bg-[#0b4627]/10 text-[#0b4627] text-xs px-2.5 py-1 rounded-md border border-[#0b4627]/20 font-medium">
              <MapPin className="w-3 h-3 text-[#0b4627]" />
              Région : <strong>{filters.region}</strong>
              <button onClick={() => removeFilter('region')} className="hover:text-[#c2410c] ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.province && (
            <span className="inline-flex items-center gap-1 bg-[#c2410c]/10 text-[#c2410c] text-xs px-2.5 py-1 rounded-md border border-[#c2410c]/20 font-medium">
              Province : <strong>{filters.province}</strong>
              <button onClick={() => removeFilter('province')} className="hover:text-[#c2410c] ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.commune && (
            <span className="inline-flex items-center gap-1 bg-[#141414]/10 text-[#141414] text-xs px-2.5 py-1 rounded-md border border-[#141414]/20 font-medium">
              Commune : <strong>{filters.commune}</strong>
              <button onClick={() => removeFilter('commune')} className="hover:text-[#c2410c] ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 bg-[#f4efe8] text-[#141414] text-xs px-2.5 py-1 rounded-md border border-[#e6dfd5]">
              Statut : <strong>{PROJECT_STATUS_LABELS[filters.status as keyof typeof PROJECT_STATUS_LABELS]}</strong>
              <button onClick={() => removeFilter('status')} className="hover:text-[#c2410c] ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              const reset: FilterState = { search: filters.search, sector: '', region: '', province: '', commune: '', status: '' };
              setFilters(reset);
              onFilter(reset);
            }}
            className="text-xs font-mono text-[#c2410c] hover:underline ml-2"
          >
            {lang === 'fr' ? 'Effacer tous les filtres' : 'Clear all filters'}
          </button>
        </div>
      )}
    </div>
  );
}
