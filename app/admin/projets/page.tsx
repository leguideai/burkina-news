"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Construction, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  ShieldCheck, 
  History, 
  ArrowRight,
  Link2
} from 'lucide-react';
import { 
  Project, 
  ProjectStatus, 
  PROJECT_STATUS_LABELS, 
  PROJECT_STATUS_COLORS, 
  PROJECT_STATUS_ORDER,
  CategoryCode 
} from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

const SECTORS = [
  'Énergie',
  'Transport',
  'Eau & Assainissement',
  'Mines',
  'Santé',
  'Éducation',
  'Agriculture & Irrigation',
  'Télécoms & Numérique'
];

const REGIONS = [
  'Centre (Ouagadougou)',
  'Hauts-Bassins (Bobo-Dioulasso)',
  'Boucle du Mouhoun',
  'Cascades',
  'Centre-Est',
  'Centre-Nord',
  'Centre-Ouest',
  'Centre-Sud',
  'Est',
  'Nord',
  'Plateau-Central',
  'Sahel',
  'Sud-Ouest',
  'National (Multi-régions)'
];

export default function AdminProjectsPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Status Change Modal (Strict charter verification modal)
  const [statusModalProject, setStatusModalProject] = useState<Project | null>(null);
  const [newStatus, setNewStatus] = useState<ProjectStatus>('en-construction');
  const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusSource, setStatusSource] = useState('');
  const [statusNoteFr, setStatusNoteFr] = useState('');
  const [statusNoteEn, setStatusNoteEn] = useState('');

  // Fetch projects
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les projets.');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 350);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.region.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.currentStatus === statusFilter;
      const matchesSector = sectorFilter === 'all' || p.sector === sectorFilter;
      const matchesRegion = regionFilter === 'all' || p.region === regionFilter;

      return matchesSearch && matchesStatus && matchesSector && matchesRegion;
    });
  }, [projects, searchTerm, statusFilter, sectorFilter, regionFilter]);

  // Open status change modal
  const handleOpenStatusModal = (project: Project) => {
    setStatusModalProject(project);
    setNewStatus(project.currentStatus);
    setStatusDate(new Date().toISOString().split('T')[0]);
    setStatusSource('');
    setStatusNoteFr(`Constatation du jalon "${PROJECT_STATUS_LABELS[project.currentStatus]}" documentée.`);
    setStatusNoteEn(`Milestone documentation verified.`);
  };

  // Submit status update
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalProject) return;

    if (!statusSource.trim()) {
      warning('Source primaire requise', 'Conformément à la charte déontologique, un changement de statut exige la mention expresse de la source officielle (Conseil des ministres, décret, rapport de terrain, bailleur).');
      return;
    }

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_project_status',
          payload: {
            projectId: statusModalProject.id,
            newStatus,
            date: statusDate,
            source: statusSource,
            note: statusNoteFr,
            noteEn: statusNoteEn,
          }
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors du changement de statut.');

      success(
        'Statut vérifié et archivé',
        `Le chantier "${statusModalProject.title}" est désormais "${PROJECT_STATUS_LABELS[newStatus]}".`
      );

      setStatusModalProject(null);
      loadData();
    } catch (err: any) {
      error('Échec', err.message);
    }
  };

  // Delete project
  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_project', payload: { id } })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors de la suppression.');

      success('Chantier retiré', `Le projet "${title}" a été supprimé du Tracker.`);
      setIsDeletingId(null);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#d97706] font-bold uppercase tracking-wider">
            <Construction size={15} />
            <span>Base Documentaire & Tracker National</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Tracker des Chantiers
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Suivi factuel, chaînes de preuves et journalisation des 6 jalons de vie des projets burkinabè.
          </p>
        </div>

        <Link
          href="/admin/projets/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={16} />
          Nouveau Chantier
        </Link>
      </div>

      {/* 6-Stage Progress Strip */}
      {loading ? (
        <SkeletonStat count={6} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECT_STATUS_ORDER.map((statusKey) => {
            const count = projects.filter(p => p.currentStatus === statusKey).length;
            const color = PROJECT_STATUS_COLORS[statusKey];
            const label = PROJECT_STATUS_LABELS[statusKey];
            const isSelected = statusFilter === statusKey;

            return (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(isSelected ? 'all' : statusKey)}
                className={`p-3 bg-white border text-left transition-all rounded ${
                  isSelected ? 'border-2 ring-1 ring-[#141414]' : 'border-[#e6dfd5] hover:border-[#141414]'
                }`}
                style={{ borderTopColor: color, borderTopWidth: '4px' }}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#736c62]">
                  {label}
                </div>
                <div className="text-2xl font-mono font-bold text-[#141414] mt-1">
                  {count}
                </div>
                <div className="text-[9px] font-mono text-[#736c62] mt-0.5 flex items-center justify-between">
                  <span>{((count / (projects.length || 1)) * 100).toFixed(0)}% du total</span>
                  {isSelected && <Check size={11} className="text-[#087443]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e6dfd5] p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#736c62]" />
          <input
            type="text"
            placeholder="Rechercher par nom de chantier, région, secteur, mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] bg-[#faf8f5]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736c62] hover:text-[#141414]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-[#736c62]">
            <Filter size={14} />
            <span>Filtres :</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Tous les statuts ({projects.length})</option>
            {PROJECT_STATUS_ORDER.map(s => (
              <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Tous les secteurs</option>
            {SECTORS.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Toutes les régions</option>
            {REGIONS.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucun chantier trouvé</div>
          <p className="text-xs font-mono text-[#736c62] mt-1 max-w-sm mx-auto">
            Aucun projet du Tracker ne correspond à ces critères de recherche.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSectorFilter('all'); setRegionFilter('all'); }}
            className="mt-4 px-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] font-mono text-xs rounded hover:bg-[#e6dfd5]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e6dfd5] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase tracking-wider text-[#736c62]">
                <th className="py-3 px-4">Chantier & Secteur</th>
                <th className="py-3 px-3">Région</th>
                <th className="py-3 px-3">Statut Actuel</th>
                <th className="py-3 px-3">Enveloppe / Budget</th>
                <th className="py-3 px-3">Dernière Preuve</th>
                <th className="py-3 px-3">Jalons</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5] text-xs font-mono">
              {filteredProjects.map((p) => {
                const statusColor = PROJECT_STATUS_COLORS[p.currentStatus] || '#9CA3AF';
                const statusLabel = PROJECT_STATUS_LABELS[p.currentStatus] || p.currentStatus;

                return (
                  <tr key={p.id} className="hover:bg-[#faf8f5]/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <div className="flex items-start gap-3">
                        <img 
                          src={p.image || '/images/lead.jpeg'} 
                          alt="" 
                          className="w-12 h-10 object-cover rounded border border-[#e6dfd5] shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-sm text-[#141414] line-clamp-1 hover:text-[#087443]">
                            {p.title}
                          </div>
                          {p.titleEn && (
                            <div className="text-[11px] text-[#736c62] italic line-clamp-1 mt-0.5">
                              EN: {p.titleEn}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#736c62]">
                            <span className="font-bold text-[#087443]">{p.sector}</span>
                            {p.capacity && <span>• {p.capacity}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[#5a554e]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} className="text-[#736c62]" />
                        {p.region.split('(')[0].trim()}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenStatusModal(p)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-xs hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: statusColor }}
                        title="Cliquer pour changer de statut et documenter la preuve"
                      >
                        <span>{statusLabel}</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-bold text-[#141414]">
                      {p.amount || '—'}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#736c62]">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>{p.lastVerifiedAt ? new Date(p.lastVerifiedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                      </div>
                      <div className="text-[10px] text-[#087443] flex items-center gap-0.5 mt-0.5">
                        <ShieldCheck size={10} /> Vérifié
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-bold text-[#5a554e] bg-[#faf8f5] px-2 py-0.5 border border-[#e6dfd5] rounded">
                        {p.statusHistory?.length || 1} jalon{(p.statusHistory?.length || 1) > 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip position="top" content="Voir la fiche publique du chantier">
                          <Link
                            href={`/fr/tracker/projets/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded"
                            aria-label="Voir sur le site public"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </Tooltip>

                        <Tooltip position="top" content="Mettre à jour le statut du chantier">
                          <button
                            onClick={() => handleOpenStatusModal(p)}
                            className="p-1.5 text-[#d97706] hover:text-[#b45309] hover:bg-[#faf8f5] rounded"
                            aria-label="Changer de statut"
                          >
                            <History size={14} />
                          </button>
                        </Tooltip>

                        <Tooltip position="top" content="Modifier la fiche du chantier">
                          <Link
                            href={`/admin/projets/${p.id}`}
                            className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded inline-flex items-center"
                            aria-label="Modifier la fiche"
                          >
                            <Edit3 size={14} />
                          </Link>
                        </Tooltip>

                        <Tooltip position="top" content="Supprimer ce chantier du Tracker">
                          <button
                            onClick={() => setIsDeletingId(p.id)}
                            className="p-1.5 text-[#736c62] hover:text-[#c2410c] hover:bg-[#faf8f5] rounded"
                            aria-label="Supprimer du Tracker"
                          >
                            <Trash2 size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Change Verification Modal (Charte Déontologique) */}
      {statusModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-[#087443] max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="bg-[#faf8f5] p-4 border-b border-[#e6dfd5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#087443]" />
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Vérification du Jalon Déontologique
                </h3>
              </div>
              <button 
                onClick={() => setStatusModalProject(null)}
                className="text-[#736c62] hover:text-[#141414]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#736c62] uppercase font-bold">Chantier concerné</span>
                <div className="font-serif font-bold text-sm text-[#141414] mt-0.5">
                  {statusModalProject.title}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e6dfd5]">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Nouveau Statut Certifié *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  >
                    {PROJECT_STATUS_ORDER.map(st => (
                      <option key={st} value={st}>{PROJECT_STATUS_LABELS[st]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Date de vérification *
                  </label>
                  <input
                    type="date"
                    required
                    value={statusDate}
                    onChange={(e) => setStatusDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#c2410c] mb-1 flex items-center gap-1">
                  <Link2 size={12} />
                  Source Primaire Obligatoire (Charte BN) *
                </label>
                <input
                  type="text"
                  required
                  value={statusSource}
                  onChange={(e) => setStatusSource(e.target.value)}
                  placeholder="Ex: Compte-rendu Conseil des Ministres du 12 août 2026, Rapport SONABEL..."
                  className="w-full px-2.5 py-2 border-2 border-[#cbd5e1] rounded focus:outline-none focus:border-[#087443] bg-[#fffbf5]"
                />
                <p className="text-[10px] text-[#736c62] mt-1">
                  Aucun changement de statut n'est accepté sans source primaire vérifiable.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Note d'audit factuel (Français)
                </label>
                <textarea
                  rows={2}
                  value={statusNoteFr}
                  onChange={(e) => setStatusNoteFr(e.target.value)}
                  placeholder="Ex: Constat de pose de la première pierre par le ministre de l'Énergie..."
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                  Verification Audit Note (English)
                </label>
                <textarea
                  rows={2}
                  value={statusNoteEn}
                  onChange={(e) => setStatusNoteEn(e.target.value)}
                  placeholder="Official documentation confirmed via ministerial release..."
                  className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-[#f8fafc]"
                />
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStatusModalProject(null)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center"
                >
                  <Check size={14} />
                  Valider et Inscrire le Jalon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-[#c2410c] p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-[#141414] flex items-center gap-2">
              <AlertCircle size={20} className="text-[#c2410c]" />
              Supprimer la fiche du Tracker
            </h3>
            <p className="text-xs font-mono text-[#5a554e] mt-2">
              Attention : la suppression de ce chantier efface également son historique de vérification public.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#faf8f5]"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const target = projects.find(p => p.id === isDeletingId);
                  if (target) handleDelete(target.id, target.title);
                }}
                className="px-4 py-2 bg-[#c2410c] text-white text-xs font-mono font-bold hover:bg-[#9a3412]"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
