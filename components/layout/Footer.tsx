"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer({ lang }: { lang?: 'fr' | 'en' }) {
  const pathname = usePathname() || '';
  const isEn = lang === 'en' || pathname.startsWith('/en');

  return (
    <footer className="bg-[#072e1a] text-[#faf8f5] border-t-4 border-[#0b4627]">
      
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1 : Brand & Mission (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-3 inline-block w-fit">
              <img src="/images/logo.png" alt="Burkina News" className="h-9 w-auto object-contain" />
            </div>

            <p className="text-xs text-[#d1e3d9] font-serif leading-relaxed">
              {isEn 
                ? "Monthly investigative journal & documentary platform on Burkina Faso. Newsroom based in Bobo-Dioulasso and Ouagadougou."
                : "Revue mensuelle d'investigation et base documentaire sur le Burkina Faso. Rédaction installée à Bobo-Dioulasso et Ouagadougou."
              }
            </p>

            <div className="border border-[#1b4d32] p-3 text-xs font-serif text-[#a7c5b6]">
              <p className="font-semibold text-white mb-1">
                {isEn ? "Editorial Standard:" : "Règle déontologique :"}
              </p>
              <p className="text-[11px] text-[#c5ded0]">
                {isEn 
                  ? "Primary sources prevail. Any published claim originates from an official document, a funder report, or direct field observation."
                  : "La source primaire fait foi. Toute affirmation publiée remonte à un document officiel d'institution, un rapport de bailleur ou une observation directe de terrain."
                }
              </p>
            </div>
          </div>

          {/* Col 2 : Rubriques (Col 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              {isEn ? "Sections" : "Rubriques"}
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href={isEn ? "/en/economie" : "/fr/economie"} className="hover:text-white transition-colors">{isEn ? "Economy" : "Économie"}</Link></li>
              <li><Link href={isEn ? "/en/securite" : "/fr/securite"} className="hover:text-white transition-colors">{isEn ? "Security" : "Sécurité"}</Link></li>
              <li><Link href={isEn ? "/en/chantiers" : "/fr/chantiers"} className="hover:text-white transition-colors">{isEn ? "Infrastructure" : "Chantiers"}</Link></li>
              <li><Link href={isEn ? "/en/agriculture" : "/fr/agriculture"} className="hover:text-white transition-colors">{isEn ? "Agriculture" : "Agriculture"}</Link></li>
              <li><Link href={isEn ? "/en/societe" : "/fr/societe"} className="hover:text-white transition-colors">{isEn ? "Society" : "Société"}</Link></li>
              <li><Link href={isEn ? "/en/idees" : "/fr/idees"} className="hover:text-white transition-colors">{isEn ? "Ideas & Essays" : "Idées & Trajectoires"}</Link></li>
            </ul>
          </div>

          {/* Col 3 : Produits (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              {isEn ? "Products & Tools" : "Produits & Outils"}
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href={isEn ? "/en/tracker" : "/fr/tracker"} className="hover:text-white transition-colors font-bold text-white">{isEn ? "The Tracker: Major Projects" : "Le Tracker des Grands Chantiers"}</Link></li>
              <li><Link href={isEn ? "/en/tracker/indicateurs" : "/fr/tracker/indicateurs"} className="hover:text-white transition-colors">{isEn ? "RELANCE Barometer 2026–2030" : "Baromètre RELANCE 2026–2030"}</Link></li>
              <li><Link href={isEn ? "/en/numeros" : "/fr/numeros"} className="hover:text-white transition-colors">{isEn ? "Monthly Issues" : "Les Numéros Mensuels"}</Link></li>
              <li><Link href={isEn ? "/en/fil" : "/fr/fil"} className="hover:text-white transition-colors">{isEn ? "The Brief (Weekly)" : "Le Fil Hebdomadaire"}</Link></li>
              <li><Link href={isEn ? "/en/recherche" : "/fr/recherche"} className="hover:text-white transition-colors">{isEn ? "Search Archives" : "Recherche Documentaire"}</Link></li>
            </ul>
          </div>

          {/* Col 4 : Déontologie (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              {isEn ? "Standards" : "Déontologie"}
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href={isEn ? "/en/methode" : "/fr/methode"} className="hover:text-white transition-colors">{isEn ? "Hierarchy of sources" : "Hiérarchie des sources"}</Link></li>
              <li><Link href={isEn ? "/en/corrections" : "/fr/corrections"} className="hover:text-white transition-colors">{isEn ? "Correction registry" : "Registre des corrections"}</Link></li>
              <li><Link href={isEn ? "/en/financement" : "/fr/financement"} className="hover:text-white transition-colors">{isEn ? "Funding transparency" : "Transparence financière"}</Link></li>
              <li><Link href={isEn ? "/en/a-propos" : "/fr/a-propos"} className="hover:text-white transition-colors">{isEn ? "The Editorial Collective" : "L'Équipe rédactionnelle"}</Link></li>
              <li><Link href={isEn ? "/en/contact" : "/fr/contact"} className="text-[#ffd8a8] hover:underline font-semibold block pt-1">{isEn ? "Report an error →" : "Signaler une erreur →"}</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Bottom Bar */}
      <div className="border-t border-[#1b4d32] py-4 px-4 sm:px-8 text-[11px] font-mono text-[#88a897]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 Burkina News · {isEn ? "All rights reserved" : "Tous droits réservés"}</div>
          <div className="flex gap-4">
            <Link href={isEn ? "/en/methode" : "/fr/methode"} className="hover:text-white">{isEn ? "Editorial Charter" : "Charte éditoriale"}</Link>
            <span>·</span>
            <Link href={isEn ? "/en/contact" : "/fr/contact"} className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
