"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  ExternalLink,
  BookOpen,
  Languages,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Article, CategoryCode, ContentType } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import Tooltip from '@/components/ui/Tooltip';

const RUBRIQUES: { code: CategoryCode; label: string }[] = [
  { code: 'economie', label: 'Économie' },
  { code: 'securite', label: 'Sécurité' },
  { code: 'chantiers', label: 'Chantiers' },
  { code: 'agriculture', label: 'Agriculture' },
  { code: 'societe', label: 'Société' },
  { code: 'histoire', label: 'Histoire & Mémoire' },
];

const CONTENT_TYPES: { code: ContentType; label: string }[] = [
  { code: 'decryptage', label: 'Grand Décryptage' },
  { code: 'analyse', label: 'Analyse' },
  { code: 'terrain', label: 'Enquête Terrain' },
  { code: 'vrai-ou-faux', label: 'Vrai ou Faux' },
  { code: 'edito', label: 'Éditorial' },
  { code: 'le-chiffre', label: 'Le Chiffre' },
  { code: 'trois-questions', label: 'Trois Questions' },
];

export default function AdminArticlesPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Form State
  const initialFormState: Partial<Article> = {
    title: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    excerptEn: '',
    body: '',
    bodyEn: '',
    category: 'economie',
    type: 'decryptage',
    author: 'La Rédaction',
    readTime: '7 min',
    sourceCount: 5,
    confidence: 'high',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    tags: ['Burkina Faso', 'Enquête'],
    issueId: 'issue-03',
  };

  const [formData, setFormData] = useState<Partial<Article>>(initialFormState);
  const [tagsInput, setTagsInput] = useState('');

  // Fetch data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les articles.');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err: any) {
      error('Erreur de chargement', err.message || 'Échec de la récupération des articles.');
    } finally {
      setTimeout(() => setLoading(false), 400); // smooth skeleton
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch = 
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.titleEn && art.titleEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || art.category === categoryFilter;
      const matchesType = typeFilter === 'all' || art.type === typeFilter;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [articles, searchTerm, categoryFilter, typeFilter]);

  // Handle open modal for creation
  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setTagsInput('Burkina Faso, Enquête');
    setIsEditing(false);
    setActiveTab('fr');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (article: Article) => {
    setFormData({ ...article });
    setTagsInput((article.tags || []).join(', '));
    setIsEditing(true);
    setActiveTab('fr');
    setIsModalOpen(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug && isEditing ? prev.slug : val.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    }));
  };

  // Submit create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.body) {
      warning('Champs obligatoires', 'Veuillez remplir au minimum le titre, la rubrique et le corps de l\'article.');
      return;
    }

    const payload: Article = {
      ...(formData as Article),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    const action = isEditing ? 'update_article' : 'create_article';

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success(
        isEditing ? 'Article mis à jour' : 'Article publié', 
        `"${payload.title}" a été enregistré avec succès.`
      );

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message);
    }
  };

  // Delete article
  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_article', payload: { id } })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Échec de la suppression.');

      success('Article retiré', `L'article "${title}" a été supprimé des publications.`);
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
            <FileText size={15} />
            <span>Rédaction & Publications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Articles & Enquêtes
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Gestion intégrale des décryptages, enquêtes terrain, analyses et de la rubrique Histoire.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={16} />
          Nouvel Article
        </button>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Total Articles</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{articles.length}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Contenus en ligne</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Rubrique Histoire</div>
            <div className="text-2xl font-mono font-bold text-[#be185d] mt-1">
              {articles.filter(a => a.category === 'histoire').length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Archives & Mémoire</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Grands Décryptages</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {articles.filter(a => a.type === 'decryptage').length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Enquêtes approfondies</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Bilinguisme EN</div>
            <div className="text-2xl font-mono font-bold text-[#1e3a5f] mt-1">
              {articles.filter(a => a.titleEn && a.bodyEn).length} / {articles.length}
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Traduits et validés</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e6dfd5] p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#736c62]" />
          <input
            type="text"
            placeholder="Rechercher par titre, mot-clé, tag..."
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
            <span>Rubrique :</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Toutes les rubriques</option>
            {RUBRIQUES.map(cat => (
              <option key={cat.code} value={cat.code}>{cat.label}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Tous les formats</option>
            {CONTENT_TYPES.map(t => (
              <option key={t.code} value={t.code}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <SkeletonTable rows={6} columns={6} />
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucun article trouvé</div>
          <p className="text-xs font-mono text-[#736c62] mt-1 max-w-sm mx-auto">
            Aucun contenu ne correspond à vos filtres de recherche. Essayez de réinitialiser vos critères.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('all'); }}
            className="mt-4 px-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] font-mono text-xs rounded hover:bg-[#e6dfd5]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e6dfd5] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase tracking-wider text-[#736c62]">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3">Rubrique</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Sources</th>
                <th className="py-3 px-3">EN</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5] text-xs font-mono">
              {filteredArticles.map((art) => {
                const isHistoire = art.category === 'histoire';
                const hasEn = Boolean(art.titleEn && art.bodyEn);

                return (
                  <tr key={art.id} className="hover:bg-[#faf8f5]/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <div className="flex items-start gap-3">
                        <img 
                          src={art.image || '/images/lead.jpeg'} 
                          alt="" 
                          className="w-12 h-10 object-cover rounded border border-[#e6dfd5] shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-sm text-[#141414] line-clamp-1 hover:text-[#087443]">
                            {art.title}
                          </div>
                          {art.titleEn && (
                            <div className="text-[11px] text-[#736c62] italic line-clamp-1 mt-0.5">
                              EN: {art.titleEn}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#736c62]">
                            <span className="flex items-center gap-1">
                              <User size={10} /> {art.author}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {art.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isHistoire 
                          ? 'bg-[#be185d]/10 text-[#be185d] border border-[#be185d]/30 font-extrabold'
                          : art.category === 'economie'
                          ? 'bg-[#087443]/10 text-[#087443]'
                          : art.category === 'securite'
                          ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
                          : art.category === 'chantiers'
                          ? 'bg-[#d97706]/10 text-[#d97706]'
                          : art.category === 'agriculture'
                          ? 'bg-[#15803d]/10 text-[#15803d]'
                          : 'bg-[#7c3aed]/10 text-[#7c3aed]'
                      }`}>
                        {art.category === 'histoire' ? 'Histoire' : art.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] text-[#5a554e] bg-[#faf8f5] px-2 py-0.5 border border-[#e6dfd5] rounded">
                        {CONTENT_TYPES.find(t => t.code === art.type)?.label || art.type}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087443]">
                        <ShieldCheck size={13} />
                        {art.sourceCount} sources
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {hasEn ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#087443] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <Check size={11} /> OK
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#a7a29a] italic">
                          À traduire
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[#736c62] text-[11px]">
                      {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip position="top" content="Voir l'enquête sur le site public">
                          <Link
                            href={`/fr/${art.category}/${art.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded"
                            aria-label="Voir sur le site public"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </Tooltip>

                        <Tooltip position="top" content="Modifier cette enquête">
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded"
                            aria-label="Modifier l'article"
                          >
                            <Edit3 size={14} />
                          </button>
                        </Tooltip>

                        <Tooltip position="top" content="Supprimer cette enquête">
                          <button
                            onClick={() => setIsDeletingId(art.id)}
                            className="p-1.5 text-[#736c62] hover:text-[#c2410c] hover:bg-[#faf8f5] rounded"
                            aria-label="Supprimer l'article"
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

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-[#c2410c] p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-[#141414] flex items-center gap-2">
              <AlertCircle size={20} className="text-[#c2410c]" />
              Confirmer la suppression
            </h3>
            <p className="text-xs font-mono text-[#5a554e] mt-2">
              Êtes-vous certain de vouloir supprimer cet article ? Cette action le retirera immédiatement du site public.
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
                  const target = articles.find(a => a.id === isDeletingId);
                  if (target) handleDelete(target.id, target.title);
                }}
                className="px-4 py-2 bg-[#c2410c] text-white text-xs font-mono font-bold hover:bg-[#9a3412]"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#141414] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  {isEditing ? 'Édition de l\'article' : 'Nouvelle Publication'}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#141414]">
                  {isEditing ? `Modifier : ${formData.title?.slice(0, 45)}...` : 'Rédiger un nouvel article'}
                </h2>
              </div>

              {/* Language Switch Tabs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#e6dfd5] p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => setActiveTab('fr')}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors ${
                      activeTab === 'fr' 
                        ? 'bg-white text-[#087443] shadow-sm' 
                        : 'text-[#5a554e] hover:text-[#141414]'
                    }`}
                  >
                    🇫🇷 Français (Principal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors ${
                      activeTab === 'en' 
                        ? 'bg-white text-[#1e3a5f] shadow-sm' 
                        : 'text-[#5a554e] hover:text-[#141414]'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>

                <Tooltip position="left" content="Fermer la boîte de dialogue">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 text-[#736c62] hover:text-[#141414] rounded"
                    aria-label="Fermer la boîte de dialogue"
                  >
                    <X size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* French Tab */}
              {activeTab === 'fr' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                        Titre de l'article (Français) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ex: Le Burkina Faso produit-il vraiment plus d'or qu'avant ?"
                        className="w-full px-3 py-2 text-sm font-serif border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                        Slug URL (Identifiant) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="ex: burkina-faso-production-or"
                        className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] bg-[#faf8f5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                        Rubrique éditoriale *
                      </label>
                      <select
                        value={formData.category || 'economie'}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CategoryCode }))}
                        className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                      >
                        {RUBRIQUES.map(r => (
                          <option key={r.code} value={r.code}>
                            {r.label} {r.code === 'histoire' ? '🏛️' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                        Chapeau / Résumé d'accroche (Français) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Résumé en 2-3 phrases des points saillants vérifiés..."
                        className="w-full px-3 py-2 text-xs font-serif border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-2">
                        Corps de l'enquête / Texte intégral (Français) *
                      </label>
                      <RichTextEditor
                        value={formData.body || ''}
                        onChange={(val) => setFormData(prev => ({ ...prev, body: val }))}
                        label="TEXT"
                        placeholder="Texte détaillé de l'article, citations vérifiées, données chiffrées..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* English Tab */}
              {activeTab === 'en' && (
                <div className="space-y-4 bg-[#f8fafc] p-4 border border-[#cbd5e1] rounded">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1e3a5f] uppercase tracking-wider mb-2">
                    <Languages size={15} />
                    <span>Version Anglaise (International Edition)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                      Article Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      placeholder="e.g. Is Burkina Faso Really Producing More Gold Than Before?"
                      className="w-full px-3 py-2 text-sm font-serif border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                      Excerpt / Subhead (English)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerptEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                      placeholder="Between statutory statistics and physical mining reality..."
                      className="w-full px-3 py-2 text-xs font-serif border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-2">
                      Full Investigation Body (English)
                    </label>
                    <RichTextEditor
                      value={formData.bodyEn || ''}
                      onChange={(val) => setFormData(prev => ({ ...prev, bodyEn: val }))}
                      label="TEXT (EN)"
                      placeholder="English translation of the full article..."
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata Fields */}
              <div className="border-t border-[#e6dfd5] pt-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#736c62] block mb-3">
                  Métadonnées éditoriales & Déontologie
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#141414] mb-1">
                      Format de publication
                    </label>
                    <select
                      value={formData.type || 'decryptage'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentType }))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    >
                      {CONTENT_TYPES.map(t => (
                        <option key={t.code} value={t.code}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#141414] mb-1">
                      Nombre de sources vérifiées
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sourceCount ?? 5}
                      onChange={(e) => setFormData(prev => ({ ...prev, sourceCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#141414] mb-1">
                      Niveau de confiance
                    </label>
                    <select
                      value={formData.confidence || 'high'}
                      onChange={(e) => setFormData(prev => ({ ...prev, confidence: e.target.value as any }))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    >
                      <option value="high">Élevé (Vérifié croisé)</option>
                      <option value="medium">Moyen (Source unique officielle)</option>
                      <option value="low">Préliminaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#141414] mb-1">
                      Temps de lecture
                    </label>
                    <input
                      type="text"
                      value={formData.readTime || '7 min'}
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-4">
                    <ImageUploader
                      label="Image de couverture de l'enquête"
                      value={formData.image || ''}
                      onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                      helperText="Téléversez une image locale depuis votre ordinateur (PNG, JPG, WebP) ou renseignez un lien web."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#141414] mb-1">
                      Mots-clés / Tags (séparés par virgule)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="mines, or, DGMG..."
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-[#e6dfd5] pt-4 flex items-center justify-between bg-[#faf8f5] -mx-4 -mb-4 p-4 sm:-mx-6 sm:-mb-6 sm:p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#e6dfd5] text-xs font-mono font-bold hover:bg-white transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#087443] text-white font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-[#075f37] transition-colors shadow-sm"
                >
                  <Check size={16} />
                  {isEditing ? 'Enregistrer les modifications' : 'Publier l\'article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
