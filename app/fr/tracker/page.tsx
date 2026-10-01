'use client';

import { useState, useMemo, useEffect } from 'react';
import { trackerApi } from '@/lib/api/tracker';
import { barometreApi } from '@/lib/api/barometre';
import { trackerFiltersApi } from '@/lib/api/trackerFilters';
import { mapProjectDTOToProject, mapIndicatorDTOToIndicator } from '@/lib/api/mappers';
import ProjectCard from '@/components/tracker/ProjectCard';
import StatusBadge from '@/components/tracker/StatusBadge';
import { 
  PROJECT_STATUS_LABELS, 
  PROJECT_STATUS_ORDER,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_THEMES,
  ProjectStatus,
  Project,
  Indicator
} from '@/data/types';
import { 
  Search, 
  X, 
  Check,
  RotateCcw,
  ArrowRight,
  LayoutGrid,
  List,
  Compass,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Coins,
  Building2,
  Clock,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { 
  BURKINA_REGIONS_17, 
  BURKINA_PROVINCES_47, 
  getProvincesByRegion, 
  getCommunesByCondition,
  getRegionByProvinceName,
} from '@/data/mock/referentiel-territoire';

export default function TrackerPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedBailleur, setSelectedBailleur] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<{ total: number; byStatus: Record<string, number> }>({ total: 0, byStatus: {} });
  const [keyIndicators, setKeyIndicators] = useState<Indicator[]>([]);
  const [dynamicSectors, setDynamicSectors] = useState<string[]>([]);
  const [dynamicBailleurs, setDynamicBailleurs] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [projRes, statsRes, indRes, filtersRes] = await Promise.allSettled([
          trackerApi.listProjects({ limit: 100 }),
          trackerApi.getStats(),
          barometreApi.listIndicators(),
          trackerFiltersApi.getFilters('fr'),
        ]);

        if (!isMounted) return;

        if (projRes.status === 'fulfilled' && projRes.value.projects && projRes.value.projects.length > 0) {
          setProjects(projRes.value.projects.map(mapProjectDTOToProject));
        }

        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats({
            total: statsRes.value.total_projects,
            byStatus: statsRes.value.by_status as any,
          });
        }

        if (indRes.status === 'fulfilled' && indRes.value && indRes.value.length > 0) {
          const mappedInds = indRes.value.map(mapIndicatorDTOToIndicator);
          const filtered = mappedInds.filter(i => ['PIB-CROISSANCE', 'ELEC-CAPACITE', 'OR-PRODUCTION', 'PAUVRETE'].includes(i.code));
          if (filtered.length > 0) {
            setKeyIndicators(filtered);
          }
        }

        if (filtersRes.status === 'fulfilled' && filtersRes.value) {
          if (filtersRes.value.sectors && filtersRes.value.sectors.length > 0) {
            setDynamicSectors(filtersRes.value.sectors);
          }
          if (filtersRes.value.bailleurs && filtersRes.value.bailleurs.length > 0) {
            setDynamicBailleurs(filtersRes.value.bailleurs);
          }
        }
      } catch (e) {
        console.error('Erreur de synchronisation Tracker API :', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const sectors = useMemo(() => {
    const fromProjects = projects.map(p => p.sector).filter(Boolean) as string[];
    const combined = Array.from(new Set([...dynamicSectors, ...fromProjects]));
    return combined.sort((a, b) => a.localeCompare(b, 'fr'));
  }, [projects, dynamicSectors]);

  const bailleurs = useMemo(() => {
    const fromProjects = projects.map(p => p.bailleur).filter(Boolean) as string[];
    const combined = Array.from(new Set([...dynamicBailleurs, ...fromProjects]));
    return combined.sort((a, b) => a.localeCompare(b, 'fr'));
  }, [projects, dynamicBailleurs]);

  const regions = useMemo(() => {
    return [...BURKINA_REGIONS_17].sort((a, b) => a.localeCompare(b, 'fr'));
  }, []);

  const availableProvinces = useMemo(() => {
    if (selectedRegion !== 'all') {
      return getProvincesByRegion(selectedRegion);
    }
    return [...BURKINA_PROVINCES_47].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [selectedRegion]);

  const availableCommunes = useMemo(() => {
    return getCommunesByCondition(
      selectedProvince !== 'all' ? selectedProvince : undefined,
      selectedRegion !== 'all' ? selectedRegion : undefined
    );
  }, [selectedProvince, selectedRegion]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        const match = p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          (p.province && p.province.toLowerCase().includes(q)) ||
          (p.bailleur && p.bailleur.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedStatus !== 'all' && p.currentStatus !== selectedStatus) {
        return false;
      }
      if (selectedSector !== 'all' && p.sector !== selectedSector) {
        return false;
      }
      if (selectedBailleur !== 'all' && p.bailleur !== selectedBailleur) {
        return false;
      }
      if (selectedRegion !== 'all' && p.region !== selectedRegion) {
        return false;
      }
      if (selectedProvince !== 'all' && p.province !== selectedProvince) {
        return false;
      }
      if (selectedCommune !== 'all') {
        const pDesc = (p.description || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase();
        const cLower = selectedCommune.toLowerCase();
        if (!pDesc.includes(cLower) && !pTitle.includes(cLower)) {
          return false;
        }
      }
      return true;
    });
  }, [projects, search, selectedStatus, selectedSector, selectedBailleur, selectedRegion, selectedProvince, selectedCommune]);

  const hasActiveFilters = search || selectedStatus !== 'all' || selectedSector !== 'all' || selectedBailleur !== 'all' || selectedRegion !== 'all' || selectedProvince !== 'all' || selectedCommune !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSelectedSector('all');
    setSelectedBailleur('all');
    setSelectedRegion('all');
    setSelectedProvince('all');
    setSelectedCommune('all');
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      
      {/* ──────────────────────────────────────────────────────────
          1. HEADER DU TRACKER : Broadsheet Style
      ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Le Tracker</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-1">
                <span className="w-2 h-2 bg-[#0b4627] inline-block"></span>
                <span>Base Documentaire Publique</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                Le Tracker des Projets du Faso
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Suivi physique et documentaire de l'état réel de chaque grand chantier annoncé au Burkina Faso. Chaque changement d'état est vérifié sur le terrain et adossé aux sources primaires.
            </p>
          </div>

          {/* Quick Stats Filter Bar (The 6 Milestones) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
            {PROJECT_STATUS_ORDER.map((status, idx) => {
              const count = stats.byStatus[status] || 0;
              const isSelected = selectedStatus === status;
              const theme = PROJECT_STATUS_THEMES[status];
              const color = PROJECT_STATUS_COLORS[status];

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
                  className={`p-3 border text-left transition-all relative flex flex-col justify-between rounded-lg ${
                    isSelected 
                      ? `${theme.bgActive} text-white ${theme.borderActive} shadow-sm ring-1 ring-black/10` 
                      : 'bg-white border-[#e6dfd5] hover:border-[#141414] text-[#141414] hover:shadow-xs'
                  }`}
                  style={{
                    borderTopColor: isSelected ? undefined : color,
                    borderTopWidth: isSelected ? '1px' : '3px',
                  }}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                    <span 
                      className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100'
                      }`}
                      style={{ color: isSelected ? '#ffffff' : color }}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full inline-block" 
                        style={{ backgroundColor: isSelected ? '#ffffff' : color }} 
                      />
                      0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${isSelected ? 'text-white' : 'text-[#737373]'}`}>
                      {count} {count > 1 ? 'projets' : 'projet'}
                      {isSelected && <Check size={11} className="text-white" />}
                    </span>
                  </div>

                  <div className={`text-[11px] font-mono font-bold uppercase tracking-wider leading-tight mb-2 ${isSelected ? 'text-white' : 'text-[#141414]'}`}>
                    {PROJECT_STATUS_LABELS[status]}
                  </div>

                  {/* Advancement accent bar */}
                  <div className={`h-1 w-full rounded-full overflow-hidden ${isSelected ? 'bg-white/30' : 'bg-neutral-100'}`}>
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        backgroundColor: isSelected ? '#ffffff' : color,
                        width: `${Math.min(100, Math.max(15, (count / (projects.length || 1)) * 100 * 2.5))}%` 
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────
          2. MAIN CONTENT WITH STICKY SLIM BAROMÈTRE ON DESKTOP
      ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        
        {/* Unified Search & Filters Bar */}
        <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-xs p-3 sm:p-3.5 mb-6 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5">
          
          {/* Search Field */}
          <div className="relative flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Rechercher par chantier, mot-clé, opérateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#888888]" />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Faceted Searchable Dropdowns */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono shrink-0">
            
            {/* Secteur */}
            <SearchableSelect
              placeholder="Secteurs"
              allOptionLabel="Tous les secteurs"
              value={selectedSector}
              onChange={setSelectedSector}
              options={sectors}
              allValue="all"
              searchPlaceholder="Filtrer un secteur..."
              lang="fr"
            />

            {/* Bailleur */}
            <SearchableSelect
              placeholder="Bailleurs"
              allOptionLabel="Tous les bailleurs"
              value={selectedBailleur}
              onChange={setSelectedBailleur}
              options={bailleurs}
              allValue="all"
              searchPlaceholder="Filtrer un bailleur..."
              lang="fr"
            />

            {/* Région */}
            <SearchableSelect
              placeholder="Régions"
              allOptionLabel="Toutes les 17 régions"
              value={selectedRegion}
              onChange={(val) => {
                setSelectedRegion(val);
                setSelectedProvince('all');
                setSelectedCommune('all');
              }}
              options={regions}
              allValue="all"
              searchPlaceholder="Rechercher une région..."
              lang="fr"
            />

            {/* Province */}
            <SearchableSelect
              placeholder="Provinces"
              allOptionLabel={
                selectedRegion !== 'all'
                  ? `Provinces de ${selectedRegion} (${availableProvinces.length})`
                  : 'Toutes les 47 provinces'
              }
              value={selectedProvince}
              onChange={(val) => {
                setSelectedProvince(val);
                setSelectedCommune('all');
                if (val !== 'all') {
                  const parentRegion = getRegionByProvinceName(val);
                  if (parentRegion && selectedRegion === 'all') {
                    setSelectedRegion(parentRegion);
                  }
                }
              }}
              options={availableProvinces}
              allValue="all"
              searchPlaceholder="Rechercher une province..."
              lang="fr"
            />

            {/* Commune / Ville */}
            <SearchableSelect
              placeholder="Communes"
              allOptionLabel={
                selectedProvince !== 'all'
                  ? `Communes (${availableCommunes.length})`
                  : selectedRegion !== 'all'
                  ? `Communes de ${selectedRegion} (${availableCommunes.length})`
                  : 'Toutes les 351 communes'
              }
              value={selectedCommune}
              onChange={setSelectedCommune}
              options={availableCommunes}
              allValue="all"
              searchPlaceholder="Rechercher une commune..."
              lang="fr"
            />

            {/* Statut (Présentation distincte) */}
            <SearchableSelect
              placeholder="Statut"
              allOptionLabel="Tous les statuts (6)"
              variant="status"
              statusColorMap={PROJECT_STATUS_COLORS}
              statusNumberMap={{
                annonce: '01',
                finance: '02',
                'en-construction': '03',
                'en-service': '04',
                suspendu: '05',
                annule: '06',
              }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={PROJECT_STATUS_ORDER.map((st) => ({
                value: st,
                label: PROJECT_STATUS_LABELS[st],
              }))}
              allValue="all"
              searchPlaceholder="Filtrer par statut..."
              autoSort={false}
              lang="fr"
            />

            {/* View Mode Toggles */}
            <div className="hidden sm:flex items-center border border-[#e6dfd5] p-0.5 bg-[#faf8f5] rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#0b4627] text-white shadow-xs' : 'text-[#737373] hover:text-[#141414]'}`}
                aria-label="Vue Grille"
                title="Affichage en fiches"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-[#0b4627] text-white shadow-xs' : 'text-[#737373] hover:text-[#141414]'}`}
                aria-label="Vue Tableau"
                title="Affichage en tableau"
              >
                <List size={14} />
              </button>
            </div>

            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="px-2 py-2 sm:py-1.5 text-[11px] font-mono text-[#c2410c] hover:underline flex items-center justify-center gap-1 font-semibold"
              >
                <RotateCcw size={11} />
                <span>Réinitialiser</span>
              </button>
            )}

          </div>

        </div>

        {/* Layout : Left Projects + Right Sticky Baromètre */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Projects Section (Col 8) */}
          <div className="lg:col-span-8 min-w-0 w-full">
            
            {/* Results Count Strip */}
            <div className="flex items-center justify-between text-xs font-mono text-[#555555] mb-4 px-1">
              <span>
                <strong className="text-[#141414]">{filteredProjects.length}</strong> chantier{filteredProjects.length > 1 ? 's' : ''} documenté{filteredProjects.length > 1 ? 's' : ''}
              </span>
              <span className="text-[#737373] text-[11px]">
                Audité le 18 août 2026
              </span>
            </div>
            
            {filteredProjects.length > 0 ? (
              viewMode === 'grid' ? (
                /* 2 or 3 Columns of Project Cards with Miniature Images */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                /* TABLE AUDIT VIEW WITH SCROLL SAFETY */
                <div className="mb-12 min-w-0 w-full">
                  <div className="sm:hidden text-[10px] font-mono text-[#737373] text-right mb-1">
                    ↔ Faites glisser le tableau pour voir toutes les colonnes
                  </div>
                  <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-xs overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs font-serif min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase text-[#737373]">
                        <th className="py-2.5 px-2.5 whitespace-nowrap">Statut</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Projet & Description</th>
                        <th className="py-2.5 px-2 whitespace-nowrap">Secteur</th>
                        <th className="py-2.5 px-2 whitespace-nowrap">Région</th>
                        <th className="py-2.5 px-2 whitespace-nowrap">Financement</th>
                        <th className="py-2.5 px-2 whitespace-nowrap hidden xl:table-cell">Vérification</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6dfd5]">
                      {filteredProjects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-[#faf8f5] transition-colors">
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <StatusBadge status={proj.currentStatus} size="sm" />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-8 sm:w-12 sm:h-9 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5] rounded-md">
                                <img 
                                  src={proj.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'} 
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link href={`/fr/tracker/projets/${proj.slug}`} className="font-bold text-[#141414] hover:text-[#0b4627] block leading-snug line-clamp-1">
                                  {proj.title}
                                </Link>
                                <span className="text-[10px] text-[#737373] line-clamp-1">{proj.description}</span>
                                <span className="text-[9px] font-mono text-[#888888] xl:hidden block">
                                  Audité le {new Date(proj.lastVerifiedAt).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 font-mono whitespace-nowrap text-[#555555]">
                            {proj.sector}
                          </td>
                          <td className="py-2.5 px-2 font-mono whitespace-nowrap text-[#555555]">
                            {proj.region}
                          </td>
                          <td className="py-2.5 px-2 font-mono whitespace-nowrap font-bold text-[#141414]">
                            {proj.amount ? `${proj.amount} ${proj.currency}` : '—'}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[11px] text-[#737373] whitespace-nowrap hidden xl:table-cell">
                            {new Date(proj.lastVerifiedAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <Link 
                              href={`/fr/tracker/projets/${proj.slug}`}
                              className="font-mono font-bold text-[#0b4627] hover:underline"
                            >
                              Fiche →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center bg-white border border-[#e6dfd5] rounded-xl shadow-xs mb-12 space-y-3">
                <Compass size={32} className="mx-auto text-[#888888]" />
                <h3 className="text-base font-bold font-serif text-[#141414]">Aucun chantier ne correspond aux filtres sélectionnés</h3>
                <p className="text-xs font-serif text-[#555555] max-w-sm mx-auto">
                  Ajustez les critères de recherche ou réinitialisez les filtres pour afficher l'ensemble des {projects.length} projets documentés.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#0b4627] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-xs hover:bg-[#072e1a] transition-colors"
                >
                  Afficher tous les projets
                </button>
              </div>
            )}

            {/* Protocol Note at Bottom of Projects List */}
            <div className="border border-[#e6dfd5] bg-[#faf8f5] rounded-xl shadow-xs p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-1">
                  Protocole d'audit documentaire
                </span>
                <h4 className="text-sm font-bold font-serif text-[#141414] mb-1">
                  Comment sont audités les chantiers du Tracker ?
                </h4>
                <p className="text-xs font-serif text-[#555555]">
                  Chaque transition de statut requiert un document contractuel officiel ou une observation directe de terrain à Ouagadougou et dans les 13 régions.
                </p>
              </div>
              <Link 
                href="/fr/methode"
                className="px-3 py-2 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors shrink-0"
              >
                Méthode →
              </Link>
            </div>

          </div>

          {/* ──────────────────────────────────────────────────────────
              SLIM, STICKY-ON-SCROLL BAROMÈTRE RELANCE SIDEBAR (Col 4)
          ────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
            
            {/* The Slim Sticky Baromètre RELANCE Widget */}
            <div className="border border-[#141414] bg-white rounded-xl shadow-xs p-5">
              
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#141414]">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block">
                    PND 2026–2030
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#141414]">
                    Baromètre RELANCE
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#f4eee3] px-1.5 py-0.5 rounded-md border border-[#e6dfd5]">
                  2026
                </span>
              </div>

              <p className="text-[11px] font-serif text-[#555555] mb-3 leading-tight">
                Indicateurs nationaux synchronisés avec les chantiers :
              </p>

              {/* 4 Compact Indicator Items */}
              <div className="space-y-2.5">
                {keyIndicators.map((ind) => (
                  <Link 
                    key={ind.id} 
                    href={`/fr/tracker/indicateurs/${ind.code}`}
                    className="block p-2.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg hover:border-[#141414] transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#737373]">{ind.code}</span>
                      <span className="text-xs font-mono font-bold text-[#0b4627] group-hover:underline">
                        {ind.currentValue} {ind.unit}
                      </span>
                    </div>

                    <div className="text-xs font-serif font-semibold text-[#141414] leading-snug truncate mb-1">
                      {ind.name}
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-[#737373]">
                      <span>Cible 2030 : {ind.target2030} {ind.unit}</span>
                      <span className="text-[#0b4627] font-semibold">Fiche →</span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link 
                href="/fr/tracker/indicateurs"
                className="mt-4 w-full py-2 bg-[#141414] hover:bg-[#0b4627] text-white text-[11px] font-mono font-bold uppercase tracking-wider text-center block rounded-lg shadow-xs transition-colors"
              >
                Consulter les 20 indicateurs →
              </Link>
            </div>

            {/* Quick Helper / Key Contacts */}
            <div className="border border-[#e6dfd5] bg-white rounded-xl shadow-xs p-4 text-xs font-serif">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-1">
                Contribuer au Tracker
              </span>
              <p className="text-[#555555] text-[11px] leading-relaxed mb-2">
                Vous disposez d'un document ou d'un constat physique sur un chantier ?
              </p>
              <Link href="/fr/contact" className="font-mono text-xs font-bold text-[#0b4627] hover:underline block">
                Transmettre une source →
              </Link>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
