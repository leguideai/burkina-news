"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Plus, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Languages, 
  Link2, 
  ShieldCheck, 
  Eye,
  Camera,
  Radio,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { BriefDTO, BriefFactDTO, CategoryDTO } from '@/lib/api/types';
import { filApi } from '@/lib/api/fil';
import { categoriesApi } from '@/lib/api/categories';
import { useFilStream } from '@/hooks/useFilStream';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import ImageUploader from '@/components/admin/ImageUploader';
import Tooltip from '@/components/ui/Tooltip';
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';

interface CategoryOption {
  code: string;
  label: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { code: 'economie', label: 'Économie' },
  { code: 'securite', label: 'Sécurité' },
  { code: 'chantiers', label: 'Chantiers' },
  { code: 'agriculture', label: 'Agriculture' },
  { code: 'societe', label: 'Société' },
  { code: 'histoire', label: 'Histoire' },
];

export default function AdminFilPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [briefs, setBriefs] = useState<BriefDTO[]>([]);
  const [selectedBriefSlug, setSelectedBriefSlug] = useState<string>('');
  const [currentBrief, setCurrentBrief] = useState<BriefDTO | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);

  // Fact Edit Modal
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Fact Form State
  const initialFactState = {
    time: '10:00',
    textFr: '',
    textEn: '',
    source: 'AIB / SIG',
    sourceUrl: 'https://www.sig.bf',
    categoryCode: 'economie',
    whyWatchFr: '',
    whyWatchEn: '',
    image: '',
  };

  const [factFormData, setFactFormData] = useState(initialFactState);

  // Brief (Edition) Modal & Deletion State
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [briefActiveTab, setBriefActiveTab] = useState<'fr' | 'en'>('fr');
  const [briefFormData, setBriefFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    date: '',
    weekNumber: 1,
    summary: '',
    summaryEn: '',
    image: '',
  });

  const [deletingBrief, setDeletingBrief] = useState<BriefDTO | null>(null);
  const [deletingFact, setDeletingFact] = useState<BriefFactDTO | null>(null);

  // Charger les catégories dynamiques depuis l'API Go
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoriesApi.listCategories();
        if (cats && cats.length > 0) {
          setCategories(cats.map(c => ({ code: c.code, label: c.name_fr })));
        }
      } catch {
        // Garder les catégories par défaut en cas d'indisponibilité temporaire
      }
    }
    loadCategories();
  }, []);

  // Charger les éditions de briefs
  const loadBriefs = useCallback(async (preferredSlug?: string) => {
    try {
      setLoading(true);
      const res = await filApi.adminListBriefs({ limit: 50 });
      const loadedBriefs = res.briefs || [];
      setBriefs(loadedBriefs);

      if (loadedBriefs.length > 0) {
        const targetSlug = preferredSlug && loadedBriefs.some(b => b.slug === preferredSlug)
          ? preferredSlug
          : selectedBriefSlug && loadedBriefs.some(b => b.slug === selectedBriefSlug)
          ? selectedBriefSlug
          : loadedBriefs[0].slug;

        setSelectedBriefSlug(targetSlug);
        // Charger les détails de l'édition sélectionnée (avec les faits préchargés)
        const detailedBrief = await filApi.getBriefBySlug(targetSlug);
        setCurrentBrief(detailedBrief);
      } else {
        setCurrentBrief(null);
      }
    } catch (err: any) {
      error('Erreur', err.message || 'Impossible de charger Le Fil.');
    } finally {
      setLoading(false);
    }
  }, [selectedBriefSlug, error]);

  // Synchronisation lors du changement de sélection de brief
  const handleSelectBrief = async (slug: string) => {
    setSelectedBriefSlug(slug);
    try {
      setLoading(true);
      const detailed = await filApi.getBriefBySlug(slug);
      setCurrentBrief(detailed);
    } catch (err: any) {
      error('Erreur', err.message || "Impossible de charger l'édition sélectionnée.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBriefs();
  }, []);

  // Connexion au flux SSE temps réel pour écoute des nouvelles dépêches
  const { isConnected, lastEvent } = useFilStream({
    onNewFact: (newFact) => {
      if (currentBrief && newFact.brief_id === currentBrief.id) {
        setCurrentBrief(prev => {
          if (!prev) return null;
          const exists = prev.facts?.some(f => f.id === newFact.id);
          if (exists) return prev;
          return {
            ...prev,
            facts: [...(prev.facts || []), newFact],
          };
        });
      }
    },
    onUpdateFact: (updatedFact) => {
      if (currentBrief && updatedFact.brief_id === currentBrief.id) {
        setCurrentBrief(prev => {
          if (!prev) return null;
          return {
            ...prev,
            facts: (prev.facts || []).map(f => f.id === updatedFact.id ? updatedFact : f),
          };
        });
      }
    },
    onDeleteFact: ({ id }) => {
      if (currentBrief) {
        setCurrentBrief(prev => {
          if (!prev) return null;
          return {
            ...prev,
            facts: (prev.facts || []).filter(f => f.id !== id),
          };
        });
      }
    },
    onNewBrief: () => {
      loadBriefs();
    },
    onUpdateBrief: (updatedBrief) => {
      setBriefs(prev => prev.map(b => b.id === updatedBrief.id ? updatedBrief : b));
      if (currentBrief?.id === updatedBrief.id) {
        setCurrentBrief(prev => prev ? { ...prev, ...updatedBrief } : null);
      }
    },
    onDeleteBrief: () => {
      loadBriefs();
    },
  });

  // Open Add Fact
  const handleOpenAddFact = () => {
    setFactFormData(initialFactState);
    setEditingFactId(null);
    setActiveTab('fr');
    setIsFactModalOpen(true);
  };

  // Open Edit Fact
  const handleOpenEditFact = (fact: BriefFactDTO) => {
    setFactFormData({
      time: fact.time || '10:00',
      textFr: fact.text_fr || '',
      textEn: fact.text_en || '',
      source: fact.source || '',
      sourceUrl: fact.source_url || '',
      categoryCode: fact.category_code || 'economie',
      whyWatchFr: fact.why_watch_fr || '',
      whyWatchEn: fact.why_watch_en || '',
      image: fact.image || '',
    });
    setEditingFactId(fact.id);
    setActiveTab('fr');
    setIsFactModalOpen(true);
  };

  // Submit Fact
  const handleSubmitFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factFormData.textFr.trim() || !factFormData.source.trim()) {
      warning('Champs obligatoires', 'Veuillez saisir le texte français du fait et sa source officielle.');
      return;
    }

    if (!currentBrief) return;

    try {
      if (editingFactId) {
        await filApi.adminUpdateFact(editingFactId, {
          brief_id: currentBrief.id,
          time: factFormData.time,
          text_fr: factFormData.textFr,
          text_en: factFormData.textEn,
          source: factFormData.source,
          source_url: factFormData.sourceUrl,
          category_code: factFormData.categoryCode,
          why_watch_fr: factFormData.whyWatchFr,
          why_watch_en: factFormData.whyWatchEn,
          image: factFormData.image,
        });

        success(
          'Dépêche mise à jour',
          `Le fait de ${factFormData.time} a été mis à jour et synchronisé en direct via SSE.`
        );
      } else {
        await filApi.adminCreateFact({
          brief_id: currentBrief.id,
          time: factFormData.time,
          date: currentBrief.date,
          text_fr: factFormData.textFr,
          text_en: factFormData.textEn,
          source: factFormData.source,
          source_url: factFormData.sourceUrl,
          category_code: factFormData.categoryCode,
          why_watch_fr: factFormData.whyWatchFr,
          why_watch_en: factFormData.whyWatchEn,
          image: factFormData.image,
          order_num: (currentBrief.facts?.length || 0) + 1,
        });

        success(
          'Dépêche certifiée 60s publiée',
          `Le fait de ${factFormData.time} a été publié et diffusé instantanément sur le flux public.`
        );
      }

      setIsFactModalOpen(false);
      // Recharger l'édition courante
      const refreshed = await filApi.getBriefBySlug(currentBrief.slug);
      setCurrentBrief(refreshed);
    } catch (err: any) {
      error('Erreur', err.message || "Erreur lors de l'enregistrement de la dépêche.");
    }
  };

  const handleMicumTranslateFact = (translated: Record<string, string>) => {
    setFactFormData(prev => ({
      ...prev,
      textEn: translated.text || prev.textEn,
      whyWatchEn: translated.whyWatch || prev.whyWatchEn
    }));
  };

  // Brief Edition Handlers
  const handleOpenCreateBrief = () => {
    const maxWeek = briefs.reduce((max, b) => Math.max(max, b.week_number || 0), 0);
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = maxWeek > 0 ? maxWeek + 1 : 1;
    const currentYear = new Date().getFullYear();
    setBriefFormData({
      title: `Semaine ${nextWeek} — Veille Nationale`,
      titleEn: `Week ${nextWeek} — National Brief`,
      slug: `${currentYear}-semaine-${nextWeek < 10 ? '0' + nextWeek : nextWeek}`,
      date: today,
      weekNumber: nextWeek,
      summary: '',
      summaryEn: '',
      image: '',
    });
    setIsEditingBrief(false);
    setBriefActiveTab('fr');
    setIsBriefModalOpen(true);
  };

  const handleOpenEditBrief = () => {
    if (!currentBrief) return;
    setBriefFormData({
      title: currentBrief.title,
      titleEn: currentBrief.title_en || '',
      slug: currentBrief.slug,
      date: currentBrief.date,
      weekNumber: currentBrief.week_number,
      summary: currentBrief.summary || '',
      summaryEn: currentBrief.summary_en || '',
      image: currentBrief.image || '',
    });
    setIsEditingBrief(true);
    setBriefActiveTab('fr');
    setIsBriefModalOpen(true);
  };

  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefFormData.title?.trim() || !briefFormData.slug?.trim()) {
      warning('Champs requis', "Veuillez renseigner le titre et l'identifiant slug de l'édition.");
      return;
    }

    try {
      const year = new Date(briefFormData.date).getFullYear() || new Date().getFullYear();
      if (isEditingBrief && currentBrief) {
        await filApi.adminUpdateBrief(currentBrief.id, {
          title: briefFormData.title,
          title_en: briefFormData.titleEn,
          date: briefFormData.date,
          week_number: briefFormData.weekNumber,
          year: year,
          summary: briefFormData.summary,
          summary_en: briefFormData.summaryEn,
          image: briefFormData.image,
          is_published: true,
        });

        success(
          'Édition mise à jour',
          `L'édition "${briefFormData.title}" a été modifiée avec succès.`
        );
      } else {
        await filApi.adminCreateBrief({
          title: briefFormData.title,
          title_en: briefFormData.titleEn,
          slug: briefFormData.slug,
          date: briefFormData.date,
          week_number: briefFormData.weekNumber,
          year: year,
          summary: briefFormData.summary,
          summary_en: briefFormData.summaryEn,
          image: briefFormData.image,
          is_published: true,
        });

        success(
          'Nouvelle édition créée',
          `L'édition "${briefFormData.title}" est maintenant disponible.`
        );
      }

      setIsBriefModalOpen(false);
      await loadBriefs(briefFormData.slug || currentBrief?.slug);
    } catch (err: any) {
      error('Erreur', err.message || "Erreur lors de l'enregistrement de l'édition.");
    }
  };

  const handleDeleteBrief = async (brief: BriefDTO) => {
    try {
      await filApi.adminDeleteBrief(brief.id);
      success('Édition supprimée', "L'édition du Fil et ses dépêches ont été retirées.");
      setDeletingBrief(null);
      setSelectedBriefSlug('');
      await loadBriefs();
    } catch (err: any) {
      error('Erreur', err.message || "Erreur lors de la suppression de l'édition.");
    }
  };

  const handleDeleteFact = async (fact: BriefFactDTO) => {
    if (!currentBrief) return;
    try {
      await filApi.adminDeleteFact(fact.id);
      success('Dépêche supprimée', 'Le fait certifié a été retiré avec succès.');
      setDeletingFact(null);
      const refreshed = await filApi.getBriefBySlug(currentBrief.slug);
      setCurrentBrief(refreshed);
    } catch (err: any) {
      error('Erreur', err.message || 'Erreur lors de la suppression du fait.');
    }
  };

  const handleMicumTranslateBrief = (translated: Record<string, string>) => {
    setBriefFormData(prev => ({
      ...prev,
      titleEn: translated.title || prev.titleEn,
      summaryEn: translated.summary || prev.summaryEn
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#d97706] font-bold uppercase tracking-wider">
            <Zap size={15} />
            <span>Veille Hebdomadaire & Dépêches 60s</span>
            <span className="text-[#736c62]">•</span>
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 text-[#087443] font-mono text-[10px] bg-[#087443]/10 px-2 py-0.5 rounded-full">
                <Wifi size={11} className="animate-pulse" />
                <span>Flux SSE Direct Connecté</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#736c62] font-mono text-[10px] bg-neutral-200/60 px-2 py-0.5 rounded-full">
                <WifiOff size={11} />
                <span>Flux SSE En veille</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Le Fil — Desk Rédactionnel
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            10 faits sourcés chaque semaine et dépêches vérifiées en direct. Raccordé à l'API Go et streaming SSE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => loadBriefs()}
            className="p-2 bg-white border border-[#e6dfd5] text-[#5a554e] hover:text-[#141414] rounded transition-colors cursor-pointer"
            title="Rafraîchir les données"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreateBrief}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#087443] text-[#087443] hover:bg-[#087443] hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            Nouvelle Édition
          </button>
          {currentBrief && (
            <>
              <Link
                href={`/fr/fil/${currentBrief.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
              >
                <ExternalLink size={14} />
                Voir en direct
              </Link>
              <button
                onClick={handleOpenAddFact}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                Ajouter une Dépêche
              </button>
            </>
          )}
        </div>
      </div>

      {/* Week Selector Bar */}
      {briefs.length > 0 && (
        <div className="bg-white border border-[#e6dfd5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar size={16} className="text-[#087443]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#141414]">
              Édition sélectionnée :
            </span>
            <select
              value={selectedBriefSlug}
              onChange={(e) => handleSelectBrief(e.target.value)}
              className="text-xs font-mono font-bold border border-[#e6dfd5] px-3 py-1.5 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
            >
              {briefs.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.title} ({b.date}) — Semaine {b.week_number}
                </option>
              ))}
            </select>

            {currentBrief && (
              <div className="flex items-center gap-1 ml-1">
                <Tooltip position="top" content="Modifier les métadonnées de cette édition (titre, date, résumé, image)">
                  <button
                    type="button"
                    onClick={handleOpenEditBrief}
                    className="p-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors cursor-pointer"
                    aria-label="Modifier l'édition"
                  >
                    <Edit3 size={14} />
                  </button>
                </Tooltip>
                <Tooltip position="top" content="Supprimer cette édition du Fil">
                  <button
                    type="button"
                    onClick={() => setDeletingBrief(currentBrief)}
                    className="p-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] rounded transition-colors cursor-pointer"
                    aria-label="Supprimer l'édition"
                  >
                    <Trash2 size={14} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>

          {currentBrief && (
            <div className="flex items-center gap-3 text-xs font-mono text-[#736c62]">
              <span>Semaine {currentBrief.week_number} ({currentBrief.year})</span>
              <span>•</span>
              <span className="font-bold text-[#087443]">
                {currentBrief.facts?.length || 0} / 10 faits enregistrés
              </span>
            </div>
          )}
        </div>
      )}

      {/* Facts Timeline & Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={4} />
      ) : !currentBrief ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center space-y-4">
          <AlertCircle size={40} className="mx-auto text-[#736c62]" />
          <div className="text-lg font-serif font-bold text-[#141414]">Aucune édition de Fil Hebdomadaire</div>
          <p className="text-xs font-mono text-[#736c62] max-w-md mx-auto">
            Commencez par créer votre première édition hebdomadaire pour compiler les 10 faits vérifiés ou publier des dépêches instantanées 60 secondes.
          </p>
          <button
            onClick={handleOpenCreateBrief}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-[#075f37] transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            Créer la première édition
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-[#e6dfd5] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#faf8f5] border-b border-[#e6dfd5] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  {currentBrief.title} — {currentBrief.date}
                </h3>
                {currentBrief.summary && (
                  <p className="text-xs font-serif text-[#5a554e] mt-0.5 italic">
                    "{currentBrief.summary}"
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#087443] text-white font-bold rounded">
                Édition Active ({currentBrief.slug})
              </span>
            </div>

            {(!currentBrief.facts || currentBrief.facts.length === 0) ? (
              <div className="p-10 text-center space-y-3">
                <Clock size={32} className="mx-auto text-[#736c62]" />
                <p className="font-serif text-sm text-[#141414]">Aucune dépêche enregistrée dans cette édition.</p>
                <button
                  onClick={handleOpenAddFact}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#087443] text-white font-mono text-xs font-bold rounded hover:bg-[#075f37] cursor-pointer"
                >
                  <Plus size={14} />
                  Ajouter le premier fait
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#e6dfd5]">
                {currentBrief.facts.map((fact, idx) => {
                  return (
                    <div key={fact.id || idx} className="p-4 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Time & Fact */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="shrink-0 text-center">
                          <span className="px-2 py-1 bg-[#141414] text-[#ffd8a8] font-mono text-xs font-bold rounded block">
                            {fact.time}
                          </span>
                          <span className="text-[9px] font-mono text-[#736c62] mt-0.5 block">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {fact.category_code && (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#e6dfd5] text-[#141414] rounded">
                                {categories.find(c => c.code === fact.category_code)?.label || fact.category_code}
                              </span>
                            )}
                            <Tooltip position="top" content="Consulter la source officielle">
                              <a 
                                href={fact.source_url || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:underline"
                                aria-label="Source officielle"
                              >
                                <Link2 size={11} />
                                Source : {fact.source}
                              </a>
                            </Tooltip>
                          </div>

                          {/* FR Text */}
                          <div className="font-serif text-sm text-[#141414] leading-relaxed">
                            {fact.text_fr}
                          </div>

                          {/* EN Text */}
                          {fact.text_en && (
                            <div className="text-xs font-serif text-[#5a554e] italic bg-[#f8fafc] p-2 rounded border border-[#e2e8f0]">
                              <span className="font-mono text-[9px] font-bold uppercase text-[#1e3a5f] mr-1.5 not-italic">EN :</span>
                              {fact.text_en}
                            </div>
                          )}

                          {/* Why Watch Note */}
                          {fact.why_watch_fr && (
                            <div className="text-[11px] font-mono text-[#c2410c] bg-orange-50/70 px-2.5 py-1 rounded border border-orange-200/60 inline-block">
                              <b>Pourquoi surveiller :</b> {fact.why_watch_fr}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end md:self-start shrink-0">
                        <Tooltip position="top" content="Modifier les informations de ce fait">
                          <button
                            onClick={() => handleOpenEditFact(fact)}
                            className="px-2.5 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            aria-label="Modifier le fait"
                          >
                            <Edit3 size={13} />
                            Modifier
                          </button>
                        </Tooltip>
                        <Tooltip position="top" content="Supprimer cette dépêche de l'édition">
                          <button
                            type="button"
                            onClick={() => setDeletingFact(fact)}
                            className="p-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] rounded transition-colors cursor-pointer"
                            aria-label="Supprimer ce fait"
                          >
                            <Trash2 size={13} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fact Edit / Add Modal */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#d97706]">
                  {editingFactId ? 'Modifier la dépêche certifiée' : 'Nouvelle Dépêche 60s'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {currentBrief?.title}
                </h3>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex bg-[#e6dfd5] p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => setActiveTab('fr')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      activeTab === 'fr' ? 'bg-white text-[#087443]' : 'text-[#5a554e]'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      activeTab === 'en' ? 'bg-white text-[#1e3a5f]' : 'text-[#5a554e]'
                    }`}
                  >
                    EN
                  </button>
                </div>
                <Tooltip position="left" content="Fermer la boîte de dialogue">
                  <button
                    onClick={() => setIsFactModalOpen(false)}
                    className="p-1 text-[#736c62] hover:text-[#141414] shrink-0"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFact} className="p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Heure du fait *
                  </label>
                  <input
                    type="text"
                    required
                    value={factFormData.time}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="ex: 10:00"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Rubrique rattachée *
                  </label>
                  <select
                    value={factFormData.categoryCode}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, categoryCode: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  >
                    {categories.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Source officielle certifiée *
                  </label>
                  <input
                    type="text"
                    required
                    value={factFormData.source}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="ex: Conseil des ministres, AIB, SIG..."
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Lien URL de la Source primaire
                </label>
                <input
                  type="text"
                  value={factFormData.sourceUrl}
                  onChange={(e) => setFactFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                />
              </div>

              {/* Bilingual Fact Body */}
              {activeTab === 'fr' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Énoncé factuel (Français) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={factFormData.textFr}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, textFr: e.target.value }))}
                      placeholder="Les faits bruts, précis, vérifiés..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#c2410c] mb-1">
                      Pourquoi surveiller (Angle d'analyse BN)
                    </label>
                    <textarea
                      rows={2}
                      value={factFormData.whyWatchFr}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, whyWatchFr: e.target.value }))}
                      placeholder="Ce que ce fait annonce ou implique à moyen terme..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#f8fafc] p-3 border border-[#cbd5e1] rounded">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#cbd5e1]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] uppercase">
                      <Languages size={13} />
                      <span>English Translation</span>
                    </div>
                    <MicumTranslateButton
                      fieldsToTranslate={{
                        text: factFormData.textFr,
                        whyWatch: factFormData.whyWatchFr
                      }}
                      onTranslated={handleMicumTranslateFact}
                      label="Traduire avec Micum"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Factual Statement (English)
                    </label>
                    <textarea
                      rows={3}
                      value={factFormData.textEn}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, textEn: e.target.value }))}
                      placeholder="Direct English translation of the fact..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      Why Watch (Editorial Note - English)
                    </label>
                    <textarea
                      rows={2}
                      value={factFormData.whyWatchEn}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, whyWatchEn: e.target.value }))}
                      placeholder="Why this matters in the upcoming weeks..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Proof / Image URL */}
              <div>
                <ImageUploader
                  label="Preuve visuelle / Photo documentée (Optionnelle)"
                  value={factFormData.image}
                  onChange={(url) => setFactFormData(prev => ({ ...prev, image: url }))}
                  helperText="Téléversez une photo de preuve depuis votre ordinateur (PNG, JPG, WebP) ou renseignez un lien web."
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFactModalOpen(false)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center cursor-pointer shadow-sm"
                >
                  <Check size={14} />
                  {editingFactId ? 'Sauvegarder les modifications' : 'Diffuser en direct (SSE)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edition (Brief) Create / Edit Modal */}
      {isBriefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#d97706]">
                  {isEditingBrief ? "Configuration de l'édition" : 'Nouvelle Édition Hebdomadaire'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {isEditingBrief ? (briefFormData.title || "Modifier l'édition") : 'Créer une édition du Fil'}
                </h3>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex bg-[#e6dfd5] p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => setBriefActiveTab('fr')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      briefActiveTab === 'fr' ? 'bg-white text-[#087443]' : 'text-[#5a554e]'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setBriefActiveTab('en')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      briefActiveTab === 'en' ? 'bg-white text-[#1e3a5f]' : 'text-[#5a554e]'
                    }`}
                  >
                    EN
                  </button>
                </div>
                <Tooltip position="left" content="Fermer la boîte de dialogue">
                  <button
                    onClick={() => setIsBriefModalOpen(false)}
                    className="p-1 text-[#736c62] hover:text-[#141414] shrink-0 cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBrief} className="p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              {/* Common Metadata: Date, Semaine, Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Numéro de Semaine *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={53}
                    required
                    value={briefFormData.weekNumber || 1}
                    onChange={(e) => setBriefFormData(prev => ({ ...prev, weekNumber: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Date de publication *
                  </label>
                  <input
                    type="date"
                    required
                    value={briefFormData.date}
                    onChange={(e) => setBriefFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Identifiant URL (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={briefFormData.slug}
                    disabled={isEditingBrief}
                    onChange={(e) => setBriefFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') }))}
                    placeholder="2026-semaine-11"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {briefActiveTab === 'fr' ? (
                <div className="space-y-3.5 pt-2 border-t border-[#e6dfd5]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#087443] uppercase tracking-wider">
                      Contenu en Français (FR)
                    </span>
                    <MicumTranslateButton
                      fieldsToTranslate={{
                        title: briefFormData.title,
                        summary: briefFormData.summary,
                      }}
                      targetLang="en"
                      onTranslated={handleMicumTranslateBrief}
                      label="Traduire vers l'Anglais avec Micum"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Titre de l'édition (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={briefFormData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBriefFormData(prev => ({
                          ...prev,
                          title: val,
                          ...(!isEditingBrief && !prev.slug ? {
                            slug: val.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
                          } : {})
                        }));
                      }}
                      placeholder="Ex: Semaine 11 — Veille Nationale et Faits Clés"
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Résumé éditorial / Synthèse de la semaine (Optionnel)
                    </label>
                    <textarea
                      rows={3}
                      value={briefFormData.summary}
                      onChange={(e) => setBriefFormData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Une synthèse des tendances majeures de la semaine au Burkina Faso..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white font-serif text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 pt-2 border-t border-[#cbd5e1] bg-[#f8fafc] -mx-5 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Languages size={15} className="text-[#1e3a5f]" />
                    <span className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-wider">
                      English Version (EN)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      Edition Title (English)
                    </label>
                    <input
                      type="text"
                      value={briefFormData.titleEn}
                      onChange={(e) => setBriefFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="Ex: Week 11 — National Brief and Key Facts"
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      Weekly Editorial Summary (English)
                    </label>
                    <textarea
                      rows={3}
                      value={briefFormData.summaryEn}
                      onChange={(e) => setBriefFormData(prev => ({ ...prev, summaryEn: e.target.value }))}
                      placeholder="A briefing of major national developments in Burkina Faso..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Cover Image */}
              <div className="pt-2 border-t border-[#e6dfd5]">
                <ImageUploader
                  label="Image de couverture de l'édition (Optionnelle)"
                  value={briefFormData.image}
                  onChange={(url) => setBriefFormData(prev => ({ ...prev, image: url }))}
                  helperText="Photo d'illustration principale pour cette édition du Fil (format paysage recommandé)."
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBriefModalOpen(false)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center cursor-pointer"
                >
                  <Check size={14} />
                  {isEditingBrief ? "Mettre à jour l'édition" : "Créer l'édition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Edition Confirmation Modal */}
      {deletingBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#141414] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#dc2626]">
              <AlertCircle size={24} />
              <h3 className="font-serif font-bold text-lg text-[#141414]">
                Supprimer cette édition ?
              </h3>
            </div>
            <p className="text-xs font-mono text-[#5a554e] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l'édition <b>"{deletingBrief.title}"</b> ? Tous les faits associés à cette semaine seront également supprimés. Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
              <button
                type="button"
                onClick={() => setDeletingBrief(null)}
                className="px-3 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#faf8f5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBrief(deletingBrief)}
                className="px-4 py-2 bg-[#dc2626] text-white text-xs font-mono font-bold uppercase rounded hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Fact Confirmation Modal */}
      {deletingFact && currentBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#141414] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#dc2626]">
              <AlertCircle size={24} />
              <h3 className="font-serif font-bold text-lg text-[#141414]">
                Retirer cette dépêche ?
              </h3>
            </div>
            <p className="text-xs font-mono text-[#5a554e] leading-relaxed">
              Êtes-vous sûr de vouloir retirer la dépêche de <b>{deletingFact.time}</b> de l'édition "{currentBrief.title}" ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
              <button
                type="button"
                onClick={() => setDeletingFact(null)}
                className="px-3 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#faf8f5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteFact(deletingFact)}
                className="px-4 py-2 bg-[#dc2626] text-white text-xs font-mono font-bold uppercase rounded hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Retirer la dépêche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
