import Link from 'next/link';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { getBriefs } from '@/data/mock/briefs';

export const metadata = {
  title: 'The Brief | Burkina News',
  description: 'Every Sunday, ten sourced facts of the week. No analysis, no opinion: verified facts.',
};

export default function FilPageEn() {
  const briefs = getBriefs('en');
  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">The Brief</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0b4627] animate-pulse"></span>
                <span>Weekly Fact Chronicle</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                The Brief (Weekly)
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Every Sunday at 8:00 AM: ten verified and sourced facts of the past week. No speculation, no spin: raw documented reality.
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
              <span className="font-bold text-[#141414] uppercase">Chronological Archives</span>
              <span className="text-[#737373]">{briefs.length} certified editions</span>
            </div>

            <div className="space-y-6">
              {briefs.map((brief) => {
                const date = new Date(brief.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <article 
                    key={brief.id} 
                    className="bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all p-6 sm:p-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#e6dfd5]">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0b4627] text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                          Week {brief.weekNumber}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#141414]">
                          {formattedDate}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#0b4627] font-semibold">
                        {brief.facts.length} verified facts
                      </span>
                    </div>

                    {/* Preview Image if available */}
                    {brief.image && (
                      <div className="aspect-[21/9] w-full overflow-hidden bg-neutral-100 border border-[#e6dfd5] mb-6">
                        <img 
                          src={brief.image} 
                          alt={`Cover week ${brief.weekNumber}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Preview of first 3 facts */}
                    <div className="space-y-3 mb-6">
                      {brief.facts.slice(0, 3).map((fact, idx) => (
                        <div key={idx} className="flex gap-3 text-xs font-serif items-start">
                          <span className="font-mono text-[11px] text-[#0b4627] font-bold shrink-0 mt-0.5">
                            [{fact.time}]
                          </span>
                          <p className="text-[#333333] leading-relaxed line-clamp-2">
                            {fact.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-[#e6dfd5] flex justify-between items-center text-xs">
                      <span className="text-[11px] font-serif text-[#737373] italic">
                        Official primary sources cross-checked
                      </span>
                      <Link 
                        href={`/en/fil/${brief.slug}`}
                        className="font-mono font-bold text-xs text-[#0b4627] hover:underline inline-flex items-center gap-1"
                      >
                        Read all {brief.facts.length} facts <ArrowRight size={12} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Mission Box */}
            <div className="bg-white border-2 border-[#141414] p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
                Concept & Rule
              </span>
              <h3 className="font-serif font-bold text-base text-[#141414] mb-3">
                What is The Brief?
              </h3>
              <p className="text-xs font-serif text-[#555555] leading-relaxed mb-4">
                The Brief is our weekly fact registry. Every Sunday at 8:00 AM, we publish exactly 10 sourced events from the past week.
              </p>
              <ul className="space-y-2 text-xs font-serif text-[#333333] border-t border-[#e6dfd5] pt-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#0b4627] font-bold">·</span>
                  <span>Zero editorial comment or conjecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0b4627] font-bold">·</span>
                  <span>Every claim links to an official primary document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0b4627] font-bold">·</span>
                  <span>Permanent archival with timestamped permalinks</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Hook */}
            <div className="bg-[#f4eee3] border border-[#e6dfd5] p-6 text-center">
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-2">
                Receive The Brief by Email
              </h4>
              <p className="text-xs font-serif text-[#555555] mb-4 leading-relaxed">
                Join readers who start Sunday morning with raw, verified national facts.
              </p>
              <Link 
                href="/en#newsletter"
                className="w-full py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider text-center block transition-colors"
              >
                Subscribe Free
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
