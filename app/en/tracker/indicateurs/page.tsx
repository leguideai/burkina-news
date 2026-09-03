import Link from 'next/link';
import { getIndicators } from '@/data/mock/indicators';
import IndicatorCard from '@/components/tracker/IndicatorCard';
import { ArrowLeft, BarChart2 } from 'lucide-react';

export const metadata = {
  title: 'RELANCE Barometer 2026–2030 | Burkina News',
  description: 'Independent monitoring dashboard for Key Performance Indicators of the National Development Plan (PND RELANCE) 2026-2030.',
};

export default function IndicatorsPageEn() {
  const enIndicators = getIndicators('en');
  const groupedIndicators = enIndicators.reduce((acc, indicator) => {
    if (!acc[indicator.category]) {
      acc[indicator.category] = [];
    }
    acc[indicator.category].push(indicator);
    return acc;
  }, {} as Record<string, typeof enIndicators>);

  const categoryNamesEn: Record<string, string> = {
    economie: 'Economy & Public Finances',
    securite: 'Security & Sovereignty',
    chantiers: 'Infrastructure & Power',
    agriculture: 'Agriculture & Food Security',
    societe: 'Health, Education & Society',
    idees: 'Governance & Institutional Reforms',
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <Link href="/en/tracker" className="hover:text-[#0b4627]">The Tracker</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">RELANCE Barometer</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-1">
                <span className="w-2 h-2 bg-[#0b4627] inline-block"></span>
                <span>PND 2026–2030</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                The RELANCE Barometer
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Comprehensive dashboard of official national indicators. Every value is sourced from statutory reports by INSD, BCEAO, DGMG and sector ministries.
            </p>
          </div>

        </div>
      </header>

      {/* Grid of Indicators Grouped by Sector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-12">
        {Object.entries(groupedIndicators).map(([category, items]) => (
          <section key={category} className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-[#141414]">
              <span className="w-2 h-2 bg-[#0b4627]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                {categoryNamesEn[category] || category}
              </h2>
              <span className="text-xs font-mono text-[#737373] ml-auto">
                {items.length} indicator{items.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((indicator) => (
                <IndicatorCard key={indicator.code} indicator={indicator} lang="en" />
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
