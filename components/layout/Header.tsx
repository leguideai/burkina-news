"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Menu, X, Globe, ArrowRight, BookOpen, SlidersHorizontal, Newspaper, ChevronDown, ChevronRight } from 'lucide-react';
import { NAV_CATEGORIES, UI_STRINGS } from '@/data/mock/translations';
import { JOURNAL_PRODUCTS } from '@/data/mock/referentiel';
import { categories as ALL_CATEGORIES } from '@/data/mock/categories';
import { categoriesApi } from '@/lib/api/categories';
import { CategoryDTO } from '@/lib/api/types';
import { mapCategoryDTOToCategory } from '@/lib/api/mappers';
import Tooltip from '@/components/ui/Tooltip';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  const pathname = usePathname() || '/fr';
  const isEn = pathname.startsWith('/en');
  const lang = isEn ? 'en' : 'fr';
  const strings = isEn ? UI_STRINGS.en : UI_STRINGS.fr;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<CategoryDTO[]>([]);

  // Date dynamique exacte correspondant au pays et fuseau horaire de l'utilisateur
  const [dynamicDateline, setDynamicDateline] = useState<string>(() => {
    try {
      const now = new Date();
      const locale = isEn ? 'en-US' : 'fr-FR';
      const formatted = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      const cap = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      return `${cap} · Ouagadougou & Bobo-Dioulasso`;
    } catch {
      return strings.dateline;
    }
  });

  useEffect(() => {
    try {
      const now = new Date();
      const locale = isEn ? 'en-US' : 'fr-FR';
      const formatted = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      const cap = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      setDynamicDateline(`${cap} · Ouagadougou & Bobo-Dioulasso`);
    } catch {
      setDynamicDateline(strings.dateline);
    }
  }, [isEn, strings.dateline]);

  // Load real categories & subcategories from Go API / PostgreSQL
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await categoriesApi.listCategories(true);
        if (isMounted && list && list.length > 0) {
          setDynamicCategories(list);
        }
      } catch {
        // Silent fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategoriesData = useMemo(() => {
    if (dynamicCategories.length > 0) {
      return dynamicCategories.map(mapCategoryDTOToCategory);
    }
    return ALL_CATEGORIES;
  }, [dynamicCategories]);

  // Target links for language toggle
  const frUrl = isEn ? pathname.replace(/^\/en/, '/fr') : pathname;
  const enUrl = isEn ? pathname : pathname.replace(/^\/fr/, '/en');

  const categories = NAV_CATEGORIES.map(cat => ({
    label: isEn ? cat.labelEn : cat.labelFr,
    href: isEn ? cat.hrefEn : cat.hrefFr
  }));

  const homeHref = isEn ? '/en' : '/fr';
  const trackerHref = isEn ? '/en/tracker' : '/fr/tracker';
  const numerosHref = isEn ? '/en/numeros' : '/fr/numeros';
  const filHref = isEn ? '/en/fil' : '/fr/fil';
  const indicateursHref = isEn ? '/en/tracker/indicateurs' : '/fr/tracker/indicateurs';
  const methodeHref = isEn ? '/en/methode' : '/fr/methode';
  const rechercheHref = isEn ? '/en/recherche' : '/fr/recherche';

  // State & Handlers anti-tremblement pour le dropdown des sous-rubriques
  const [hoveredCategoryCode, setHoveredCategoryCode] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = (catCode: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredCategoryCode(catCode);
  };

  const handleCategoryMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryCode(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryCode(null);
    }, 150);
  };

  useEffect(() => {
    setHoveredCategoryCode(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const activeHoverCategory = useMemo(() => {
    if (!hoveredCategoryCode) return null;
    return categories.find(c => c.href.split('/').pop() === hoveredCategoryCode) || null;
  }, [hoveredCategoryCode, categories]);

  const activeHoverCategoryData = useMemo(() => {
    if (!hoveredCategoryCode) return null;
    return activeCategoriesData.find(c => c.code === hoveredCategoryCode) || null;
  }, [hoveredCategoryCode, activeCategoriesData]);

  // Découpage strict : 2 sous-rubriques par colonne
  const subCategoryColumns = useMemo(() => {
    if (!activeHoverCategoryData?.subCategories) return [];
    const subs = activeHoverCategoryData.subCategories;
    const cols = [];
    for (let i = 0; i < subs.length; i += 2) {
      cols.push(subs.slice(i, i + 2));
    }
    return cols;
  }, [activeHoverCategoryData]);

  return (
    <header className="w-full bg-[#faf8f5] border-b border-[#e6dfd5]">
      
      {/* 1. TOPLINE : Dateline & Edition information */}
      <div className="border-b border-[#e6dfd5] text-[11px] font-serif text-[#555555] py-1.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span 
              className="font-semibold uppercase tracking-wider text-[#141414] text-[10px] sm:text-[11px] truncate"
              suppressHydrationWarning
            >
              {dynamicDateline}
            </span>
          </div>

          <div className="hidden md:block italic text-[#737373]">
            {strings.siteSlogan}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs shrink-0">
            <Link 
              href={methodeHref} 
              className={`transition-colors hidden sm:inline px-2 py-0.5 rounded-md ${
                pathname === methodeHref || pathname.startsWith(methodeHref + '/')
                  ? 'bg-[#0b4627] text-white font-bold shadow-xs'
                  : 'text-[#555555] hover:text-[#141414]'
              }`}
            >
              {strings.methodLink}
            </Link>
            <span className="text-[#d4cece] hidden sm:inline">·</span>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 font-mono font-bold text-[#141414] text-[11px]">
              <Tooltip position="bottom" content="Passer l'interface en français">
                <Link 
                  href={frUrl} 
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    !isEn 
                      ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                      : 'text-[#737373] hover:text-[#141414] hover:bg-[#e6dfd5]/40'
                  }`}
                  aria-label="Passer en français"
                >
                  FR
                </Link>
              </Tooltip>
              <span className="text-neutral-300">/</span>
              <Tooltip position="bottom" content="Switch interface to English">
                <Link 
                  href={enUrl} 
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    isEn 
                      ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                      : 'text-[#737373] hover:text-[#141414] hover:bg-[#e6dfd5]/40'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD PRINCIPAL : Brand logo and tools */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-3.5 sm:py-7 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
        
        {/* Mobile top navigation strip */}
        <div className="w-full md:hidden flex justify-between items-center">
          <Tooltip position="bottom" content={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
            <button 
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (!mobileMenuOpen) setSearchOpen(false);
              }}
              className="w-11 h-11 flex items-center justify-center text-[#141414] hover:bg-[#f4eee3] active:bg-[#e6dfd5] transition-colors rounded-lg cursor-pointer"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </Tooltip>
          
          <Link href={homeHref} className="block py-1">
            <img src="/images/logo.png" alt="Burkina News" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          <Tooltip position="bottom" content={searchOpen ? "Fermer la recherche" : "Rechercher sur le site"}>
            <button 
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) setMobileMenuOpen(false);
              }}
              className="w-11 h-11 flex items-center justify-center text-[#141414] hover:bg-[#f4eee3] active:bg-[#e6dfd5] transition-colors rounded-lg cursor-pointer"
              aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
            >
              {searchOpen ? <X size={22} /> : <Search size={22} />}
            </button>
          </Tooltip>
        </div>

        {/* Mobile quick search drawer when searchOpen is active */}
        {searchOpen && (
          <div className="w-full md:hidden pt-2 pb-1 border-t border-[#e6dfd5]">
            <HeaderSearch 
              lang={lang} 
              isMobile={true} 
              autoFocus={true} 
              onNavigate={() => setSearchOpen(false)} 
            />
          </div>
        )}

        {/* Desktop Brand */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={homeHref} className="block hover:opacity-95 transition-opacity">
            <img 
              src="/images/logo.png" 
              alt="Burkina News" 
              className="h-16 lg:h-20 w-auto object-contain" 
            />
          </Link>
          <div className="border-l border-[#e6dfd5] pl-4 py-1 text-xs text-[#555555] font-serif">
            <p className="font-semibold text-[#141414]">
              {isEn ? "Monthly journal & documentary registry" : "Revue mensuelle & base documentaire"}
            </p>
            <p className="text-[#737373] text-[11px]">
              {isEn ? "Verified facts · Indicators · National projects" : "Faits vérifiés · Indicateurs · Projets du Faso"}
            </p>
          </div>
        </div>

        {/* Desktop Search & Subscription */}
        <div className="hidden md:flex items-center gap-3">
          <HeaderSearch 
            lang={lang} 
            isMobile={false} 
          />

          <Link 
            href={trackerHref} 
            className="bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            {strings.trackerBtn}
          </Link>

          <Link 
            href="#newsletter"
            className="border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            {strings.subscribeBtn}
          </Link>
        </div>

      </div>

      {/* 3. NAVIGATION BAR : Classic double border rules on Desktop */}
      <nav className="hidden md:block border-t-2 border-b border-[#141414] bg-white relative">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center relative">
          
          <div className="flex items-center">
            {(() => {
              const isHomeActive = pathname === homeHref;
              return (
                <Link 
                  href={homeHref} 
                  className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                    isHomeActive 
                      ? 'bg-[#0b4627] text-white shadow-xs' 
                      : 'text-[#141414] bg-white hover:bg-neutral-50'
                  }`}
                >
                  {isEn ? "Front Page" : "À la une"}
                </Link>
              );
            })()}

            {categories.map((cat) => {
              const active = pathname === cat.href || pathname.startsWith(cat.href + '/');
              const catCode = cat.href.split('/').pop() || '';
              const isHovered = hoveredCategoryCode === catCode;

              return (
                <div 
                  key={cat.href}
                  onMouseEnter={() => handleCategoryMouseEnter(catCode)}
                  onMouseLeave={handleCategoryMouseLeave}
                  className="relative"
                >
                  <Link
                    href={cat.href}
                    className={`py-2.5 px-3.5 text-xs uppercase tracking-wider transition-colors border-r border-[#e6dfd5] flex items-center gap-1.5 ${
                      active 
                        ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                        : isHovered 
                        ? 'text-[#0b4627] bg-[#f4eee3] font-bold' 
                        : 'text-[#333333] hover:text-[#141414] bg-white hover:bg-neutral-50 font-semibold'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown 
                      size={11} 
                      className={`transition-transform duration-200 ${
                        active 
                          ? 'text-white' 
                          : isHovered 
                          ? 'text-[#0b4627] rotate-180' 
                          : 'text-[#888888]'
                      }`} 
                    />
                  </Link>
                </div>
              );
            })}

            {(() => {
              const isTrackerActive = (pathname === trackerHref || pathname.startsWith(trackerHref + '/')) && !pathname.startsWith(indicateursHref);
              return (
                <Link 
                  href={trackerHref} 
                  className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                    isTrackerActive 
                      ? 'bg-[#0b4627] text-white shadow-xs' 
                      : 'text-[#0b4627] bg-white hover:bg-[#f4eee3]/60'
                  }`}
                >
                  {strings.trackerBtn}
                </Link>
              );
            })()}
          </div>

          <div className="flex items-center text-xs font-serif text-[#555555] gap-1 py-1">
            {(() => {
              const isNumerosActive = pathname === numerosHref || pathname.startsWith(numerosHref + '/');
              return (
                <Link 
                  href={numerosHref} 
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isNumerosActive 
                      ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                      : 'hover:text-[#141414] hover:bg-[#faf8f5]'
                  }`}
                >
                  {isEn ? "Issues" : "Les Numéros"}
                </Link>
              );
            })()}
            <span className="text-neutral-300">/</span>
            {(() => {
              const isFilActive = pathname === filHref || pathname.startsWith(filHref + '/');
              return (
                <Link 
                  href={filHref} 
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isFilActive 
                      ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                      : 'hover:text-[#141414] hover:bg-[#faf8f5]'
                  }`}
                >
                  {isEn ? "The Brief" : "Le Fil"}
                </Link>
              );
            })()}
            <span className="text-neutral-300">/</span>
            {(() => {
              const isIndicateursActive = pathname === indicateursHref || pathname.startsWith(indicateursHref + '/');
              return (
                <Link 
                  href={indicateursHref} 
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    isIndicateursActive 
                      ? 'bg-[#0b4627] text-white font-bold shadow-xs' 
                      : 'text-[#0b4627] hover:bg-[#f4eee3]/60'
                  }`}
                >
                  {isEn ? "RELANCE Barometer" : "Baromètre RELANCE"}
                </Link>
              );
            })()}
          </div>

          {/* Desktop Mega Menu Dropdown : S'arrête aux marges de la page (left-8 right-8) et zéro tremblement */}
          {hoveredCategoryCode && activeHoverCategoryData && activeHoverCategoryData.subCategories && activeHoverCategoryData.subCategories.length > 0 && (
            <div 
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
              className="absolute top-full left-8 right-8 z-50 bg-white border-x-2 border-b-2 border-[#141414] shadow-2xl rounded-b-2xl overflow-hidden before:content-[''] before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-2.5"
            >
              <div className="p-6">
                {/* En-tête contextuel de la rubrique */}
                <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#e6dfd5]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0b4627]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                      {isEn ? "Sub-rubrics" : "Sous-rubriques"} · <span className="text-[#0b4627]">{activeHoverCategory?.label}</span>
                    </span>
                    <span className="text-[#d4cece]">·</span>
                    <span className="text-[11px] font-mono text-[#888888]">
                      {activeHoverCategoryData.subCategories.length} {isEn ? "sections" : "volets"}
                    </span>
                  </div>

                  <Link
                    href={activeHoverCategory?.href || '#'}
                    className="text-xs font-mono font-bold text-[#0b4627] hover:text-[#072e1a] hover:underline flex items-center gap-1.5 shrink-0"
                  >
                    <span>{isEn ? `All ${activeHoverCategory?.label} investigations →` : `Toutes les enquêtes ${activeHoverCategory?.label} →`}</span>
                  </Link>
                </div>

                {/* Deux rubriques par colonne (exactement 2 sous-rubriques par colonne verticale) */}
                <div className="flex flex-wrap items-start gap-x-12 lg:gap-x-16 gap-y-4">
                  {subCategoryColumns.map((col, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-2 min-w-[180px] sm:min-w-[210px]">
                      {col.map((sub) => (
                        <Link
                          key={sub.code}
                          href={`${activeHoverCategory?.href}?sub=${sub.code}`}
                          className="group/item flex items-center justify-between py-2 px-3 rounded-lg text-[14px] font-medium text-[#222222] hover:text-[#0b4627] hover:bg-[#faf8f5] transition-all duration-150"
                        >
                          <span className="group-hover/item:translate-x-1 transition-transform duration-150">
                            {isEn ? sub.nameEn : sub.nameFr}
                          </span>
                          <ChevronRight size={14} className="text-[#0b4627] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0 ml-2" />
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </nav>

      {/* 4. MOBILE DRAWER WITH RICH NAVIGATION & LANGUAGE PICKER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#141414] px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 rounded-b-2xl shadow-xl">
          
          {/* Mobile Search inside drawer */}
          <HeaderSearch 
            lang={lang} 
            isMobile={true} 
            onNavigate={() => setMobileMenuOpen(false)} 
          />

          {/* Dedicated Language Selector inside mobile menu */}
          <div className="flex items-center justify-between p-2.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl shadow-xs">
            <span className="font-mono text-xs text-[#737373] uppercase font-semibold">
              {isEn ? "Language / Langue" : "Langue / Language"} :
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Link 
                href={frUrl} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${!isEn ? 'bg-[#0b4627] text-white shadow-xs' : 'bg-white text-[#141414] border border-[#e6dfd5]'}`}
              >
                FR
              </Link>
              <Link 
                href={enUrl} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${isEn ? 'bg-[#0b4627] text-white shadow-xs' : 'bg-white text-[#141414] border border-[#e6dfd5]'}`}
              >
                EN
              </Link>
            </div>
          </div>

          {/* Core Products / Main Sections on mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Front Page / À la une */}
            {(() => {
              const isHomeActive = pathname === homeHref;
              return (
                <Link 
                  href={homeHref} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`col-span-2 flex items-center justify-between p-3 font-mono font-bold text-xs uppercase rounded-xl transition-colors shadow-xs ${
                    isHomeActive 
                      ? 'bg-[#0b4627] text-white border-2 border-[#0b4627] shadow-sm' 
                      : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isHomeActive ? 'bg-white' : 'bg-[#0b4627]'}`} />
                    <span>{isEn ? "Front Page (À la une)" : "À la une (Accueil)"}</span>
                  </div>
                  <ArrowRight size={14} className={isHomeActive ? 'text-white' : 'text-[#0b4627]'} />
                </Link>
              );
            })()}

            {(() => {
              const isTrackerActive = (pathname === trackerHref || pathname.startsWith(trackerHref + '/')) && !pathname.startsWith(indicateursHref);
              return (
                <Link 
                  href={trackerHref} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 font-mono font-bold text-xs uppercase rounded-xl transition-colors shadow-xs ${
                    isTrackerActive 
                      ? 'bg-[#0b4627] text-white border-2 border-[#0b4627] shadow-sm' 
                      : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  <SlidersHorizontal size={14} className={isTrackerActive ? 'text-white' : 'text-[#0b4627]'} />
                  <span>{isEn ? "The Tracker" : "Le Tracker"}</span>
                </Link>
              );
            })()}

            {(() => {
              const isNumerosActive = pathname === numerosHref || pathname.startsWith(numerosHref + '/');
              return (
                <Link 
                  href={numerosHref} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 font-mono font-bold text-xs uppercase rounded-xl transition-colors shadow-xs ${
                    isNumerosActive 
                      ? 'bg-[#0b4627] text-white border-2 border-[#0b4627] shadow-sm' 
                      : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  <BookOpen size={14} className={isNumerosActive ? 'text-white' : 'text-[#141414]'} />
                  <span>{isEn ? "Monthly Issues" : "Les Numéros"}</span>
                </Link>
              );
            })()}

            {(() => {
              const isFilActive = pathname === filHref || pathname.startsWith(filHref + '/');
              return (
                <Link 
                  href={filHref} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 font-mono font-bold text-xs uppercase rounded-xl transition-colors shadow-xs ${
                    isFilActive 
                      ? 'bg-[#0b4627] text-white border-2 border-[#0b4627] shadow-sm' 
                      : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  <Newspaper size={14} className={isFilActive ? 'text-white' : 'text-[#141414]'} />
                  <span>{isEn ? "The Brief (Weekly)" : "Le Fil Hebdo"}</span>
                </Link>
              );
            })()}

            {(() => {
              const isIndicateursActive = pathname === indicateursHref || pathname.startsWith(indicateursHref + '/');
              return (
                <Link 
                  href={indicateursHref} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 font-mono font-bold text-xs uppercase rounded-xl transition-colors shadow-xs ${
                    isIndicateursActive 
                      ? 'bg-[#0b4627] text-white border-2 border-[#0b4627] shadow-sm' 
                      : 'bg-white border border-[#e6dfd5] text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  <span className={isIndicateursActive ? 'text-white font-bold' : 'text-[#0b4627] font-bold'}>RELANCE</span>
                </Link>
              );
            })()}
          </div>

          {/* Editorial Categories with Sub-Categories */}
          <div className="border-t border-[#e6dfd5] pt-3">
            <div className="font-mono text-[10px] uppercase font-bold text-[#737373] mb-2 tracking-wider">
              {isEn ? "Investigative Sections & Sub-Rubrics" : "Rubriques & Sous-Rubriques d'Enquête"}
            </div>
            <div className="space-y-2">
              {activeCategoriesData.map((cat) => {
                const catHref = isEn ? `/en/${cat.code}` : `/fr/${cat.code}`;
                const isCatActive = pathname === catHref || pathname.startsWith(catHref + '/');
                return (
                  <div 
                    key={cat.code} 
                    className={`p-2.5 rounded-xl shadow-xs transition-colors ${
                      isCatActive 
                        ? 'border-2 border-[#0b4627] bg-[#f4eee3]' 
                        : 'border border-[#e6dfd5] bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Link
                        href={catHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-mono text-xs font-bold uppercase flex items-center gap-1.5 ${
                          isCatActive ? 'text-[#0b4627]' : 'text-[#141414] hover:text-[#0b4627]'
                        }`}
                      >
                        {isCatActive && <span className="w-2 h-2 rounded-full bg-[#0b4627] inline-block shrink-0" />}
                        <span>{isEn ? cat.nameEn : cat.nameFr}</span>
                      </Link>
                      <Link
                        href={catHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-[10px] font-mono ${
                          isCatActive ? 'text-[#0b4627] font-bold' : 'text-[#737373] hover:text-[#141414]'
                        }`}
                      >
                        {isEn ? "View all →" : "Voir tout →"}
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cat.subCategories?.map((sub) => {
                        const subHref = `${catHref}?sub=${sub.code}`;
                        return (
                          <Link
                            key={sub.code}
                            href={subHref}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-[11px] px-2 py-1 bg-white border border-[#e6dfd5] rounded-lg text-[#333333] hover:border-[#0b4627] hover:text-[#0b4627] transition-colors"
                          >
                            {isEn ? sub.nameEn : sub.nameFr}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional links */}
          <div className="border-t border-[#e6dfd5] pt-3 space-y-1 text-xs font-serif text-[#555555]">
            <Link 
              href={methodeHref} 
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[40px] flex items-center px-1 text-[#141414] font-semibold hover:text-[#0b4627]"
            >
              → {isEn ? "Verification Methodology & Sources" : "Notre Méthode & Hiérarchie des Sources"}
            </Link>
            <Link 
              href={isEn ? "/en/corrections" : "/fr/corrections"} 
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[40px] flex items-center px-1 text-[#141414] font-semibold hover:text-[#0b4627]"
            >
              → {isEn ? "Correction Registry" : "Registre Public des Corrections"}
            </Link>
            <Link 
              href={isEn ? "/en/contact" : "/fr/contact"} 
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[40px] flex items-center px-1 text-[#c2410c] font-bold"
            >
              → {isEn ? "Report an error or submit a primary source" : "Signaler une erreur ou apporter une source"}
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}
