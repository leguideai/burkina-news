'use client';

import { Search, X, MapPin, ChevronDown } from 'lucide-react';
import { PROJECT_STATUS_LABELS } from '@/data/types';
import { useState, useMemo, useEffect } from 'react';
import {
  BURKINA_REGIONS_17,
  getProvincesByRegion,
  getCommunesByCondition,
  getRegionByProvinceName,
} from '@/data/mock/referentiel-territoire';

export interface FilterState {
  search: string;
  sector: string;
  bailleur: string;
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
    bailleur: '',
    region: '',
    province: '',
    commune: '',
    status: '',
  });

  const [provinceSearch, setProvinceSearch] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showCommuneDropdown, setShowCommuneDropdown] = useState(false);

  useEffect(() => {
    if (!filters.province) setProvinceSearch('');
  }, [filters.province]);

  useEffect(() => {
    if (!filters.commune) setCommuneSearch('');
  }, [filters.commune]);

  // Liste conditionnelle des provinces selon la région choisie
  const availableProvinces = useMemo(() => {
    return getProvincesByRegion(filters.region || undefined);
  }, [filters.region]);

  // Liste conditionnelle des communes/villes selon la région et la province choisies
  const availableCommunes = useMemo(() => {
    return getCommunesByCondition(filters.province || undefined, filters.region || undefined);
  }, [filters.region, filters.province]);

  const filteredProvinces = useMemo(() => {
    if (!provinceSearch) return availableProvinces;
    return availableProvinces.filter((p) => p.toLowerCase().includes(provinceSearch.toLowerCase()));
  }, [availableProvinces, provinceSearch]);

  const filteredCommunes = useMemo(() => {
    if (!communeSearch) return availableCommunes;
    return availableCommunes.filter((c) => c.toLowerCase().includes(communeSearch.toLowerCase()));
  }, [availableCommunes, communeSearch]);

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
    (filters.bailleur ? 1 : 0) +
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
          {/* Secteur (Ordre alphabétique) */}
          {/* Secteur (Ordre alphabétique) */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Secteurs' : 'Sectors'}</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Agro-industrie">Agro-industrie</option>
            <option value="Eau / Irrigation">Eau / Irrigation</option>
            <option value="Éducation">Éducation</option>
            <option value="Énergie">Énergie</option>
            <option value="Mines">Mines</option>
            <option value="Routes">Routes</option>
            <option value="Santé">Santé</option>
            <option value="Transport">Transport</option>
          </select>

          {/* Bailleur (Ordre alphabétique) */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.bailleur}
            onChange={(e) => handleChange('bailleur', e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Bailleurs' : 'Donors'}</option>
            <option value="BAD">BAD</option>
            <option value="Banque mondiale">Banque mondiale</option>
            <option value="CEDEAO">CEDEAO</option>
            <option value="Coopération bilatérale">Coopération bilatérale</option>
            <option value="État du Burkina Faso">État du Burkina Faso</option>
            <option value="Secteur privé">Secteur privé</option>
            <option value="Union Européenne">Union Européenne</option>
          </select>

          {/* Étape 1 : Région (17 régions officielles) */}
          <select
            className="border border-[#e6dfd5] bg-[#faf8f5] rounded-lg text-xs py-2 px-2.5 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627]"
            value={filters.region}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">{lang === 'fr' ? 'Régions' : 'Regions'}</option>
            <option value="National">National (Multi-régions)</option>
            {BURKINA_REGIONS_17.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Étape 2 : Province (Conditionnée par la région choisie) */}
          <div className="relative min-w-[140px]">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={lang === 'fr' ? 'Provinces' : 'Provinces'}
                value={filters.province || provinceSearch}
                onChange={(e) => {
                  if (filters.province) {
                    handleProvinceChange('');
                  }
                  setProvinceSearch(e.target.value);
                  setShowProvinceDropdown(true);
                }}
                onFocus={() => setShowProvinceDropdown(true)}
                onBlur={() => setTimeout(() => setShowProvinceDropdown(false), 200)}
                className={`w-full border border-[#e6dfd5] rounded-lg text-xs py-2 pl-2.5 pr-8 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627] ${
                  filters.region || filters.province ? 'bg-[#f4efe8] font-medium' : 'bg-[#faf8f5]'
                }`}
              />
              {filters.province ? (
                <button
                  className="absolute right-2 text-[#737373] hover:text-[#c2410c]"
                  onClick={() => {
                    handleProvinceChange('');
                    setProvinceSearch('');
                  }}
                  title="Effacer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <ChevronDown className="absolute right-2 w-3 h-3 text-[#737373] pointer-events-none" />
              )}
            </div>
            {showProvinceDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6dfd5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredProvinces.map((p) => (
                  <div
                    key={p}
                    className="px-3 py-2 text-xs text-[#141414] cursor-pointer hover:bg-[#f4efe8]"
                    onClick={() => {
                      handleProvinceChange(p);
                      setProvinceSearch('');
                      setShowProvinceDropdown(false);
                    }}
                  >
                    {p}
                  </div>
                ))}
                {filteredProvinces.length === 0 && (
                  <div className="px-3 py-2 text-xs text-[#737373]">
                    {lang === 'fr' ? 'Aucun résultat' : 'No results'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Étape 3 : Commune / Ville (Conditionnée par la province et région) */}
          <div className="relative min-w-[140px]">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={lang === 'fr' ? 'Communes' : 'Communes'}
                value={filters.commune || communeSearch}
                onChange={(e) => {
                  if (filters.commune) {
                    handleCommuneChange('');
                  }
                  setCommuneSearch(e.target.value);
                  setShowCommuneDropdown(true);
                }}
                onFocus={() => setShowCommuneDropdown(true)}
                onBlur={() => setTimeout(() => setShowCommuneDropdown(false), 200)}
                className={`w-full border border-[#e6dfd5] rounded-lg text-xs py-2 pl-2.5 pr-8 text-[#141414] focus:ring-1 focus:ring-[#0b4627] focus:border-[#0b4627] ${
                  filters.province || filters.commune ? 'bg-[#f4efe8] font-medium' : 'bg-[#faf8f5]'
                }`}
              />
              {filters.commune ? (
                <button
                  className="absolute right-2 text-[#737373] hover:text-[#c2410c]"
                  onClick={() => {
                    handleCommuneChange('');
                    setCommuneSearch('');
                  }}
                  title="Effacer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <ChevronDown className="absolute right-2 w-3 h-3 text-[#737373] pointer-events-none" />
              )}
            </div>
            {showCommuneDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6dfd5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCommunes.map((c, idx) => (
                  <div
                    key={`filterbar-commune-${c}-${idx}`}
                    className="px-3 py-2 text-xs text-[#141414] cursor-pointer hover:bg-[#f4efe8]"
                    onClick={() => {
                      handleCommuneChange(c);
                      setCommuneSearch('');
                      setShowCommuneDropdown(false);
                    }}
                  >
                    {c}
                  </div>
                ))}
                {filteredCommunes.length === 0 && (
                  <div className="px-3 py-2 text-xs text-[#737373]">
                    {lang === 'fr' ? 'Aucun résultat' : 'No results'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statut officiel du chantier (Présentation distincte sombre & badge) */}
          <select
            className={`border rounded-lg text-xs py-2 px-2.5 font-bold transition-all ${
              filters.status
                ? 'bg-white border-[#0b4627] text-[#0b4627]'
                : 'bg-[#141414] border-[#141414] text-white hover:bg-[#262626]'
            }`}
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="" className="bg-white text-[#141414]">{lang === 'fr' ? '● Statut' : '● Status'}</option>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key} className="bg-white text-[#141414]">
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
          {filters.bailleur && (
            <span className="inline-flex items-center gap-1 bg-[#f4efe8] text-[#141414] text-xs px-2.5 py-1 rounded-md border border-[#e6dfd5]">
              Bailleur : <strong>{filters.bailleur}</strong>
              <button onClick={() => removeFilter('bailleur')} className="hover:text-[#c2410c] ml-1">
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
              const reset: FilterState = { search: filters.search, sector: '', bailleur: '', region: '', province: '', commune: '', status: '' };
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
