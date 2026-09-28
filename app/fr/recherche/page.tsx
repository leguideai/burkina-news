'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);

  // Données de secours / cache initial
  const [fallbackArticles, setFallbackArticles] = useState<Article[]>([]);
  const fallbackProjects = useMemo(() => getProjects('fr'), []);
  const fallbackIndicators = useMemo(() => getIndicators('fr'), []);

  // Résultats retournés par l'API PostgreSQL
  const [apiResults, setApiResults] = useState<{
    articles: Article[];
    projects: Project[];
    indicators: Indicator[];
    facts: BriefFactDTO[];
  } | null>(null);

  // Préchargement des articles pour le fallback local
  useEffect(() => {
    let isMounted = true;
    articlesApi.listArticles({ limit: 100 })
      .then(res => {
        if (isMounted && res.articles) {
          setFallbackArticles(res.articles.map(mapArticleDTOToArticle));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Déclenchement de la recherche avec debouncing
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
          lang: 'fr',
        });

        if (res && (res.articles?.length || res.projects?.length || res.indicators?.length || res.facts?.length)) {
          setApiResults({
            articles: (res.articles || []).map(mapArticleDTOToArticle),
            projects: (res.projects || []).map(mapProjectDTOToProject),
            indicators: (res.indicators || []).map(mapIndicatorDTOToIndicator),
            facts: res.facts || [],
          });
        } else {
          setApiResults(null);
        }
      } catch (err) {
        console.warn('[SearchPage] Repli sur la recherche locale :', err);
        setApiResults(null);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, filter]);

  // Calcul des résultats locaux de secours
  const localResults = useMemo(() => {
    if (!query.trim()) return { articles: [], projects: [], indicators: [], facts: [] };

    const lowerQuery = query.toLowerCase();

    const filteredArticles = fallbackArticles.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery)
    );

    const filteredProjects = fallbackProjects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.region.toLowerCase().includes(lowerQuery) ||
      p.sector.toLowerCase().includes(lowerQuery)
    );

    const filteredIndicators = fallbackIndicators.filter(i => 
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
  }, [query, fallbackArticles, fallbackProjects, fallbackIndicators]);

  // Sélection active : résultats API en priorité, sinon résultats locaux
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
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Moteur de Recherche</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
              Base Documentaire Publique & Archives (PostgreSQL)
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              Recherche dans les Archives
            </h1>

            {/* Search Input */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                className="w-full pl-10 pr-10 py-3 bg-[#faf8f5] border-2 border-[#141414] text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none"
                placeholder="Rechercher par mot-clé, chantier, indicateur, région..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#888888]" />
              {loading ? (
                <Loader2 className="absolute right-3.5 top-3.5 h-4 w-4 text-[#0b4627] animate-spin" />
              ) : query ? (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 p-0.5"
                  aria-label="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'all' 
                  ? 'bg-[#141414] text-white border-[#141414]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#141414]'
              }`}
            >
              Tous les résultats ({isSearching ? totalResults : 0})
            </button>
            <button
              onClick={() => setFilter('articles')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'articles' 
                  ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
              }`}
            >
              Articles ({isSearching ? effectiveResults.articles.length : fallbackArticles.length})
            </button>
            <button
              onClick={() => setFilter('projects')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'projects' 
                  ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
              }`}
            >
              Chantiers Tracker ({isSearching ? effectiveResults.projects.length : fallbackProjects.length})
            </button>
            <button
              onClick={() => setFilter('indicators')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'indicators' 
                  ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
              }`}
            >
              Indicateurs Baromètre ({isSearching ? effectiveResults.indicators.length : fallbackIndicators.length})
            </button>
            {effectiveResults.facts.length > 0 && (
              <button
                onClick={() => setFilter('facts')}
                className={`px-3 py-1.5 border transition-colors ${
                  filter === 'facts' 
                    ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                    : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
                }`}
              >
                Dépêches du Fil ({effectiveResults.facts.length})
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {!isSearching && (
          <div className="text-center py-16 bg-white border border-[#e6dfd5] p-8">
            <Search className="w-10 h-10 text-[#888888] mx-auto mb-3" />
            <h3 className="text-base font-bold font-serif text-[#141414] mb-1">Explorez les archives de Burkina News</h3>
            <p className="text-xs font-serif text-[#555555] max-w-sm mx-auto">
              Saisissez un terme de recherche pour interroger simultanément les enquêtes, les chantiers documentés du Tracker et les séries statistiques officielles.
            </p>
          </div>
        )}

        {isSearching && !loading && totalResults === 0 && (
          <div className="text-center py-16 bg-white border border-[#e6dfd5] p-8">
            <h3 className="text-base font-bold font-serif text-[#141414] mb-1">Aucun document ne correspond à « {query} »</h3>
            <p className="text-xs font-serif text-[#555555] max-w-sm mx-auto">
              Vérifiez l'orthographe ou essayez avec un mot-clé plus général (ex : or, solaire, coton, bobo, route).
            </p>
          </div>
        )}

        {/* 1. Articles Results */}
        {(filter === 'all' || filter === 'articles') && effectiveResults.articles.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <FileText size={15} className="text-[#0b4627]" />
                <span>Enquêtes & Décryptages ({effectiveResults.articles.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {effectiveResults.articles.map(article => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </section>
        )}

        {/* 2. Projects Results */}
        {(filter === 'all' || filter === 'projects') && effectiveResults.projects.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <Construction size={15} className="text-[#0b4627]" />
                <span>Chantiers du Tracker ({effectiveResults.projects.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {effectiveResults.projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Indicators Results */}
        {(filter === 'all' || filter === 'indicators') && effectiveResults.indicators.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <BarChart3 size={15} className="text-[#0b4627]" />
                <span>Indicateurs Baromètre RELANCE ({effectiveResults.indicators.length})</span>
              </h2>
            </div>
            <div className="bg-white border border-[#e6dfd5] divide-y divide-[#e6dfd5]">
              {effectiveResults.indicators.map(ind => (
                <Link 
                  key={ind.id} 
                  href={`/fr/tracker/indicateurs/${ind.code}`}
                  className="block p-4 hover:bg-[#faf8f5] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0b4627]">{ind.code} · {ind.category}</span>
                      <h3 className="font-serif font-bold text-sm text-[#141414] mb-1">{ind.name}</h3>
                      <p className="font-serif text-xs text-[#555555] line-clamp-1">{ind.definition}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="font-mono font-bold text-base text-[#141414]">{ind.currentValue} {ind.unit}</span>
                      <span className="block text-[10px] font-mono text-[#737373]">Source : {ind.source}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. Facts Results (Dépêches du Fil en direct) */}
        {(filter === 'all' || filter === 'facts') && effectiveResults.facts.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <Radio size={15} className="text-[#0b4627]" />
                <span>Dépêches du Fil en Direct ({effectiveResults.facts.length})</span>
              </h2>
            </div>
            <div className="bg-white border border-[#e6dfd5] divide-y divide-[#e6dfd5]">
              {effectiveResults.facts.map((fact, idx) => (
                <div key={fact.id || idx} className="p-4 hover:bg-[#faf8f5] transition-colors flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#0b4627] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 font-bold">
                        {fact.category_code || 'FIL'}
                      </span>
                      <span className="text-[10px] font-mono text-[#737373]">
                        {fact.date} · {fact.time}
                      </span>
                    </div>
                    <p className="font-serif text-sm text-[#141414]">{fact.text_fr}</p>
                    {fact.source && (
                      <span className="text-[10px] font-mono text-[#737373] mt-1 block">
                        Source vérifiée : {fact.source}
                      </span>
                    )}
                  </div>
                  <Link href="/fr/fil" className="shrink-0 font-mono text-xs text-[#0b4627] hover:underline flex items-center gap-1 font-bold">
                    <span>Le Fil</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
