import { Indicator } from '@/data/types';
import { TrendingUp, TrendingDown, Minus, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getSourceUrl } from '@/data/sources';

interface IndicatorCardProps {
  indicator: Indicator;
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const progressPercent = indicator.target2030 && indicator.baselineValue
    ? Math.min(100, Math.max(0, ((indicator.currentValue - indicator.baselineValue) / (indicator.target2030 - indicator.baselineValue)) * 100))
    : 50;

  return (
    <div className="group h-full bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors flex flex-col justify-between overflow-hidden">
      
      {/* Photographic Evidence Header */}
      {indicator.image && (
        <Link href={`/fr/tracker/indicateurs/${indicator.code}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
          <img 
            src={indicator.image} 
            alt={indicator.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 bg-[#141414] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest">
            {indicator.code}
          </div>
        </Link>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span className="font-bold text-[#0b4627]">{indicator.category}</span>
            <span>{indicator.currentYear}</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <Link 
              href={`/fr/tracker/indicateurs/${indicator.code}`}
              className="text-3xl font-bold font-mono text-[#141414] hover:text-[#0b4627] transition-colors"
            >
              {indicator.currentValue}
            </Link>
            <span className="text-xs font-mono text-[#555555]">{indicator.unit}</span>
            
            <div className="ml-auto">
              {indicator.trend === 'up' && <span className="text-[11px] font-mono font-bold text-[#0b4627]">↗ Hausse</span>}
              {indicator.trend === 'down' && <span className="text-[11px] font-mono font-bold text-neutral-600">↘ Baisse</span>}
              {indicator.trend === 'stable' && <span className="text-[11px] font-mono text-[#737373]">→ Stable</span>}
            </div>
          </div>

          <h4 className="text-xs font-serif font-bold text-[#141414] leading-snug mb-4 line-clamp-2">
            <Link href={`/fr/tracker/indicateurs/${indicator.code}`} className="hover:text-[#0b4627] transition-colors">
              {indicator.name}
            </Link>
          </h4>
        </div>

        <div>
          {indicator.target2030 && (
            <div className="pt-3 border-t border-[#e6dfd5] mb-3">
              <div className="flex justify-between text-[9px] font-mono text-[#737373] uppercase mb-1">
                <span>Base : {indicator.baselineValue}</span>
                <span>Cible 2030 : {indicator.target2030}</span>
              </div>
              <div className="w-full bg-neutral-200 h-1">
                <div 
                  className="h-1 bg-[#0b4627] transition-all" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#e6dfd5] flex justify-between items-center text-[10px] font-mono text-[#737373]">
            <span className="truncate max-w-[140px]">
              Source :{' '}
              <a 
                href={getSourceUrl(indicator.source)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0b4627] font-bold hover:underline inline-flex items-center gap-0.5"
                title={`Ouvrir le portail officiel de ${indicator.source}`}
              >
                <span>{indicator.source}</span>
                <ExternalLink size={8} />
              </a>
            </span>
            <Link 
              href={`/fr/tracker/indicateurs/${indicator.code}`}
              className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
            >
              Détail →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
