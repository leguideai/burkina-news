'use client';

import { useState, useMemo } from 'react';
import { projects, getProjectStats } from '@/data/mock/projects';
import { getKeyIndicators } from '@/data/mock/indicators';
import ProjectCard from '@/components/tracker/ProjectCard';
import StatusBadge from '@/components/tracker/StatusBadge';
import { 
  PROJECT_STATUS_LABELS, 
  PROJECT_STATUS_ORDER,
  ProjectStatus 
} from '@/data/types';
import { 
  Search, 
  X, 
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

export default function TrackerPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const stats = getProjectStats();
  const keyIndicators = getKeyIndicators();

  const sectors = useMemo(() => Array.from(new Set(projects.map(p => p.sector))), []);
  const regions = useMemo(() => Array.from(new Set(projects.map(p => p.region))), []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedStatus !== 'all' && p.currentStatus !== selectedStatus) {
        return false;
      }
      if (selectedSector !== 'all' && p.sector !== selectedSector) {
        return false;
      }
      if (selectedRegion !== 'all' && p.region !== selectedRegion) {
        return false;
      }
      return true;
    });
  }, [search, selectedStatus, selectedSector, selectedRegion]);

  const hasActiveFilters = search || selectedStatus !== 'all' || selectedSector !== 'all' || selectedRegion !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSelectedSector('all');
    setSelectedRegion('all');
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5">
            {PROJECT_STATUS_ORDER.map((status, idx) => {
              const count = stats.byStatus[status] || 0;
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
                  className={`p-2.5 border text-left transition-colors flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#0b4627] text-white border-[#0b4627] shadow-xs' 
                      : 'bg-[#faf8f5] border-[#e6dfd5] hover:border-[#141414] text-[#141414]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className={isSelected ? 'text-[#ffd8a8]' : 'text-[#737373]'}>
                      0{idx + 1}
                    </span>
                    <span className="font-bold">{count} projet{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider leading-tight">
                    {PROJECT_STATUS_LABELS[status]}
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
        <div className="bg-white border border-[#e6dfd5] p-3.5 sm:p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Rechercher par nom de chantier, région, bailleur, maître d'ouvrage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 sm:top-2 text-[#888888]" />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 sm:top-2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Faceted Dropdowns (Full-width grid on mobile, inline on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-2 text-xs font-mono w-full lg:w-auto">
            
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full lg:w-auto px-2.5 py-2 sm:py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            >
              <option value="all">Tous les secteurs</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full lg:w-auto px-2.5 py-2 sm:py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            >
              <option value="all">Toutes les régions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full lg:w-auto px-2.5 py-2 sm:py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            >
              <option value="all">Tous les statuts (6)</option>
              {PROJECT_STATUS_ORDER.map(st => (
                <option key={st} value={st}>{PROJECT_STATUS_LABELS[st]}</option>
              ))}
            </select>

            {/* View Mode Toggles */}
            <div className="hidden sm:flex items-center border border-[#e6dfd5] p-0.5 bg-[#faf8f5]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-white text-[#0b4627] shadow-xs' : 'text-[#737373] hover:text-[#141414]'}`}
                aria-label="Vue Grille"
                title="Affichage en fiches"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-white text-[#0b4627] shadow-xs' : 'text-[#737373] hover:text-[#141414]'}`}
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
          <div className="lg:col-span-8">
            
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
                <div className="mb-12">
                  <div className="sm:hidden text-[10px] font-mono text-[#737373] text-right mb-1">
                    ↔ Faites glisser le tableau pour voir toutes les colonnes
                  </div>
                  <div className="bg-white border border-[#e6dfd5] overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left border-collapse text-xs font-serif">
                    <thead>
                      <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase text-[#737373]">
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3">Projet & Description</th>
                        <th className="py-2.5 px-3">Secteur</th>
                        <th className="py-2.5 px-3">Région</th>
                        <th className="py-2.5 px-3">Financement</th>
                        <th className="py-2.5 px-3">Vérification</th>
                        <th className="py-2.5 px-3 text-right">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6dfd5]">
                      {filteredProjects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-[#faf8f5] transition-colors">
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <StatusBadge status={proj.currentStatus} size="sm" />
                          </td>
                          <td className="py-2.5 px-3 max-w-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-9 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                                <img 
                                  src={proj.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'} 
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link href={`/fr/tracker/projets/${proj.slug}`} className="font-bold text-[#141414] hover:text-[#0b4627] block leading-snug truncate">
                                  {proj.title}
                                </Link>
                                <span className="text-[10px] text-[#737373] line-clamp-1">{proj.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap text-[#555555]">
                            {proj.sector}
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap text-[#555555]">
                            {proj.region}
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap font-bold text-[#141414]">
                            {proj.amount ? `${proj.amount} ${proj.currency}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#737373] whitespace-nowrap">
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
              <div className="p-12 text-center bg-white border border-[#e6dfd5] mb-12 space-y-3">
                <Compass size={32} className="mx-auto text-[#888888]" />
                <h3 className="text-base font-bold font-serif text-[#141414]">Aucun chantier ne correspond aux filtres sélectionnés</h3>
                <p className="text-xs font-serif text-[#555555] max-w-sm mx-auto">
                  Ajustez les critères de recherche ou réinitialisez les filtres pour afficher l'ensemble des {projects.length} projets documentés.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#0b4627] text-white text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Afficher tous les projets
                </button>
              </div>
            )}

            {/* Protocol Note at Bottom of Projects List */}
            <div className="border border-[#e6dfd5] bg-[#faf8f5] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                className="px-3 py-2 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                Méthode →
              </Link>
            </div>

          </div>

          {/* ──────────────────────────────────────────────────────────
              SLIM, STICKY-ON-SCROLL BAROMÈTRE RELANCE SIDEBAR (Col 4 / 3)
          ────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 space-y-6">
            
            {/* The Slim Sticky Baromètre RELANCE Widget */}
            <div className="border border-[#141414] bg-white p-5 shadow-xs">
              
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#141414]">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block">
                    PND 2026–2030
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#141414]">
                    Baromètre RELANCE
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#f4eee3] px-1.5 py-0.5 border border-[#e6dfd5]">
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
                    className="block p-2.5 bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#141414] transition-colors group"
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
                className="mt-4 w-full py-2 bg-[#141414] hover:bg-[#0b4627] text-white text-[11px] font-mono font-bold uppercase tracking-wider text-center block transition-colors"
              >
                Consulter les 20 indicateurs →
              </Link>
            </div>

            {/* Quick Helper / Key Contacts */}
            <div className="border border-[#e6dfd5] bg-white p-4 text-xs font-serif">
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
