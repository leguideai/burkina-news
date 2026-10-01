"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Filter, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft,
  Briefcase,
  Landmark,
  MapPin,
  AlertTriangle,
  Loader2,
  Building2,
  Globe2,
  Layers,
  Sparkles
} from 'lucide-react';
import { TrackerSector, TrackerBailleur, Project } from '@/data/types';
import { trackerFiltersApi } from '@/lib/api/trackerFilters';
import { trackerApi } from '@/lib/api/tracker';
import { mapProjectDTOToProject } from '@/lib/api/mappers';
import { useToast } from '@/components/admin/Toast';
import { 
  BURKINA_REGIONS_17, 
  BURKINA_PROVINCES_47, 
  BURKINA_COMMUNES_351, 
  getProvincesByRegion, 
  getCommunesByCondition 
} from '@/data/mock/referentiel-territoire';
import Tooltip from '@/components/ui/Tooltip';

export default function AdminTrackerFiltersPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sectors' | 'bailleurs' | 'territories'>('sectors');
  const [searchQuery, setSearchQuery] = useState('');

  // Data
  const [sectors, setSectors] = useState<TrackerSector[]>([]);
  const [bailleurs, setBailleurs] = useState<TrackerBailleur[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Modals state
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<TrackerSector | null>(null);
  const [sectorFormData, setSectorFormData] = useState({
    name: '',
    nameEn: '',
    code: '',
    description: '',
  });

  const [isBailleurModalOpen, setIsBailleurModalOpen] = useState(false);
  const [editingBailleur, setEditingBailleur] = useState<TrackerBailleur | null>(null);
  const [bailleurFormData, setBailleurFormData] = useState({
    name: '',
    code: '',
    type: 'multilateral',
    country: '',
    description: '',
  });

  const [isDeleting, setIsDeleting] = useState<{ type: 'sector' | 'bailleur'; id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Territory view filter
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  // Load data
  const loadFilters = async () => {
    try {
      setLoading(true);
      const [filterRes, projRes] = await Promise.all([
        trackerFiltersApi.getFilters(),
        trackerApi.listProjects({ limit: 100 }).catch(() => ({ projects: [] })),
      ]);

      setSectors(filterRes.rawSectors || []);
      setBailleurs(filterRes.rawBailleurs || []);

      if (projRes.projects && projRes.projects.length > 0) {
        setProjects(projRes.projects.map(mapProjectDTOToProject));
      } else {
        const fb = await fetch('/api/admin/data');
        if (fb.ok) {
          const d = await fb.json();
          setProjects(d.projects || []);
        }
      }
    } catch (err: any) {
      error('Erreur de chargement', err.message || 'Impossible de charger les filtres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  // Compute usage counts from projects
  const sectorUsageCount = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach(p => {
      if (p.sector) {
        map[p.sector] = (map[p.sector] || 0) + 1;
      }
    });
    return map;
  }, [projects]);

  const bailleurUsageCount = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach(p => {
      if (p.bailleur) {
        map[p.bailleur] = (map[p.bailleur] || 0) + 1;
      }
    });
    return map;
  }, [projects]);

  // Alphabetically sorted & filtered sectors
  const sortedFilteredSectors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return [...sectors]
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      .filter(s => !q || s.name.toLowerCase().includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q)) || (s.description && s.description.toLowerCase().includes(q)));
  }, [sectors, searchQuery]);

  // Alphabetically sorted & filtered bailleurs
  const sortedFilteredBailleurs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return [...bailleurs]
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      .filter(b => !q || b.name.toLowerCase().includes(q) || (b.country && b.country.toLowerCase().includes(q)) || (b.description && b.description.toLowerCase().includes(q)));
  }, [bailleurs, searchQuery]);

  // Territory items for inspection
  const filteredProvinces = useMemo(() => {
    if (selectedRegion === 'all') return BURKINA_PROVINCES_47;
    return getProvincesByRegion(selectedRegion);
  }, [selectedRegion]);

  const filteredCommunes = useMemo(() => {
    return BURKINA_COMMUNES_351.filter(c => {
      if (selectedRegion !== 'all' && c.region !== selectedRegion) return false;
      if (selectedProvince !== 'all' && c.province !== selectedProvince) return false;
      return true;
    }).sort((a, b) => a.commune.localeCompare(b.commune, 'fr'));
  }, [selectedRegion, selectedProvince]);

  // Handle Sector Modal Open
  const handleOpenSectorModal = (sector?: TrackerSector) => {
    if (sector) {
      setEditingSector(sector);
      setSectorFormData({
        name: sector.name,
        nameEn: sector.nameEn || sector.name,
        code: sector.code,
        description: sector.description || '',
      });
    } else {
      setEditingSector(null);
      setSectorFormData({
        name: '',
        nameEn: '',
        code: '',
        description: '',
      });
    }
    setIsSectorModalOpen(true);
  };

  // Handle Save Sector
  const handleSaveSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorFormData.name.trim()) {
      warning('Champ obligatoire', 'Veuillez saisir le nom du secteur.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingSector) {
        const updated = await trackerFiltersApi.updateSector(editingSector.id, sectorFormData);
        setSectors(prev => prev.map(s => s.id === updated.id ? updated : s));
        success('Secteur mis à jour', `Le secteur « ${updated.name} » a été modifié.`);
      } else {
        const created = await trackerFiltersApi.createSector(sectorFormData);
        setSectors(prev => [...prev, created]);
        success('Secteur créé', `Le secteur « ${created.name} » est maintenant disponible dans les filtres.`);
      }
      setIsSectorModalOpen(false);
    } catch (err: any) {
      error('Erreur', err.message || 'Impossible d\'enregistrer le secteur');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Bailleur Modal Open
  const handleOpenBailleurModal = (bailleur?: TrackerBailleur) => {
    if (bailleur) {
      setEditingBailleur(bailleur);
      setBailleurFormData({
        name: bailleur.name,
        code: bailleur.code,
        type: bailleur.type || 'multilateral',
        country: bailleur.country || '',
        description: bailleur.description || '',
      });
    } else {
      setEditingBailleur(null);
      setBailleurFormData({
        name: '',
        code: '',
        type: 'multilateral',
        country: '',
        description: '',
      });
    }
    setIsBailleurModalOpen(true);
  };

  // Handle Save Bailleur
  const handleSaveBailleur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bailleurFormData.name.trim()) {
      warning('Champ obligatoire', 'Veuillez saisir le nom du bailleur.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingBailleur) {
        const updated = await trackerFiltersApi.updateBailleur(editingBailleur.id, bailleurFormData);
        setBailleurs(prev => prev.map(b => b.id === updated.id ? updated : b));
        success('Bailleur mis à jour', `Le bailleur « ${updated.name} » a été modifié.`);
      } else {
        const created = await trackerFiltersApi.createBailleur(bailleurFormData);
        setBailleurs(prev => [...prev, created]);
        success('Bailleur créé', `Le bailleur « ${created.name} » est maintenant disponible dans les filtres.`);
      }
      setIsBailleurModalOpen(false);
    } catch (err: any) {
      error('Erreur', err.message || 'Impossible d\'enregistrer le bailleur');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!isDeleting) return;
    try {
      setSubmitting(true);
      if (isDeleting.type === 'sector') {
        await trackerFiltersApi.deleteSector(isDeleting.id);
        setSectors(prev => prev.filter(s => s.id !== isDeleting.id));
        success('Suppression réussie', `Le secteur « ${isDeleting.name} » a été supprimé des filtres.`);
      } else {
        await trackerFiltersApi.deleteBailleur(isDeleting.id);
        setBailleurs(prev => prev.filter(b => b.id !== isDeleting.id));
        success('Suppression réussie', `Le bailleur « ${isDeleting.name} » a été supprimé des filtres.`);
      }
      setIsDeleting(null);
    } catch (err: any) {
      error('Erreur de suppression', err.message || 'Impossible de supprimer cet élément.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ─── Header & Breadcrumb ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-mono">
            <Link href="/admin/projets" className="text-[#0b4627] hover:underline flex items-center gap-1 font-semibold">
              <ArrowLeft size={13} />
              <span>Chantiers du Tracker</span>
            </Link>
            <span className="text-[#888888]">/</span>
            <span className="text-[#737373]">Référentiel des Filtres</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414] flex items-center gap-3">
            <Filter className="text-[#0b4627]" size={28} />
            <span>Filtres Dynamiques du Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#555555] mt-1">
            Gérez directement les options proposées aux visiteurs (Secteurs, Bailleurs, Circonscriptions). Tous les menus déroulants sont automatiquement synchronisés et ordonnés par ordre alphabétique.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/projets"
            className="px-3.5 py-2 bg-white border border-[#141414] text-[#141414] hover:bg-[#faf8f5] text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Retour aux Chantiers</span>
          </Link>
          {activeTab === 'sectors' && (
            <button
              onClick={() => handleOpenSectorModal()}
              className="px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Nouveau Secteur</span>
            </button>
          )}
          {activeTab === 'bailleurs' && (
            <button
              onClick={() => handleOpenBailleurModal()}
              className="px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Nouveau Bailleur</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Navigation Tabs ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e6dfd5] pb-px">
        <button
          onClick={() => { setActiveTab('sectors'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 -mb-px ${
            activeTab === 'sectors'
              ? 'border-[#0b4627] text-[#0b4627] bg-white'
              : 'border-transparent text-[#737373] hover:text-[#141414]'
          }`}
        >
          <Briefcase size={14} />
          <span>Secteurs d'intervention ({sectors.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('bailleurs'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 -mb-px ${
            activeTab === 'bailleurs'
              ? 'border-[#0b4627] text-[#0b4627] bg-white'
              : 'border-transparent text-[#737373] hover:text-[#141414]'
          }`}
        >
          <Landmark size={14} />
          <span>Bailleurs de fonds ({bailleurs.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('territories'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 -mb-px ${
            activeTab === 'territories'
              ? 'border-[#0b4627] text-[#0b4627] bg-white'
              : 'border-transparent text-[#737373] hover:text-[#141414]'
          }`}
        >
          <MapPin size={14} />
          <span>Circonscriptions Territoriales (17 Régions · 47 Provinces · 351 Communes)</span>
        </button>
      </div>

      {/* ─── Search Bar (for Sectors & Bailleurs) ──────────────────── */}
      {activeTab !== 'territories' && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={activeTab === 'sectors' ? 'Rechercher un secteur...' : 'Rechercher un bailleur...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e6dfd5] rounded-lg text-xs font-mono text-[#141414] focus:outline-none focus:border-[#0b4627]"
            />
            <Search className="absolute left-3 top-2.5 text-[#888888]" size={14} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#888888] hover:text-[#141414]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="text-[11px] font-mono text-[#737373]">
            Ordre d'affichage : <strong>Alphabétique (A ➔ Z)</strong>
          </div>
        </div>
      )}

      {/* ─── TAB 1 : SECTEURS D'INTERVENTION ────────────────────────── */}
      {activeTab === 'sectors' && (
        <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-serif">
              <thead>
                <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase text-[#737373]">
                  <th className="py-3 px-4">Ordre</th>
                  <th className="py-3 px-4">Libellé Officiel (FR)</th>
                  <th className="py-3 px-4">Libellé Anglais (EN)</th>
                  <th className="py-3 px-4">Code Système</th>
                  <th className="py-3 px-4">Chantiers Liés</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {sortedFilteredSectors.map((sector, idx) => {
                  const usage = sectorUsageCount[sector.name] || 0;
                  return (
                    <tr key={sector.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#737373] text-[11px]">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#141414] font-serif text-sm">
                        {sector.name}
                      </td>
                      <td className="py-3 px-4 text-[#555555] italic">
                        {sector.nameEn || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#0b4627] bg-[#f4eee3]/40 px-2 py-0.5 rounded">
                        {sector.code}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {usage > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#0b4627] border border-green-200">
                            {usage} chantier{usage > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#888888] font-mono">0 chantier</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#666666] text-xs max-w-xs truncate" title={sector.description}>
                        {sector.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenSectorModal(sector)}
                            className="p-1.5 text-[#555555] hover:text-[#0b4627] hover:bg-neutral-100 rounded-md transition-colors"
                            title="Modifier ce secteur"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setIsDeleting({ type: 'sector', id: sector.id, name: sector.name })}
                            className="p-1.5 text-[#555555] hover:text-[#c2410c] hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer ce secteur"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sortedFilteredSectors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs font-serif text-[#737373]">
                      Aucun secteur ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2 : BAILLEURS DE FONDS ─────────────────────────────── */}
      {activeTab === 'bailleurs' && (
        <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-serif">
              <thead>
                <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase text-[#737373]">
                  <th className="py-3 px-4">Ordre</th>
                  <th className="py-3 px-4">Nom Officiel du Bailleur</th>
                  <th className="py-3 px-4">Nature Juridique</th>
                  <th className="py-3 px-4">Siège / Pays</th>
                  <th className="py-3 px-4">Chantiers Financés</th>
                  <th className="py-3 px-4">Détails & Mandat</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {sortedFilteredBailleurs.map((bailleur, idx) => {
                  const usage = bailleurUsageCount[bailleur.name] || 0;
                  return (
                    <tr key={bailleur.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#737373] text-[11px]">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#141414] font-serif text-sm">
                        {bailleur.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] capitalize text-[#555555]">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded-md border border-[#e6dfd5]">
                          {bailleur.type || 'multilateral'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#555555]">
                        {bailleur.country || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {usage > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#0b4627] border border-green-200">
                            {usage} chantier{usage > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#888888] font-mono">0 chantier</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#666666] text-xs max-w-xs truncate" title={bailleur.description}>
                        {bailleur.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenBailleurModal(bailleur)}
                            className="p-1.5 text-[#555555] hover:text-[#0b4627] hover:bg-neutral-100 rounded-md transition-colors"
                            title="Modifier ce bailleur"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setIsDeleting({ type: 'bailleur', id: bailleur.id, name: bailleur.name })}
                            className="p-1.5 text-[#555555] hover:text-[#c2410c] hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer ce bailleur"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sortedFilteredBailleurs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs font-serif text-[#737373]">
                      Aucun bailleur ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3 : TERRITOIRES & CIRCONSCRIPTIONS ─────────────────── */}
      {activeTab === 'territories' && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#e6dfd5] rounded-xl shadow-xs flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#737373] uppercase font-bold">Région :</span>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedProvince('all');
                }}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg font-serif text-[#141414] focus:outline-none"
              >
                <option value="all">Toutes les 17 régions ({BURKINA_REGIONS_17.length})</option>
                {BURKINA_REGIONS_17.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#737373] uppercase font-bold">Province :</span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg font-serif text-[#141414] focus:outline-none"
              >
                <option value="all">Toutes les provinces ({filteredProvinces.length})</option>
                {filteredProvinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-[#0b4627] font-bold">
              {filteredCommunes.length} communes et départements répertoriés
            </div>
          </div>

          <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-xs p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-4 border-b border-[#141414] flex justify-between items-center">
              <span>Référentiel Administratif Officiel du Faso</span>
              <span className="text-[#0b4627] font-semibold text-[11px]">Décret officiel · 351 Communes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredCommunes.map((commune) => (
                <div 
                  key={`${commune.region}-${commune.province}-${commune.commune}`}
                  className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-serif hover:border-[#0b4627] transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#141414]">{commune.commune}</span>
                    <span className="text-[10px] font-mono text-[#737373] uppercase px-1.5 py-0.2 bg-white rounded border border-[#e6dfd5]">
                      {commune.typeCommune === 'urbaine à statut particulier' ? 'Capitale' : commune.typeCommune}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#555555]">
                    {commune.province} · <strong className="text-[#0b4627]">{commune.region}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL : AJOUT / ÉDITION DE SECTEUR ──────────────────────── */}
      {isSectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#141414] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-lg text-[#141414] flex items-center gap-2">
                <Briefcase className="text-[#0b4627]" size={20} />
                <span>{editingSector ? 'Modifier le Secteur' : 'Nouveau Secteur d\'Intervention'}</span>
              </h3>
              <button 
                onClick={() => setIsSectorModalOpen(false)}
                className="text-[#737373] hover:text-[#141414] p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSector} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Nom officiel en français *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Énergie & Électrification"
                  value={sectorFormData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSectorFormData(prev => ({
                      ...prev,
                      name: val,
                      code: prev.code || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    }));
                  }}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-sm font-serif text-[#141414] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Libellé en anglais (English translation)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Energy & Electrification"
                  value={sectorFormData.nameEn}
                  onChange={(e) => setSectorFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-sm font-serif text-[#141414] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Code système (identifiant slug)
                </label>
                <input
                  type="text"
                  placeholder="energie-electrification"
                  value={sectorFormData.code}
                  onChange={(e) => setSectorFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-mono text-[#0b4627] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Périmètre & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Précisez le type d'infrastructures couvertes par ce secteur..."
                  value={sectorFormData.description}
                  onChange={(e) => setSectorFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-serif text-[#141414] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSectorModalOpen(false)}
                  className="px-4 py-2 border border-[#e6dfd5] text-[#737373] hover:text-[#141414] rounded-lg font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white rounded-lg font-bold uppercase tracking-wider text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingSector ? 'Sauvegarder' : 'Créer le Secteur'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL : AJOUT / ÉDITION DE BAILLEUR ─────────────────────── */}
      {isBailleurModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#141414] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-lg text-[#141414] flex items-center gap-2">
                <Landmark className="text-[#0b4627]" size={20} />
                <span>{editingBailleur ? 'Modifier le Bailleur' : 'Nouveau Bailleur de Fonds'}</span>
              </h3>
              <button 
                onClick={() => setIsBailleurModalOpen(false)}
                className="text-[#737373] hover:text-[#141414] p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBailleur} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Nom officiel de l'institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Banque Ouest Africaine de Développement (BOAD)"
                  value={bailleurFormData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBailleurFormData(prev => ({
                      ...prev,
                      name: val,
                      code: prev.code || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    }));
                  }}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-sm font-serif text-[#141414] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#141414] font-bold uppercase mb-1">
                    Nature Juridique
                  </label>
                  <select
                    value={bailleurFormData.type}
                    onChange={(e) => setBailleurFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-mono text-[#141414] focus:outline-none"
                  >
                    <option value="multilateral">Multilatéral (Banque de développement)</option>
                    <option value="etatique">Étatique (Budget National du Faso)</option>
                    <option value="bilateral">Bilatéral (Coopération État à État)</option>
                    <option value="prive">Secteur Privé / PPP</option>
                    <option value="autre">Autre / Fonds Spécial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#141414] font-bold uppercase mb-1">
                    Pays / Siège
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Togo (UEMOA)"
                    value={bailleurFormData.country}
                    onChange={(e) => setBailleurFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-mono text-[#141414] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Code système
                </label>
                <input
                  type="text"
                  placeholder="boad"
                  value={bailleurFormData.code}
                  onChange={(e) => setBailleurFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-mono text-[#0b4627] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#141414] font-bold uppercase mb-1">
                  Mandat & Instruments de financement
                </label>
                <textarea
                  rows={3}
                  placeholder="Précisez le type de concours financier (prêts concessionnels, dons, garanties)..."
                  value={bailleurFormData.description}
                  onChange={(e) => setBailleurFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-xs font-serif text-[#141414] focus:outline-none focus:border-[#0b4627]"
                />
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBailleurModalOpen(false)}
                  className="px-4 py-2 border border-[#e6dfd5] text-[#737373] hover:text-[#141414] rounded-lg font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white rounded-lg font-bold uppercase tracking-wider text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingBailleur ? 'Sauvegarder' : 'Créer le Bailleur'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL : CONFIRMATION DE SUPPRESSION ────────────────────── */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#c2410c] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#c2410c]">
              <AlertTriangle size={24} />
              <h3 className="font-serif font-bold text-lg text-[#141414]">Confirmer la suppression</h3>
            </div>
            <p className="text-xs font-serif text-[#555555] leading-relaxed">
              Êtes-vous sûr de vouloir retirer définitivement <strong>« {isDeleting.name} »</strong> des options de filtrage du Tracker ?
            </p>
            <div className="pt-2 flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setIsDeleting(null)}
                className="px-4 py-2 border border-[#e6dfd5] text-[#737373] hover:text-[#141414] rounded-lg font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#c2410c] hover:bg-red-800 text-white rounded-lg font-bold uppercase shadow-xs flex items-center gap-1.5"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
