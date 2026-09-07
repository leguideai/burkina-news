"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Check, 
  ExternalLink, 
  Layers, 
  Quote, 
  Eye, 
  ShieldCheck, 
  Languages, 
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react';
import { Article } from '@/data/types';
import { HomepageConfig } from '@/data/admin-store';
import { useToast } from '@/components/admin/Toast';
import { SkeletonCard, SkeletonStat } from '@/components/admin/Skeleton';

export default function AdminUnePage() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig | null>(null);

  // Active Quote Tab
  const [quoteTab, setQuoteTab] = useState<'fr' | 'en'>('fr');

  // Load store data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Impossible de charger la configuration de la Une.');
      const data = await res.json();
      setArticles(data.articles || []);
      setHomepageConfig(data.homepageConfig || null);
    } catch (err: any) {
      error('Erreur', err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save homepage config
  const handleSaveConfig = async () => {
    if (!homepageConfig) return;

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_homepage_config',
          payload: homepageConfig
        })
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur d\'enregistrement.');

      success(
        'Une d\'accueil mise à jour',
        'La sélection éditoriale a été déployée sur la page d\'accueil publique.'
      );
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  const getArticle = (id: string) => {
    if (!id) return null;
    const norm = id.replace(/^art-0*/, 'art-');
    return articles.find(a => a.id === id || a.id.replace(/^art-0*/, 'art-') === norm);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#c2410c] font-bold uppercase tracking-wider">
            <Sparkles size={15} />
            <span>Pilotage Éditorial de la Vitrine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-1">
            Mise en Page de la Une
          </h1>
          <p className="text-sm font-mono text-[#5a554e] mt-0.5">
            Orchestration du Grand Décryptage, des sujets prioritaires et de la citation de la rédaction.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/fr"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6dfd5] hover:border-[#141414] font-mono text-xs font-bold rounded shadow-xs transition-colors"
          >
            <ExternalLink size={14} />
            Voir la Une en Direct
          </Link>
          <button
            onClick={handleSaveConfig}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            <Check size={16} />
            Déployer la Une
          </button>
        </div>
      </div>

      {loading || !homepageConfig ? (
        <div className="space-y-4">
          <SkeletonStat count={3} />
          <SkeletonCard count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Story Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Slot 1: Grand Décryptage (Lead) */}
            <div className="bg-white border-2 border-[#087443] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#087443]" />
                  <h3 className="font-serif font-bold text-base text-[#141414]">
                    Slot 1 : Le Grand Décryptage (Article d'ouverture)
                  </h3>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#087443] text-white font-bold rounded">
                  Pleine Largeur
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1.5">
                  Sélectionner l'article d'ouverture :
                </label>
                <select
                  value={homepageConfig.leadArticleId}
                  onChange={(e) => setHomepageConfig(prev => prev ? ({ ...prev, leadArticleId: e.target.value }) : null)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443] font-bold"
                >
                  {articles.map(art => (
                    <option key={art.id} value={art.id}>
                      [{art.category.toUpperCase()}] {art.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Article Card Preview */}
              {(() => {
                const leadArt = getArticle(homepageConfig.leadArticleId);
                if (!leadArt) return null;
                return (
                  <div className="bg-[#faf8f5] border border-[#e6dfd5] p-4 rounded flex flex-col sm:flex-row gap-4 items-start">
                    <img
                      src={leadArt.image || '/images/lead.jpeg'}
                      alt=""
                      className="w-full sm:w-44 h-28 object-cover rounded border border-[#e6dfd5] shrink-0"
                    />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="uppercase font-bold text-[#087443]">{leadArt.category}</span>
                        <span>•</span>
                        <span className="text-[#736c62]">{leadArt.readTime}</span>
                        <span>•</span>
                        <span className="text-[#087443] font-bold">{leadArt.sourceCount} sources</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#141414] line-clamp-2">
                        {leadArt.title}
                      </h4>
                      <p className="text-xs font-serif text-[#5a554e] line-clamp-2">
                        {leadArt.excerpt}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Slots 2 & 3: Secondary Stories */}
            <div className="bg-white border border-[#e6dfd5] p-5 shadow-sm space-y-4">
              <div className="border-b border-[#e6dfd5] pb-3 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Slots 2 & 3 : Sujets d'Approfondissement
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#e6dfd5] text-[#141414] font-bold rounded">
                  Grille 2 Colonnes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Secondary 1 */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414]">
                    Deuxième Sujet :
                  </label>
                  <select
                    value={homepageConfig.secondaryArticleIds[0] || ''}
                    onChange={(e) => {
                      const newSecondaries = [...homepageConfig.secondaryArticleIds];
                      newSecondaries[0] = e.target.value;
                      setHomepageConfig(prev => prev ? ({ ...prev, secondaryArticleIds: newSecondaries }) : null);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
                  >
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>
                        [{art.category.toUpperCase()}] {art.title.slice(0, 40)}...
                      </option>
                    ))}
                  </select>

                  {(() => {
                    const art = getArticle(homepageConfig.secondaryArticleIds[0]);
                    if (!art) return null;
                    return (
                      <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded text-xs">
                        <div className="font-bold text-[#087443] text-[10px] uppercase">{art.category}</div>
                        <div className="font-serif font-bold text-[#141414] line-clamp-2 mt-0.5">{art.title}</div>
                      </div>
                    );
                  })()}
                </div>

                {/* Secondary 2 */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414]">
                    Troisième Sujet :
                  </label>
                  <select
                    value={homepageConfig.secondaryArticleIds[1] || ''}
                    onChange={(e) => {
                      const newSecondaries = [...homepageConfig.secondaryArticleIds];
                      newSecondaries[1] = e.target.value;
                      setHomepageConfig(prev => prev ? ({ ...prev, secondaryArticleIds: newSecondaries }) : null);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
                  >
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>
                        [{art.category.toUpperCase()}] {art.title.slice(0, 40)}...
                      </option>
                    ))}
                  </select>

                  {(() => {
                    const art = getArticle(homepageConfig.secondaryArticleIds[1]);
                    if (!art) return null;
                    return (
                      <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded text-xs">
                        <div className="font-bold text-[#087443] text-[10px] uppercase">{art.category}</div>
                        <div className="font-serif font-bold text-[#141414] line-clamp-2 mt-0.5">{art.title}</div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Slots 4 & 5: Terrain & Fact-check */}
            <div className="bg-white border border-[#e6dfd5] p-5 shadow-sm space-y-4">
              <div className="border-b border-[#e6dfd5] pb-3 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#141414]">
                  Enquêtes Spéciales en Vitrine
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                    Enquête Terrain / Carnet :
                  </label>
                  <select
                    value={homepageConfig.terrainArticleId || ''}
                    onChange={(e) => setHomepageConfig(prev => prev ? ({ ...prev, terrainArticleId: e.target.value }) : null)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
                  >
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>
                        [{art.type}] {art.title.slice(0, 38)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#141414] mb-1">
                    Vrai ou Faux / Fact-check :
                  </label>
                  <select
                    value={homepageConfig.factCheckArticleId || ''}
                    onChange={(e) => setHomepageConfig(prev => prev ? ({ ...prev, factCheckArticleId: e.target.value }) : null)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-[#e6dfd5] rounded bg-[#faf8f5] focus:outline-none focus:border-[#087443]"
                  >
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>
                        [{art.type}] {art.title.slice(0, 38)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Quote of the Editorial Board */}
          <div className="space-y-6">
            <div className="bg-[#072e1a] text-white p-5 border-t-4 border-[#ffd8a8] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b4d32] pb-3">
                <div className="flex items-center gap-2">
                  <Quote size={16} className="text-[#ffd8a8]" />
                  <h3 className="font-serif font-bold text-base">
                    Citation de la Rédaction
                  </h3>
                </div>

                <div className="flex bg-[#0b4627] p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => setQuoteTab('fr')}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      quoteTab === 'fr' ? 'bg-[#ffd8a8] text-[#072e1a]' : 'text-[#a7c5b6]'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteTab('en')}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      quoteTab === 'en' ? 'bg-[#ffd8a8] text-[#072e1a]' : 'text-[#a7c5b6]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {quoteTab === 'fr' ? (
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#ffd8a8] mb-1">
                      Citation (Français) :
                    </label>
                    <textarea
                      rows={3}
                      value={homepageConfig.featuredQuote.quoteFr}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomepageConfig(prev => prev ? ({
                          ...prev,
                          featuredQuote: { ...prev.featuredQuote, quoteFr: val }
                        }) : null);
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#052213] border border-[#1b4d32] rounded text-white font-serif text-sm focus:outline-none focus:border-[#ffd8a8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#a7c5b6] mb-1">
                      Auteur :
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.featuredQuote.author}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomepageConfig(prev => prev ? ({
                          ...prev,
                          featuredQuote: { ...prev.featuredQuote, author: val }
                        }) : null);
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#052213] border border-[#1b4d32] rounded text-white focus:outline-none focus:border-[#ffd8a8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#a7c5b6] mb-1">
                      Contexte / Fonction (Français) :
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.featuredQuote.contextFr}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomepageConfig(prev => prev ? ({
                          ...prev,
                          featuredQuote: { ...prev.featuredQuote, contextFr: val }
                        }) : null);
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#052213] border border-[#1b4d32] rounded text-white focus:outline-none focus:border-[#ffd8a8]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#ffd8a8] mb-1">
                      Featured Quote (English) :
                    </label>
                    <textarea
                      rows={3}
                      value={homepageConfig.featuredQuote.quoteEn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomepageConfig(prev => prev ? ({
                          ...prev,
                          featuredQuote: { ...prev.featuredQuote, quoteEn: val }
                        }) : null);
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#052213] border border-[#1b4d32] rounded text-white font-serif text-sm focus:outline-none focus:border-[#ffd8a8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#a7c5b6] mb-1">
                      Context / Title (English) :
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.featuredQuote.contextEn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHomepageConfig(prev => prev ? ({
                          ...prev,
                          featuredQuote: { ...prev.featuredQuote, contextEn: val }
                        }) : null);
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#052213] border border-[#1b4d32] rounded text-white focus:outline-none focus:border-[#ffd8a8]"
                    />
                  </div>
                </div>
              )}

              {/* Quote Live Preview Box */}
              <div className="mt-4 p-4 bg-[#052213] border border-[#1b4d32] rounded">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#ffd8a8] mb-1">
                  Aperçu bloc éditorial
                </div>
                <blockquote className="font-serif italic text-sm text-[#ffd8a8]">
                  {quoteTab === 'fr' ? homepageConfig.featuredQuote.quoteFr : homepageConfig.featuredQuote.quoteEn}
                </blockquote>
                <div className="mt-2 text-xs font-bold text-white">
                  — {homepageConfig.featuredQuote.author}
                </div>
                <div className="text-[10px] text-[#a7c5b6]">
                  {quoteTab === 'fr' ? homepageConfig.featuredQuote.contextFr : homepageConfig.featuredQuote.contextEn}
                </div>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-2.5 bg-[#087443] hover:bg-[#075f37] text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Sauvegarder les réglages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
