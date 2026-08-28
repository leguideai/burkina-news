"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, Globe, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { label: 'Économie', href: '/fr/economie' },
  { label: 'Sécurité', href: '/fr/securite' },
  { label: 'Chantiers', href: '/fr/chantiers' },
  { label: 'Agriculture', href: '/fr/agriculture' },
  { label: 'Société', href: '/fr/societe' },
  { label: 'Idées', href: '/fr/idees' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full bg-[#faf8f5] border-b border-[#e6dfd5]">
      
      {/* 1. TOPLINE : Dateline & Edition information */}
      <div className="border-b border-[#e6dfd5] text-[11px] font-serif text-[#555555] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-[#141414]">Jeudi 28 août 2026</span>
            <span className="text-[#d4cece]">·</span>
            <span>Ouagadougou & Bobo-Dioulasso</span>
          </div>

          <div className="hidden md:block italic text-[#737373]">
            « L'information juste, la preuve vérifiée, la trajectoire du pays »
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/fr/methode" className="hover:text-[#141414] transition-colors hidden sm:inline">
              Charte & Sources
            </Link>
            <span className="text-[#d4cece] hidden sm:inline">·</span>
            <div className="flex items-center gap-1 font-mono font-bold text-[#141414] text-[11px]">
              <span className="text-[#0b4627]">FR</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-400 hover:text-neutral-700 cursor-pointer">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD PRINCIPAL : Large, dignified brand logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-7 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Mobile top tools */}
        <div className="w-full md:hidden flex justify-between items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#141414] hover:bg-[#f4eee3] rounded"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <Link href="/fr">
            <img src="/images/logo.png" alt="Burkina News" className="h-9 w-auto object-contain" />
          </Link>

          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 text-[#141414] hover:bg-[#f4eee3] rounded"
            aria-label="Recherche"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Desktop Brand Centered or Left */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/fr" className="block">
            <img 
              src="/images/logo.png" 
              alt="Burkina News" 
              className="h-12 lg:h-14 w-auto object-contain" 
            />
          </Link>
          <div className="border-l border-[#e6dfd5] pl-4 py-1 text-xs text-[#555555] font-serif">
            <p className="font-semibold text-[#141414]">Revue mensuelle & base documentaire</p>
            <p className="text-[#737373] text-[11px]">Faits vérifiés · Indicateurs · Projets du Faso</p>
          </div>
        </div>

        {/* Desktop Search & Subscription */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  window.location.href = `/fr/recherche?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="w-56 lg:w-64 pl-8 pr-3 py-1.5 bg-white border border-[#e6dfd5] text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#141414]"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-[#888888]" />
          </div>

          <Link 
            href="/fr/tracker" 
            className="bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
          >
            Le Tracker
          </Link>

          <Link 
            href="#newsletter"
            className="border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            S'abonner
          </Link>
        </div>

      </div>

      {/* 3. NAVIGATION BAR : Classic double border rules */}
      <nav className="hidden md:block border-t-2 border-b border-[#141414] bg-white">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          
          <div className="flex items-center">
            <Link 
              href="/fr" 
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                pathname === '/fr' ? 'text-[#0b4627] bg-[#f4eee3]' : 'text-[#141414] hover:bg-neutral-50'
              }`}
            >
              À la une
            </Link>

            {CATEGORIES.map((cat) => {
              const active = pathname.startsWith(cat.href);
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                    active ? 'text-[#0b4627] bg-[#f4eee3] font-bold' : 'text-[#333333] hover:text-[#141414] hover:bg-neutral-50'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}

            <Link 
              href="/fr/tracker" 
              className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e6dfd5] ${
                pathname.startsWith('/fr/tracker') ? 'text-[#0b4627] bg-[#f4eee3]' : 'text-[#0b4627] hover:bg-neutral-50'
              }`}
            >
              Le Tracker
            </Link>
          </div>

          <div className="flex items-center text-xs font-serif text-[#555555]">
            <Link href="/fr/numeros" className="py-2.5 px-3 hover:text-[#141414] transition-colors">
              Les Numéros
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/fr/fil" className="py-2.5 px-3 hover:text-[#141414] transition-colors">
              Le Fil
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/fr/tracker/indicateurs" className="py-2.5 px-3 hover:text-[#0b4627] font-semibold transition-colors">
              Baromètre RELANCE
            </Link>
          </div>

        </div>
      </nav>

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#141414] px-6 py-6 space-y-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Rechercher un sujet, un projet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  window.location.href = `/fr/recherche?q=${encodeURIComponent(searchQuery)}`;
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full pl-8 pr-3 py-2 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#888888]" />
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-b border-[#e6dfd5] py-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#0b4627]"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2 pt-2 text-xs font-semibold">
            <Link 
              href="/fr/tracker" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#0b4627] font-bold uppercase tracking-wider"
            >
              → Accéder au Tracker des Chantiers
            </Link>
            <Link 
              href="/fr/numeros" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#555555]"
            >
              Les Numéros Mensuels
            </Link>
            <Link 
              href="/fr/fil" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#555555]"
            >
              Le Fil Hebdomadaire
            </Link>
            <Link 
              href="/fr/methode" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#555555]"
            >
              Notre Méthode & Sources
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
