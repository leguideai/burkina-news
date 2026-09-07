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
          <div className="flex items-center gap-2 font-mono text-xs text-[#be185d] font-bold uppercase tracking-wider">
            <Landmark size={15} />
            <span>Architecture Éditoriale & Cadrage Thématique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Rubriques & Section Histoire
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Gouvernance des 6 piliers thématiques, du "Regard de la rédaction" et des archives de la mémoire.
          </p>
        </div>

        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={16} />
          Créer un Article
        </Link>
      </div>

      {/* Special Histoire Focus Banner */}
      <div className="bg-[#be185d]/5 border-2 border-[#be185d] p-5 rounded relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#be185d]">
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
              className="px-3.5 py-2 bg-white border border-[#be185d] text-[#be185d] hover:bg-[#be185d] hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              Voir /fr/histoire
            </Link>
            <Link
              href="/admin/articles"
              className="px-3.5 py-2 bg-[#be185d] text-white hover:bg-[#9d174d] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Gérer les articles Histoire
            </Link>
          </div>
        </div>
      </div>

      {/* Rubriques Cards Grid */}
      {loading ? (
        <SkeletonCard count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const isHistoire = cat.code === 'histoire';
            const catArticles = articles.filter(a => a.category === cat.code);
            const catProjects = projects.filter(p => p.category === cat.code || p.sector.toLowerCase().includes(cat.nameFr.toLowerCase()));
            const regard = defaultRegards[cat.code] || { fr: cat.descriptionFr, en: cat.descriptionEn };

            return (
              <div 
                key={cat.code}
                className={`bg-white border transition-shadow hover:shadow-md flex flex-col justify-between ${
                  isHistoire ? 'border-2 border-[#be185d]' : 'border-[#e6dfd5]'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      Code : {cat.code}
                    </span>
                    {isHistoire && (
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-[#be185d] text-white rounded">
                        ★ Pôle Mémoire
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#141414]">
                      {cat.nameFr}
                    </h3>
                    <div className="text-xs font-mono text-[#736c62] italic mt-0.5">
                      EN: {cat.nameEn}
                    </div>
                  </div>

                  <p className="text-xs font-serif text-[#5a554e] leading-relaxed line-clamp-3">
                    {cat.descriptionFr}
                  </p>

                  {/* Regard de la redaction box snippet */}
                  <div className="bg-[#faf8f5] p-3 border-l-2 border-[#141414] rounded-r text-[11px] font-serif italic text-[#3f3b35]">
                    <div className="font-mono text-[9px] font-bold uppercase not-italic text-[#736c62] mb-1">
                      Regard de la rédaction :
                    </div>
                    "{regard.fr.slice(0, 110)}..."
                  </div>
                </div>

                {/* Card Bottom / Stats & Actions */}
                <div className="p-4 border-t border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3 text-[#736c62]">
                    <span className="flex items-center gap-1 font-bold text-[#141414]">
                      <FileText size={13} className="text-[#087443]" />
                      {catArticles.length} article{catArticles.length > 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Construction size={13} className="text-[#d97706]" />
                      {catProjects.length} chantier{catProjects.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Tooltip position="top" content="Consulter la page publique de cette rubrique">
                      <Link
                        href={`/fr/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-white rounded"
                        aria-label="Voir la page publique"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </Tooltip>

                    <Tooltip position="top" content="Modifier le cadrage et le regard de la rédaction">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-white rounded"
                        aria-label="Modifier le cadrage"
                      >
                        <Edit3 size={14} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Category Framing Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Cadrage Théorique & Ligne Éditoriale
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  Rubrique {formData.nameFr}
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
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
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
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e6dfd5]">
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
              <div className="pt-3 border-t border-[#e6dfd5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1.5 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37]"
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
