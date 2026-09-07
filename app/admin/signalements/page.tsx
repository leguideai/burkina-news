"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  AlertCircle, 
  Mail, 
  ExternalLink, 
  Check, 
  X, 
  Scale, 
  Calendar, 
  Clock, 
  User, 
  Link2, 
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';
import MicumIcon from '@/components/admin/MicumIcon';

interface Submission {
  id: string;
  createdAt: string;
  type: 'error_report' | 'general';
  email: string;
  url?: string;
  description?: string;
  source?: string;
  name?: string;
  category?: string;
  message?: string;
  status?: 'pending' | 'resolved' | 'archived';
}

export default function AdminSignalementsPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'error_report' | 'general'>('all');

  // Modal to Convert Error Report to Public Correction
  const [convertingReport, setConvertingReport] = useState<Submission | null>(null);
  const [corrArticleTitle, setCorrArticleTitle] = useState('');
  const [corrPreviousText, setCorrPreviousText] = useState('');
  const [corrCorrectedText, setCorrCorrectedText] = useState('');
  const [corrReason, setCorrReason] = useState('');
  const [corrValidator, setCorrValidator] = useState('Alfred Ouédraogo (Directeur éditorial)');

  // Fetch Submissions
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les signalements.');
      const data = await res.json();
      setSubmissions(data.contacts || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      if (typeFilter === 'all') return true;
      return sub.type === typeFilter;
    });
  }, [submissions, typeFilter]);

  // Open Convert Modal
  const handleOpenConvert = (sub: Submission) => {
    setConvertingReport(sub);
    setCorrArticleTitle(sub.url?.split('/').pop()?.replace(/-/g, ' ') || 'Article signalé');
    setCorrPreviousText('');
    setCorrCorrectedText('');
    setCorrReason(`Rectification suite au signalement lecteur (${sub.email}) basé sur la source : ${sub.source || 'Rapport communiqué'}`);
    setCorrValidator('Alfred Ouédraogo (Directeur éditorial)');
  };

  // Micum AI Instant Assistant for Error Reports
  const [micumLoadingId, setMicumLoadingId] = useState<string | null>(null);

  const handleMicumConvert = async (sub: Submission) => {
    try {
      setMicumLoadingId(sub.id);
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert_signalement',
          payload: { report: sub }
        })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'analyse par Micum');
      const json = await res.json();
      if (json.data) {
        setConvertingReport(sub);
        setCorrArticleTitle(json.data.articleTitle || sub.url?.split('/').pop()?.replace(/-/g, ' ') || 'Article signalé');
        setCorrPreviousText(json.data.previousText || '');
        setCorrCorrectedText(json.data.correctedText || '');
        setCorrReason(json.data.reason || `Rectification suite au signalement lecteur (${sub.email})`);
        setCorrValidator(json.data.validator || 'Alfred Ouédraogo (Directeur éditorial)');
        success('Analyse Micum terminée', 'La correction déontologique a été formulée automatiquement. Vérifiez et validez.');
      }
    } catch (err: any) {
      error('Erreur Micum', err.message || 'Impossible d\'analyser le signalement.');
      handleOpenConvert(sub);
    } finally {
      setMicumLoadingId(null);
    }
  };

  // Submit Converted Correction
  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrArticleTitle || !corrPreviousText || !corrCorrectedText || !corrReason) {
      warning('Champs requis', 'Veuillez remplir le titre, l\'ancien texte, le texte corrigé et le motif.');
      return;
    }

    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        articleTitle: corrArticleTitle,
        articleSlug: convertingReport?.url?.split('/').pop() || 'article-corrige',
        previousText: corrPreviousText,
        correctedText: corrCorrectedText,
        reason: corrReason,
        validatedBy: corrValidator,
      };

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_correction',
          payload
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors de l\'inscription.');

      success(
        'Correction inscrite au registre public',
        `Le signalement a été converti en correction officielle avec succès.`
      );

      setConvertingReport(null);
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#c2410c] font-bold uppercase tracking-wider">
            <AlertCircle size={15} />
            <span>Veille Participative & Déontologie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Signalements des Lecteurs
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Retours critiques de l'audience, détection d'erreurs matérielles et demandes de contact institutionnel.
          </p>
        </div>

        <Link
          href="/fr/contact"
          target="_blank"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors self-start md:self-auto"
        >
          <ExternalLink size={14} />
          Tester le formulaire public
        </Link>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Total Messages</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{submissions.length}</div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Boîte de réception unifiée</div>
          </div>
          <div className="bg-white border-2 border-[#c2410c] p-4 bg-orange-50/20">
            <div className="text-[11px] font-mono uppercase text-[#c2410c] font-bold">Erreurs Factuelles Signalées</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {submissions.filter(s => s.type === 'error_report').length}
            </div>
            <div className="text-[10px] font-mono text-[#c2410c] mt-0.5">Instruction sous 48h obligatoire</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Prises de Contact Générales</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {submissions.filter(s => s.type === 'general').length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Partenariats & Questions</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e6dfd5] pb-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
            typeFilter === 'all'
              ? 'bg-[#141414] text-white'
              : 'text-[#5a554e] hover:bg-[#e6dfd5]'
          }`}
        >
          Tous les flux ({submissions.length})
        </button>
        <button
          onClick={() => setTypeFilter('error_report')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 ${
            typeFilter === 'error_report'
              ? 'bg-[#c2410c] text-white'
              : 'text-[#c2410c] bg-orange-50 hover:bg-orange-100'
          }`}
        >
          <ShieldAlert size={13} />
          Signalements d'erreur ({submissions.filter(s => s.type === 'error_report').length})
        </button>
        <button
          onClick={() => setTypeFilter('general')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
            typeFilter === 'general'
              ? 'bg-[#087443] text-white'
              : 'text-[#087443] bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          Contacts généraux ({submissions.filter(s => s.type === 'general').length})
        </button>
      </div>

      {/* Submissions Feed */}
      {loading ? (
        <SkeletonTable rows={4} columns={4} />
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <CheckCircle2 size={36} className="mx-auto text-[#087443] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Boîte de réception à jour</div>
          <p className="text-xs font-mono text-[#736c62] mt-1">
            Aucun message en attente dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => {
            const isError = sub.type === 'error_report';

            return (
              <div 
                key={sub.id}
                className={`bg-white border p-5 shadow-xs space-y-3 transition-colors ${
                  isError 
                    ? 'border-l-4 border-l-[#c2410c] border-y-[#e6dfd5] border-r-[#e6dfd5]' 
                    : 'border-[#e6dfd5]'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd5] pb-2.5">
                  <div className="flex items-center gap-2">
                    {isError ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-orange-100 text-[#c2410c] rounded">
                        <ShieldAlert size={12} />
                        Signalement d'erreur
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-[#087443] rounded">
                        {sub.category || 'Général'}
                      </span>
                    )}

                    <span className="text-xs font-mono text-[#736c62] flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(sub.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#141414] font-bold flex items-center gap-1">
                      <Mail size={12} className="text-[#736c62]" />
                      {sub.email}
                    </span>
                    {sub.name && <span className="text-[#736c62]">({sub.name})</span>}
                  </div>
                </div>

                {/* Content */}
                {isError ? (
                  <div className="space-y-2.5 text-xs font-mono">
                    {sub.url && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#087443]">
                        <Link2 size={12} />
                        <span className="font-bold">Article contesté :</span>
                        <a href={sub.url} target="_blank" className="underline hover:text-[#075f37]">
                          {sub.url}
                        </a>
                      </div>
                    )}

                    <div className="bg-[#faf8f5] p-3 rounded border border-[#e6dfd5]">
                      <span className="text-[10px] font-bold uppercase text-[#736c62] block mb-1">
                        Description de l'erreur soumise par le lecteur :
                      </span>
                      <p className="font-serif text-sm text-[#141414] leading-relaxed">
                        « {sub.description} »
                      </p>
                    </div>

                    {sub.source && (
                      <div className="bg-amber-50/60 p-2.5 rounded border border-amber-200/60 text-[11px] text-amber-900">
                        <b>Source primaire contradictoire invoquée :</b> {sub.source}
                      </div>
                    )}

                    {/* Action button to convert into correction */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                      <Tooltip position="top" content="Micum analyse le signalement, retrouve le texte et formule le diff Avant/Après automatiquement">
                        <button
                          onClick={() => handleMicumConvert(sub)}
                          disabled={micumLoadingId === sub.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all shadow-xs cursor-pointer disabled:opacity-50"
                          aria-label="Traiter avec Micum"
                        >
                          {micumLoadingId === sub.id ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Micum analyse...</span>
                            </>
                          ) : (
                            <>
                              <MicumIcon size={14} glow />
                              <span>Traiter avec Micum</span>
                            </>
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip position="top" content="Inscrire manuellement une correction déontologique">
                        <button
                          onClick={() => handleOpenConvert(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c2410c] text-white hover:bg-[#9a3412] text-xs font-mono font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
                          aria-label="Convertir en correction"
                        >
                          <Scale size={13} />
                          Saisie Manuelle
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-serif text-[#141414] bg-[#faf8f5] p-3 rounded border border-[#e6dfd5] leading-relaxed">
                    « {sub.message} »
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Convert to Public Correction Modal */}
      {convertingReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#c2410c] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-orange-50/50 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Scale size={18} className="text-[#c2410c] shrink-0" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414] truncate">
                  Convertir en correction certifiée
                </h3>
              </div>
              <Tooltip position="left" content="Fermer la boîte de dialogue">
                <button
                  onClick={() => setConvertingReport(null)}
                  className="p-1 text-[#736c62] hover:text-[#141414] shrink-0"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </Tooltip>
            </div>

            <form onSubmit={handleSubmitCorrection} className="p-4 sm:p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Titre de l'Article Rectifié *
                </label>
                <input
                  type="text"
                  required
                  value={corrArticleTitle}
                  onChange={(e) => setCorrArticleTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded font-serif text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#be123c] mb-1">
                  Texte erroné avant rectification (Version contestée) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={corrPreviousText}
                  onChange={(e) => setCorrPreviousText(e.target.value)}
                  placeholder="Ex: Tonnage annoncé de 4,2 tonnes..."
                  className="w-full px-2.5 py-1.5 border border-rose-300 bg-rose-50/50 rounded font-serif text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#047857] mb-1">
                  Texte rectifié & documenté (Nouvelle version) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={corrCorrectedText}
                  onChange={(e) => setCorrCorrectedText(e.target.value)}
                  placeholder="Ex: Tonnage effectif révisé à 4,75 tonnes selon rapport trimestriel..."
                  className="w-full px-2.5 py-1.5 border border-emerald-300 bg-emerald-50/50 rounded font-serif text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#d97706] mb-1">
                  Motif public au Registre *
                </label>
                <textarea
                  rows={2}
                  required
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Validateur déontologique *
                </label>
                <select
                  value={corrValidator}
                  onChange={(e) => setCorrValidator(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                >
                  <option value="Alfred Ouédraogo (Directeur éditorial)">Alfred Ouédraogo (Directeur éditorial)</option>
                  <option value="Samba Diop (Superadmin)">Samba Diop (Superadmin)</option>
                  <option value="Desk IA Burkina News">Desk IA Burkina News</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setConvertingReport(null)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center"
                >
                  <Check size={14} />
                  Publier au Registre des Corrections
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
