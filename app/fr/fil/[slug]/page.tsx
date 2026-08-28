import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Camera, Calendar, Clock, ChevronRight, Hash } from 'lucide-react';
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

  const currentIndex = briefs.findIndex((b) => b.slug === slug);
  const prevBrief = currentIndex < briefs.length - 1 ? briefs[currentIndex + 1] : null;
  const nextBrief = currentIndex > 0 ? briefs[currentIndex - 1] : null;

  const date = new Date(brief.date);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const heroImageSrc = brief.image || '/images/lead.jpeg';

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* 1. Header Masthead */}
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
                <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Édition Hebdomadaire</span>
                <span>·</span>
                <span className="text-[#555555]">{formattedDate}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                {brief.title}
              </h1>
            </div>

            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-right shrink-0">
              <span className="font-mono text-xs font-bold text-[#0b4627] block">10 Faits Sourcés & Vérifiés</span>
              <span className="text-[10px] font-serif text-[#737373]">Chronique hebdomadaire</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 10 Facts Timeline (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Weekly Hero Evidence Photo */}
            <div className="bg-white border border-[#e6dfd5] overflow-hidden">
              <div className="aspect-[16/9] w-full bg-neutral-100 relative">
                <img 
                  src={heroImageSrc} 
                  alt={brief.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#141414]/90 text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                  <Camera size={12} />
                  <span>Documentaire de la Semaine {brief.weekNumber}</span>
                </div>
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#555555] flex flex-wrap justify-between items-center gap-2">
                <span>Photographie documentaire · Archives Rédaction Burkina News</span>
                <span className="font-mono text-[10px] text-[#0b4627] font-semibold">10 faits certifiés sans opinion</span>
              </div>
            </div>

            {/* Facts Chronological List */}
            <div className="divide-y divide-[#e6dfd5] bg-white border border-[#e6dfd5]">
              {brief.facts.map((fact, index) => {
                const catInfo = fact.category ? categories.find(c => c.code === fact.category) : null;
                const factImageSrc = fact.image || '/images/lead.jpeg';
                
                return (
                  <article 
                    key={index} 
                    id={`fait-${index + 1}`}
                    className="p-6 hover:bg-[#faf8f5] transition-colors scroll-mt-24 target:bg-[#f4eee3]/80 target:border-l-4 target:border-l-[#0b4627]"
                  >
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`#fait-${index + 1}`}
                          className="font-mono text-xs font-bold text-[#0b4627] bg-[#f4eee3] hover:bg-[#e9efe8] px-2 py-0.5 border border-[#e6dfd5] inline-flex items-center gap-1 transition-colors"
                          title="Lien permanent vers ce fait"
                        >
                          <Hash size={11} className="opacity-60" />
                          <span>Fait {index + 1}/10</span>
                          <span className="text-[#555555]">· [{fact.time}]</span>
                        </a>

                        {catInfo && (
                          <Link 
                            href={`/fr/${fact.category}`}
                            className="text-[10px] font-mono font-bold uppercase text-[#555555] hover:text-[#0b4627] hover:underline"
                            title={`Voir tous les contenus ${catInfo.nameFr}`}
                          >
                            {catInfo.nameFr}
                          </Link>
                        )}
                      </div>

                      <div className="text-[11px] font-serif text-[#737373]">
                        Source :{' '}
                        <a 
                          href={getSourceUrl(fact.source, fact.sourceUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                          title={`Ouvrir le portail officiel de ${fact.source}`}
                        >
                          <span>{fact.source}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    {/* Fact Body with Photographic Evidence */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      
                      {/* Photographic Evidence Thumbnail */}
                      <div className="w-full sm:w-32 aspect-[4/3] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <img 
                          src={factImageSrc} 
                          alt={`Preuve visuelle - Fait ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-serif text-[#141414] leading-relaxed mb-3 font-medium">
                          {fact.text}
                        </p>

                        {fact.whyWatch && (
                          <div className="bg-[#faf8f5] border-l-2 border-[#0b4627] p-3 text-xs font-serif text-[#444444] mb-3">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0b4627] block mb-1">
                              Pourquoi surveiller ce fait :
                            </span>
                            <p className="leading-relaxed">{fact.whyWatch}</p>
                          </div>
                        )}

                        {/* Direct Contextual Links */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                          <a 
                            href={getSourceUrl(fact.source, fact.sourceUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0b4627] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <ShieldCheck size={12} />
                            <span>Vérifier auprès de {fact.source} ↗</span>
                          </a>

                          {catInfo && (
                            <Link 
                              href={`/fr/${fact.category}`}
                              className="text-[#737373] hover:text-[#141414] hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Rubrique {catInfo.nameFr}</span>
                              <ChevronRight size={12} />
                            </Link>
                          )}
                        </div>

                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            {/* Bottom Week Navigation Bar */}
            <div className="flex justify-between items-center bg-white border border-[#e6dfd5] p-4 text-xs font-mono">
              {prevBrief ? (
                <Link 
                  href={`/fr/fil/${prevBrief.slug}`}
                  className="px-3 py-2 border border-[#e6dfd5] hover:border-[#141414] text-[#141414] font-bold uppercase inline-flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Semaine {prevBrief.weekNumber} précédente</span>
                </Link>
              ) : (
                <div />
              )}

              {nextBrief && (
                <Link 
                  href={`/fr/fil/${nextBrief.slug}`}
                  className="px-3 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white font-bold uppercase inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Semaine {nextBrief.weekNumber} suivante</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

          </div>

          {/* 3. Sidebar (Col 4) : Semaines Passées & Archives */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Direct Access to Other Weekly Editions */}
            <div className="bg-white border border-[#141414] p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#141414]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  Éditions du Fil Hebdo
                </h3>
                <span className="text-[10px] font-mono text-[#0b4627] font-bold">
                  {briefs.length} semaines
                </span>
              </div>

              <p className="text-xs font-serif text-[#555555] mb-4 leading-relaxed">
                Accédez directement aux faits vérifiés des semaines précédentes :
              </p>

              <div className="space-y-3">
                {briefs.map((b) => {
                  const isCurrent = b.slug === brief.slug;
                  const bDate = new Date(b.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <Link 
                      key={b.id} 
                      href={`/fr/fil/${b.slug}`}
                      className={`block p-3 border transition-all ${
                        isCurrent 
                          ? 'bg-[#f4eee3] border-[#0b4627] ring-1 ring-[#0b4627]' 
                          : 'bg-white border-[#e6dfd5] hover:border-[#141414] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-16 h-12 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={b.image || '/images/lead.jpeg'} 
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#141414]">
                              Semaine {b.weekNumber}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono font-bold bg-[#0b4627] text-white px-1.5 py-0.2 uppercase">
                                En cours
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-serif text-[#737373] block truncate">
                            {bDate} · 10 faits
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#e6dfd5]">
                <Link 
                  href="/fr/fil"
                  className="font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
                >
                  <span>Toutes les archives du Fil</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Editorial Protocol Box */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-3 border-b border-[#e6dfd5]">
                Protocole de Traçabilité
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-3">
                Chaque fait est consigné à la suite d'une vérification directe contre le document émetteur ou d'un constat avéré sur le terrain, documenté par une preuve matérielle.
              </p>
              <Link href="/fr/methode" className="font-mono text-xs font-bold text-[#0b4627] hover:underline block">
                Consulter notre méthode →
              </Link>
            </div>

            {/* Return Link */}
            <Link 
              href="/fr"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </aside>

        </div>
      </div>

    </div>
  );
}
