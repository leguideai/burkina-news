import { getIndicatorByCode, indicators } from '@/data/mock/indicators';
import { getProjectsByCategory } from '@/data/mock/projects';
import StatusBadge from '@/components/tracker/StatusBadge';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSourceUrl } from '@/data/sources';

export function generateStaticParams() {
  return indicators.map((indicator) => ({
    slug: indicator.code,
  }));
}

export default async function IndicatorDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const indicator = getIndicatorByCode(slug);

  if (!indicator) {
    notFound();
  }

  const relatedProjects = getProjectsByCategory(indicator.category).slice(0, 3);
  
  const progressPercent = indicator.target2030 && indicator.baselineValue
    ? Math.min(100, Math.max(0, ((indicator.currentValue - indicator.baselineValue) / (indicator.target2030 - indicator.baselineValue)) * 100))
    : 0;

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      
      {/* 1. Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <Link href="/en/tracker" className="hover:text-[#0b4627]">The Tracker</Link>
            <span>/</span>
            <Link href="/en/tracker/indicateurs" className="hover:text-[#0b4627]">Barometer</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">{indicator.code}</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
              <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">{indicator.code}</span>
              <span>·</span>
              <span className="text-[#555555]">Sector: {indicator.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              {indicator.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-[#555555]">
              <span className="flex items-center gap-1.5 text-[#0b4627] font-semibold font-mono">
                <ShieldCheck size={14} /> Certified official data
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                Source:{' '}
                <a 
                  href={getSourceUrl(indicator.source)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                  title={`Open official portal: ${indicator.source}`}
                >
                  <span>{indicator.source}</span>
                  <ExternalLink size={10} />
                </a>
              </span>
              <span>·</span>
              <span>Baseline: {indicator.baselineYear}</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Value & Target Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#141414] p-6">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block mb-1">
                  Current Value ({indicator.currentYear})
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-bold text-[#141414]">{indicator.currentValue}</span>
                  <span className="text-sm font-semibold text-[#555555]">{indicator.unit}</span>
                </div>
                <div className="mt-2 text-xs font-mono text-[#0b4627]">
                  {indicator.trend === 'up' && '↗ Progressing'}
                  {indicator.trend === 'down' && '↘ Retracting'}
                  {indicator.trend === 'stable' && '→ Stable'}
                </div>
              </div>

              <div className="bg-white border border-[#e6dfd5] p-6">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block mb-1">
                  Baseline ({indicator.baselineYear})
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-bold text-[#555555]">{indicator.baselineValue}</span>
                  <span className="text-sm text-[#737373]">{indicator.unit}</span>
                </div>
                <span className="text-[11px] font-serif text-[#737373] mt-2 block">
                  Initial reference point
                </span>
              </div>

              <div className="bg-[#f4eee3] border border-[#e6dfd5] p-6">
                <span className="text-[10px] font-mono text-[#0b4627] uppercase tracking-wider block mb-1 font-bold">
                  PND Target 2030
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-bold text-[#0b4627]">{indicator.target2030}</span>
                  <span className="text-sm text-[#0b4627]">{indicator.unit}</span>
                </div>
                <span className="text-[11px] font-mono text-[#0b4627] mt-2 block">
                  RELANCE 2026-2030
                </span>
              </div>
            </div>

            {/* Definition & Program */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-4 border-b border-[#e6dfd5]">
                Indicator Definition & Perimeter
              </h2>
              <div className="space-y-4 text-xs sm:text-sm font-serif text-[#333333] leading-relaxed">
                <p>
                  {indicator.definition}
                </p>
                {indicator.program && (
                  <p className="text-xs font-mono text-[#737373] mt-3 bg-[#faf8f5] p-2.5 border border-[#e6dfd5]">
                    <strong>Associated PND Program:</strong> {indicator.program}
                  </p>
                )}
              </div>
            </section>

            {/* Historical Series Table */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-4 border-b border-[#e6dfd5]">
                Documented Historical Series
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-serif">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#141414] font-mono text-[10px] uppercase text-[#737373]">
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Recorded Value</th>
                      <th className="py-2.5 px-3">Variance</th>
                      <th className="py-2.5 px-3">Primary Source Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dfd5]">
                    {indicator.history.map((h, idx) => {
                      const prev = indicator.history[idx - 1];
                      const diff = prev ? (h.value - prev.value).toFixed(1) : null;
                      return (
                        <tr key={h.year} className="hover:bg-[#fcfaf7]">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#141414]">{h.year}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#0b4627]">
                            {h.value} {indicator.unit}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#737373]">
                            {diff ? (Number(diff) > 0 ? `+${diff}` : diff) : '—'}
                          </td>
                          <td className="py-2.5 px-3 font-serif">
                            <a 
                              href={getSourceUrl(h.source)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0b4627] hover:underline font-semibold inline-flex items-center gap-0.5"
                              title="Open verified source document"
                            >
                              <span>{h.source}</span>
                              <ExternalLink size={9} />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Related Infrastructure Projects */}
            <div className="bg-white border border-[#141414] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-4 border-b border-[#141414]">
                Related Infrastructure Projects
              </h3>
              
              {relatedProjects.length > 0 ? (
                <div className="space-y-4">
                  {relatedProjects.map(proj => (
                    <div key={proj.id} className="pb-3 border-b border-[#e6dfd5] last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#737373] mb-1">
                        <span>{proj.region}</span>
                        <StatusBadge status={proj.currentStatus} size="sm" lang="en" />
                      </div>
                      <h4 className="font-serif font-bold text-xs text-[#141414] hover:text-[#0b4627] mb-1 leading-snug">
                        <Link href={`/en/tracker/projets/${proj.slug}`}>
                          {proj.title}
                        </Link>
                      </h4>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-serif text-[#737373]">
                  No related construction sites indexed in this sector.
                </p>
              )}

              <Link
                href="/en/tracker"
                className="mt-6 w-full py-2 bg-[#faf8f5] border border-[#e6dfd5] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:border-[#141414] transition-colors"
              >
                Browse All Projects →
              </Link>
            </div>

            {/* Back link */}
            <Link
              href="/en/tracker/indicateurs"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Back to RELANCE Barometer
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
