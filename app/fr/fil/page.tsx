import Link from 'next/link';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { briefs } from '@/data/mock/briefs';

export const metadata = {
  title: 'Le Fil | Burkina News',
  description: 'Chaque dimanche, dix faits sourcés de la semaine. Pas d\'analyse, pas d\'opinion : les faits.',
};

export default function FilPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Le Fil</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0b4627] animate-pulse"></span>
                <span>Chronique Factuelle Hebdomadaire</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                Le Fil de la Semaine
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Chaque dimanche à 8h00 : dix faits vérifiés et sourcés de la semaine écoulée. Aucune opinion, aucune conjecture : les faits bruts documentés.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main List (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="pb-2 border-b border-[#141414] flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#141414] uppercase">Archives chronologiques</span>
              <span className="text-[#737373]">{briefs.length} éditions certifiées</span>
            </div>

            <div className="space-y-6">
              {briefs.map((brief) => {
                const date = new Date(brief.date);
                const formattedDate = date.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

                return (
                  <article key={brief.id} className="bg-white border border-[#e6dfd5] p-6 hover:border-[#141414] transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2 pb-3 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0b4627] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                          Semaine {brief.weekNumber}
                        </span>
                        <span className="font-mono text-xs text-[#737373]">{formattedDate}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0b4627]">10 faits vérifiés</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 mb-4">
                      {brief.image && (
                        <div className="sm:w-1/3 aspect-[16/10] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={brief.image} 
                            alt={brief.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="sm:w-2/3 flex flex-col justify-between">
                        <h2 className="text-xl font-bold font-serif text-[#141414] hover:text-[#0b4627] leading-snug mb-3">
                          <Link href={`/fr/fil/${brief.slug}`}>
                            {brief.title}
                          </Link>
                        </h2>

                        <ul className="space-y-2 text-xs font-serif text-[#444444] divide-y divide-neutral-100">
                          {brief.facts.slice(0, 3).map((fact, idx) => (
                            <li key={idx} className="pt-2 first:pt-0 flex items-start gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#0b4627] shrink-0">[{fact.time}]</span>
                              <span className="line-clamp-2 leading-relaxed">{fact.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center">
                      <span className="text-[11px] font-serif text-[#737373]">Sources officielles confrontées</span>
                      <Link 
                        href={`/fr/fil/${brief.slug}`}
                        className="font-mono font-bold text-xs text-[#0b4627] hover:underline inline-flex items-center gap-1"
                      >
                        Consulter les 10 faits <ArrowRight size={12} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#141414] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#141414]">
                Principes du Fil
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-3">
                Le Fil s'interdit toute interprétation subjective. Il consigne chronologiquement les faits publics vérifiés, les arrêtés légaux et les publications statistiques officielles de la semaine.
              </p>
              <Link href="/fr/methode" className="font-mono text-xs font-bold text-[#0b4627] hover:underline block">
                Lire notre charte de preuve →
              </Link>
            </div>

            <div className="bg-[#072e1a] text-white p-5 border border-[#0b4627]">
              <h4 className="font-serif font-bold text-sm text-white mb-2">
                Recevoir Le Fil par Courriel
              </h4>
              <p className="text-xs font-serif text-[#d1e3d9] mb-4">
                Chaque dimanche matin à 8h00, recevez la synthèse brute des 10 faits directement dans votre boîte.
              </p>
              <form action="#" className="space-y-2">
                <input 
                  type="email" 
                  placeholder="votre.email@domaine.com"
                  className="w-full bg-[#0b4627] border border-[#1b4d32] px-3 py-2 text-xs text-white placeholder:text-[#a7c5b6] focus:outline-none focus:border-white"
                />
                <button 
                  type="submit"
                  className="w-full py-2 bg-white text-[#072e1a] hover:bg-[#faf8f5] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  S'abonner au Fil
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
