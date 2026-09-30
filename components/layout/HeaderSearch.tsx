"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Loader2, 
  FileText, 
  Construction, 
  BarChart3, 
  Radio, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { searchApi } from '@/lib/api/search';
import { mapArticleDTOToArticle, mapProjectDTOToProject, mapIndicatorDTOToIndicator } from '@/lib/api/mappers';
import { Article, Project, Indicator } from '@/data/types';
import { BriefFactDTO } from '@/lib/api/types';
import { getArticles } from '@/data/mock/articles';
import { getProjects } from '@/data/mock/projects';
import { getIndicators } from '@/data/mock/indicators';

interface HeaderSearchProps {
  lang: 'fr' | 'en';
  isMobile?: boolean;
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

interface SuggestionGroup {
  articles: Article[];
  projects: Project[];
  indicators: Indicator[];
  facts: BriefFactDTO[];
  total: number;
}

const STATUS_LABELS: Record<string, { fr: string; en: string; badge: string }> = {
  'en-construction': { fr: 'En chantier', en: 'Under Construction', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  'termine': { fr: 'Livré', en: 'Delivered', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  'retard': { fr: 'En retard', en: 'Delayed', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
  'en-etude': { fr: "À l'étude", en: 'In Study', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  'annonce': { fr: 'Annoncé', en: 'Announced', badge: 'bg-stone-100 text-stone-700 border-stone-300' },
  'suspendu': { fr: 'Suspendu', en: 'Suspended', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
};

export default function HeaderSearch({
  lang = 'fr',
  isMobile = false,
  className = '',
  autoFocus = false,
  onNavigate,
}: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionGroup | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const isEn = lang === 'en';
  const rechercheHref = isEn ? '/en/recherche' : '/fr/recherche';
  const placeholder = isEn 
    ? 'Search archives, projects, data...' 
    : 'Rechercher articles, chantiers, indicateurs...';

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search logic (220ms)
  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // 1. Tenter la recherche API backend Go
        const res = await searchApi.search({
          q: trimmed,
          limit: 4,
          lang,
        });

        const hasApiResults = res && (
          (res.articles && res.articles.length > 0) ||
          (res.projects && res.projects.length > 0) ||
          (res.indicators && res.indicators.length > 0) ||
          (res.facts && res.facts.length > 0)
        );

        if (hasApiResults) {
          const mappedArticles = (res.articles || []).slice(0, 3).map(mapArticleDTOToArticle);
          const mappedProjects = (res.projects || []).slice(0, 3).map(mapProjectDTOToProject);
          const mappedIndicators = (res.indicators || []).slice(0, 3).map(mapIndicatorDTOToIndicator);
          const mappedFacts = (res.facts || []).slice(0, 2);

          setSuggestions({
            articles: mappedArticles,
            projects: mappedProjects,
            indicators: mappedIndicators,
            facts: mappedFacts,
            total: res.total || (mappedArticles.length + mappedProjects.length + mappedIndicators.length + mappedFacts.length),
          });
          setIsOpen(true);
          setLoading(false);
          return;
        }

        // 2. Repli local instantané (mock/store data)
        const lower = trimmed.toLowerCase();
        const localArticles = getArticles(lang).filter(a => 
          a.title.toLowerCase().includes(lower) || 
          a.excerpt.toLowerCase().includes(lower) ||
          a.category.toLowerCase().includes(lower)
        ).slice(0, 3);

        const localProjects = getProjects(lang).filter(p => 
          p.title.toLowerCase().includes(lower) || 
          p.description.toLowerCase().includes(lower) ||
          p.region.toLowerCase().includes(lower) ||
          p.sector.toLowerCase().includes(lower)
        ).slice(0, 3);

        const localIndicators = getIndicators(lang).filter(i => 
          i.name.toLowerCase().includes(lower) || 
          i.code.toLowerCase().includes(lower) ||
          i.definition.toLowerCase().includes(lower)
        ).slice(0, 3);

        setSuggestions({
          articles: localArticles,
          projects: localProjects,
          indicators: localIndicators,
          facts: [],
          total: localArticles.length + localProjects.length + localIndicators.length,
        });
        setIsOpen(true);
      } catch (e) {
        console.warn('[HeaderSearch] Erreur recherche debounce :', e);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, lang]);

  const handleClear = () => {
    setQuery('');
    setSuggestions(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    if (onNavigate) onNavigate();
    startTransition(() => {
      router.push(`${rechercheHref}?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
  };

  const hasResults = suggestions && suggestions.total > 0;
  const showEmpty = !loading && query.trim().length >= 2 && suggestions && suggestions.total === 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={
            isMobile
              ? "w-full pl-9 pr-9 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414] transition-colors"
              : "w-56 lg:w-72 pl-8 pr-8 py-1.5 bg-white border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414] transition-colors"
          }
          aria-label={placeholder}
          autoComplete="off"
        />

        {/* Left search icon */}
        <Search 
          size={isMobile ? 16 : 14} 
          className={isMobile ? "absolute left-3 top-3 text-[#888888]" : "absolute left-2.5 top-2 text-[#888888]"} 
        />

        {/* Right loader / clear icon */}
        <div className={isMobile ? "absolute right-2.5 top-2.5 flex items-center" : "absolute right-2 top-1.5 flex items-center"}>
          {loading ? (
            <Loader2 size={15} className="text-[#0b4627] animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#888888] hover:text-[#141414] p-0.5 rounded cursor-pointer"
              title={isEn ? "Clear search" : "Effacer la recherche"}
              aria-label={isEn ? "Clear search" : "Effacer"}
            >
              <X size={15} />
            </button>
          ) : null}
        </div>
      </form>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div 
          className={`absolute left-0 mt-1 z-50 bg-white border-2 border-[#141414] shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${
            isMobile 
              ? 'w-full' 
              : 'w-[380px] lg:w-[440px] right-0 left-auto'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#f4eee3] border-b border-[#e6dfd5] text-[11px] font-mono">
            <span className="text-[#0b4627] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Search size={12} />
              {isEn ? "Live Suggestions" : "Suggestions en direct"}
            </span>
            {hasResults && (
              <span className="text-[#737373]">
                {suggestions.total} {isEn ? "matches" : "trouvé(s)"}
              </span>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f0ece4]">
            
            {/* Loading State */}
            {loading && !suggestions && (
              <div className="p-6 text-center text-xs font-mono text-[#737373] flex flex-col items-center justify-center gap-2">
                <Loader2 size={18} className="text-[#0b4627] animate-spin" />
                <span>{isEn ? "Searching database..." : "Recherche dans les archives..."}</span>
              </div>
            )}

            {/* Empty State */}
            {showEmpty && (
              <div className="p-5 text-center">
                <p className="text-xs text-[#555555] font-serif">
                  {isEn ? "No direct match for" : "Aucun résultat direct pour"} « <b className="text-[#141414]">{query}</b> »
                </p>
                <p className="text-[11px] text-[#888888] font-mono mt-1">
                  {isEn ? "Press Enter to query the entire archive." : "Appuyez sur Entrée pour rechercher sur tout le site."}
                </p>
              </div>
            )}

            {/* 1. ARTICLES */}
            {suggestions?.articles && suggestions.articles.length > 0 && (
              <div className="p-2 bg-white">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] px-2 py-1 flex items-center gap-1.5">
                  <FileText size={12} className="text-[#0b4627]" />
                  <span>{isEn ? "Articles & Investigations" : "Articles & Enquêtes"}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {suggestions.articles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/${lang}/${art.category}/${art.slug}`}
                      onClick={handleItemClick}
                      className="group flex items-start gap-2.5 p-2 rounded hover:bg-[#faf8f5] transition-colors"
                    >
                      {art.image && (
                        <img 
                          src={art.image} 
                          alt="" 
                          className="w-10 h-10 object-cover rounded shrink-0 border border-[#e6dfd5]" 
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono uppercase font-bold text-[#0b4627] bg-[#f4eee3] px-1.5 py-0.2 rounded">
                            {art.category}
                          </span>
                          {art.readTime && (
                            <span className="text-[9px] font-mono text-[#888888]">
                              · {art.readTime}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-xs font-bold text-[#141414] group-hover:text-[#0b4627] line-clamp-1 mt-0.5 transition-colors">
                          {art.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. CHANTIERS TRACKER */}
            {suggestions?.projects && suggestions.projects.length > 0 && (
              <div className="p-2 bg-white">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] px-2 py-1 flex items-center gap-1.5">
                  <Construction size={12} className="text-[#0b4627]" />
                  <span>{isEn ? "National Projects (Tracker)" : "Chantiers du Faso (Tracker)"}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {suggestions.projects.map((proj) => {
                    const statusInfo = STATUS_LABELS[proj.currentStatus] || {
                      fr: proj.currentStatus,
                      en: proj.currentStatus,
                      badge: 'bg-neutral-100 text-neutral-700 border-neutral-300'
                    };
                    const statusLabel = isEn ? statusInfo.en : statusInfo.fr;

                    return (
                      <Link
                        key={proj.id}
                        href={`/${lang}/tracker/projets/${proj.slug}`}
                        onClick={handleItemClick}
                        className="group flex items-start justify-between gap-2 p-2 rounded hover:bg-[#faf8f5] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-[#737373]">
                              {proj.region}
                            </span>
                            <span className="text-[9px] font-mono text-[#888888]">·</span>
                            <span className="text-[9px] font-mono text-[#737373]">
                              {proj.sector}
                            </span>
                          </div>
                          <h4 className="font-serif text-xs font-bold text-[#141414] group-hover:text-[#0b4627] line-clamp-1 mt-0.5 transition-colors">
                            {proj.title}
                          </h4>
                        </div>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border rounded shrink-0 ${statusInfo.badge}`}>
                          {statusLabel}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. INDICATEURS RELANCE */}
            {suggestions?.indicators && suggestions.indicators.length > 0 && (
              <div className="p-2 bg-white">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] px-2 py-1 flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-[#0b4627]" />
                  <span>{isEn ? "Key Indicators (Barometer)" : "Indicateurs RELANCE"}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {suggestions.indicators.map((ind) => {
                    const TrendIcon = ind.trend === 'up' ? TrendingUp : ind.trend === 'down' ? TrendingDown : Minus;
                    const trendColor = ind.trend === 'up' ? 'text-emerald-700' : ind.trend === 'down' ? 'text-rose-700' : 'text-neutral-500';

                    return (
                      <Link
                        key={ind.id || ind.code}
                        href={`/${lang}/tracker/indicateurs/${ind.code}`}
                        onClick={handleItemClick}
                        className="group flex items-center justify-between gap-2 p-2 rounded hover:bg-[#faf8f5] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-mono font-bold bg-[#141414] text-white px-1.5 py-0.2 rounded">
                            {ind.code}
                          </span>
                          <h4 className="font-serif text-xs font-bold text-[#141414] group-hover:text-[#0b4627] line-clamp-1 mt-0.5 transition-colors">
                            {ind.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#141414] shrink-0">
                          <span>
                            {(ind.currentValue !== undefined && ind.currentValue !== null ? Number(ind.currentValue) : 0).toLocaleString('fr-FR')} {ind.unit}
                          </span>
                          <TrendIcon size={12} className={trendColor} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. DÉPÊCHES DU FIL */}
            {suggestions?.facts && suggestions.facts.length > 0 && (
              <div className="p-2 bg-white">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] px-2 py-1 flex items-center gap-1.5">
                  <Radio size={12} className="text-[#0b4627]" />
                  <span>{isEn ? "The Brief (60s)" : "Le Fil (Dépêches)"}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {suggestions.facts.map((fact) => (
                    <Link
                      key={fact.id}
                      href={`/${lang}/fil`}
                      onClick={handleItemClick}
                      className="group block p-2 rounded hover:bg-[#faf8f5] transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[9px] font-mono text-[#888888]">
                        <span className="font-bold text-[#0b4627]">{fact.time}</span>
                        <span>·</span>
                        <span className="uppercase">{fact.category_code}</span>
                      </div>
                      <p className="text-xs text-[#141414] font-serif line-clamp-1 mt-0.5 group-hover:text-[#0b4627] transition-colors">
                        {isEn && fact.text_en ? fact.text_en : fact.text_fr}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Action: Voir tous les résultats */}
          {query.trim().length >= 2 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#faf8f5] hover:bg-[#0b4627] hover:text-white border-t border-[#e6dfd5] text-xs font-mono font-bold text-[#141414] transition-colors cursor-pointer group"
            >
              <span>
                {isEn ? "View all results for" : "Voir tous les résultats pour"} « {query} »
              </span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
