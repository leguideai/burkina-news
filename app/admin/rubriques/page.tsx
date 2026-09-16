"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  Edit3, 
  ExternalLink, 
  FileText, 
  Construction, 
  Check, 
  X, 
  Languages, 
  Sparkles, 
  BookOpen, 
  ShieldCheck,
  Plus,
  Eye,
  EyeOff,
  Layers,
  Compass,
  TrendingUp,
  BookMarked,
  Newspaper,
  ChevronRight,
  Info
} from 'lucide-react';
import { Category, Article, Project } from '@/data/types';
import { SUB_CATEGORIES, JOURNAL_PRODUCTS, isSubCategoryActive } from '@/data/mock/referentiel';
import { categories as defaultCategories } from '@/data/mock/categories';
import { useToast } from '@/components/admin/Toast';
import { SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

export default function AdminRubriquesPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedView, setSelectedView] = useState<string>('all');

  // Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Editorial Framing ("Regard de la Rédaction") extra states
  const [regardFr, setRegardFr] = useState<string>('');
  const [regardEn, setRegardEn] = useState<string>('');

  // Default regards for rubriques
  const defaultRegards: Record<string, { fr: string; en: string }> = {
    economie: {
      fr: "Notre boussole économique repose sur les données primaires : budgets votés vs exécutés, statistiques douanières minières et flux réels dans l'économie des ménages.",
      en: "Our economic compass relies on primary audits: enacted vs executed public budgets, mineral customs declarations, and actual cash flows within local household economies."
    },
    securite: {
      fr: "Face aux défis de souveraineté et à la géopolitique sahélienne, nous documentons avec réserve et rigueur les faits opérationnels, les accords de défense et la réalité du terrain.",
      en: "Addressing sovereignty challenges and Sahelian geopolitics, we document operational developments, defense accords, and front-line realities with rigorous fact-checking."
    },
    chantiers: {
      fr: "Un chantier n'est pas un effet d'annonce. Nous pistons chaque infrastructure de son décret ministériel à sa réception technique effective.",
      en: "An infrastructure project is not a press release. We track every capital work from its initial ministerial decree to physical commissioning."
    },
    agriculture: {
      fr: "La souveraineté alimentaire se joue dans les rendements céréaliers, l'irrigation et la sécurisation foncière des producteurs burkinabè.",
      en: "Food sovereignty is decided across cereal yields, rural irrigation schemes, and land rights for Burkinabè farmers."
    },
    societe: {
      fr: "Éducation, santé publique, innovations civiques : radioscopie des mutations quotidiennes de la société burkinabè.",
      en: "Education, public healthcare, and civic innovations: a factual radiography of everyday transformations across Burkinabè society."
    },
    histoire: {
      fr: "L'histoire burkinabè ne se réduit pas à une succession de crises ou d'hommages figés. De la révolution sankariste de 1983 à nos jours, nous analysons les choix doctrinaux, la mémoire collective et les précédents historiques pour éclairer les décisions contemporaines.",
      en: "Burkinabè history is never merely a sequence of crises or frozen eulogies. From Thomas Sankara's 1983 revolution to present-day trajectories, we analyze doctrinal precedents, archival evidence, and collective memory to illuminate contemporary national choices."
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les rubriques.');
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
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

  // Compute stats per subcategory
  const subCategoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    SUB_CATEGORIES.forEach(sc => {
      stats[sc.code] = articles.filter(a => a.subCategory === sc.code).length;
    });
    return stats;
  }, [articles]);

  const activeSubCatsCount = useMemo(() => {
    return SUB_CATEGORIES.filter(sc => (subCategoryStats[sc.code] || 0) >= 2).length;
  }, [subCategoryStats]);

  const pendingSubCatsCount = useMemo(() => {
    return SUB_CATEGORIES.length - activeSubCatsCount;
  }, [activeSubCatsCount]);

  // Open Edit Modal
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setRegardFr(defaultRegards[cat.code]?.fr || cat.descriptionFr);
    setRegardEn(defaultRegards[cat.code]?.en || cat.descriptionEn);
    setActiveTab('fr');
  };

  // Submit Category Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const payload = {
        ...formData,
        code: editingCategory.code,
      };

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_category',
          payload
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur lors de la mise à jour.');

      success(
        'Cadrage éditorial actualisé',
        `La rubrique "${formData.nameFr}" a été mise à jour avec succès.`
      );

      setEditingCategory(null);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  const displayedCategories = useMemo(() => {
    if (selectedView === 'all' || selectedView === 'produits') {
      return categories;
    }
    return categories.filter(c => c.code === selectedView);
  }, [categories, selectedView]);

  return (
    <div className="space-y-6">
      
      {/* ──────────────────────────────────────────────────────────
          1. TOP BANNER
      ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <Layers size={15} />
            <span>Architecture Éditoriale & Référentiel Fermé</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Gouvernance des 6 Rubriques & 24 Sous-rubriques
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Conforme au brief de la direction éditoriale (Alfred) & charte documentaire v3.1 (Samba).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Nouvel Article</span>
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. STATS KPI BAR
      ────────────────────────────────────────────────────────── */}
      {loading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Rubriques Piliers</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {categories.length} / 6
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Ensemble éditorial clos</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Sous-rubriques Fermées</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">
              {SUB_CATEGORIES.length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">4 par rubrique en moyenne</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Sous-rubriques Actives</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {activeSubCatsCount} <span className="text-xs text-[#736c62] font-normal">/ {SUB_CATEGORIES.length}</span>
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Seuil ≥ 2 articles atteint</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">En Attente d'Activation</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {pendingSubCatsCount}
            </div>
            <div className="text-[10px] font-mono text-[#c2410c] mt-0.5">Masquage automatique Alfred (&lt; 2 articles)</div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          3. NAVIGATION TABS
      ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#e6dfd5] pb-2 text-xs font-mono">
        <button
          onClick={() => setSelectedView('all')}
          className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
            selectedView === 'all' 
              ? 'bg-[#087443] text-white' 
              : 'bg-white border border-[#e6dfd5] text-[#141414] hover:border-[#087443]'
          }`}
        >
          Toutes les Rubriques (6)
        </button>

        {categories.map(cat => (
          <button
            key={cat.code}
            onClick={() => setSelectedView(cat.code)}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedView === cat.code 
                ? 'bg-[#087443] text-white' 
                : 'bg-white border border-[#e6dfd5] text-[#141414] hover:border-[#087443]'
            }`}
          >
            {cat.nameFr}
          </button>
        ))}

        <button
          onClick={() => setSelectedView('produits')}
          className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ml-auto whitespace-nowrap ${
            selectedView === 'produits' 
              ? 'bg-[#1e3a5f] text-white' 
              : 'bg-[#faf8f5] border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
          }`}
        >
          <Compass size={12} className="inline mr-1" />
          Les 4 Produits d'Information
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. ARCHITECTURE RULE CALLOUT (Alfred & Samba Brief)
      ────────────────────────────────────────────────────────── */}
      <div className="bg-[#f4eee3] border border-[#e6dfd5] p-4 rounded text-xs font-mono text-[#5a554e] flex items-start gap-3">
        <Info size={18} className="text-[#087443] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#087443] uppercase tracking-wider block">
            Règle de Gouvernance Éditoriale (Brief Alfred v5 & Note Samba) :
          </span>
          <p className="font-serif text-xs leading-relaxed text-[#333]">
            1. <strong>Sous-rubriques fermées :</strong> Aucune nouvelle sous-rubrique ne peut être créée en dehors des 24 définies dans le référentiel officiel.<br />
            2. <strong>Règle d'activation automatique :</strong> Une sous-rubrique est <em>masquée</em> au public tant qu'elle compte moins de 2 articles publiés. Dès le 2ᵉ article, elle apparaît automatiquement en onglet et ne disparaît plus.<br />
            3. <strong>Séparation stricte :</strong> <em>Le Tracker</em>, <em>RELANCE</em>, <em>Les Numéros</em> et <em>Le Fil</em> sont des <strong>Produits</strong> documentaires avec leurs propres sous-menus, et non des sous-rubriques.
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          5. RUBRIQUES LISTING & SUB-RUBRICS TABLES
      ────────────────────────────────────────────────────────── */}
      {selectedView !== 'produits' && (
        <div className="space-y-8">
          {displayedCategories.map(cat => {
            const catArticles = articles.filter(a => a.category === cat.code || (cat.code === 'histoire' && a.category === 'idees'));
            const subCats = SUB_CATEGORIES.filter(sc => sc.categoryCode === cat.code);
            const regardText = defaultRegards[cat.code]?.fr || cat.descriptionFr;

            return (
              <div key={cat.code} className="bg-white border border-[#e6dfd5] rounded shadow-xs overflow-hidden">
                
                {/* Rubrique Header */}
                <div className="p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#087443' }} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#736c62]">
                        Rubrique Officielle · Code: {cat.code}
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#141414]">
                      {cat.nameFr} <span className="text-sm font-normal text-[#736c62] font-mono">({cat.nameEn})</span>
                    </h2>
                    <p className="text-xs font-serif text-[#5a554e] mt-1 max-w-2xl">
                      {cat.descriptionFr}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/fr/${cat.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-white border border-[#e6dfd5] hover:border-[#087443] hover:text-[#087443] text-xs font-mono font-bold rounded inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>Voir en ligne</span>
                    </Link>

                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 bg-[#087443] hover:bg-[#075f37] text-white text-xs font-mono font-bold rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Cadrer la rubrique</span>
                    </button>
                  </div>
                </div>

                {/* Editorial Framing Regard */}
                <div className="px-5 py-3.5 bg-emerald-50/40 border-b border-[#e6dfd5] flex items-start gap-3 text-xs font-serif">
                  <BookOpen size={15} className="text-[#087443] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-[#087443] block">
                      Le Regard de la Rédaction (Encadré Public) :
                    </span>
                    <p className="italic text-[#3f3b35] mt-0.5">
                      &ldquo;{regardText}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Sub-rubrics List */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Sous-rubriques fermées ({subCats.length})
                    </h3>
                    <span className="text-[11px] font-mono text-[#736c62]">
                      Articles dans cette rubrique : <strong>{catArticles.length}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subCats.map(sc => {
                      const count = subCategoryStats[sc.code] || 0;
                      const isActive = count >= 2;

                      return (
                        <div 
                          key={sc.code}
                          className={`p-3.5 border rounded flex flex-col justify-between transition-all ${
                            isActive 
                              ? 'bg-white border-[#e6dfd5] hover:border-[#087443]' 
                              : 'bg-[#faf8f5] border-[#e6dfd5] opacity-90'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[11px] font-bold text-[#141414]">
                                {sc.nameFr}
                              </span>
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                                  <Eye size={10} />
                                  <span>Visible ({count})</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold rounded">
                                  <EyeOff size={10} />
                                  <span>Masquée ({count}/2)</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] font-serif text-[#736c62] line-clamp-2">
                              {sc.descriptionFr}
                            </p>

                            <div className="mt-2 text-[10px] font-mono text-[#999] flex justify-between items-center">
                              <span>Code : <code className="text-[#141414] font-bold">{sc.code}</code></span>
                              <span>EN : {sc.nameEn}</span>
                            </div>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-[#e6dfd5] flex items-center justify-between text-xs font-mono">
                            <Link
                              href={`/admin/articles/nouveau?category=${cat.code}&subCategory=${sc.code}`}
                              className="text-[11px] text-[#087443] hover:underline inline-flex items-center gap-1 font-bold"
                            >
                              <Plus size={11} />
                              <span>+ Rédiger</span>
                            </Link>

                            <Link
                              href={`/admin/articles?category=${cat.code}`}
                              className="text-[11px] text-[#736c62] hover:text-[#141414]"
                            >
                              {count} article{count > 1 ? 's' : ''} →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          6. THE 4 INDEPENDENT PRODUCTS SECTION
      ────────────────────────────────────────────────────────── */}
      {(selectedView === 'all' || selectedView === 'produits') && (
        <div className="space-y-4 pt-4 border-t-2 border-[#141414]">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#1e3a5f]" />
            <h2 className="text-xl font-serif font-bold text-[#141414]">
              Les 4 Produits d'Information & Leurs Sous-menus Officiels
            </h2>
          </div>
          <p className="text-xs font-mono text-[#5a554e] max-w-3xl">
            Conformément à la note de synthèse de Samba, ces 4 contenants éditoriaux ne sont pas des rubriques et ne partagent pas le référentiel des 24 sous-rubriques. Chacun possède son propre modèle documentaire et ses filtres dédiés.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {JOURNAL_PRODUCTS.map(prod => (
              <div key={prod.code} className="bg-white border-2 border-[#141414] p-5 rounded space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1e3a5f] text-white px-2 py-0.5 rounded">
                      {prod.badge}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#141414] mt-2">
                      {prod.nameFr} <span className="text-xs font-mono text-[#736c62]">({prod.nameEn})</span>
                    </h3>
                  </div>

                  <Link
                    href={prod.hrefFr}
                    target="_blank"
                    className="p-1.5 border border-[#e6dfd5] text-[#141414] hover:border-[#1e3a5f] hover:text-[#1e3a5f] rounded"
                    title={`Voir ${prod.nameFr} en direct`}
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono uppercase font-bold text-[#736c62] mb-1.5">
                    {prod.hasSubMenus ? `Sous-menus officiels (${prod.subMenus.length}) :` : 'Navigation produit :'}
                  </h4>

                  {prod.hasSubMenus ? (
                    <div className="flex flex-wrap gap-1.5">
                      {prod.subMenus.map(sm => (
                        <span 
                          key={sm.code} 
                          className="px-2 py-1 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] rounded"
                        >
                          {sm.labelFr}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-serif text-[#736c62] italic">
                      Flux chronologique unifié sans sous-menu de niveau 2.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-mono">
                  <span className="text-[10px] text-[#736c62]">Route publique : {prod.hrefFr}</span>
                  <Link href={prod.hrefFr} className="text-[#087443] font-bold hover:underline inline-flex items-center gap-1">
                    Accéder au produit <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          7. EDIT CATEGORY FRAMING MODAL
      ────────────────────────────────────────────────────────── */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-t sm:border border-[#141414] rounded-t-xl sm:rounded-none max-w-2xl w-full shadow-2xl overflow-hidden my-0 sm:my-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Cadrage Théorique & Ligne Éditoriale
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  Rubrique {formData.nameFr}
                </h3>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
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
                    onClick={() => setEditingCategory(null)}
                    className="p-1 text-[#736c62] hover:text-[#141414]"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              {activeTab === 'fr' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Nom de la Rubrique (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameFr || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Descriptif court sous le titre (Français) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.descriptionFr || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#087443] mb-1">
                      "Le Regard de la Rédaction" (Encadré éditorial de la page publique)
                    </label>
                    <textarea
                      rows={4}
                      value={regardFr}
                      onChange={(e) => setRegardFr(e.target.value)}
                      placeholder="Manifeste ou angle d'investigation propre à cette rubrique..."
                      className="w-full px-2.5 py-1.5 border-2 border-[#087443] rounded bg-[#faf8f5] font-serif text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#f8fafc] p-3 border border-[#cbd5e1] rounded">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] uppercase">
                    <Languages size={13} />
                    <span>Traductions Anglaises</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Rubric Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Header Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.descriptionEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1e3a5f] mb-1">
                      "Editorial Desk Perspective" (English Sidebar Box)
                    </label>
                    <textarea
                      rows={4}
                      value={regardEn}
                      onChange={(e) => setRegardEn(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded bg-white font-serif text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Color Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e6dfd5]">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Couleur Identitaire (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color || '#087443'}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="h-8 w-12 border border-[#e6dfd5] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color || '#087443'}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 px-2 py-1.5 border border-[#e6dfd5] rounded font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Slug de la Route
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`/fr/${editingCategory.slug}`}
                    className="w-full px-2 py-1.5 border border-[#e6dfd5] rounded bg-[#f5f5f5] text-[#736c62]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] rounded cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] cursor-pointer text-center"
                >
                  <Check size={14} />
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
