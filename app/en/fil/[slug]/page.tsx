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

export default async function BriefDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  
  if (!brief) {
    notFound();
  }

  const currentIndex = briefs.findIndex((b) => b.slug === slug);
  const prevBrief = currentIndex < briefs.length - 1 ? briefs[currentIndex + 1] : null;
  const nextBrief = currentIndex > 0 ? briefs[currentIndex - 1] : null;

  const date = new Date(brief.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const heroImageSrc = brief.image || '/images/lead.jpeg';

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* 1. Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <Link href="/en/fil" className="hover:text-[#0b4627]">The Brief</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Week {brief.weekNumber}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
                <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Weekly Edition</span>
                <span>·</span>
                <span className="text-[#555555]">{formattedDate}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                {brief.title}
              </h1>
            </div>

            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-right shrink-0">
              <span className="font-mono text-xs font-bold text-[#0b4627] block">10 Verified & Sourced Facts</span>
              <span className="text-[10px] font-serif text-[#737373]">Weekly fact registry</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Timeline Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Lead Cover Image with documentary badge */}
            <div className="border border-[#e6dfd5] bg-white overflow-hidden shadow-xs">
              <div className="aspect-[21/9] w-full bg-neutral-100 relative">
                <img 
                  src={heroImageSrc} 
                  alt={brief.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#141414]/90 text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Camera size={12} className="text-[#ffd8a8]" />
                  <span>Documentary Evidence · Week {brief.weekNumber}</span>
                </div>
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#737373] flex justify-between items-center">
                <span>Field evidence & documentary records collected in Burkina Faso</span>
                <span className="font-mono text-[10px] text-[#0b4627] font-semibold">Burkina News Newsroom</span>
              </div>
            </div>

            {/* Introductory Statement */}
            <div className="bg-white border-l-4 border-[#0b4627] p-4 text-xs font-serif text-[#444444] leading-relaxed">
              <p>
                <strong>Methodology:</strong> The Brief records 10 factual events of the week. No analysis or speculation: only auditable facts substantiated by a ministerial decree, an official statistical bulletin, a multilateral agency release, or direct verified observation.
              </p>
            </div>

            {/* The 10 Facts Timeline */}
            <div className="space-y-6">
              {brief.facts.map((fact, idx) => {
                const factAnchor = `fait-${idx + 1}`;
                return (
                  <article 
                    key={idx} 
                    id={factAnchor}
                    className="group bg-white border border-[#e6dfd5] p-6 sm:p-7 hover:border-[#141414] transition-all scroll-mt-24 target:bg-[#f4eee3] target:border-l-4 target:border-l-[#0b4627]"
                  >
                    {/* Topline: Number, Time, Category, Permlink */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`#${factAnchor}`} 
                          className="bg-[#0b4627] text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 hover:bg-[#072e1a] transition-colors"
                          title="Fact permalink"
                        >
                          <Hash size={10} />
                          <span>Fact {idx + 1}/10 · {fact.time}</span>
                        </a>

                        <Link 
                          href={`/en/${fact.category}`}
                          className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] hover:text-[#0b4627] transition-colors"
                        >
                          {fact.category}
                        </Link>
                      </div>

                      {/* External Official Source Link */}
                      <div className="text-xs font-serif text-[#737373] flex items-center gap-1">
                        <span>Source:</span>
                        <a 
                          href={getSourceUrl(fact.source)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                          title={`Verify with official institution: ${fact.source}`}
                        >
                          <span>{fact.source}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    {/* Fact Body with Image Evidence */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start mb-4">
                      {fact.image && (
                        <div className="w-full sm:w-44 aspect-[4/3] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={fact.image} 
                            alt="Documentary evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <p className="text-sm sm:text-base font-serif text-[#141414] leading-relaxed flex-1">
                        {fact.text}
                      </p>
                    </div>

                    {/* Why Watch Note */}
                    {fact.whyWatch && (
                      <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3.5 text-xs font-serif">
                        <span className="font-mono text-[10px] uppercase text-[#0b4627] font-bold block mb-1">
                          Strategic Implications :
                        </span>
                        <p className="text-[#555555] leading-relaxed">
                          {fact.whyWatch}
                        </p>
                      </div>
                    )}

                    {/* Fact Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[11px] font-mono">
                      <a 
                        href={`#${factAnchor}`} 
                        className="text-[#737373] hover:text-[#0b4627] flex items-center gap-1"
                      >
                        <Hash size={11} />
                        <span>Permalink: #{factAnchor}</span>
                      </a>

                      <a 
                        href={getSourceUrl(fact.source)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0b4627] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Verify with {fact.source}</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Navigation between editions */}
            <div className="flex justify-between items-center pt-8 border-t border-[#141414]">
              {prevBrief ? (
                <Link 
                  href={`/en/fil/${prevBrief.slug}`}
                  className="font-mono text-xs font-bold text-[#141414] hover:text-[#0b4627] flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Week {prevBrief.weekNumber} (Previous)</span>
                </Link>
              ) : <div />}

              {nextBrief ? (
                <Link 
                  href={`/en/fil/${nextBrief.slug}`}
                  className="font-mono text-xs font-bold text-[#141414] hover:text-[#0b4627] flex items-center gap-1"
                >
                  <span>Week {nextBrief.weekNumber} (Next)</span>
                  <ArrowRight size={14} />
                </Link>
              ) : <div />}
            </div>

          </div>

          {/* Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Past Weeks Navigation */}
            <div className="bg-white border-2 border-[#141414] p-5">
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-[#141414]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  Past Brief Editions
                </h3>
                <span className="text-[10px] font-mono text-[#0b4627] font-bold">
                  {briefs.length} weeks
                </span>
              </div>

              <p className="text-xs font-serif text-[#555555] mb-4 leading-relaxed">
                Directly access verified facts from previous weeks:
              </p>

              <div className="space-y-3">
                {briefs.map((b) => {
                  const isCurrent = b.slug === brief.slug;
                  const bDate = new Date(b.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <Link 
                      key={b.id} 
                      href={`/en/fil/${b.slug}`}
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
                              Week {b.weekNumber}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono font-bold bg-[#0b4627] text-white px-1.5 py-0.2 uppercase">
                                Current
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-serif text-[#737373] block truncate">
                            {bDate} · 10 facts
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#e6dfd5]">
                <Link 
                  href="/en/fil"
                  className="font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
                >
                  <span>All Brief archives</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Editorial Protocol Box */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-3 border-b border-[#e6dfd5]">
                Traceability Standard
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-3">
                Every fact is recorded after direct verification against the primary issuing document or direct visual evidence on the ground.
              </p>
              <Link href="/en/methode" className="font-mono text-xs font-bold text-[#0b4627] hover:underline block">
                Read our methodology →
              </Link>
            </div>

            {/* Return Link */}
            <Link 
              href="/en"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Back to Front Page
            </Link>
          </aside>

        </div>
      </div>

    </div>
  );
}
