"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Check, 
  X, 
  FileDown, 
  Calendar, 
  FileText, 
  Languages,
  AlertCircle
} from 'lucide-react';
import { Issue, Article } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonCard, SkeletonStat } from '@/components/admin/Skeleton';
import ImageUploader from '@/components/admin/ImageUploader';
import Tooltip from '@/components/ui/Tooltip';

export default function AdminNumerosPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Modal State
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [formData, setFormData] = useState<Partial<Issue>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les numéros.');
      const data = await res.json();
      setIssues(data.issues || []);
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

  // Open Edit Modal
  const handleOpenEdit = (iss: Issue) => {
    setEditingIssue(iss);
    setFormData({ ...iss });
    setActiveTab('fr');
  };

  // Submit Issue Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      warning('Champ requis', 'Veuillez renseigner le titre du numéro.');
      return;
    }

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_issue',
          payload: formData
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'enregistrement.');

      success('Numéro actualisé', `Le Numéro #${formData.number} a été mis à jour avec succès.`);
      setEditingIssue(null);
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
            <BookOpen size={15} />
            <span>Revue Mensuelle & Édition Téléchargeable</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Les Numéros Mensuels
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Publication intégrale de la revue, gestion des couvertures, sommaires et fichiers PDF.
          </p>
        </div>

        <Link
          href="/fr/numeros"
          target="_blank"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors self-start md:self-auto"
        >
          <ExternalLink size={14} />
          Voir les archives publiques
        </Link>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Numéros Publiés</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{issues.length}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Revues mensuelles complètes</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Dernière Parution</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              Numéro #{issues[0]?.number || 3}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">{issues[0]?.publicationDate || 'Août 2026'}</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Édition Bilingue</div>
            <div className="text-2xl font-mono font-bold text-[#1e3a5f] mt-1">100%</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Sommaires FR et EN certifiés</div>
          </div>
        </div>
      )}

      {/* Issues Grid */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((iss) => {
            const issueArticles = articles.filter(a => a.issueId === iss.id);

            return (
              <div 
                key={iss.id}
                className="bg-white border border-[#e6dfd5] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Issue Cover Header */}
                  <div className="relative aspect-[16/10] bg-[#141414] overflow-hidden">
                    <img 
                      src={iss.coverImage || '/images/lead.jpeg'} 
                      alt="" 
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-[#f46b18] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded">
                        Numéro {iss.number < 10 ? `0${iss.number}` : iss.number}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] font-mono uppercase text-[#ffd8a8]">
                        {iss.publicationDate}
                      </div>
                      <h3 className="font-serif font-bold text-base line-clamp-1">
                        {iss.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {iss.titleEn && (
                      <div className="text-xs font-mono text-[#736c62] italic line-clamp-1">
                        EN: {iss.titleEn}
                      </div>
                    )}

                    <p className="text-xs font-serif text-[#5a554e] line-clamp-3 leading-relaxed">
                      {iss.summary}
                    </p>

                    <div className="pt-2 border-t border-[#e6dfd5] flex items-center justify-between text-xs font-mono text-[#736c62]">
                      <span className="flex items-center gap-1 font-bold text-[#141414]">
                        <FileText size={13} className="text-[#087443]" />
                        {issueArticles.length || iss.articleCount || 5} articles
                      </span>

                      {iss.pdfUrl ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#087443] font-bold">
                          <FileDown size={12} /> PDF disponible
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#a7a29a] italic">
                          PDF non renseigné
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3.5 bg-[#faf8f5] border-t border-[#e6dfd5] flex items-center justify-between">
                  <Tooltip position="top" content="Consulter ce numéro en ligne">
                    <Link
                      href={`/fr/numeros/${iss.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#087443] hover:underline font-bold"
                      aria-label="Consulter le numéro"
                    >
                      <ExternalLink size={13} />
                      Consulter
                    </Link>
                  </Tooltip>

                  <Tooltip position="top" content="Modifier le sommaire et la couverture">
                    <button
                      onClick={() => handleOpenEdit(iss)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors"
                      aria-label="Modifier le numéro"
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
      )}

      {/* Edit Issue Modal */}
      {editingIssue && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Numéro #{formData.number}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  Modifier la publication mensuelle
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
                    onClick={() => setEditingIssue(null)}
                    className="p-1 text-[#736c62] hover:text-[#141414] shrink-0"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              {activeTab === 'fr' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Titre du Grand Décryptage (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Éditorial / Sommaire du Numéro (Français) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.summary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#f8fafc] p-3 border border-[#cbd5e1] rounded">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] uppercase">
                    <Languages size={13} />
                    <span>English Version</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Issue Lead Investigation Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Editorial Overview (English)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.summaryEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, summaryEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata */}
              <div className="space-y-4 pt-3 border-t border-[#e6dfd5]">
                <ImageUploader
                  label="Image de couverture du numéro"
                  value={formData.coverImage || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                  helperText="Téléversez la couverture grand format du numéro depuis votre ordinateur (PNG, JPG, WebP) ou collez un lien web."
                />

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Lien de Téléchargement PDF
                  </label>
                  <input
                    type="text"
                    value={formData.pdfUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                    placeholder="/downloads/numero-03.pdf ou URL"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Date de Parution affichée
                  </label>
                  <input
                    type="text"
                    value={formData.publicationDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                    placeholder="ex: Août 2026"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.slug || ''}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-[#f5f5f5] text-[#736c62]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingIssue(null)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center"
                >
                  <Check size={14} />
                  Sauvegarder le Numéro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
