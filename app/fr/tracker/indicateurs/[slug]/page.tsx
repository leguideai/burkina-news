import { getIndicatorByCode, indicators } from '@/data/mock/indicators';
import { getProjectsByCategory } from '@/data/mock/projects';
import StatusBadge from '@/components/tracker/StatusBadge';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return indicators.map((indicator) => ({
    slug: indicator.code,
  }));
}

export default async function IndicatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href="/fr/tracker" className="hover:text-[#0b4627]">Le Tracker</Link>
            <span>/</span>
            <Link href="/fr/tracker/indicateurs" className="hover:text-[#0b4627]">Baromètre</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">{indicator.code}</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
              <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">{indicator.code}</span>
              <span>·</span>
              <span className="text-[#555555]">Secteur : {indicator.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              {indicator.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-[#555555]">
              <span className="flex items-center gap-1.5 text-[#0b4627] font-semibold font-mono">
                <ShieldCheck size={14} /> Donnée officielle auditée
              </span>
              <span>·</span>
              <span>Source : {indicator.source}</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Metrics & Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Value Display Box */}
            <div className="bg-white border border-[#141414] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#e6dfd5]">
                <div>
                  <span className="text-xs font-mono text-[#737373] uppercase block mb-1">
                    Valeur constatée ({indicator.currentYear})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-bold font-mono text-[#141414]">
                      {indicator.currentValue}
                    </span>
                    <span className="text-xl font-mono text-[#555555] font-semibold">{indicator.unit}</span>
                  </div>
                </div>

                <div className="font-mono text-xs">
                  {indicator.trend === 'up' && (
                    <span className="bg-[#f0fdf4] text-[#0b4627] border border-green-200 px-3 py-1.5 font-bold">
                      ↗ Tendance à la hausse
                    </span>
                  )}
                  {indicator.trend === 'down' && (
                    <span className="bg-neutral-100 text-neutral-800 border border-neutral-300 px-3 py-1.5 font-bold">
                      ↘ Tendance à la baisse
                    </span>
                  )}
                  {indicator.trend === 'stable' && (
                    <span className="bg-neutral-100 text-[#737373] border border-neutral-300 px-3 py-1.5 font-bold">
                      → Tendance stable
                    </span>
                  )}
                </div>
              </div>

              {/* Progress toward 2030 target */}
              {indicator.target2030 && (
                <div className="bg-[#faf8f5] border border-[#e6dfd5] p-5 mb-6">
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#737373] uppercase">Trajectoire PND 2026–2030</span>
                    <span className="font-bold text-[#0b4627]">{Math.round(progressPercent)}% de l'objectif</span>
                  </div>

                  <div className="w-full bg-neutral-200 h-2 mb-2">
                    <div 
                      className="h-2 bg-[#0b4627]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-[#737373]">
                    <span>Base {indicator.baselineYear} : {indicator.baselineValue} {indicator.unit}</span>
                    <span>Cible 2030 : {indicator.target2030} {indicator.unit}</span>
                  </div>
                </div>
              )}

              {/* Definition */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-2 pb-1 border-b border-[#e6dfd5]">
                  Définition & Périmètre
                </h3>
                <p className="text-sm font-serif text-[#333333] leading-relaxed">
                  {indicator.definition}
                </p>
                {indicator.program && (
                  <p className="text-xs font-mono text-[#737373] mt-3 bg-[#faf8f5] p-2.5 border border-[#e6dfd5]">
                    <strong>Programme PND associé :</strong> {indicator.program}
                  </p>
                )}
              </div>
            </div>

            {/* Historical Series Table */}
            <div className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] mb-4 pb-2 border-b border-[#141414]">
                Série Historique des Données Vérifiées
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-serif border-collapse">
                  <thead>
                    <tr className="border-b border-[#141414] bg-[#faf8f5] font-mono text-[10px] uppercase text-[#737373]">
                      <th className="py-2.5 px-4">Année</th>
                      <th className="py-2.5 px-4">Valeur ({indicator.unit})</th>
                      <th className="py-2.5 px-4">Source Primaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dfd5]">
                    {indicator.history.map((h) => (
                      <tr key={h.year} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#141414]">{h.year}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#0b4627]">{h.value}</td>
                        <td className="py-2.5 px-4 text-[#555555]">{h.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Source Meta */}
            <div className="bg-white border border-[#e6dfd5] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#e6dfd5]">
                Source Primaire Certifiée
              </h3>
              <p className="text-xs font-serif font-bold text-[#141414] mb-1">{indicator.source}</p>
              <p className="text-[11px] font-serif text-[#555555] leading-relaxed">
                Les séries statistiques sont vérifiées et recoupées directement avec les publications officielles du ministère de tutelle et de l'INSD.
              </p>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="bg-white border border-[#e6dfd5] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#e6dfd5]">
                  Chantiers Liés dans le Tracker
                </h3>
                <div className="space-y-3">
                  {relatedProjects.map(p => (
                    <div key={p.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5]">
                      <div className="flex justify-between items-center mb-1">
                        <StatusBadge status={p.currentStatus} size="sm" />
                        <span className="text-[10px] font-mono text-[#737373]">{p.region}</span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-[#141414] mb-1">
                        <Link href={`/fr/tracker/projets/${p.slug}`} className="hover:text-[#0b4627]">
                          {p.title}
                        </Link>
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link 
              href="/fr/tracker/indicateurs"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Tous les indicateurs
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
