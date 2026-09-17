"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  Edit3, 
  Trash2,
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
  TrendingUp,
  BookMarked,
  Newspaper,
  ChevronRight,
  Info,
  AlertTriangle,
  FolderPlus,
  Loader2
} from 'lucide-react';
import { Category, Article, Project, SubCategory, CategoryCode } from '@/data/types';
import { categoriesApi, CategoryDTO, SubCategoryDTO, normalizeRoleCode } from '@/lib/api';
import { useAdminAuth } from '@/components/admin/AuthGuard';
import { useToast } from '@/components/admin/Toast';
import { SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';


export default function AdminRubriquesPage() {
  const { user: currentUser } = useAdminAuth();
  const roleCode = normalizeRoleCode(currentUser?.role || '');
  const canManageRubriques = roleCode === 'superadmin' || roleCode === 'editorial_director';

  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedView, setSelectedView] = useState<string>('all');

  // Category Modal State (CRUD Dynamique Rubriques)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    code: '',
    nameFr: '',
    nameEn: '',
    descriptionFr: '',
    descriptionEn: '',
    color: '#087443',
  });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingCategoryStats, setDeletingCategoryStats] = useState<{ subCatsCount: number; articlesCount: number }>({
    subCatsCount: 0,
    articlesCount: 0,
  });

  // SubCategory Modal State (CRUD Dynamique)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [subFormData, setSubFormData] = useState<Partial<SubCategory>>({
    categoryCode: 'economie',
    code: '',
    nameFr: '',
    nameEn: '',
    descriptionFr: '',
    descriptionEn: '',
  });
  const [subActiveTab, setSubActiveTab] = useState<'fr' | 'en'>('fr');
  const [isSubmittingSub, setIsSubmittingSub] = useState(false);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);
  const [deleteAttachedCount, setDeleteAttachedCount] = useState<number>(0);

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

  const mapSubCategoryDto = (dto: SubCategoryDTO): SubCategory => ({
    id: dto.id,
    code: dto.code,
    nameFr: dto.name_fr,
    nameEn: dto.name_en,
    categoryCode: dto.category_code as CategoryCode,
    descriptionFr: dto.description_fr || '',
    descriptionEn: dto.description_en || '',
    isActivated: dto.is_activated,
  });

  const mapCategoryDto = (dto: CategoryDTO): Category => ({
    code: dto.code as CategoryCode,
    nameFr: dto.name_fr,
    nameEn: dto.name_en,
    descriptionFr: dto.description_fr || '',
    descriptionEn: dto.description_en || '',
    slug: dto.slug,
    color: dto.color,
    icon: dto.icon,
    order: dto.order_num,
    subCategories: (dto.sub_categories || []).map(mapSubCategoryDto),
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Chargement direct depuis PostgreSQL via l'API Go
      const apiCategories = await categoriesApi.listCategories(true);
      if (apiCategories && apiCategories.length > 0) {
        const mappedCats = apiCategories.map(mapCategoryDto);
        setCategories(mappedCats);

        const allSubs: SubCategory[] = [];
        apiCategories.forEach(cat => {
          if (cat.sub_categories && cat.sub_categories.length > 0) {
            allSubs.push(...cat.sub_categories.map(mapSubCategoryDto));
          }
        });
        setSubCategories(allSubs);
      } else {
        setCategories([]);
        setSubCategories([]);
      }

      // 2. Chargement des articles pour les métriques de publication
      try {
        const resArticles = await fetch('/api/admin/data');
        if (resArticles.ok) {
          const data = await resArticles.json();
          setArticles(data.articles || []);
        }
      } catch {
        // Silencieux
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des rubriques depuis PostgreSQL :', err);
      setCategories([]);
      setSubCategories([]);
      error('Erreur de chargement', 'Impossible de récupérer les rubriques depuis PostgreSQL. Vérifiez que le backend est actif.');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  // Compute stats per subcategory dynamically
  const subCategoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    subCategories.forEach(sc => {
      stats[sc.code] = articles.filter(a => a.subCategory === sc.code).length;
    });
    return stats;
  }, [articles, subCategories]);

  const activeSubCatsCount = useMemo(() => {
    return subCategories.filter(sc => (subCategoryStats[sc.code] || 0) >= 2).length;
  }, [subCategories, subCategoryStats]);

  const pendingSubCatsCount = useMemo(() => {
    return subCategories.length - activeSubCatsCount;
  }, [subCategories.length, activeSubCatsCount]);

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent créer une rubrique.');
      return;
    }
    setEditingCategory(null);
    setCategoryFormData({
      code: '',
      nameFr: '',
      nameEn: '',
      descriptionFr: '',
      descriptionEn: '',
      color: '#087443',
    });
    setRegardFr('');
    setRegardEn('');
    setActiveTab('fr');
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: Category) => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent modifier une rubrique.');
      return;
    }
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setRegardFr(defaultRegards[cat.code]?.fr || cat.descriptionFr || '');
    setRegardEn(defaultRegards[cat.code]?.en || cat.descriptionEn || '');
    setActiveTab('fr');
    setIsCategoryModalOpen(true);
  };

  // Submit Category Create or Update
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.nameFr?.trim()) {
      warning('Champ requis', 'Le nom en français de la rubrique est requis.');
      return;
    }

    try {
      setIsSubmittingCategory(true);
      const isEdit = Boolean(editingCategory);

      if (isEdit) {
        await categoriesApi.updateCategory(editingCategory!.code, {
          name_fr: categoryFormData.nameFr.trim(),
          name_en: categoryFormData.nameEn?.trim() || categoryFormData.nameFr.trim(),
          description_fr: categoryFormData.descriptionFr?.trim(),
          description_en: categoryFormData.descriptionEn?.trim(),
          color: categoryFormData.color || '#087443',
          slug: categoryFormData.slug,
          icon: categoryFormData.icon,
        });
      } else {
        const rawCode = categoryFormData.code?.trim() || categoryFormData.nameFr.trim();
        const code = rawCode.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await categoriesApi.createCategory({
          code,
          name_fr: categoryFormData.nameFr.trim(),
          name_en: categoryFormData.nameEn?.trim() || categoryFormData.nameFr.trim(),
          description_fr: categoryFormData.descriptionFr?.trim(),
          description_en: categoryFormData.descriptionEn?.trim(),
          color: categoryFormData.color || '#087443',
          slug: categoryFormData.slug || code,
          icon: categoryFormData.icon,
        });
      }

      if (regardFr || regardEn) {
        const codeKey = editingCategory ? editingCategory.code : (categoryFormData.code || '');
        if (codeKey) {
          defaultRegards[codeKey] = {
            fr: regardFr || categoryFormData.descriptionFr || '',
            en: regardEn || categoryFormData.descriptionEn || ''
          };
        }
      }

      success(
        isEdit ? 'Rubrique actualisée' : 'Rubrique créée',
        `La rubrique "${categoryFormData.nameFr}" a été enregistrée avec succès dans PostgreSQL.`
      );

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await loadData();
    } catch (err: any) {
      error('Erreur', err.message || "Erreur lors de l'enregistrement de la rubrique.");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // Prompt delete Category
  const handlePromptDeleteCategory = (cat: Category) => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent supprimer une rubrique.');
      return;
    }
    const subCats = subCategories.filter(sc => sc.categoryCode === cat.code);
    const subCatCodes = new Set(subCats.map(sc => sc.code));
    const catArticles = articles.filter(a => a.category === cat.code || (a.subCategory && subCatCodes.has(a.subCategory)));
    setDeletingCategory(cat);
    setDeletingCategoryStats({
      subCatsCount: subCats.length,
      articlesCount: catArticles.length,
    });
  };

  // Confirm delete Category
  const handleConfirmDeleteCategory = async (force = false) => {
    if (!canManageRubriques) return;
    if (!deletingCategory) return;
    try {
      await categoriesApi.deleteCategory(deletingCategory.code);
      success('Rubrique supprimée', `La rubrique "${deletingCategory.nameFr}" a été supprimée.`);
      setDeletingCategory(null);
      if (selectedView === deletingCategory.code) {
        setSelectedView('all');
      }
      await loadData();
    } catch (err: any) {
      error('Suppression impossible', err.message || 'Erreur lors de la suppression.');
    }
  };


  // Open Create SubCategory Modal
  const handleOpenCreateSubCategory = (defaultCatCode: CategoryCode = 'economie') => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent créer une sous-rubrique.');
      return;
    }
    setEditingSubCategory(null);
    setSubFormData({
      categoryCode: defaultCatCode,
      code: '',
      nameFr: '',
      nameEn: '',
      descriptionFr: '',
      descriptionEn: '',
    });
    setSubActiveTab('fr');
    setIsSubModalOpen(true);
  };

  // Open Edit SubCategory Modal
  const handleOpenEditSubCategory = (sub: SubCategory) => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent modifier une sous-rubrique.');
      return;
    }
    setEditingSubCategory(sub);
    setSubFormData({ ...sub });
    setSubActiveTab('fr');
    setIsSubModalOpen(true);
  };

  // Submit SubCategory (Create or Update)
  const handleSubmitSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageRubriques) {
      warning('Accès restreint', 'Opération non autorisée.');
      return;
    }
    if (!subFormData.nameFr?.trim()) {
      warning('Champ requis', 'Le nom en français de la sous-rubrique est requis.');
      return;
    }

    try {
      setIsSubmittingSub(true);
      const isEdit = Boolean(editingSubCategory);

      if (isEdit) {
        const subId = editingSubCategory!.id || editingSubCategory!.code;
        await categoriesApi.updateSubCategory(subId, {
          name_fr: subFormData.nameFr.trim(),
          name_en: subFormData.nameEn?.trim() || subFormData.nameFr.trim(),
          description_fr: subFormData.descriptionFr?.trim(),
          description_en: subFormData.descriptionEn?.trim(),
        });
      } else {
        const rawCode = subFormData.code?.trim() || subFormData.nameFr.trim();
        const code = rawCode.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const parentCategory = subFormData.categoryCode || 'economie';
        await categoriesApi.createSubCategory(parentCategory, {
          code,
          name_fr: subFormData.nameFr.trim(),
          name_en: subFormData.nameEn?.trim() || subFormData.nameFr.trim(),
          description_fr: subFormData.descriptionFr?.trim(),
          description_en: subFormData.descriptionEn?.trim(),
        });
      }

      success(
        isEdit ? 'Sous-rubrique actualisée' : 'Sous-rubrique créée',
        `La sous-rubrique "${subFormData.nameFr}" a été enregistrée avec succès dans PostgreSQL.`
      );

      setIsSubModalOpen(false);
      setEditingSubCategory(null);
      await loadData();
    } catch (err: any) {
      error('Erreur', err.message || "Erreur lors de l'enregistrement de la sous-rubrique.");
    } finally {
      setIsSubmittingSub(false);
    }
  };

  // Prompt delete subcategory
  const handlePromptDeleteSubCategory = (sub: SubCategory) => {
    if (!canManageRubriques) {
      warning('Accès restreint', 'Seuls le Superadmin et la Direction Éditoriale peuvent supprimer une sous-rubrique.');
      return;
    }
    const attachedCount = articles.filter(a => a.subCategory === sub.code).length;
    setDeletingSubCategory(sub);
    setDeleteAttachedCount(attachedCount);
  };

  // Confirm delete subcategory
  const handleConfirmDeleteSubCategory = async (force = false) => {
    if (!deletingSubCategory) return;
    try {
      const subId = deletingSubCategory.id || deletingSubCategory.code;
      await categoriesApi.deleteSubCategory(subId);
      success('Sous-rubrique supprimée', `La sous-rubrique "${deletingSubCategory.nameFr}" a été retirée.`);
      setDeletingSubCategory(null);
      await loadData();
    } catch (err: any) {
      error('Suppression impossible', err.message || 'Erreur lors de la suppression.');
    }
  };


  const displayedCategories = useMemo(() => {
    if (selectedView === 'all') {
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
            <span>Architecture Éditoriale & Référentiel Dynamique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Gestion des Rubriques & Sous-rubriques
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Gestion dynamique et CRUD complet des rubriques mères et sous-rubriques.
          </p>
        </div>

        {canManageRubriques ? (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleOpenCreateCategory}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
            >
              <FolderPlus size={15} />
              <span>+ Nouvelle Rubrique</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreateSubCategory()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#087443] text-[#087443] hover:bg-[#087443] hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Nouvelle Sous-rubrique</span>
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#faf8f5] border border-[#e6dfd5] text-[#736c62] text-xs font-mono rounded">
            <ShieldCheck size={15} className="text-[#087443]" />
            <span>Mode Consultation Rédactionnelle</span>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. STATS KPI BAR
      ────────────────────────────────────────────────────────── */}
      {loading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Rubriques Actives</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {categories.length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Gérées dynamiquement</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Sous-rubriques Définies</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">
              {subCategories.length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Gérées en base dynamique</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Sous-rubriques Actives</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {activeSubCatsCount} <span className="text-xs text-[#736c62] font-normal">/ {subCategories.length}</span>
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Seuil ≥ 2 articles atteint</div>
          </div>

          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">En Attente d'Activation</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {pendingSubCatsCount}
            </div>
            <div className="text-[10px] font-mono text-[#c2410c] mt-0.5">Masquage automatique (&lt; 2 articles)</div>
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
          Toutes les Rubriques ({categories.length})
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

      </div>

      {/* ──────────────────────────────────────────────────────────
          4. ARCHITECTURE RULE CALLOUT
      ────────────────────────────────────────────────────────── */}
      <div className="bg-[#f4eee3] border border-[#e6dfd5] p-4 rounded text-xs font-mono text-[#5a554e] flex items-start gap-3">
        <Info size={18} className="text-[#087443] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#087443] uppercase tracking-wider block">
            Gouvernance Éditoriale & Architecture Dynamique :
          </span>
          <p className="font-serif text-xs leading-relaxed text-[#333]">
            1. <strong>CRUD dynamique des rubriques et sous-rubriques :</strong> {canManageRubriques ? "Vous pouvez créer, modifier et supprimer des rubriques mères et des sous-rubriques selon les besoins de la rédaction." : "La création, modification et suppression de rubriques mères et sous-rubriques est réservée au Superadmin et à la Direction Éditoriale."}<br />
            2. <strong>Règle d'activation automatique :</strong> Une sous-rubrique est <em>masquée</em> au public tant qu'elle compte moins de 2 articles publiés. Dès le 2ᵉ article, elle apparaît automatiquement en onglet et ne disparaît plus.
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          5. RUBRIQUES LISTING & SUB-RUBRICS TABLES
      ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="bg-white border border-[#e6dfd5] rounded p-6 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-neutral-200 rounded" />
                  <div className="h-6 w-48 bg-neutral-200 rounded" />
                  <div className="h-3 w-80 bg-neutral-100 rounded" />
                </div>
                <div className="h-8 w-24 bg-neutral-200 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[#f0ebe3]">
                {[1, 2, 3].map(sIdx => (
                  <div key={sIdx} className="h-20 bg-neutral-100 rounded border border-neutral-200/60" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : displayedCategories.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] rounded p-12 text-center">
          <Layers size={40} className="mx-auto text-neutral-400 mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#141414]">Aucune rubrique disponible</h3>
          <p className="font-mono text-xs text-[#736c62] mt-1 max-w-md mx-auto">
            {canManageRubriques 
              ? "Aucune rubrique n'est enregistrée dans PostgreSQL. Utilisez le bouton ci-dessous pour en créer une."
              : "Aucune rubrique n'est enregistrée dans PostgreSQL. Veuillez contacter le Superadmin ou la Direction Éditoriale."}
          </p>
          {canManageRubriques && (
            <button
              type="button"
              onClick={handleOpenCreateCategory}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              <FolderPlus size={15} />
              <span>+ Créer la première rubrique</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {displayedCategories.map(cat => {
            const catArticles = articles.filter(a => a.category === cat.code || (cat.code === 'histoire' && a.category === 'idees'));
            const subCats = subCategories.filter(sc => sc.categoryCode === cat.code);
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
                      href={`/fr/${cat.slug || cat.code}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-white border border-[#e6dfd5] hover:border-[#087443] hover:text-[#087443] text-xs font-mono font-bold rounded inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>Voir</span>
                    </Link>

                    {canManageRubriques && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="px-3 py-1.5 bg-[#087443] hover:bg-[#075f37] text-white text-xs font-mono font-bold rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Modifier / Cadrer</span>
                        </button>

                        <Tooltip position="top" content="Supprimer la rubrique">
                          <button
                            type="button"
                            onClick={() => handlePromptDeleteCategory(cat)}
                            className="p-1.5 text-[#736c62] hover:text-red-600 hover:bg-red-50 rounded border border-[#e6dfd5] hover:border-red-200 transition-colors cursor-pointer"
                            aria-label={`Supprimer ${cat.nameFr}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </Tooltip>
                      </>
                    )}
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                        Sous-rubriques ({subCats.length})
                      </h3>
                      {canManageRubriques && (
                        <button
                          type="button"
                          onClick={() => handleOpenCreateSubCategory(cat.code as CategoryCode)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#087443]/10 hover:bg-[#087443] text-[#087443] hover:text-white rounded text-[10px] font-mono font-bold transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          <span>Ajouter</span>
                        </button>
                      )}
                    </div>
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
                              {sc.descriptionFr || 'Aucun descriptif pour cette sous-rubrique.'}
                            </p>

                            <div className="mt-2 text-[10px] font-mono text-[#999] flex justify-between items-center">
                              <span>Code : <code className="text-[#141414] font-bold">{sc.code}</code></span>
                              <span className="truncate max-w-[120px]">EN : {sc.nameEn}</span>
                            </div>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-[#e6dfd5] flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/articles/nouveau?category=${cat.code}&subCategory=${sc.code}`}
                                className="text-[11px] text-[#087443] hover:underline inline-flex items-center gap-1 font-bold"
                              >
                                <Plus size={11} />
                                <span>Rédiger</span>
                              </Link>

                              <Link
                                href={`/admin/articles?category=${cat.code}`}
                                className="text-[11px] text-[#736c62] hover:text-[#141414]"
                              >
                                {count} art.
                              </Link>
                            </div>

                            {canManageRubriques && (
                              <div className="flex items-center gap-1">
                                <Tooltip position="top" content="Modifier la sous-rubrique">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditSubCategory(sc)}
                                    className="p-1 text-[#555] hover:text-[#087443] hover:bg-[#faf8f5] rounded border border-[#e6dfd5] transition-colors cursor-pointer"
                                    aria-label={`Modifier ${sc.nameFr}`}
                                  >
                                    <Edit3 size={12} />
                                  </button>
                                </Tooltip>

                                <Tooltip position="top" content="Supprimer la sous-rubrique">
                                  <button
                                    type="button"
                                    onClick={() => handlePromptDeleteSubCategory(sc)}
                                    className="p-1 text-[#555] hover:text-[#d32f2f] hover:bg-rose-50 rounded border border-[#e6dfd5] transition-colors cursor-pointer"
                                    aria-label={`Supprimer ${sc.nameFr}`}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </Tooltip>
                              </div>
                            )}
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
          7. MODAL DYNAMIQUE : CRÉATION / ÉDITION RUBRIQUE
      ────────────────────────────────────────────────────────── */}
      {canManageRubriques && isCategoryModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white border-t sm:border border-[#141414] rounded-t-xl sm:rounded-none max-w-2xl w-full shadow-2xl overflow-hidden my-0 sm:my-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  {editingCategory ? 'Cadrage Théorique & Ligne Éditoriale' : 'Création de Rubrique Pilière'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  {editingCategory ? `Rubrique : ${categoryFormData.nameFr || editingCategory.nameFr}` : 'Nouvelle Rubrique'}
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
                    onClick={() => {
                      setIsCategoryModalOpen(false);
                      setEditingCategory(null);
                    }}
                    className="p-1 text-[#736c62] hover:text-[#141414] cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCategory} className="p-4 sm:p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
              {activeTab === 'fr' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Nom de la Rubrique (Français) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormData.nameFr || ''}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                      placeholder="Ex: Économie, Souveraineté, Culture..."
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Code Identifiant (Slug) {editingCategory && '(fixe)'}
                    </label>
                    <input
                      type="text"
                      disabled={Boolean(editingCategory)}
                      value={editingCategory ? editingCategory.code : (categoryFormData.code || '')}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder={editingCategory ? editingCategory.code : "auto (généré si vide, ex: culture)"}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded font-mono text-xs focus:outline-none focus:border-[#087443] disabled:bg-[#f5f5f5] disabled:text-[#736c62]"
                    />
                    {!editingCategory && (
                      <span className="text-[10px] text-[#736c62] block mt-0.5">
                        Identifiant unique sans accents ni espaces (ex: economie, securite). Laisser vide pour auto-générer.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Descriptif court sous le titre (Français) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={categoryFormData.descriptionFr || ''}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
                      placeholder="Brève synthèse affichée en en-tête de la page publique..."
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
                      value={categoryFormData.nameEn || ''}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      placeholder="Ex: Economy, Security, Culture..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white font-serif text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Header Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={categoryFormData.descriptionEn || ''}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      placeholder="Short rubric summary in English..."
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
                      placeholder="English translation of the editorial perspective..."
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
                      value={categoryFormData.color || '#087443'}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="h-8 w-12 border border-[#e6dfd5] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={categoryFormData.color || '#087443'}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 px-2 py-1.5 border border-[#e6dfd5] rounded font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Route Publique Associée
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingCategory ? `/fr/${editingCategory.slug || editingCategory.code}` : `/fr/${categoryFormData.code || '...'}`}
                    className="w-full px-2 py-1.5 border border-[#e6dfd5] rounded bg-[#f5f5f5] text-[#736c62] font-mono text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  disabled={isSubmittingCategory}
                  className="w-full sm:w-auto px-4 py-2 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5] rounded cursor-pointer text-center disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37] cursor-pointer text-center disabled:opacity-50 transition-colors"
                >
                  {isSubmittingCategory ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {editingCategory ? 'Enregistrer les modifications' : 'Créer la rubrique'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          6. MODAL DYNAMIQUE : CRÉATION / ÉDITION SOUS-RUBRIQUE
      ────────────────────────────────────────────────────────── */}
      {canManageRubriques && isSubModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#1e3a5f] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Layers size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg">
                    {editingSubCategory ? `Modifier : ${editingSubCategory.nameFr}` : 'Nouvelle Sous-rubrique'}
                  </h3>
                  <p className="text-[11px] text-white/80">
                    {editingSubCategory 
                      ? 'Ajustez le rattachement ou les libellés bilingues'
                      : 'Créez une nouvelle sous-rubrique dynamique'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitSubCategory} className="p-4 sm:p-6 space-y-4">
              {/* Category Parent & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Rubrique Parente <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subFormData.categoryCode || 'economie'}
                    onChange={(e) => setSubFormData(prev => ({ ...prev, categoryCode: e.target.value as CategoryCode }))}
                    className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded text-xs focus:outline-none focus:border-[#1e3a5f] bg-white font-medium"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.code} value={cat.code}>
                        {cat.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                    Code Identifiant (Slug)
                  </label>
                  <input
                    type="text"
                    disabled={Boolean(editingSubCategory)}
                    value={subFormData.code || ''}
                    onChange={(e) => setSubFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder={editingSubCategory ? editingSubCategory.code : "auto (généré si vide)"}
                    className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded text-xs font-mono focus:outline-none focus:border-[#1e3a5f] bg-white disabled:bg-[#f1f5f9] disabled:text-[#94a3b8]"
                  />
                  {!editingSubCategory && (
                    <span className="text-[10px] text-[#736c62] block mt-0.5">
                      Ex: filiere-coton (laisser vide pour auto-générer)
                    </span>
                  )}
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-b border-[#e6dfd5] flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSubActiveTab('fr')}
                    className={`pb-1.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                      subActiveTab === 'fr'
                        ? 'border-[#087443] text-[#087443]'
                        : 'border-transparent text-[#736c62] hover:text-[#141414]'
                    }`}
                  >
                    <Languages size={13} /> Français (FR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubActiveTab('en')}
                    className={`pb-1.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                      subActiveTab === 'en'
                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                        : 'border-transparent text-[#736c62] hover:text-[#141414]'
                    }`}
                  >
                    <Languages size={13} /> English (EN)
                  </button>
                </div>
              </div>

              {/* FR Fields */}
              {subActiveTab === 'fr' && (
                <div className="space-y-3 animate-in fade-in duration-100">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Nom de la sous-rubrique (Français) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subFormData.nameFr || ''}
                      onChange={(e) => setSubFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                      placeholder="Ex: Filière Coton, Mines & Or..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#087443] bg-white font-serif text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Descriptif éditorial (Français)
                    </label>
                    <textarea
                      rows={2}
                      value={subFormData.descriptionFr || ''}
                      onChange={(e) => setSubFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
                      placeholder="Ex: Analyse approfondie des dynamiques et productions de la filière..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded text-xs focus:outline-none focus:border-[#087443] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* EN Fields */}
              {subActiveTab === 'en' && (
                <div className="space-y-3 animate-in fade-in duration-100">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Sub-rubric Name (English)
                    </label>
                    <input
                      type="text"
                      value={subFormData.nameEn || ''}
                      onChange={(e) => setSubFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      placeholder="Ex: Cotton Sector, Mining & Gold..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white font-serif text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Editorial Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={subFormData.descriptionEn || ''}
                      onChange={(e) => setSubFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      placeholder="Ex: In-depth analysis of supply chain dynamics and agricultural output..."
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded text-xs focus:outline-none focus:border-[#1e3a5f] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Rule reminder */}
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg flex items-start gap-2.5 text-[11px] text-[#736c62]">
                <Info size={16} className="text-[#1e3a5f] shrink-0 mt-0.5" />
                <p>
                  <strong>Règle d'activation automatique :</strong> Une sous-rubrique devient active et visible sur le site public dès qu'elle compte au minimum <strong>2 articles publiés</strong>.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  disabled={isSubmittingSub}
                  className="px-4 py-2 border border-[#cbd5e1] text-xs font-bold hover:bg-[#faf8f5] rounded cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSub}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white text-xs font-bold uppercase rounded hover:bg-[#075f37] cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isSubmittingSub ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {editingSubCategory ? 'Mettre à jour' : 'Créer la sous-rubrique'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          7. MODAL DE CONFIRMATION DE SUPPRESSION SOUS-RUBRIQUE
      ────────────────────────────────────────────────────────── */}
      {canManageRubriques && deletingSubCategory && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-2xl max-w-md w-full overflow-hidden p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Supprimer la sous-rubrique ?
                </h3>
                <p className="text-xs text-[#736c62]">
                  Action sur <strong>{deletingSubCategory.nameFr}</strong> ({deletingSubCategory.code})
                </p>
              </div>
            </div>

            {deleteAttachedCount > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={15} className="text-amber-700 shrink-0" />
                  <span>Articles rattachés détectés ({deleteAttachedCount})</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Cette sous-rubrique est actuellement assignée à <strong>{deleteAttachedCount} article(s)</strong>. La supprimer détachera ces articles de cette sous-rubrique.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#4b5563]">
                Cette sous-rubrique ne contient aucun article rattaché. Vous pouvez la supprimer en toute sécurité.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
              <button
                type="button"
                onClick={() => setDeletingSubCategory(null)}
                className="px-3.5 py-1.5 border border-[#cbd5e1] text-xs font-bold rounded hover:bg-[#faf8f5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteSubCategory(deleteAttachedCount > 0)}
                className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 cursor-pointer transition-colors"
              >
                {deleteAttachedCount > 0 ? 'Forcer la suppression' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          8. MODAL DE CONFIRMATION DE SUPPRESSION RUBRIQUE
      ────────────────────────────────────────────────────────── */}
      {canManageRubriques && deletingCategory && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white border border-[#e6dfd5] rounded-xl shadow-2xl max-w-md w-full overflow-hidden p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Supprimer la rubrique ?
                </h3>
                <p className="text-xs text-[#736c62]">
                  Action sur <strong>{deletingCategory.nameFr}</strong> (code: <code>{deletingCategory.code}</code>)
                </p>
              </div>
            </div>

            {(deletingCategoryStats.subCatsCount > 0 || deletingCategoryStats.articlesCount > 0) ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={15} className="text-amber-700 shrink-0" />
                  <span>Éléments rattachés détectés</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Cette rubrique contient <strong>{deletingCategoryStats.subCatsCount} sous-rubrique(s)</strong> et <strong>{deletingCategoryStats.articlesCount} article(s)</strong>.
                  La suppression forcée retirera définitivement cette rubrique ainsi que l'ensemble de ses sous-rubriques rattachées.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#4b5563]">
                Cette rubrique ne contient aucune sous-rubrique ni aucun article rattaché. Vous pouvez la supprimer en toute sécurité.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e6dfd5]">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-3.5 py-1.5 border border-[#cbd5e1] text-xs font-bold rounded hover:bg-[#faf8f5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteCategory(deletingCategoryStats.subCatsCount > 0 || deletingCategoryStats.articlesCount > 0)}
                className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 cursor-pointer transition-colors"
              >
                {(deletingCategoryStats.subCatsCount > 0 || deletingCategoryStats.articlesCount > 0) ? 'Forcer la suppression' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
