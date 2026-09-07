"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Filter, 
  Edit3, 
  ExternalLink, 
  Check, 
  X, 
  AlertCircle, 
  Languages, 
  ShieldCheck, 
  Target, 
  Calendar,
  BarChart2
} from 'lucide-react';
import { Indicator, CategoryCode } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import { SkeletonTable, SkeletonStat } from '@/components/admin/Skeleton';
import MicumCopilot from '@/components/admin/MicumCopilot';
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';

const CATEGORIES: { code: CategoryCode; label: string }[] = [
  { code: 'economie', label: 'Économie & Finances' },
  { code: 'securite', label: 'Sécurité & Souveraineté' },
  { code: 'chantiers', label: 'Énergie & Infrastructures' },
  { code: 'agriculture', label: 'Agriculture & Souveraineté Alim.' },
  { code: 'societe', label: 'Santé, Éducation & Société' },
  { code: 'histoire', label: 'Mémoire & Trajectoires' },
];

export default function AdminIndicatorsPage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [trendFilter, setTrendFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Form State
  const [formData, setFormData] = useState<Partial<Indicator>>({});

  // Fetch indicators
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger les indicateurs.');
      const data = await res.json();
      setIndicators(data.indicators || []);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered indicators
  const filteredIndicators = useMemo(() => {
    return indicators.filter((ind) => {
      const matchesSearch = 
        ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ind.nameEn && ind.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ind.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'all' || ind.category === categoryFilter;
      const matchesTrend = trendFilter === 'all' || ind.trend === trendFilter;

      return matchesSearch && matchesCat && matchesTrend;
    });
  }, [indicators, searchTerm, categoryFilter, trendFilter]);

  // Open Edit Modal
  const handleOpenEdit = (ind: Indicator) => {
    setSelectedIndicator(ind);
    setFormData({ ...ind });
    setActiveTab('fr');
    setIsModalOpen(true);
  };

  // Micum Batch Indicators Ingestion
  const handleMicumApplyIndicators = async (data: any) => {
    if (!data.updates || !Array.isArray(data.updates)) return;
    try {
      setLoading(true);
      for (const update of data.updates) {
        const found = indicators.find(i => i.code === update.code);
        if (found) {
          const updated: Indicator = {
            ...found,
            currentValue: typeof update.newValue === 'number' ? update.newValue : parseFloat(update.newValue) || found.currentValue,
            trend: (update.trend === 'up' || update.trend === 'down' || update.trend === 'stable') ? update.trend : found.trend,
            source: update.source || found.source,
            currentYear: new Date().getFullYear()
          };
          await fetch('/api/admin/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_indicator', payload: updated })
          });
        }
      }
      success('Indicateurs actualisés par Micum', `${data.updates.length} indicateurs ont été mis à jour dans le Baromètre RELANCE.`);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.currentValue === undefined) {
      warning('Champs requis', 'Veuillez renseigner le nom et la valeur actuelle de l\'indicateur.');
      return;
    }

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_indicator',
          payload: formData
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success('Indicateur mis à jour', `La métrique "${formData.name}" a été actualisée.`);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#087443] font-bold uppercase tracking-wider">
            <BarChart2 size={15} />
            <span>Suivi Macroéconomique & Social</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Baromètre RELANCE (Indicateurs Nationaux)
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            20 métriques stratégiques mesurant les engagements de la trajectoire nationale 2026-2030.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Link
            href="/fr/tracker/indicateurs"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
          >
            <ExternalLink size={14} />
            Voir le Baromètre Public
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <SkeletonStat count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Total Indicateurs</div>
            <div className="text-2xl font-mono font-bold text-[#141414] mt-1">{indicators.length}</div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Métriques officielles</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">En Progression (↗)</div>
            <div className="text-2xl font-mono font-bold text-[#087443] mt-1">
              {indicators.filter(i => i.trend === 'up').length}
            </div>
            <div className="text-[10px] font-mono text-[#087443] mt-0.5">Trajectoire favorable</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">Stables (→)</div>
            <div className="text-2xl font-mono font-bold text-[#736c62] mt-1">
              {indicators.filter(i => i.trend === 'stable').length}
            </div>
            <div className="text-[10px] font-mono text-[#736c62] mt-0.5">En cours de consolidation</div>
          </div>
          <div className="bg-white border border-[#e6dfd5] p-4">
            <div className="text-[11px] font-mono uppercase text-[#736c62] font-semibold">En Baisse (↘)</div>
            <div className="text-2xl font-mono font-bold text-[#c2410c] mt-1">
              {indicators.filter(i => i.trend === 'down').length}
            </div>
            <div className="text-[10px] font-mono text-[#c2410c] mt-0.5">Point de vigilance</div>
          </div>
        </div>
      )}

      {/* Micum Intelligent Assistant Banner */}
      <MicumCopilot
        mode="indicators"
        variant="banner"
        onApply={handleMicumApplyIndicators}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e6dfd5] p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#736c62]" />
          <input
            type="text"
            placeholder="Rechercher par nom d'indicateur, code (ex: IND-01), source..."
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
            <span>Filtres :</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Toutes les catégories</option>
            {CATEGORIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>

          <select
            value={trendFilter}
            onChange={(e) => setTrendFilter(e.target.value)}
            className="text-xs font-mono border border-[#e6dfd5] px-2.5 py-2 rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
          >
            <option value="all">Toutes les tendances</option>
            <option value="up">En hausse (↗)</option>
            <option value="stable">Stable (→)</option>
            <option value="down">En baisse (↘)</option>
          </select>
        </div>
      </div>

      {/* Indicators Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : filteredIndicators.length === 0 ? (
        <div className="bg-white border border-[#e6dfd5] p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-[#736c62] mb-3" />
          <div className="text-base font-serif font-bold text-[#141414]">Aucun indicateur trouvé</div>
          <p className="text-xs font-mono text-[#736c62] mt-1 max-w-sm mx-auto">
            Aucune métrique ne correspond à ces critères.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#e6dfd5] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141414] bg-[#faf8f5] text-[10px] font-mono uppercase tracking-wider text-[#736c62]">
                <th className="py-3 px-4">Code & Indicateur</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Valeur Actuelle</th>
                <th className="py-3 px-3">Tendance</th>
                <th className="py-3 px-3">Base → Cibles</th>
                <th className="py-3 px-3">Source Officielle</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5] text-xs font-mono">
              {filteredIndicators.map((ind) => {
                const TrendIcon = ind.trend === 'up' ? TrendingUp : ind.trend === 'down' ? TrendingDown : Minus;
                const trendColor = ind.trend === 'up' ? 'text-[#087443] bg-emerald-50 border-emerald-200' : ind.trend === 'down' ? 'text-[#c2410c] bg-orange-50 border-orange-200' : 'text-[#736c62] bg-neutral-50 border-neutral-200';

                return (
                  <tr key={ind.id || ind.code} className="hover:bg-[#faf8f5]/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-[#141414] text-white text-[9px] font-bold rounded">
                            {ind.code}
                          </span>
                          <span className="font-serif font-bold text-sm text-[#141414] line-clamp-1 hover:text-[#087443]">
                            {ind.name}
                          </span>
                        </div>
                        {ind.nameEn && (
                          <div className="text-[11px] text-[#736c62] italic line-clamp-1 mt-0.5 ml-10">
                            EN: {ind.nameEn}
                          </div>
                        )}
                        <p className="text-[11px] text-[#5a554e] line-clamp-1 mt-1">
                          {ind.definition}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#faf8f5] border border-[#e6dfd5] rounded text-[#5a554e]">
                        {ind.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-base text-[#141414]">
                        {ind.currentValue.toLocaleString('fr-FR')} <span className="text-xs font-normal text-[#736c62]">{ind.unit}</span>
                      </div>
                      <div className="text-[10px] text-[#736c62]">
                        Année : {ind.currentYear || 2026}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border ${trendColor}`}>
                        <TrendIcon size={12} />
                        {ind.trend === 'up' ? 'En hausse' : ind.trend === 'down' ? 'En baisse' : 'Stable'}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#5a554e]">
                      <div>Base {ind.baselineYear} : <b>{ind.baselineValue}</b></div>
                      <div className="text-[10px] text-[#087443] flex items-center gap-1 mt-0.5">
                        <Target size={10} />
                        Cible 2028 : <b>{ind.target2028 ?? '—'}</b> | 2030 : <b>{ind.target2030 ?? '—'}</b>
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-[180px] truncate text-[11px] text-[#736c62]" title={ind.source}>
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={11} className="text-[#087443] shrink-0" />
                        <span className="truncate">{ind.source}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/fr/tracker/indicateurs/${ind.code}`}
                          target="_blank"
                          title="Voir sur le site public"
                          className="p-1.5 text-[#736c62] hover:text-[#087443] hover:bg-[#faf8f5] rounded"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(ind)}
                          title="Actualiser la valeur"
                          className="px-2.5 py-1 bg-[#faf8f5] border border-[#e6dfd5] text-xs font-bold hover:bg-[#087443] hover:text-white hover:border-[#087443] rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 size={12} />
                          Actualiser
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Indicator Modal */}
      {isModalOpen && selectedIndicator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-[#141414] max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#087443]">
                  Indicateur {formData.code}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#141414]">
                  Actualiser la métrique nationale
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
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#736c62] hover:text-[#141414]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
              {activeTab === 'fr' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Nom de l'indicateur (Français) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443] font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Définition & Méthodologie (Français)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.definition || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded focus:outline-none focus:border-[#087443]"
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
                      Indicator Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Methodological Definition (English)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.definitionEn || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, definitionEn: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#cbd5e1] rounded focus:outline-none focus:border-[#1e3a5f] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Numerical Metrics */}
              <div className="border-t border-[#e6dfd5] pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#736c62] block mb-2">
                  Mesures & Cibles Chiffrées
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#087443] mb-1">
                      Valeur Actuelle *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.currentValue ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 border-2 border-[#087443] rounded font-bold text-sm bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Unité de mesure *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unit || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Année de mesure
                    </label>
                    <input
                      type="number"
                      value={formData.currentYear ?? 2026}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentYear: parseInt(e.target.value) || 2026 }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Tendance observée
                    </label>
                    <select
                      value={formData.trend || 'stable'}
                      onChange={(e) => setFormData(prev => ({ ...prev, trend: e.target.value as any }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    >
                      <option value="up">En hausse (↗)</option>
                      <option value="stable">Stable (→)</option>
                      <option value="down">En baisse (↘)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Valeur de Base
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.baselineValue ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, baselineValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Année de Base
                    </label>
                    <input
                      type="number"
                      value={formData.baselineYear ?? 2023}
                      onChange={(e) => setFormData(prev => ({ ...prev, baselineYear: parseInt(e.target.value) || 2023 }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Cible PND 2028
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.target2028 ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, target2028: parseFloat(e.target.value) || undefined }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                      Cible PND 2030
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.target2030 ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, target2030: parseFloat(e.target.value) || undefined }))}
                      className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Source attribution */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#141414] mb-1">
                  Source officielle primaire
                </label>
                <input
                  type="text"
                  value={formData.source || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Ex: Ministère de l'Énergie / SONABEL, INSD, FMI..."
                  className="w-full px-2.5 py-1.5 border border-[#e6dfd5] rounded"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#e6dfd5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-[#e6dfd5] text-xs font-bold hover:bg-[#faf8f5]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white font-bold uppercase rounded hover:bg-[#075f37]"
                >
                  <Check size={14} />
                  Enregistrer l'indicateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
