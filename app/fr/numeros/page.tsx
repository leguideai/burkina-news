import Link from 'next/link';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import { issues } from '@/data/mock/issues';

export const metadata = {
  title: 'Les Numéros | Burkina News',
  description: 'Une revue mensuelle. Un Grand Décryptage. Les faits, les chiffres, la trajectoire.',
};

export default function IssuesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Les Numéros</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
                Éditions Mensuelles d'Investigation
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                Les Numéros de Burkina News
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Chaque premier dimanche du mois, un Grand Décryptage sectoriel, des enquêtes de terrain et le bilan documentaire des données nationales.
            </p>
          </div>
        </div>
      </header>

      {/* Issues Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue) => {
            const date = new Date(issue.publicationDate);
            const formattedDate = date.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            });

            return (
              <article 
                key={issue.id} 
                className="bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/fr/numeros/${issue.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                    <img
                      src={issue.coverImage}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#0b4627] text-white text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-wider">
                      Numéro {issue.number}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="text-[11px] font-mono text-[#737373] uppercase mb-2">
                      {formattedDate} · {issue.articleCount} dossiers
                    </div>

                    <h2 className="text-xl font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-3">
                      <Link href={`/fr/numeros/${issue.slug}`}>
                        {issue.title}
                      </Link>
                    </h2>

                    <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-3 mb-4">
                      {issue.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif">
                    <span className="font-mono text-[11px] text-[#737373]">Édition certifiée</span>
                    <Link 
                      href={`/fr/numeros/${issue.slug}`}
                      className="font-mono font-bold text-xs text-[#0b4627] hover:underline inline-flex items-center gap-1"
                    >
                      Consulter <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

    </div>
  );
}
