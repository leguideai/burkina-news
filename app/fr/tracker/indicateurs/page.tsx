import Link from 'next/link';
import { indicators } from '@/data/mock/indicators';
import IndicatorCard from '@/components/tracker/IndicatorCard';
import { ArrowLeft, BarChart2 } from 'lucide-react';

export const metadata = {
  title: 'Baromètre RELANCE 2026–2030 | Burkina News',
  description: 'Tableau de bord de suivi des indicateurs clés de performance du Plan National de Développement (PND) 2026-2030.',
};

export default function IndicatorsPage() {
  const groupedIndicators = indicators.reduce((acc, indicator) => {
    if (!acc[indicator.category]) {
      acc[indicator.category] = [];
    }
    acc[indicator.category].push(indicator);
    return acc;
  }, {} as Record<string, typeof indicators>);

  const categoryNames: Record<string, string> = {
    economie: 'Économie & Finances',
    securite: 'Sécurité & Souveraineté',
    chantiers: 'Infrastructures & Énergie',
    agriculture: 'Agriculture & Souveraineté Alimentaire',
    societe: 'Santé, Éducation & Société',
    idees: 'Gouvernance & Réformes',
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href="/fr/tracker" className="hover:text-[#0b4627]">Le Tracker</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Baromètre RELANCE</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-1">
                <span className="w-2 h-2 bg-[#0b4627] inline-block"></span>
                <span>PND 2026–2030</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                Le Baromètre RELANCE
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Tableau de bord exhaustif des indicateurs nationaux officiels. Chaque valeur est adossée aux rapports périodiques de l'INSD, de la BCEAO, de la DGMG et des ministères sectoriels.
            </p>
          </div>

        </div>
      </header>

      {/* Grouped Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-12">
        {Object.entries(groupedIndicators).map(([category, categoryIndicators]) => (
          <section key={category}>
            <div className="border-b border-[#141414] mb-6 pb-2 flex justify-between items-baseline">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-[#141414]">
                {categoryNames[category] || category}
              </h2>
              <span className="text-xs font-mono text-[#737373]">{categoryIndicators.length} indicateurs audités</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryIndicators.map(indicator => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
