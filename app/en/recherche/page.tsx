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

export default function SearchPageEn() {
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
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Search Archives</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
              Documentary Engine
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
                className="w-full pl-12 pr-10 py-3.5 bg-[#faf8f5] border-2 border-[#141414] text-base font-serif text-[#141414] placeholder:text-[#888888] focus:outline-none focus:bg-white"
              />
              <Search size={20} className="absolute left-4 top-4 text-[#888888]" />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-4 text-[#888888] hover:text-[#141414]"
                >
                  <X size={18} />
                </button>
              )}
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
                Investigations ({searchResults.articles.length})
              </button>

              <button
                onClick={() => setFilter('projects')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'projects' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                Tracker Projects ({searchResults.projects.length})
              </button>

              <button
                onClick={() => setFilter('indicators')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                  filter === 'indicators' 
                    ? 'bg-[#141414] text-white border-[#141414]' 
                    : 'bg-white text-[#141414] border-[#e6dfd5] hover:border-[#141414]'
                }`}
              >
                Indicators ({searchResults.indicators.length})
              </button>
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
              Search across investigative dossiers, the national project registry (target: 60 major sites), or PND RELANCE statistical series.
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
        ) : totalResults === 0 ? (
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
            
            {/* Investigations Results */}
            {(filter === 'all' || filter === 'articles') && searchResults.articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Investigative Reports & Analyses ({searchResults.articles.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} lang="en" />
                  ))}
                </div>
              </section>
            )}

            {/* Projects Results */}
            {(filter === 'all' || filter === 'projects') && searchResults.projects.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <Construction size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      Major Infrastructure Projects ({searchResults.projects.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} lang="en" />
                  ))}
                </div>
              </section>
            )}

            {/* Indicators Results */}
            {(filter === 'all' || filter === 'indicators') && searchResults.indicators.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#0b4627]" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      National Indicators ({searchResults.indicators.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.indicators.map((ind) => (
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
                        {ind.name}
                      </h3>
                      <p className="text-xs font-serif text-[#555555] line-clamp-2">
                        {ind.definition}
                      </p>
                    </Link>
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
