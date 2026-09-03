'use client';

import { useState, useMemo } from 'react';
import { getProjects, getProjectStats } from '@/data/mock/projects';
import { getKeyIndicators } from '@/data/mock/indicators';
import ProjectCard from '@/components/tracker/ProjectCard';
import StatusBadge from '@/components/tracker/StatusBadge';
import { 
  PROJECT_STATUS_LABELS_EN, 
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
  TrendingUp,
  MapPin,
  Clock,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function TrackerPageEn() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const enProjects = useMemo(() => getProjects('en'), []);
  const stats = getProjectStats();
  const keyIndicators = useMemo(() => getKeyIndicators('en'), []);

  const sectors = useMemo(() => Array.from(new Set(enProjects.map(p => p.sector))), [enProjects]);
  const regions = useMemo(() => Array.from(new Set(enProjects.map(p => p.region))), [enProjects]);

  const filteredProjects = useMemo(() => {
    return enProjects.filter(p => {
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
  }, [enProjects, search, selectedStatus, selectedSector, selectedRegion]);

  const hasActiveFilters = search || selectedStatus !== 'all' || selectedSector !== 'all' || selectedRegion !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSelectedSector('all');
    setSelectedRegion('all');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* ──────────────────────────────────────────────────────────
          1. HEADER & MASTHEAD
      ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">The Tracker</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 bg-[#0b4627]"></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627]">
                  Public Verification Registry
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                The Tracker: Major National Projects
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="bg-[#faf8f5] border border-[#e6dfd5] px-4 py-2 text-xs font-mono">
                <span className="text-[#737373] block text-[10px] uppercase">Registry Status</span>
                <span className="font-bold text-[#0b4627]">Active Monitoring</span> · {enProjects.length} documented projects
              </div>
              
              <Link
                href="/en/methode"
                className="text-xs font-serif text-[#0b4627] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Verification protocol</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Status Progression Bar */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#555555]">
              <span className="uppercase font-semibold">The 6 Lifecycle Statuses :</span>
              <span className="text-[11px] text-[#737373]">From announcement to verified impact</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PROJECT_STATUS_ORDER.map((statusKey) => {
                const count = stats.byStatus[statusKey] || 0;
                const isSelected = selectedStatus === statusKey;
                const label = PROJECT_STATUS_LABELS_EN[statusKey];

                return (
                  <button
                    key={statusKey}
                    onClick={() => setSelectedStatus(isSelected ? 'all' : statusKey)}
                    className={`p-3 text-left border transition-all ${
                      isSelected 
                        ? 'bg-[#0b4627] text-white border-[#0b4627] shadow-sm' 
                        : 'bg-[#faf8f5] border-[#e6dfd5] hover:border-[#141414] text-[#141414]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${isSelected ? 'text-[#ffd8a8]' : 'text-[#737373]'}`}>
                        {label}
                      </span>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                        {count}
                      </span>
                    </div>
                    <div className={`h-1 w-full rounded-full ${isSelected ? 'bg-white/30' : 'bg-neutral-200'}`}>
                      <div 
                        className={`h-full rounded-full ${isSelected ? 'bg-white' : 'bg-[#0b4627]'}`}
                        style={{ width: `${Math.min(100, (count / (enProjects.length || 1)) * 100 * 3)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────
          2. MAIN CONTENT & SIDEBAR
      ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white border border-[#e6dfd5] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-4 border-b border-[#e6dfd5]">
                
                {/* Search */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by project name, description or keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]"
                  />
                  <Search size={14} className="absolute left-3 top-2.5 text-[#888888]" />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-2.5 text-[#888888] hover:text-[#141414]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 border border-[#e6dfd5] p-0.5 bg-[#faf8f5] shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#0b4627]' : 'text-[#737373] hover:text-[#141414]'}`}
                    title="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-[#0b4627]' : 'text-[#737373] hover:text-[#141414]'}`}
                    title="Table view"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                {/* Sector */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#737373] mb-1">
                    Sector
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full p-2 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  >
                    <option value="all">All sectors</option>
                    {sectors.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#737373] mb-1">
                    Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full p-2 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  >
                    <option value="all">All regions</option>
                    {regions.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#737373] mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  >
                    <option value="all">All statuses</option>
                    {PROJECT_STATUS_ORDER.map(s => (
                      <option key={s} value={s}>{PROJECT_STATUS_LABELS_EN[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filters summary */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-[#e6dfd5] text-xs font-serif">
                  <div className="flex items-center gap-2">
                    <span className="text-[#737373]">Active filters:</span>
                    {selectedSector !== 'all' && (
                      <span className="bg-[#f4eee3] text-[#0b4627] font-mono text-[10px] px-2 py-0.5 border border-[#e6dfd5]">
                        Sector: {selectedSector}
                      </span>
                    )}
                    {selectedRegion !== 'all' && (
                      <span className="bg-[#f4eee3] text-[#0b4627] font-mono text-[10px] px-2 py-0.5 border border-[#e6dfd5]">
                        Region: {selectedRegion}
                      </span>
                    )}
                    {selectedStatus !== 'all' && (
                      <span className="bg-[#f4eee3] text-[#0b4627] font-mono text-[10px] px-2 py-0.5 border border-[#e6dfd5]">
                        Status: {PROJECT_STATUS_LABELS_EN[selectedStatus as ProjectStatus]}
                      </span>
                    )}
                    {search && (
                      <span className="bg-[#f4eee3] text-[#0b4627] font-mono text-[10px] px-2 py-0.5 border border-[#e6dfd5]">
                        “{search}”
                      </span>
                    )}
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-mono text-[#c2410c] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    <span>Reset filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Results Count Strip */}
            <div className="flex items-center justify-between text-xs font-mono text-[#555555] px-1">
              <span>
                Showing <strong className="text-[#141414]">{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''} out of <strong className="text-[#141414]">{enProjects.length}</strong> documented (Target: 60)
              </span>
              <span className="text-[#737373] text-[11px]">
                Updated weekly
              </span>
            </div>

            {/* Projects Presentation: Grid or Table */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white border border-[#e6dfd5] p-12 text-center">
                <Compass className="mx-auto text-[#737373] mb-3" size={36} />
                <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
                  No projects match your criteria
                </h3>
                <p className="text-xs font-serif text-[#555555] max-w-md mx-auto mb-4">
                  Try adjusting your keywords or clearing selected filters to explore our documented projects.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#0b4627] text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#072e1a] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} lang="en" />
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white border border-[#e6dfd5] overflow-x-auto">
                <table className="w-full text-left text-xs font-serif">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#141414] font-mono text-[10px] uppercase text-[#737373]">
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-3">Sector</th>
                      <th className="py-3 px-3">Region</th>
                      <th className="py-3 px-3">Budget</th>
                      <th className="py-3 px-3">Last verification</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dfd5]">
                    {filteredProjects.map((project) => {
                      const imageSrc = project.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80';
                      return (
                        <tr key={project.id} className="hover:bg-[#fcfaf7] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#141414]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-8 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                                <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                              </div>
                              <Link 
                                href={`/en/tracker/projets/${project.slug}`}
                                className="hover:text-[#0b4627] transition-colors line-clamp-2"
                              >
                                {project.title}
                              </Link>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#555555]">{project.sector}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#555555]">{project.region}</td>
                          <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#141414]">
                            {project.amount ? `${project.amount} ${project.currency}` : '—'}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#737373]">
                            {new Date(project.lastVerifiedAt).toLocaleDateString('en-US')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <StatusBadge status={project.currentStatus} size="sm" lang="en" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* Sidebar (Col 4) : Sticky RELANCE Barometer */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            
            {/* RELANCE Barometer Card */}
            <div className="bg-white border-2 border-[#141414] p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#141414]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0b4627]"></span>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                    RELANCE Barometer
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#0b4627] font-semibold">
                  2026–2030
                </span>
              </div>

              <p className="text-xs font-serif text-[#555555] mb-6 leading-relaxed">
                Key quantitative targets from the National Development Plan (PND RELANCE) measured against independent data.
              </p>

              <div className="space-y-4">
                {keyIndicators.slice(0, 4).map((ind) => (
                  <div key={ind.code} className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono uppercase text-[#737373]">
                        {ind.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#0b4627]">
                        Target 2030: {ind.target2030} {ind.unit}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#141414] mb-1">
                      <Link href={`/en/tracker/indicateurs/${ind.code}`} className="hover:underline">
                        {ind.name}
                      </Link>
                    </h4>

                    <div className="flex justify-between items-baseline pt-1">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-xl font-bold text-[#141414]">{ind.currentValue}</span>
                        <span className="text-xs text-[#555555]">{ind.unit}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#0b4627]">
                        {ind.trend === 'up' ? '↗ Progressing' : ind.trend === 'down' ? '↘ Retracting' : '→ Stable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/en/tracker/indicateurs"
                className="mt-6 w-full py-2.5 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider text-center block transition-colors"
              >
                All 8 National Indicators →
              </Link>
            </div>

            {/* Verification Protocol Box */}
            <div className="bg-[#f4eee3] border border-[#e6dfd5] p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
                Documentary Standards
              </span>
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-2">
                How We Track Projects
              </h4>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-4">
                No project transitions to the next status without a verifiable primary source: ministerial decree, funder audit report, or direct visual field confirmation.
              </p>
              <Link
                href="/en/methode"
                className="font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
              >
                Read our methodology <ArrowRight size={12} />
              </Link>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
}
