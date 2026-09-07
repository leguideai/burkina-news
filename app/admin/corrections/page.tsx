"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  UserCheck, 
  FileText,
  Clock
} from 'lucide-react';
import { Correction, Article } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

export default function AdminCorrectionsPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<Correction> = {
    date: new Date().toISOString().split('T')[0],
    articleTitle: '',
    articleSlug: '',
    previousText: '',
    correctedText: '',
    reason: '',
    validatedBy: 'Alfred Ouédraogo (Directeur éditorial)',
  };

  const [formData, setFormData] = useState<Partial<Correction>>(initialFormState);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger le registre des corrections.');
      const data = await res.json();
      setCorrections(data.corrections || []);
      setArticles(data.articles || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      ...initialFormState,
      articleTitle: articles[0]?.title || '',
      articleSlug: articles[0]?.slug || '',
    });
    setIsModalOpen(true);
  };

  const handleSelectArticle = (slug: string) => {
    const art = articles.find(a => a.slug === slug);
    if (art) {
      setFormData(prev => ({
        ...prev,
        articleTitle: art.title,
        articleSlug: art.slug,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.articleTitle || !formData.previousText || !formData.correctedText || !formData.reason) {
      warning('Champs requis', 'Veuillez remplir l\'ensemble des champs de rectification.');
      return;
    }

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_correction',
          payload: formData
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'inscription.');

      success(
        'Correction inscrite au registre',
        `La rectification sur "${formData.articleTitle}" a été publiée au registre public.`
      );

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_correction',
          payload: { id }
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur de suppression.');

      success('Correction retirée', 'La mention a été supprimée du registre.');
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
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <Scale size={15} />
            <span>Pacte de Transparence & Déontologie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Registre Public des Corrections
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Historique public des rectifications factuelles. Chez Burkina News, chaque correction est documentée avec son motif.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/fr/corrections"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
          >
            <ExternalLink size={14} />
            Voir le Registre Public
          </Link>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            <Plus size={16} />
            Inscrire une Correction
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Corrections Publiées</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{corrections.length}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Transparence totale</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Validation Directe</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">Directeur éditorial</div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Contrôle collégial</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Déclencheurs</div>
            <div className="text-2xl font-mono font-bold text-[#d97706] mt-1">3 motifs</div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Signalement lecteur, MAJ officielle, veille</div>
          </div>
        </div>
      )}

      {/* Corrections List */}
      {loading ? (
        <SkeletonTable rows={4} columns={5} />
      ) : corrections.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucune correction enregistrée</div>
          <p className="text-xs font-mono text-[#736c62] mt-1">Le registre est actuellement vierge de toute rectification en attente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {corrections.map((corr) => (
            <div 
              key={corr.id}
              className="bg-white border border-[#e6dfd5] p-5 shadow-xs space-y-4 hover:border-[#141414] transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd5] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-[#141414] text-white text-[10px] font-mono font-bold uppercase rounded">
                    {corr.date}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#141414]">
                    Article concerné : <span className="text-[#087443]">{corr.articleTitle}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#736c62]">
                  <span className="flex items-center gap-1">
                    <UserCheck size={13} className="text-[#087443]" />
                    {corr.validatedBy}
                  </span>
                  <Tooltip position="top" content="Supprimer cette correction">
                    <button
                      onClick={() => setIsDeletingId(corr.id)}
                      className="p-1 text-[#736c62] hover:text-[#c2410c] rounded"
                      aria-label="Supprimer la correction"
                    >
                      <Trash2 size={15} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Before / After Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Before (Red) */}
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#be123c] flex items-center gap-1">
                    <X size={12} />
                    Texte erroné avant rectification :
                  </div>
                  <p className="line-through text-rose-900 font-serif leading-relaxed">
                    « {corr.previousText} »
                  </p>
                </div>

                {/* After (Green) */}
                <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#047857] flex items-center gap-1">
                    <Check size={12} />
                    Texte rectifié & certifié :
                  </div>
                  <p className="text-emerald-950 font-serif font-semibold leading-relaxed">
                    « {corr.correctedText} »
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-[#faf8f5] p-3 border-l-2 border-[#d97706] rounded-r text-xs font-mono">
                <span className="font-bold text-[#d97706] uppercase text-[10px] block mb-0.5">
                  Motif déontologique :
                </span>
                <span className="text-[#5a554e] font-serif">
                  {corr.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-[#c2410c] p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-[#141414] flex items-center gap-2">
              <AlertCircle size={20} className="text-[#c2410c]" />
              Retirer cette correction
            </h3>
            <p className="text-xs font-mono text-[#5a554e] mt-2">
              Êtes-vous certain de vouloir supprimer cette inscription du registre public ?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#faf8f5]"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="px-4 py-2 bg-[#c2410c] text-white text-xs font-mono font-bold hover:bg-[#9a3412]"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Correction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between gap-2 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Déontologie & Transparence
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414]">
                  Inscrire une nouvelle rectification
                </h3>
              </div>
              <Tooltip position="left" content="Fermer la boîte de dialogue">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#736c62] hover:text-[#141414] shrink-0"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </Tooltip>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Article concerné *
                  </label>
                  <select
                    value={formData.articleSlug || ''}
                    onChange={(e) => handleSelectArticle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  >
                    {articles.map(art => (
                      <option key={art.slug} value={art.slug}>{art.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Date de la correction *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#be123c] mb-1">
                  Texte erroné avant correction (Ancienne version) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.previousText || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousText: e.target.value }))}
                  placeholder="Ex: Production nationale de 59 tonnes en 2025..."
                  className="w-full px-2.5 py-1.5 border border-rose-300 bg-rose-50/50 rounded font-serif text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#047857] mb-1">
                  Texte rectifié (Nouvelle version vérifiée) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.correctedText || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, correctedText: e.target.value }))}
                  placeholder="Ex: Production nationale consolidée de 57,6 tonnes selon les chiffres DGMG..."
                  className="w-full px-2.5 py-1.5 border border-emerald-300 bg-emerald-50/50 rounded font-serif text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#d97706] mb-1">
                  Motif précis de la rectification *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.reason || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ex: Précision suite à la publication du rapport annuel officiel du ministère..."
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Validé par *
                </label>
                <select
                  value={formData.validatedBy || 'Alfred Ouédraogo (Directeur éditorial)'}
                  onChange={(e) => setFormData(prev => ({ ...prev, validatedBy: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                >
                  <option value="Alfred Ouédraogo (Directeur éditorial)">Alfred Ouédraogo (Directeur éditorial)</option>
                  <option value="Samba Diop (Superadmin)">Samba Diop (Superadmin)</option>
                  <option value="Desk IA Burkina News">Desk IA Burkina News</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center"
                >
                  <Check size={14} />
                  Inscrire au Registre Public
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
