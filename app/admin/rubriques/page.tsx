"use client";

import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import { Category, Article, Project } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonCard, SkeletonStat } from '@/components/admin/Skeleton';
import Tooltip from '@/components/ui/Tooltip';

export default function AdminRubriquesPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Editorial Framing ("Regard de la Rédaction") extra states
  const [regardFr, setRegardFr] = useState<string>('');
  const [regardEn, setRegardEn] = useState<string>('');

  // Default regards for rubriques
  const defaultRegards: Record<string, { fr: string; en: string }> = {
    histoire: {
      fr: "L'histoire burkinabè ne se réduit pas à une succession de crises ou d'hommages figés. De la révolution sankariste de 1983 à nos jours, nous analysons les choix doctrinaux, la mémoire collective et les précédents historiques pour éclairer les décisions contemporaines.",
      en: "Burkinabè history is never merely a sequence of crises or frozen eulogies. From Thomas Sankara's 1983 revolution to present-day trajectories, we analyze doctrinal precedents, archival evidence, and collective memory to illuminate contemporary national choices."
    },
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
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les rubriques.');
      const data = await res.json();
      setCategories(data.categories || []);
      setArticles(data.articles || []);
      setProjects(data.projects || []);
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <Landmark size={15} />
            <span>Pôle Mémoire & Archives Nationales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Section Histoire
          </h1>
          <p className="text-xs font-mono text-[#5a554e] mt-0.5">
            Gouvernance des enquêtes rétrospectives, archives de la révolution sankariste et mémoire de la nation.
          </p>
        </div>

        <Link
          href="/admin/articles/nouveau?category=histoire"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Nouvel Article Histoire</span>
        </Link>
      </div>

      {/* Special Histoire Focus Banner */}
      <div className="bg-white border border-[#e6dfd5] border-l-4 border-l-[#087443] p-5 rounded shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#087443]">
              <Sparkles size={15} />
              <span>Priorité Éditoriale · Rubrique Histoire</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-[#141414]">
              Mémoire, Révolution Sankariste et Trajectoires de la Nation
            </h2>
            <p className="text-xs font-mono text-[#5a554e] leading-relaxed">
              La rubrique <b>Histoire</b> (anciennement Idées) est le laboratoire de mise en perspective de Burkina News. Elle héberge les analyses historiques, les leçons des politiques d'autosuffisance de 1983-1987 et le décryptage des archives nationales.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/fr/histoire"
              target="_blank"
              className="px-3.5 py-2 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] hover:border-[#087443] hover:text-[#087443] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              Voir /fr/histoire
            </Link>
            <Link
              href="/admin/articles?category=histoire"
              className="px-3.5 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5"
            >
              <span>Gérer dans la table des articles</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                {articles.filter(a => a.category === 'histoire' || a.category === 'idees').length}
              </span>
            </Link>
          </div>
        </div>

        {/* Articles Histoire list directly embedded in this screen */}
        <div className="mt-5 pt-4 border-t border-[#e6dfd5] relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[#087443]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Articles publiés dans la rubrique Histoire ({articles.filter(a => a.category === 'histoire' || a.category === 'idees').length})
              </h3>
            </div>
            <Link
              href="/admin/articles/nouveau?category=histoire"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#087443] hover:underline"
            >
              <Plus size={14} />
              <span>Rédiger un nouvel article Histoire</span>
            </Link>
          </div>

          {articles.filter(a => a.category === 'histoire' || a.category === 'idees').length === 0 ? (
            <div className="bg-[#faf8f5] p-6 text-center rounded border border-[#e6dfd5] text-xs font-mono text-[#736c62]">
              Aucun article rattaché à l&apos;Histoire pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.filter(a => a.category === 'histoire' || a.category === 'idees').map(art => (
                <div 
                  key={art.id} 
                  className="bg-[#faf8f5] border border-[#e6dfd5] p-4 rounded flex flex-col justify-between hover:border-[#087443] hover:shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                    {art.image && (
                      <div className="w-full sm:w-28 h-32 sm:h-24 shrink-0 rounded overflow-hidden border border-[#e6dfd5] bg-white shadow-xs">
                        <img 
                          src={art.image} 
                          alt={art.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-[#087443] border border-emerald-200 text-[10px] font-mono font-bold uppercase rounded">
                          {art.type}
                        </span>
                        <span className="text-[10px] font-mono text-[#736c62]">
                          {art.readTime || '6 min'} • {art.sourceCount || 0} sources
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#141414] leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs font-serif text-[#5a554e] line-clamp-2 italic">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#e6dfd5] text-xs font-mono">
                    <span className="text-[10px] text-[#736c62]">
                      Publié le {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('fr-FR') : 'Août 2026'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/fr/histoire/${art.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-white border border-[#e6dfd5] text-[#141414] hover:border-[#087443] hover:text-[#087443] rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Voir en ligne</span>
                      </Link>
                      <Link
                        href={`/admin/articles/${art.id}`}
                        className="px-2.5 py-1 bg-[#087443] hover:bg-[#075f37] text-white font-bold rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={12} />
                        <span>Modifier</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Histoire Key Indicators */}
      {loading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Articles Publiés</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {articles.filter(a => a.category === 'histoire' || a.category === 'idees').length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Enquêtes & Éditoriaux</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Sources & Archives</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {articles.filter(a => a.category === 'histoire' || a.category === 'idees').reduce((acc, a) => acc + (a.sourceCount || 0), 0)}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">Documents primaires vérifiés</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Bilinguisme EN</div>
            <div className="text-2xl font-mono font-bold text-[#1e3a5f] mt-1">
              {articles.filter(a => (a.category === 'histoire' || a.category === 'idees') && a.titleEn).length} / {articles.filter(a => a.category === 'histoire' || a.category === 'idees').length}
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Versions anglaises validées</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Pôle Mémoriel</div>
            <div className="text-sm font-mono font-bold text-[#141414] mt-2">
              Sankara 1983-1987
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Doctrine d&apos;autosuffisance</div>
          </div>
        </div>
      )}

      {/* Regard de la Rédaction (Manifeste Histoire) */}
      <div className="bg-white border-l-4 border-[#087443] border-y border-r border-[#e6dfd5] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#087443]">
            <BookOpen size={14} />
            <span>Ligne Éditoriale · Le Regard de la Rédaction pour l&apos;Histoire</span>
          </div>
          <p className="font-serif italic text-sm text-[#3f3b35] leading-relaxed max-w-3xl">
            &ldquo;{defaultRegards.histoire.fr}&rdquo;
          </p>
        </div>
        <button
          onClick={() => {
            const histoireCat = categories.find(c => c.code === 'histoire');
            if (histoireCat) handleOpenEdit(histoireCat);
          }}
          className="px-3.5 py-2 border border-[#e6dfd5] hover:border-[#087443] hover:text-[#087443] text-xs font-mono font-bold rounded transition-colors shrink-0 inline-flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Edit3 size={14} />
          <span>Modifier le cadrage</span>
        </button>
      </div>

      {/* Edit Category Framing Modal */}
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
                      "Le Regard de la Rédaction" (Encadré latéral vert de la page publique)
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
