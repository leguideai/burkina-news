'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, FileText, Construction, BarChart3, ChevronRight, X } from 'lucide-react';
import { articles } from '@/data/mock/articles';
import { projects } from '@/data/mock/projects';
import { indicators } from '@/data/mock/indicators';
import ArticleCard from '@/components/editorial/ArticleCard';
import ProjectCard from '@/components/tracker/ProjectCard';
import StatusBadge from '@/components/tracker/StatusBadge';

type FilterType = 'all' | 'articles' | 'projects' | 'indicators';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { articles: [], projects: [], indicators: [] };

    const lowerQuery = query.toLowerCase();

    const filteredArticles = articles.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery)
    );

    const filteredProjects = projects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.region.toLowerCase().includes(lowerQuery) ||
      p.sector.toLowerCase().includes(lowerQuery)
    );

    const filteredIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes(lowerQuery) || 
      i.definition.toLowerCase().includes(lowerQuery) ||
      i.code.toLowerCase().includes(lowerQuery)
    );

    return {
      articles: filteredArticles,
      projects: filteredProjects,
      indicators: filteredIndicators
    };
  }, [query]);

  const totalResults = searchResults.articles.length + searchResults.projects.length + searchResults.indicators.length;
  const isSearching = query.trim().length > 0;

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
              Base Documentaire & Articles
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              Recherche dans les Archives
            </h1>

            {/* Search Input */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                className="w-full pl-9 pr-8 py-3 bg-[#faf8f5] border-2 border-[#141414] text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none"
                placeholder="Rechercher par mot-clé, chantier, indicateur, région..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#888888]" />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
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
              Articles ({isSearching ? searchResults.articles.length : articles.length})
            </button>
            <button
              onClick={() => setFilter('projects')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'projects' 
                  ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
              }`}
            >
              Chantiers Tracker ({isSearching ? searchResults.projects.length : projects.length})
            </button>
            <button
              onClick={() => setFilter('indicators')}
              className={`px-3 py-1.5 border transition-colors ${
                filter === 'indicators' 
                  ? 'bg-[#0b4627] text-white border-[#0b4627]' 
                  : 'bg-white text-[#555555] border-[#e6dfd5] hover:border-[#0b4627]'
              }`}
            >
              Indicateurs Baromètre ({isSearching ? searchResults.indicators.length : indicators.length})
            </button>
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

        {isSearching && totalResults === 0 && (
          <div className="text-center py-16 bg-white border border-[#e6dfd5] p-8">
            <h3 className="text-base font-bold font-serif text-[#141414] mb-1">Aucun document ne correspond à « {query} »</h3>
            <p className="text-xs font-serif text-[#555555] max-w-sm mx-auto">
              Vérifiez l'orthographe ou essayez avec un mot-clé plus général (ex : or, solaire, bobo, budget).
            </p>
          </div>
        )}

        {/* 1. Articles Results */}
        {(filter === 'all' || filter === 'articles') && searchResults.articles.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Enquêtes & Décryptages ({searchResults.articles.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.articles.map(article => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </section>
        )}

        {/* 2. Projects Results */}
        {(filter === 'all' || filter === 'projects') && searchResults.projects.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Chantiers du Tracker ({searchResults.projects.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Indicators Results */}
        {(filter === 'all' || filter === 'indicators') && searchResults.indicators.length > 0 && (
          <section className="mb-12">
            <div className="pb-2 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Indicateurs Baromètre RELANCE ({searchResults.indicators.length})
              </h2>
            </div>
            <div className="bg-white border border-[#e6dfd5] divide-y divide-[#e6dfd5]">
              {searchResults.indicators.map(ind => (
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

      </div>

    </div>
  );
}
