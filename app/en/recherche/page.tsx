'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, FileText, Construction, BarChart3, Radio, ChevronRight, X, Loader2 } from 'lucide-react';
import { searchApi } from '@/lib/api/search';
import { articlesApi } from '@/lib/api/articles';
import { mapArticleDTOToArticle, mapProjectDTOToProject, mapIndicatorDTOToIndicator } from '@/lib/api/mappers';
import { Article, Project, Indicator } from '@/data/types';
import { BriefFactDTO } from '@/lib/api/types';
import { getProjects } from '@/data/mock/projects';
import { getIndicators } from '@/data/mock/indicators';
import ArticleCard from '@/components/editorial/ArticleCard';
import ProjectCard from '@/components/tracker/ProjectCard';

type FilterType = 'all' | 'articles' | 'projects' | 'indicators' | 'facts';

function SearchContentEn() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);

  // Synchronize with URL search params (e.g. search triggered from header)
  useEffect(() => {
    const q = searchParams?.get('q') || '';
    if (q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  // Bidirectional synchronization with URL on user typing (no page reload)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const currentParam = url.searchParams.get('q') || '';
      if (query.trim()) {
        if (currentParam !== query.trim()) {
          url.searchParams.set('q', query.trim());
          window.history.replaceState({}, '', url.toString());
        }
      } else if (currentParam) {
        url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [query]);

  // Local fallback / initial cache
  const [enArticles, setEnArticles] = useState<Article[]>([]);
  const enProjects = useMemo(() => getProjects('en'), []);
  const enIndicators = useMemo(() => getIndicators('en'), []);

  // Results returned by PostgreSQL API
  const [apiResults, setApiResults] = useState<{
    articles: Article[];
    projects: Project[];
    indicators: Indicator[];
    facts: BriefFactDTO[];
  } | null>(null);

  // Preload articles for resilient local fallback
  useEffect(() => {
    let isMounted = true;
    articlesApi.listArticles({ limit: 100 })
      .then(res => {
        if (isMounted && res.articles) {
          setEnArticles(res.articles.map(dto => {
            const mapped = mapArticleDTOToArticle(dto);
            if (dto.title_en) mapped.title = dto.title_en;
            if (dto.excerpt_en) mapped.excerpt = dto.excerpt_en;
            return mapped;
          }));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Trigger search with 250ms debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setApiResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchApi.search({
          q: trimmed,
          type: filter === 'all' ? undefined : filter,
          limit: 15,
          lang: 'en',
        });

        if (res && (res.articles?.length || res.projects?.length || res.indicators?.length || res.facts?.length)) {
          setApiResults({
            articles: (res.articles || []).map(dto => {
              const mapped = mapArticleDTOToArticle(dto);
              if (dto.title_en) mapped.title = dto.title_en;
              if (dto.excerpt_en) mapped.excerpt = dto.excerpt_en;
              return mapped;
            }),
            projects: (res.projects || []).map(mapProjectDTOToProject),
            indicators: (res.indicators || []).map(mapIndicatorDTOToIndicator),
            facts: res.facts || [],
          });
        } else {
          setApiResults(null);
        }
      } catch (err) {
        console.warn('[SearchPageEn] Fallback to local search :', err);
        setApiResults(null);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, filter]);

  // Compute local fallback results
  const localResults = useMemo(() => {
    if (!query.trim()) return { articles: [], projects: [], indicators: [], facts: [] };

    const lowerQuery = query.toLowerCase();

    const filteredArticles = enArticles.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery)
    );

    const filteredProjects = enProjects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.region.toLowerCase().includes(lowerQuery) ||
      p.sector.toLowerCase().includes(lowerQuery)
    );

    const filteredIndicators = enIndicators.filter(i => 
      i.name.toLowerCase().includes(lowerQuery) || 
      i.definition.toLowerCase().includes(lowerQuery) ||
      i.code.toLowerCase().includes(lowerQuery)
    );

    return {
      articles: filteredArticles,
      projects: filteredProjects,
      indicators: filteredIndicators,
      facts: [] as BriefFactDTO[],
    };
  }, [query, enArticles, enProjects, enIndicators]);

  // Active selection: API results first, fallback to local
  const effectiveResults = apiResults || localResults;
  const isSearching = query.trim().length > 0;

  const totalResults = 
    effectiveResults.articles.length + 
    effectiveResults.projects.length + 
    effectiveResults.indicators.length + 
    effectiveResults.facts.length;

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Search Archives</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
              Public Documentary Engine & Archives (PostgreSQL)
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-6">
              Search Archives & Data
            </h1>

            {/* Big Search Input */}
            <div className="relative max-w-3xl">
              <input
                type="text"
                placeholder="Search an investigation, infrastructure project, indicator, or institution..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-12 py-3.5 bg-[#faf8f5] border-2 border-[#141414] text-base font-serif text-[#141414] placeholder:text-[#888888] focus:outline-none focus:bg-white"
              />
              <Search size={20} className="absolute left-4 top-4 text-[#888888]" />
              {loading ? (
                <Loader2 className="absolute right-4 top-4 h-5 w-5 text-[#0b4627] animate-spin" />
              ) : query ? (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-4 text-[#888888] hover:text-[#141414] p-0.5"
                  aria-label="Clear search input"
                >
                  <X size={18} />
                </button>
              ) : null}
            </div>
          </div>

          {/* Filter Tabs */}
          {isSearching && (
            <div className="flex flex-wrap items-center gap-2 pt-6">
              <span className="text-xs font-mono text-[#737373] mr-2">Filter results:</span>
              
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'all' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                All ({totalResults})
              </button>

              <button
                onClick={() => setFilter('articles')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'articles' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                Investigations ({effectiveResults.articles.length})
              </button>

              <button
                onClick={() => setFilter('projects')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'projects' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                Tracker Projects ({effectiveResults.projects.length})
              </button>

              <button
                onClick={() => setFilter('indicators')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'indicators' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                Indicators ({effectiveResults.indicators.length})
              </button>

              {effectiveResults.facts.length > 0 && (
                <button
                  onClick={() => setFilter('facts')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                    filter === 'facts' 
                      ? 'bg-[#141414] text-white border-[#141414]' 
                      : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                  }`}
                >
                  Live Wire Dispatches ({effectiveResults.facts.length})
                </button>
              )}
            </div>
          )}

        </div>
      </header>

      {/* Main Results Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {!isSearching ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <Search size={40} className="mx-auto text-[#737373] mb-4" />
            <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
              Explore Our Complete Documentary Base
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#555555] leading-relaxed mb-6">
              Search across investigative dossiers, the national project registry, or PND RELANCE statistical series.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
              <button onClick={() => setQuery('Or')} className="px-2.5 py-1 bg-white border border-[#e6dfd5] hover:border-[#141414]">
                Gold extraction
              </button>
              <button onClick={() => setQuery('Solaire')} className="px-2.5 py-1 bg-white border border-[#e6dfd5] hover:border-[#141414]">
                Solar power
              </button>
              <button onClick={() => setQuery('Kaya')} className="px-2.5 py-1 bg-white border border-[#e6dfd5] hover:border-[#141414]">
                Rail Ouaga-Kaya
              </button>
              <button onClick={() => setQuery('PIB')} className="px-2.5 py-1 bg-white border border-[#e6dfd5] hover:border-[#141414]">
                GDP growth
              </button>
            </div>
          </div>
        ) : !loading && totalResults === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e6dfd5] p-8">
            <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
              No results found for “{query}”
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-md mx-auto mb-4">
              Check spelling or try broader terms. You can also explore directly via our sections or The Tracker.
            </p>
            <Link
              href="/en/tracker"
              className="inline-block px-4 py-2 bg-[#0b4627] text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#072e1a] transition-colors"
            >
              Open The Tracker →
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. Investigations Results */}
            {(filter === 'all' || filter === 'articles') && effectiveResults.articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Investigative Reports & Analyses ({effectiveResults.articles.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {effectiveResults.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} lang="en" />
                  ))}
                </div>
              </section>
            )}

            {/* 2. Projects Results */}
            {(filter === 'all' || filter === 'projects') && effectiveResults.projects.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <Construction size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Major Infrastructure Projects ({effectiveResults.projects.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {effectiveResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} lang="en" />
                  ))}
                </div>
              </section>
            )}

            {/* 3. Indicators Results */}
            {(filter === 'all' || filter === 'indicators') && effectiveResults.indicators.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      National Indicators ({effectiveResults.indicators.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {effectiveResults.indicators.map((ind) => (
                    <Link
                      key={ind.code}
                      href={`/en/tracker/indicateurs/${ind.code}`}
                      className="block p-5 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#0b4627] bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">
                          {ind.code}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#141414]">
                          {ind.currentValue} {ind.unit}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#141414] mb-2 leading-snug">
                        {ind.nameEn || ind.name}
                      </h3>
                      <p className="text-xs font-serif text-[#555555] line-clamp-2">
                        {ind.definitionEn || ind.definition}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Facts Results (Live Wire Dispatches) */}
            {(filter === 'all' || filter === 'facts') && effectiveResults.facts.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Live Wire Dispatches ({effectiveResults.facts.length})
                    </h2>
                  </div>
                </div>

                <div className="bg-white border border-[#e6dfd5] divide-y divide-[#e6dfd5]">
                  {effectiveResults.facts.map((fact, idx) => (
                    <div key={fact.id || idx} className="p-4 hover:bg-[#faf8f5] transition-colors flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#0b4627] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 font-bold">
                            {fact.category_code || 'WIRE'}
                          </span>
                          <span className="text-[10px] font-mono text-[#737373]">
                            {fact.date} · {fact.time}
                          </span>
                        </div>
                        <p className="font-serif text-sm text-[#141414]">{fact.text_en || fact.text_fr}</p>
                        {fact.source && (
                          <span className="text-[10px] font-mono text-[#737373] mt-1 block">
                            Verified source: {fact.source}
                          </span>
                        )}
                      </div>
                      <Link href="/en/fil" className="shrink-0 font-mono text-xs text-[#0b4627] hover:underline flex items-center gap-1 font-bold">
                        <span>The Wire</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default function SearchPageEn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#0b4627] animate-spin" />
      </div>
    }>
      <SearchContentEn />
    </Suspense>
  );
}

