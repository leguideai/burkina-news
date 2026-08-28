import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Camera } from 'lucide-react';
import { briefs, getBriefBySlug } from '@/data/mock/briefs';
import { categories } from '@/data/mock/categories';
import { getSourceUrl } from '@/data/sources';

export function generateStaticParams() {
  return briefs.map((brief) => ({
    slug: brief.slug,
  }));
}

export default async function BriefDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  
  if (!brief) {
    notFound();
  }

  const date = new Date(brief.date);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href="/fr/fil" className="hover:text-[#0b4627]">Le Fil</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Semaine {brief.weekNumber}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
                <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Semaine {brief.weekNumber}</span>
                <span>·</span>
                <span className="text-[#555555]">{formattedDate}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                {brief.title}
              </h1>
            </div>

            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-right shrink-0">
              <span className="font-mono text-xs font-bold text-[#0b4627] block">10 Faits Sourcés & Illustrés</span>
              <span className="text-[10px] font-serif text-[#737373]">Chronique hebdomadaire</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 10 Facts Timeline (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Weekly Hero Evidence Photo */}
            {brief.image && (
              <div className="bg-white border border-[#e6dfd5] overflow-hidden">
                <div className="aspect-[16/9] w-full bg-neutral-100">
                  <img 
                    src={brief.image} 
                    alt={brief.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#737373] flex justify-between">
                  <span>Photographie documentaire de la semaine {brief.weekNumber}</span>
                  <span>Archives Rédaction Burkina News</span>
                </div>
              </div>
            )}

            <div className="divide-y divide-[#e6dfd5] bg-white border border-[#e6dfd5]">
              {brief.facts.map((fact, index) => {
                const catInfo = fact.category ? categories.find(c => c.code === fact.category) : null;
                
                return (
                  <article 
                    key={index} 
                    id={`fait-${index + 1}`}
                    className="p-6 hover:bg-[#faf8f5] transition-colors scroll-mt-24 target:bg-[#f4eee3]/80 target:border-l-4 target:border-l-[#0b4627]"
                  >
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0b4627] bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">
                          Fait {index + 1}/10 · [{fact.time}]
                        </span>
                        {catInfo && (
                          <span className="text-[10px] font-mono font-bold uppercase text-[#555555]">
                            {catInfo.nameFr}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-serif text-[#737373]">
                        Source :{' '}
                        <a 
                          href={getSourceUrl(fact.source, fact.sourceUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                          title={`Consulter le portail officiel de ${fact.source}`}
                        >
                          <span>{fact.source}</span>
                          <ExternalLink size={10} />
                        </a>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Miniature Photographic Evidence */}
                      {fact.image && (
                        <div className="w-full sm:w-28 aspect-[4/3] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={fact.image} 
                            alt={`Preuve visuelle - Fait ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-serif text-[#141414] leading-relaxed mb-3">
                          {fact.text}
                        </p>

                        {fact.whyWatch && (
                          <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-xs font-serif text-[#444444]">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0b4627] block mb-1">
                              Pourquoi surveiller :
                            </span>
                            <p>{fact.whyWatch}</p>
                          </div>
                        )}
                      </div>
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
                Protocole de Traçabilité du Fil
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-3">
                Chaque fait est consigné à la suite d'une vérification directe contre le document émetteur ou d'un constat avéré sur le terrain, documenté par une preuve matérielle.
              </p>
              <Link href="/fr/methode" className="font-mono text-xs font-bold text-[#0b4627] hover:underline block">
                Consulter notre méthode →
              </Link>
            </div>

            <Link 
              href="/fr/fil"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Retour aux éditions du Fil
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
