import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Camera, Calendar, Clock, ChevronRight, Hash } from 'lucide-react';
import { filApi } from '@/lib/api/fil';
import { categoriesApi } from '@/lib/api/categories';
import { BriefDTO, CategoryDTO } from '@/lib/api/types';
import { getSourceUrl } from '@/data/sources';

export async function generateStaticParams() {
  try {
    const res = await filApi.listBriefs({ limit: 50 });
    return (res.briefs || []).map((brief) => ({
      slug: brief.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function BriefDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let brief: BriefDTO | null = null;
  let allBriefs: BriefDTO[] = [];
  let categories: CategoryDTO[] = [];

  try {
    const [res, b, cats] = await Promise.allSettled([
      filApi.listBriefs({ limit: 50 }),
      filApi.getBriefBySlug(slug),
      categoriesApi.listCategories(),
    ]);
    if (res.status === 'fulfilled' && res.value?.briefs) {
      allBriefs = res.value.briefs;
    }
    if (b.status === 'fulfilled' && b.value) {
      brief = b.value;
    }
    if (cats.status === 'fulfilled' && cats.value) {
      categories = cats.value;
    }
  } catch {
    // API error
  }

  if (!brief) {
    notFound();
  }

  const currentIndex = allBriefs.findIndex((b) => b.slug === slug);
  const prevBrief = currentIndex < allBriefs.length - 1 ? allBriefs[currentIndex + 1] : null;
  const nextBrief = currentIndex > 0 ? allBriefs[currentIndex - 1] : null;

  const date = new Date(brief.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const heroImageSrc = brief.image || '/images/lead.jpeg';
  const displayTitle = brief.title_en || brief.title;

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
            <span className="text-[#141414] font-bold">Week {brief.week_number}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
                <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Weekly Edition</span>
                <span>·</span>
                <span className="text-[#555555]">{formattedDate}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                {displayTitle}
              </h1>
            </div>

            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-right shrink-0">
              <span className="font-mono text-xs font-bold text-[#0b4627] block">
                {brief.facts?.length || 10} Sourced & Verified Facts
              </span>
              <span className="text-[10px] font-serif text-[#737373]">Weekly chronicle</span>
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
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#141414]/90 text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                  <Camera size={12} />
                  <span>Documentary Evidence · Week {brief.week_number}</span>
                </div>
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#555555] flex flex-wrap justify-between items-center gap-2">
                <span>Documentary photography · Burkina News Archive</span>
                <span className="font-mono text-[10px] text-[#0b4627] font-semibold">
                  {brief.facts?.length || 10} certified facts without opinion
                </span>
              </div>
            </div>

            {/* Facts Chronological List */}
            <div className="divide-y divide-[#e6dfd5] bg-white border border-[#e6dfd5]">
              {brief.facts?.map((fact, index) => {
                const catInfo = fact.category_code ? categories.find(c => c.code === fact.category_code) : null;
                const catName = catInfo ? (catInfo.name_en || catInfo.name_fr) : null;
                const factText = fact.text_en || fact.text_fr;
                const factWhyWatch = fact.why_watch_en || fact.why_watch_fr;
                
                return (
                  <article 
                    key={fact.id || index} 
                    id={`fact-${index + 1}`}
                    className="p-6 hover:bg-[#faf8f5] transition-colors scroll-mt-24 target:bg-[#f4eee3]/80 target:border-l-4 target:border-l-[#0b4627]"
                  >
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`#fact-${index + 1}`}
                          className="font-mono text-xs font-bold text-[#0b4627] bg-[#f4eee3] hover:bg-[#e9efe8] px-2 py-0.5 border border-[#e6dfd5] inline-flex items-center gap-1 transition-colors"
                          title="Permalink to this fact"
                        >
                          <Hash size={11} className="opacity-60" />
                          <span>Fact {index + 1}/{brief.facts?.length || 10}</span>
                          <span className="text-[#555555]">· [{fact.time}]</span>
                        </a>

                        {catInfo && (
                          <Link 
                            href={`/en/${fact.category_code}`}
                            className="text-[10px] font-mono font-bold uppercase text-[#555555] hover:text-[#0b4627] hover:underline"
                            title={`View all ${catName} reports`}
                          >
                            {catName}
                          </Link>
                        )}
                      </div>

                      <div className="text-[11px] font-serif text-[#737373]">
                        Source:{' '}
                        <a 
                          href={getSourceUrl(fact.source, fact.source_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                          title={`Open official portal of ${fact.source}`}
                        >
                          <span>{fact.source}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    {/* Fact Body with Photographic Evidence */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      
                      {/* Photographic Evidence Thumbnail */}
                      {fact.image && (
                        <div className="w-full sm:w-32 aspect-[4/3] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={fact.image} 
                            alt={`Evidence photo - Fact ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-serif text-[#141414] leading-relaxed mb-3 font-medium">
                          {factText}
                        </p>

                        {factWhyWatch && (
                          <div className="bg-[#faf8f5] border-l-2 border-[#0b4627] p-3 text-xs font-serif text-[#444444] mb-3">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0b4627] block mb-1">
                              Why watch this fact:
                            </span>
                            <p className="leading-relaxed">{factWhyWatch}</p>
                          </div>
                        )}

                        {/* Direct Contextual Links */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                          <a 
                            href={getSourceUrl(fact.source, fact.source_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0b4627] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <ShieldCheck size={12} />
                            <span>Verify with {fact.source} ↗</span>
                          </a>

                          {catInfo && (
                            <Link 
                              href={`/en/${fact.category_code}`}
                              className="text-[#737373] hover:text-[#141414] hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Category {catName}</span>
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
                  href={`/en/fil/${prevBrief.slug}`}
                  className="px-3 py-2 border border-[#e6dfd5] hover:border-[#141414] text-[#141414] font-bold uppercase inline-flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Previous Week {prevBrief.week_number}</span>
                </Link>
              ) : (
                <div />
              )}

              {nextBrief && (
                <Link 
                  href={`/en/fil/${nextBrief.slug}`}
                  className="px-3 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white font-bold uppercase inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Week {nextBrief.week_number}</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

          </div>

          {/* 3. Sidebar (Col 4) : Past Weeks & Archives */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Direct Access to Other Weekly Editions */}
            <div className="bg-white border border-[#141414] p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#141414]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  Past Brief Editions
                </h3>
                <span className="text-[10px] font-mono text-[#0b4627] font-bold">
                  {allBriefs.length} weeks
                </span>
              </div>

              <p className="text-xs font-serif text-[#555555] mb-4 leading-relaxed">
                Access verified facts from preceding weeks directly:
              </p>

              <div className="space-y-3">
                {allBriefs.map((b) => {
                  const isCurrent = b.slug === brief?.slug;
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
                            alt={b.title_en || b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#141414]">
                              Week {b.week_number}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono font-bold bg-[#0b4627] text-white px-1.5 py-0.2 uppercase">
                                Current
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-serif text-[#737373] block truncate">
                            {bDate} · {b.facts?.length || 10} facts
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
                  <span>All archives of The Brief</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Editorial Protocol Box */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-3 border-b border-[#e6dfd5]">
                Evidence Protocol
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-3">
                Every fact is published only after primary source verification against official documents or authenticated field evidence.
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
              ← Back to homepage
            </Link>
          </aside>

        </div>
      </div>

    </div>
  );
}
