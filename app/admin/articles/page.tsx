"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  User, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Article, CategoryCode, ContentType } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
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

function AdminArticlesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialType = searchParams.get('type') || 'all';

  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [typeFilter, setTypeFilter] = useState<string>(initialType);

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Sync category filter if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

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

      const matchesCat = 
        categoryFilter === 'all' || 
        art.category === categoryFilter || 
        (categoryFilter === 'histoire' && (art.category === 'histoire' || art.category === 'idees'));
      const matchesType = typeFilter === 'all' || art.type === typeFilter;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [articles, searchTerm, categoryFilter, typeFilter]);

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
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Gestion intégrale des décryptages, enquêtes terrain, analyses et de la rubrique Histoire.
          </p>
        </div>

        <Link
          href="/admin/articles/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={16} />
          Nouvel Article
        </Link>
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
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
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

      {/* Active Filter Pill */}
      {categoryFilter !== 'all' && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded text-xs font-mono text-[#087443]">
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <span>
              Filtre actif : Rubrique <strong>« {RUBRIQUES.find(r => r.code === categoryFilter)?.label || categoryFilter} »</strong> ({filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''})
            </span>
          </div>
          <button
            onClick={() => setCategoryFilter('all')}
            className="text-xs text-[#087443] underline hover:text-[#075f37] cursor-pointer font-bold"
          >
            Afficher toutes les rubriques
          </button>
        </div>
      )}

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
          <table className="w-full text-left border-collapse min-w-[680px]">
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
                          ? 'bg-emerald-50 text-[#087443] border border-emerald-300 font-extrabold'
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
                          <Link
                            href={`/admin/articles/${art.id}`}
                            className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded inline-flex items-center"
                            aria-label="Modifier l'article"
                          >
                            <Edit3 size={14} />
                          </Link>
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
    </div>
  );
}

export default function AdminArticlesPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <SkeletonTable rows={6} columns={6} />
      </div>
    }>
      <AdminArticlesContent />
    </Suspense>
  );
}

