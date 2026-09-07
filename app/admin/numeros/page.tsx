"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Trash2,
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
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';

export default function AdminNumerosPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [formData, setFormData] = useState<Partial<Issue>>({});
  const [isDeletingIssue, setIsDeletingIssue] = useState<Issue | null>(null);

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

  // Open Create Modal
  const handleOpenCreate = () => {
    const maxNum = issues.reduce((max, i) => Math.max(max, i.number || 0), 0);
    const nextNum = maxNum > 0 ? maxNum + 1 : 1;
    const nextNumStr = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const curMonth = months[new Date().getMonth()];
    const curYear = new Date().getFullYear();

    setFormData({
      number: nextNum,
      title: '',
      titleEn: '',
      slug: `numero-${nextNumStr}`,
      publicationDate: `${curMonth} ${curYear}`,
      summary: '',
      summaryEn: '',
      coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      articleCount: 5,
      articleIds: [],
      pdfUrl: ''
    });
    setIsEditing(false);
    setActiveTab('fr');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (iss: Issue) => {
    setFormData({ ...iss, articleIds: iss.articleIds || [] });
    setIsEditing(true);
    setActiveTab('fr');
    setIsModalOpen(true);
  };

  // Submit Issue
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      warning('Champ requis', 'Veuillez renseigner le titre du numéro.');
      return;
    }

    try {
      const action = isEditing ? 'update_issue' : 'create_issue';
      const payload = {
        ...formData,
        articleCount: formData.articleIds?.length || formData.articleCount || 0
      };

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'enregistrement.');

      success(
        isEditing ? 'Numéro actualisé' : 'Nouveau numéro créé',
        `Le Numéro #${formData.number} a été enregistré avec succès.`
      );
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  // Delete Issue
  const handleDeleteIssue = async (iss: Issue) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_issue', payload: { id: iss.id, slug: iss.slug } })
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur de suppression.');

      success('Numéro supprimé', `Le Numéro #${iss.number} a été retiré.`);
      setIsDeletingIssue(null);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  // Micum Translation Helper
  const handleMicumTranslate = (translated: Record<string, string>) => {
    setFormData(prev => ({
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

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Link
            href="/fr/numeros"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
          >
            <ExternalLink size={14} />
            Voir les archives publiques
          </Link>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Nouveau Numéro
          </button>
        </div>
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

                  <div className="flex items-center gap-1.5">
                    <Tooltip position="top" content="Modifier le sommaire et la couverture">
                      <button
                        onClick={() => handleOpenEdit(iss)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors cursor-pointer"
                        aria-label="Modifier le numéro"
                      >
                        <Edit3 size={13} />
                        Modifier
                      </button>
                    </Tooltip>
                    <Tooltip position="top" content="Supprimer ce numéro de la collection">
                      <button
                        type="button"
                        onClick={() => setIsDeletingIssue(iss)}
                        className="p-1.5 bg-white border border-[#e6dfd5] text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] rounded transition-colors cursor-pointer"
                        aria-label="Supprimer le numéro"
                      >
                        <Trash2 size={13} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-xl sm:rounded-none overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  {isEditing ? `Numéro #${formData.number}` : 'Nouvelle Publication'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {isEditing ? 'Modifier la publication mensuelle' : 'Créer un Nouveau Numéro Mensuel'}
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
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 text-[#736c62] hover:text-[#141414] shrink-0 cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              {/* Common Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Numéro de Parution *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.number || 1}
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10) || 1;
                      const numStr = num < 10 ? `0${num}` : `${num}`;
                      setFormData(prev => ({
                        ...prev,
                        number: num,
                        ...(!isEditing ? { slug: `numero-${numStr}` } : {})
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Date de Parution affichée *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.publicationDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                    placeholder="ex: Septembre 2026"
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Identifiant URL (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={formData.slug || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') }))}
                    className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-[#736c62]"
                  />
                </div>
              </div>

              {activeTab === 'fr' ? (
                <div className="space-y-3 pt-2 border-t border-[#e6dfd5]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#087443] uppercase tracking-wider">
                      Contenu Éditorial (Français)
                    </span>
                    <MicumTranslateButton
                      fieldsToTranslate={{
                        title: formData.title || '',
                        summary: formData.summary || ''
                      }}
                      targetLang="en"
                      onTranslated={handleMicumTranslate}
                      label="Traduire vers l'Anglais avec Micum"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Titre du Grand Décryptage (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Souveraineté Énergétique et Rupture Industrielle"
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
                      placeholder="Une synthèse des dossiers et enquêtes de ce numéro mensuel..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-[#cbd5e1] bg-[#f8fafc] -mx-5 px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] uppercase">
                    <Languages size={13} />
                    <span>English Version (EN)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      Issue Lead Investigation Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="Ex: Energy Sovereignty and Industrial Breakthrough"
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      Editorial Overview (English)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.summaryEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, summaryEn: e.target.value }))}
                      placeholder="An overview of the monthly issue investigations and reports..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata: Cover Image & PDF */}
              <div className="space-y-4 pt-3 border-t border-[#e6dfd5]">
                <ImageUploader
                  label="Image de couverture du numéro"
                  value={formData.coverImage || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                  helperText="Téléversez la couverture grand format du numéro depuis votre ordinateur (PNG, JPG, WebP) ou collez un lien web."
                />

                <ImageUploader
                  label="Fichier de téléchargement PDF de la revue (Optionnel)"
                  value={formData.pdfUrl || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, pdfUrl: url }))}
                  helperText="Téléversez le document PDF officiel de la revue ou collez une URL de téléchargement."
                />

                {/* Linked Articles Selection */}
                {articles.length > 0 && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Articles associés à ce numéro ({formData.articleIds?.length || 0} sélectionnés)
                    </label>
                    <div className="max-h-36 overflow-y-auto border border-[#e6dfd5] rounded p-2 bg-[#faf8f5] divide-y divide-[#e6dfd5]">
                      {articles.map((art) => {
                        const isSelected = (formData.articleIds || []).includes(art.id);
                        return (
                          <label key={art.id} className="flex items-center gap-2 py-1.5 px-1 hover:bg-white cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentIds = formData.articleIds || [];
                                const newIds = e.target.checked
                                  ? [...currentIds, art.id]
                                  : currentIds.filter(id => id !== art.id);
                                setFormData(prev => ({
                                  ...prev,
                                  articleIds: newIds,
                                  articleCount: newIds.length
                                }));
                              }}
                              className="rounded text-[#087443] focus:ring-[#087443]"
                            />
                            <span className="font-serif font-bold text-[#141414] truncate flex-1">{art.title}</span>
                            <span className="text-[10px] font-mono text-[#736c62] uppercase">{art.category}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] w-full sm:w-auto text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] w-full sm:w-auto text-center cursor-pointer"
                >
                  <Check size={14} />
                  {isEditing ? 'Mettre à jour le Numéro' : 'Créer et Publier le Numéro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Issue Confirmation Modal */}
      {isDeletingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#141414] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#dc2626]">
              <AlertCircle size={24} />
              <h3 className="font-serif font-bold text-lg text-[#141414]">
                Supprimer le Numéro #{isDeletingIssue.number} ?
              </h3>
            </div>
            <p className="text-xs font-mono text-[#5a554e] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l'édition <b>"{isDeletingIssue.title}"</b> ({isDeletingIssue.publicationDate}) de la collection publique ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
              <button
                type="button"
                onClick={() => setIsDeletingIssue(null)}
                className="px-3 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-[#faf8f5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteIssue(isDeletingIssue)}
                className="px-4 py-2 bg-[#dc2626] text-white text-xs font-mono font-bold uppercase rounded hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
