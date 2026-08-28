import Link from 'next/link';

export default function Footer() {
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
              Revue mensuelle d'investigation et base documentaire sur le Burkina Faso. Rédaction installée à Bobo-Dioulasso et Ouagadougou.
            </p>

            <div className="border border-[#1b4d32] p-3 text-xs font-serif text-[#a7c5b6]">
              <p className="font-semibold text-white mb-1">Règle déontologique :</p>
              <p className="text-[11px] text-[#c5ded0]">
                La source primaire fait foi. Toute affirmation publiée remonte à un document officiel d'institution, un rapport de bailleur ou une observation directe de terrain.
              </p>
            </div>
          </div>

          {/* Col 2 : Rubriques (Col 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              Rubriques
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href="/fr/economie" className="hover:text-white transition-colors">Économie</Link></li>
              <li><Link href="/fr/securite" className="hover:text-white transition-colors">Sécurité</Link></li>
              <li><Link href="/fr/chantiers" className="hover:text-white transition-colors">Chantiers</Link></li>
              <li><Link href="/fr/agriculture" className="hover:text-white transition-colors">Agriculture</Link></li>
              <li><Link href="/fr/societe" className="hover:text-white transition-colors">Société</Link></li>
              <li><Link href="/fr/idees" className="hover:text-white transition-colors">Idées & Trajectoires</Link></li>
            </ul>
          </div>

          {/* Col 3 : Produits (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              Produits & Outils
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href="/fr/tracker" className="hover:text-white transition-colors font-bold text-white">Le Tracker des Projets (60)</Link></li>
              <li><Link href="/fr/tracker/indicateurs" className="hover:text-white transition-colors">Baromètre RELANCE 2026–2030</Link></li>
              <li><Link href="/fr/numeros" className="hover:text-white transition-colors">Les Numéros Mensuels</Link></li>
              <li><Link href="/fr/fil" className="hover:text-white transition-colors">Le Fil Hebdomadaire</Link></li>
              <li><Link href="/fr/recherche" className="hover:text-white transition-colors">Recherche Documentaire</Link></li>
            </ul>
          </div>

          {/* Col 4 : Déontologie (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffd8a8] mb-4">
              Déontologie
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#d1e3d9]">
              <li><Link href="/fr/methode" className="hover:text-white transition-colors">Hiérarchie des sources</Link></li>
              <li><Link href="/fr/corrections" className="hover:text-white transition-colors">Registre des corrections</Link></li>
              <li><Link href="/fr/financement" className="hover:text-white transition-colors">Transparence financière</Link></li>
              <li><Link href="/fr/a-propos" className="hover:text-white transition-colors">L'Équipe rédactionnelle</Link></li>
              <li><Link href="/fr/contact" className="text-[#ffd8a8] hover:underline font-semibold block pt-1">Signaler une erreur →</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Bottom Bar */}
      <div className="border-t border-[#1b4d32] py-4 px-4 sm:px-8 text-[11px] font-mono text-[#88a897]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 Burkina News · Tous droits réservés</div>
          <div className="flex gap-4">
            <Link href="/fr/methode" className="hover:text-white">Charte éditoriale</Link>
            <span>·</span>
            <Link href="/fr/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
