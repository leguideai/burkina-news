"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, Globe, ArrowRight, BookOpen, SlidersHorizontal, Newspaper, ChevronDown } from 'lucide-react';
import { NAV_CATEGORIES, UI_STRINGS } from '@/data/mock/translations';
import { JOURNAL_PRODUCTS } from '@/data/mock/referentiel';
import { categories as ALL_CATEGORIES } from '@/data/mock/categories';
import Tooltip from '@/components/ui/Tooltip';

export default function Header() {
  const pathname = usePathname() || '/fr';
  const isEn = pathname.startsWith('/en');
  const lang = isEn ? 'en' : 'fr';
  const strings = isEn ? UI_STRINGS.en : UI_STRINGS.fr;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Target links for language toggle
  const frUrl = isEn ? pathname.replace(/^\/en/, '/fr') : pathname;
  const enUrl = isEn ? pathname : pathname.replace(/^\/fr/, '/en');

  const categories = NAV_CATEGORIES.map(cat => ({
    label: isEn ? cat.labelEn : cat.labelFr,
    href: isEn ? cat.hrefEn : cat.hrefFr
  }));

  const currentCategory = ALL_CATEGORIES.find(c => 
    pathname === `/fr/${c.code}` || 
    pathname === `/en/${c.code}` || 
    pathname.startsWith(`/fr/${c.code}/`) || 
    pathname.startsWith(`/en/${c.code}/`)
  );

  const homeHref = isEn ? '/en' : '/fr';
  const trackerHref = isEn ? '/en/tracker' : '/fr/tracker';
  const numerosHref = isEn ? '/en/numeros' : '/fr/numeros';
  const filHref = isEn ? '/en/fil' : '/fr/fil';
  const indicateursHref = isEn ? '/en/tracker/indicateurs' : '/fr/tracker/indicateurs';
  const methodeHref = isEn ? '/en/methode' : '/fr/methode';
  const rechercheHref = isEn ? '/en/recherche' : '/fr/recherche';

  return (
    <header className="w-full bg-[#faf8f5] border-b border-[#e6dfd5]">
      
      {/* 1. TOPLINE : Dateline & Edition information */}
      <div className="border-b border-[#e6dfd5] text-[11px] font-serif text-[#555555] py-1.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold uppercase tracking-wider text-[#141414] text-[10px] sm:text-[11px] truncate">
              {strings.dateline}
            </span>
          </div>

          <div className="hidden md:block italic text-[#737373]">
            {strings.siteSlogan}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs shrink-0">
            <Link href={methodeHref} className="hover:text-[#141414] transition-colors hidden sm:inline">
              {strings.methodLink}
            </Link>
            <span className="text-[#d4cece] hidden sm:inline">·</span>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 font-mono font-bold text-[#141414] text-[11px]">
              <Tooltip position="bottom" content="Passer l'interface en français">
                <Link 
                  href={frUrl} 
                  className={`py-0.5 px-1 rounded transition-colors ${!isEn ? 'text-[#0b4627] font-extrabold underline decoration-2 underline-offset-2' : 'text-neutral-400 hover:text-neutral-700'}`}
                  aria-label="Passer en français"
                >
                  FR
                </Link>
              </Tooltip>
              <span className="text-neutral-300">/</span>
              <Tooltip position="bottom" content="Switch interface to English">
                <Link 
                  href={enUrl} 
                  className={`py-0.5 px-1 rounded transition-colors ${isEn ? 'text-[#0b4627] font-extrabold underline decoration-2 underline-offset-2' : 'text-neutral-400 hover:text-neutral-700'}`}
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
              className="w-11 h-11 flex items-center justify-center text-[#141414] hover:bg-[#f4eee3] active:bg-[#e6dfd5] transition-colors rounded cursor-pointer"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </Tooltip>
          
          <Link href={homeHref} className="block py-1">
            <img src="/images/logo.png" alt="Burkina News" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>

          <Tooltip position="bottom" content={searchOpen ? "Fermer la recherche" : "Rechercher sur le site"}>
            <button 
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) setMobileMenuOpen(false);
              }}
              className="w-11 h-11 flex items-center justify-center text-[#141414] hover:bg-[#f4eee3] active:bg-[#e6dfd5] transition-colors rounded cursor-pointer"
              aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
            >
              {searchOpen ? <X size={22} /> : <Search size={22} />}
            </button>
          </Tooltip>
        </div>

        {/* Mobile quick search drawer when searchOpen is active */}
        {searchOpen && (
          <div className="w-full md:hidden pt-2 pb-1 border-t border-[#e6dfd5]">
            <div className="relative">
              <input 
                type="text" 
                placeholder={strings.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `${rechercheHref}?q=${encodeURIComponent(searchQuery)}`;
                    setSearchOpen(false);
                  }
                }}
                autoFocus
                className="w-full pl-9 pr-9 py-2.5 bg-white border-2 border-[#141414] text-xs text-[#141414] placeholder:text-[#777] focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-3 text-[#777]" />
              {searchQuery && (
                <Tooltip position="left" content="Effacer la recherche">
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-[#777] hover:text-[#141414] cursor-pointer"
                    aria-label="Effacer la recherche"
                  >
                    <X size={16} />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Desktop Brand */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={homeHref} className="block">
            <img 
              src="/images/logo.png" 
              alt="Burkina News" 
              className="h-12 lg:h-14 w-auto object-contain" 
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
          <div className="relative">
            <input 
              type="text" 
              placeholder={strings.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  window.location.href = `${rechercheHref}?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="w-56 lg:w-64 pl-8 pr-3 py-1.5 bg-white border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-[#888888]" />
          </div>

          <Link 
            href={trackerHref} 
            className="bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
          >
            {strings.trackerBtn}
          </Link>

          <Link 
            href="#newsletter"
            className="border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            {strings.subscribeBtn}
          </Link>
        </div>

      </div>

      {/* 3. NAVIGATION BAR : Classic double border rules on Desktop */}
      <nav className="hidden md:block border-t-2 border-b border-[#141414] bg-white">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          
          <div className="flex items-center">
            <Link 
              href={homeHref} 
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                pathname === homeHref ? 'text-[#0b4627] bg-[#f4eee3]' : 'text-[#141414] hover:bg-neutral-50'
              }`}
            >
              {isEn ? "Front Page" : "À la une"}
            </Link>

            {categories.map((cat) => {
              const active = pathname.startsWith(cat.href);
              const catCode = cat.href.split('/').pop();
              const categoryData = ALL_CATEGORIES.find(c => c.code === catCode);
              return (
                <div key={cat.href} className="relative group">
                  <Link
                    href={cat.href}
                    className={`py-2.5 px-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] flex items-center gap-1.5 ${
                      active ? 'text-[#0b4627] bg-[#f4eee3] font-bold' : 'text-[#333333] hover:text-[#141414] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown size={11} className="text-[#888888] group-hover:text-[#141414] group-hover:rotate-180 transition-transform" />
                  </Link>

                  {/* Desktop Dropdown with sub-categories */}
                  {categoryData && categoryData.subCategories && categoryData.subCategories.length > 0 && (
                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 absolute top-full left-0 z-50 min-w-[220px] bg-white border-2 border-[#141414] shadow-xl py-2">
                      <div className="px-3 pb-1.5 mb-1 border-b border-[#e6dfd5] font-mono text-[10px] font-bold uppercase text-[#737373] tracking-wider">
                        {isEn ? "Sub-rubrics" : "Sous-rubriques"}
                      </div>
                      {categoryData.subCategories.map((sub) => (
                        <Link
                          key={sub.code}
                          href={`${cat.href}?sub=${sub.code}`}
                          className="block px-3 py-1.5 text-xs font-serif text-[#333333] hover:bg-[#f4eee3] hover:text-[#0b4627] hover:font-bold transition-colors"
                        >
                          {isEn ? sub.nameEn : sub.nameFr}
                        </Link>
                      ))}
                      <div className="mt-1 pt-1.5 px-3 border-t border-[#e6dfd5]">
                        <Link
                          href={cat.href}
                          className="text-[11px] font-mono font-bold text-[#0b4627] hover:underline block"
                        >
                          {isEn ? "All investigations →" : "Toutes les enquêtes →"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link 
              href={trackerHref} 
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                pathname.startsWith(trackerHref) ? 'text-[#0b4627] bg-[#f4eee3]' : 'text-[#0b4627] hover:bg-neutral-50'
              }`}
            >
              {strings.trackerBtn}
            </Link>
          </div>

          <div className="flex items-center text-xs font-serif text-[#555555]">
            <Link href={numerosHref} className="py-2.5 px-3 hover:text-[#141414] transition-colors">
              {isEn ? "Issues" : "Les Numéros"}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href={filHref} className="py-2.5 px-3 hover:text-[#141414] transition-colors">
              {isEn ? "The Brief" : "Le Fil"}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href={indicateursHref} className="py-2.5 px-3 hover:text-[#0b4627] font-semibold transition-colors">
              {isEn ? "RELANCE Barometer" : "Baromètre RELANCE"}
            </Link>
          </div>

        </div>
      </nav>

      {/* 3.1 CONTEXTUAL CATEGORY SUB-BAR (When viewing any of the 6 sections) */}
      {currentCategory && (
        <div className="hidden md:block bg-[#f4eee3] border-b border-[#e6dfd5] text-[11px] font-mono py-1.5 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#0b4627] font-bold uppercase shrink-0">
              <span>{isEn ? currentCategory.nameEn : currentCategory.nameFr} :</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
              <Link
                href={isEn ? `/en/${currentCategory.code}` : `/fr/${currentCategory.code}`}
                className="px-2 py-0.5 whitespace-nowrap text-[#555555] hover:text-[#0b4627] hover:underline"
              >
                {isEn ? "All" : "Tout voir"}
              </Link>
              {currentCategory.subCategories?.map((sub) => (
                <Link
                  key={sub.code}
                  href={isEn ? `/en/${currentCategory.code}?sub=${sub.code}` : `/fr/${currentCategory.code}?sub=${sub.code}`}
                  className="px-2 py-0.5 whitespace-nowrap text-[#555555] hover:text-[#0b4627] hover:underline font-medium"
                >
                  {isEn ? sub.nameEn : sub.nameFr}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3.1 CONTEXTUAL PRODUCT SUB-BAR (Brief Samba v5, Section 3) */}
      {pathname.includes('/tracker') && (
        <div className="hidden md:block bg-[#f4eee3] border-b border-[#e6dfd5] text-[11px] font-mono py-1.5 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#0b4627] font-bold uppercase shrink-0">
              <span>{pathname.includes('/indicateurs') ? "RELANCE 2026-2030" : "Le Tracker"} :</span>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
              {pathname.includes('/indicateurs') ? (
                JOURNAL_PRODUCTS.find(p => p.code === 'relance')?.subMenus.map(m => (
                  <Link
                    key={m.code}
                    href={isEn ? m.hrefEn : m.hrefFr}
                    className="text-[#555555] hover:text-[#0b4627] whitespace-nowrap transition-colors"
                  >
                    {isEn ? m.labelEn : m.labelFr}
                  </Link>
                ))
              ) : (
                JOURNAL_PRODUCTS.find(p => p.code === 'tracker')?.subMenus.map(m => (
                  <Link
                    key={m.code}
                    href={isEn ? m.hrefEn : m.hrefFr}
                    className="text-[#555555] hover:text-[#0b4627] whitespace-nowrap transition-colors"
                  >
                    {isEn ? m.labelEn : m.labelFr}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE DRAWER WITH RICH NAVIGATION & LANGUAGE PICKER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#141414] px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Mobile Search inside drawer */}
          <div className="relative">
            <input 
              type="text" 
              placeholder={strings.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  window.location.href = `${rechercheHref}?q=${encodeURIComponent(searchQuery)}`;
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414]"
            />
            <Search size={16} className="absolute left-3 top-3 text-[#888888]" />
          </div>

          {/* Dedicated Language Selector inside mobile menu */}
          <div className="flex items-center justify-between p-2.5 bg-[#faf8f5] border border-[#e6dfd5]">
            <span className="font-mono text-xs text-[#737373] uppercase font-semibold">
              {isEn ? "Language / Langue" : "Langue / Language"} :
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Link 
                href={frUrl} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1.5 font-bold transition-colors ${!isEn ? 'bg-[#0b4627] text-white' : 'bg-white text-[#141414] border border-[#e6dfd5]'}`}
              >
                FR
              </Link>
              <Link 
                href={enUrl} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1.5 font-bold transition-colors ${isEn ? 'bg-[#0b4627] text-white' : 'bg-white text-[#141414] border border-[#e6dfd5]'}`}
              >
                EN
              </Link>
            </div>
          </div>

          {/* Core Products / Main Sections on mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link 
              href={trackerHref} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 bg-[#f4eee3] border border-[#0b4627]/30 text-[#0b4627] font-mono font-bold text-xs uppercase"
            >
              <SlidersHorizontal size={14} />
              <span>{isEn ? "The Tracker" : "Le Tracker"}</span>
            </Link>

            <Link 
              href={numerosHref} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 bg-white border border-[#e6dfd5] text-[#141414] font-mono font-bold text-xs uppercase hover:bg-neutral-50"
            >
              <BookOpen size={14} />
              <span>{isEn ? "Monthly Issues" : "Les Numéros"}</span>
            </Link>

            <Link 
              href={filHref} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 bg-white border border-[#e6dfd5] text-[#141414] font-mono font-bold text-xs uppercase hover:bg-neutral-50"
            >
              <Newspaper size={14} />
              <span>{isEn ? "The Brief (Weekly)" : "Le Fil Hebdo"}</span>
            </Link>

            <Link 
              href={indicateursHref} 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 bg-white border border-[#e6dfd5] text-[#141414] font-mono font-bold text-xs uppercase hover:bg-neutral-50"
            >
              <span className="text-[#0b4627] font-bold">RELANCE</span>
            </Link>
          </div>

          {/* Editorial Categories with Sub-Categories */}
          <div className="border-t border-[#e6dfd5] pt-3">
            <div className="font-mono text-[10px] uppercase font-bold text-[#737373] mb-2 tracking-wider">
              {isEn ? "Investigative Sections & Sub-Rubrics" : "Rubriques & Sous-Rubriques d'Enquête"}
            </div>
            <div className="space-y-2">
              {ALL_CATEGORIES.map((cat) => (
                <div key={cat.code} className="border border-[#e6dfd5] bg-[#faf8f5] p-2.5 rounded-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <Link
                      href={isEn ? `/en/${cat.code}` : `/fr/${cat.code}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-mono text-xs font-bold uppercase text-[#0b4627] hover:underline"
                    >
                      {isEn ? cat.nameEn : cat.nameFr}
                    </Link>
                    <Link
                      href={isEn ? `/en/${cat.code}` : `/fr/${cat.code}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[10px] font-mono text-[#737373] hover:text-[#141414]"
                    >
                      {isEn ? "View all →" : "Voir tout →"}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.subCategories?.map((sub) => (
                      <Link
                        key={sub.code}
                        href={isEn ? `/en/${cat.code}?sub=${sub.code}` : `/fr/${cat.code}?sub=${sub.code}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] px-2 py-1 bg-white border border-[#e6dfd5] text-[#333333] hover:border-[#0b4627] hover:text-[#0b4627] transition-colors"
                      >
                        {isEn ? sub.nameEn : sub.nameFr}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
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
