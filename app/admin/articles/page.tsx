"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
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
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FolderTree
} from 'lucide-react';
import { ArticleDTO, ArticleFormat, CategoryDTO, PaginationMeta } from '@/lib/api/types';
import { articlesApi } from '@/lib/api/articles';
import { categoriesApi } from '@/lib/api/categories';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

const CONTENT_TYPES: { code: ArticleFormat; label: string }[] = [
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

  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, total_pages: 1 });

  // Global KPIs across the entire catalog (independent of current page)
  const [kpis, setKpis] = useState({ total: 0, histoire: 0, decryptages: 0, bilingual: 0 });
  const [kpisLoading, setKpisLoading] = useState(true);
  
  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Sync category filter if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategoryFilter(cat);
      setSubCategoryFilter('all');
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Load categories from Go API
  useEffect(() => {
    (async () => {
      try {
        const cats = await categoriesApi.listCategories(true);
        setCategories(cats || []);
      } catch {
        // Silent fallback
      }
    })();
  }, []);

  // Compute available sub-categories for the selected category
  const availableSubCategories = useMemo(() => {
    if (categoryFilter === 'all') return [];
    const target = categories.find(c => c.code === categoryFilter);
    return target?.sub_categories || [];
  }, [categoryFilter, categories]);

  // Load global KPIs once from full catalog
  const loadKpis = useCallback(async () => {
    try {
      setKpisLoading(true);
      const res = await articlesApi.adminListArticles({ limit: 100 });
      const allArts = res.articles || [];
      const total = res.meta?.total || allArts.length;
      const histoire = allArts.filter(a => a.category_code === 'histoire').length;
      const decryptages = allArts.filter(a => a.type === 'decryptage').length;
      const bilingual = allArts.filter(a => Boolean(a.title_en && a.body_en)).length;
      setKpis({ total, histoire, decryptages, bilingual });
    } catch {
      // Fallback
    } finally {
      setKpisLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  // Fetch paginated articles from Go API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articlesApi.adminListArticles({
        page: currentPage,
        limit: pageSize,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sub_category: subCategoryFilter !== 'all' ? subCategoryFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm ? searchTerm : undefined,
      });
      setArticles(res.articles || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      error('Erreur de chargement', err.message || 'Échec de la récupération des articles depuis la base.');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }, [currentPage, pageSize, categoryFilter, subCategoryFilter, typeFilter, statusFilter, searchTerm, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Delete article via Go API
  const handleDelete = async (id: string, title: string) => {
    try {
      await articlesApi.deleteArticle(id);
      success('Article supprimé', `L'article "${title}" a été supprimé de la base de données.`);
      setIsDeletingId(null);
      loadData();
      loadKpis();
    } catch (err: any) {
      error('Erreur de suppression', err.message || 'Impossible de supprimer cet article.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#087443]">Publié</span>;
      case 'review':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">En relecture</span>;
      case 'archived':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">Archivé</span>;
      default:
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">Brouillon</span>;
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
            Articles & Grandes Enquêtes
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Catalogue d&apos;investigation connecté en temps réel à l&apos;API Go et PostgreSQL 16.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="p-2 border border-[#e6dfd5] hover:bg-[#faf8f5] text-[#736c62] rounded transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus size={16} />
            Nouvel Article
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      {kpisLoading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Total Articles</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{kpis.total}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Enquêtes en base</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Rubrique Histoire</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {kpis.histoire}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Archives & Mémoire</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Grands Décryptages</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {kpis.decryptages}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Enquêtes de fond</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Bilinguisme EN</div>
            <div className="text-2xl font-mono font-bold text-[#1e3a5f] mt-1">
              {kpis.bilingual} / {kpis.total}
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Traduits en anglais</div>
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] bg-[#faf8f5]"
          />
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736c62] hover:text-[#141414]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-[#736c62]">
            <Filter size={14} />
            <span>Rubrique :</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubCategoryFilter('all');
              setCurrentPage(1);
            }}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Toutes les rubriques</option>
            {categories.map(cat => (
              <option key={cat.code} value={cat.code}>{cat.name_fr}</option>
            ))}
          </select>

          {/* Dynamic Sub-category Selector */}
          {categoryFilter !== 'all' && availableSubCategories.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-[#736c62]">
                <FolderTree size={14} />
                <span>Sous-rubrique :</span>
              </div>
              <select
                value={subCategoryFilter}
                onChange={(e) => {
                  setSubCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
              >
                <option value="all">Toutes les sous-rubriques</option>
                {availableSubCategories.map(sub => (
                  <option key={sub.code} value={sub.code}>{sub.name_fr}</option>
                ))}
              </select>
            </>
          )}

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Tous les formats</option>
            {CONTENT_TYPES.map(t => (
              <option key={t.code} value={t.code}>{t.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="review">En relecture</option>
            <option value="archived">Archivés</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <SkeletonTable rows={6} columns={6} />
      ) : articles.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucun article trouvé</div>
          <p className="text-xs font-mono text-[#736c62] mt-1 max-w-sm mx-auto">
            Aucun contenu ne correspond à vos critères de recherche dans la base de données.
          </p>
          <button
            onClick={() => { 
              setSearchTerm(''); 
              setCategoryFilter('all'); 
              setSubCategoryFilter('all');
              setTypeFilter('all'); 
              setStatusFilter('all'); 
              setCurrentPage(1);
            }}
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
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3">Rubrique & Sous-rubrique</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3">Sources</th>
                <th className="py-3 px-3">EN</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5] text-xs font-mono">
              {articles.map((art) => {
                const isHistoire = art.category_code === 'histoire';
                const hasEn = Boolean(art.title_en && art.body_en);
                const categoryName = art.category?.name_fr || art.category_code;
                const authorName = art.author?.name || 'La Rédaction';
                const imageUrl = art.image || art.featured_image || '/images/lead.jpeg';

                return (
                  <tr key={art.id} className="hover:bg-[#faf8f5]/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <div className="flex items-start gap-3">
                        <img 
                          src={imageUrl} 
                          alt={art.title_fr} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/lead.jpeg';
                          }}
                          className="w-12 h-10 object-cover rounded border border-[#e6dfd5] shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-sm text-[#141414] line-clamp-1 hover:text-[#087443]">
                            {art.title_fr}
                          </div>
                          {art.title_en && (
                            <div className="text-[11px] text-[#736c62] italic line-clamp-1 mt-0.5">
                              EN: {art.title_en}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#736c62]">
                            <span className="flex items-center gap-1">
                              <User size={10} /> {authorName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {art.read_time || 5} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isHistoire 
                            ? 'bg-emerald-50 text-[#087443] border border-emerald-300 font-extrabold'
                            : art.category_code === 'economie'
                            ? 'bg-[#087443]/10 text-[#087443]'
                            : art.category_code === 'securite'
                            ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
                            : art.category_code === 'chantiers'
                            ? 'bg-[#d97706]/10 text-[#d97706]'
                            : art.category_code === 'agriculture'
                            ? 'bg-[#15803d]/10 text-[#15803d]'
                            : 'bg-[#7c3aed]/10 text-[#7c3aed]'
                        }`}>
                          {categoryName}
                        </span>
                        {(art.sub_category?.name_fr || art.sub_category_code) && (
                          <span className="text-[10px] text-[#736c62] flex items-center gap-1 font-mono">
                            <span className="text-[#a7a29a]">›</span>
                            <span>{art.sub_category?.name_fr || art.sub_category_code}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] text-[#5a554e] bg-[#faf8f5] px-2 py-0.5 border border-[#e6dfd5] rounded">
                        {CONTENT_TYPES.find(t => t.code === art.type)?.label || art.type}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(art.status)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087443]">
                        <ShieldCheck size={13} />
                        {art.source_count || 0} sources
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
                      {art.published_at ? new Date(art.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : (
                        art.created_at ? new Date(art.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip position="top" content="Voir l'enquête sur le site public">
                          <Link
                            href={`/fr/${art.category_code}/${art.slug}`}
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

          {/* Pagination Controls */}
          <div className="p-3.5 bg-[#faf8f5] border-t border-[#e6dfd5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3 text-[#736c62] flex-wrap">
              <span>
                Affichage de <strong className="text-[#141414]">{meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0}</strong> à <strong className="text-[#141414]">{Math.min(meta.page * meta.limit, meta.total)}</strong> sur <strong className="text-[#141414]">{meta.total}</strong> articles
              </span>
              <span className="hidden sm:inline text-[#e6dfd5]">|</span>
              <div className="flex items-center gap-1.5">
                <span>Lignes par page :</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-0.5 border border-[#e6dfd5] bg-white rounded text-xs font-mono focus:outline-none focus:border-[#087443]"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {meta.total_pages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={meta.page <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border border-[#e6dfd5] rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  title="Page précédente"
                >
                  <ChevronLeft size={13} />
                  <span className="hidden sm:inline">Précédent</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: meta.total_pages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === meta.total_pages || Math.abs(p - meta.page) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && p - prev > 1;
                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && <span className="px-1 text-[#a7a29a]">...</span>}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-mono font-bold transition-colors ${
                              p === meta.page
                                ? 'bg-[#087443] text-white shadow-xs'
                                : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-[#faf8f5]'
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  type="button"
                  disabled={meta.page >= meta.total_pages}
                  onClick={() => setCurrentPage(p => Math.min(meta.total_pages, p + 1))}
                  className="px-2.5 py-1 border border-[#e6dfd5] rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  title="Page suivante"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
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
              Êtes-vous certain de vouloir supprimer cette enquête d&apos;investigation ? Cette action est irréversible en base de données.
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
                  if (target) handleDelete(target.id, target.title_fr);
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
