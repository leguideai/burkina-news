"use client";

import React, { useState, useEffect } from 'react';
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
  Camera
} from 'lucide-react';
import { Brief, BriefFact, CategoryCode } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import ImageUploader from '@/components/admin/ImageUploader';
import Tooltip from '@/components/ui/Tooltip';

const CATEGORIES: { code: CategoryCode; label: string }[] = [
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
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedBriefSlug, setSelectedBriefSlug] = useState<string>('');

  // Fact Edit Modal
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [editingFactIndex, setEditingFactIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Fact Form
  const initialFactState: Partial<BriefFact> = {
    time: '10:00',
    text: '',
    textEn: '',
    source: 'AIB / SIG',
    sourceUrl: 'https://www.sig.bf',
    category: 'economie',
    whyWatch: '',
    whyWatchEn: '',
    image: '',
  };

  const [factFormData, setFactFormData] = useState<Partial<BriefFact>>(initialFactState);

  // Fetch Briefs
  const loadData = async (preferredSlug?: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger Le Fil.');
      const data = await res.json();
      const loadedBriefs: Brief[] = data.briefs || [];
      setBriefs(loadedBriefs);

      if (loadedBriefs.length > 0) {
        if (preferredSlug && loadedBriefs.some(b => b.slug === preferredSlug)) {
          setSelectedBriefSlug(preferredSlug);
        } else if (!selectedBriefSlug) {
          setSelectedBriefSlug(loadedBriefs[0].slug);
        }
      }
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentBrief = briefs.find(b => b.slug === selectedBriefSlug) || briefs[0];

  // Open Add Fact
  const handleOpenAddFact = () => {
    setFactFormData(initialFactState);
    setEditingFactIndex(null);
    setActiveTab('fr');
    setIsFactModalOpen(true);
  };

  // Open Edit Fact
  const handleOpenEditFact = (fact: BriefFact, index: number) => {
    setFactFormData({ ...fact });
    setEditingFactIndex(index);
    setActiveTab('fr');
    setIsFactModalOpen(true);
  };

  // Submit Fact
  const handleSubmitFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factFormData.text || !factFormData.source) {
      warning('Champs obligatoires', 'Veuillez saisir le texte du fait et sa source.');
      return;
    }

    if (!currentBrief) return;

    try {
      const isEdit = editingFactIndex !== null;
      const action = isEdit ? 'update_brief_fact' : 'add_brief_fact';
      const payload = isEdit 
        ? { briefSlug: currentBrief.slug, factIndex: editingFactIndex, fact: factFormData }
        : { briefSlug: currentBrief.slug, fact: factFormData };

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'enregistrement.');

      success(
        isEdit ? 'Fait mis à jour' : 'Nouveau fait inscrit',
        `Le fait de ${factFormData.time} a été enregistré dans l'édition ${currentBrief.title}.`
      );

      setIsFactModalOpen(false);
      loadData(currentBrief.slug);
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
            <Zap size={15} />
            <span>Veille Hebdomadaire (10 Faits Sourcés)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Le Fil Hebdomadaire
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Chaque dimanche, 10 faits rigoureusement sourcés. Pas d'opinion, uniquement les faits vérifiés.
          </p>
        </div>

        {currentBrief && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href={`/fr/fil/${currentBrief.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
            >
              <ExternalLink size={14} />
              Voir l'édition publique
            </Link>
            <button
              onClick={handleOpenAddFact}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
            >
              <Plus size={16} />
              Ajouter un Fait
            </button>
          </div>
        )}
      </div>

      {/* Week Selector Bar */}
      <div className="bg-white border border-[#e6dfd5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#087443]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#141414]">
            Édition du Fil :
          </span>
          <select
            value={selectedBriefSlug}
            onChange={(e) => setSelectedBriefSlug(e.target.value)}
            className="text-xs font-mono font-bold border border-[#e6dfd5] px-3 py-1.5 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            {briefs.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title} ({b.date})
              </option>
            ))}
          </select>
        </div>

        {currentBrief && (
          <div className="flex items-center gap-3 text-xs font-mono text-[#736c62]">
            <span>Semaine {currentBrief.weekNumber}</span>
            <span>•</span>
            <span className="font-bold text-[#087443]">{currentBrief.facts?.length || 0} / 10 faits enregistrés</span>
          </div>
        )}
      </div>

      {/* Facts Timeline & Table */}
      {loading ? (
        <SkeletonTable rows={10} columns={5} />
      ) : !currentBrief ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucune édition trouvée</div>
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
                Édition Active
              </span>
            </div>

            <div className="divide-y divide-[#e6dfd5]">
              {currentBrief.facts.map((fact, idx) => {
                return (
                  <div key={idx} className="p-4 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
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
                          {fact.category && (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#e6dfd5] text-[#141414] rounded">
                              {fact.category}
                            </span>
                          )}
                          <Tooltip position="top" content="Consulter la source officielle">
                            <a 
                              href={fact.sourceUrl || '#'} 
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
                          {fact.text}
                        </div>

                        {/* EN Text */}
                        {fact.textEn && (
                          <div className="text-xs font-serif text-[#5a554e] italic bg-[#f8fafc] p-2 rounded border border-[#e2e8f0]">
                            <span className="font-mono text-[9px] font-bold uppercase text-[#1e3a5f] mr-1.5 not-italic">EN :</span>
                            {fact.textEn}
                          </div>
                        )}

                        {/* Why Watch Note */}
                        {fact.whyWatch && (
                          <div className="text-[11px] font-mono text-[#c2410c] bg-orange-50/70 px-2.5 py-1 rounded border border-orange-200/60 inline-block">
                            <b>Pourquoi surveiller :</b> {fact.whyWatch}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                      <Tooltip position="top" content="Modifier les informations de ce fait">
                        <button
                          onClick={() => handleOpenEditFact(fact, idx)}
                          className="px-2.5 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors inline-flex items-center gap-1.5"
                          aria-label="Modifier le fait"
                        >
                          <Edit3 size={13} />
                          Modifier
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fact Edit / Add Modal */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#d97706]">
                  {editingFactIndex !== null ? `Modifier le fait #${editingFactIndex + 1}` : 'Nouveau Fait Vérifié'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {currentBrief?.title}
                </h3>
              </div>

              {/* Language Switch */}
              <div className="flex items-center gap-2">
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
                    className="p-1 text-[#736c62] hover:text-[#141414]"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitFact} className="p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Heure du fait *
                  </label>
                  <input
                    type="text"
                    required
                    value={factFormData.time || '10:00'}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="ex: 08:30"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Rubrique
                  </label>
                  <select
                    value={factFormData.category || 'economie'}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, category: e.target.value as CategoryCode }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Nom de la Source *
                  </label>
                  <input
                    type="text"
                    required
                    value={factFormData.source || ''}
                    onChange={(e) => setFactFormData(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="ex: Conseil des ministres, AIB..."
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
                  value={factFormData.sourceUrl || ''}
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
                      value={factFormData.text || ''}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, text: e.target.value }))}
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
                      value={factFormData.whyWatch || ''}
                      onChange={(e) => setFactFormData(prev => ({ ...prev, whyWatch: e.target.value }))}
                      placeholder="Ce que ce fait annonce ou implique à moyen terme..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#f8fafc] p-3 border border-[#cbd5e1] rounded">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] uppercase">
                    <Languages size={13} />
                    <span>English Translation</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Factual Statement (English)
                    </label>
                    <textarea
                      rows={3}
                      value={factFormData.textEn || ''}
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
                      value={factFormData.whyWatchEn || ''}
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
                  value={factFormData.image || ''}
                  onChange={(url) => setFactFormData(prev => ({ ...prev, image: url }))}
                  helperText="Téléversez une photo de preuve depuis votre ordinateur (PNG, JPG, WebP) ou renseignez un lien web."
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFactModalOpen(false)}
                  className="px-3 py-1.5 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37]"
                >
                  <Check size={14} />
                  {editingFactIndex !== null ? 'Sauvegarder le fait' : 'Ajouter le fait'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
