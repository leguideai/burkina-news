import { Indicator } from '@/data/types';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface IndicatorCardProps {
  indicator: Indicator;
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const progressPercent = indicator.target2030 && indicator.baselineValue
    ? Math.min(100, Math.max(0, ((indicator.currentValue - indicator.baselineValue) / (indicator.target2030 - indicator.baselineValue)) * 100))
    : 50;

  return (
    <Link href={`/fr/tracker/indicateurs/${indicator.code}`} className="group block h-full">
      <div className="h-full bg-white border border-[#e6dfd5] group-hover:border-[#141414] transition-colors p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#737373] mb-2">
            <span className="font-bold text-[#0b4627]">{indicator.code}</span>
            <span>{indicator.category}</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-bold font-mono text-[#141414] group-hover:text-[#0b4627] transition-colors">
              {indicator.currentValue}
            </span>
            <span className="text-xs font-mono text-[#555555]">{indicator.unit}</span>
            
            <div className="ml-auto">
              {indicator.trend === 'up' && <span className="text-xs font-mono font-bold text-[#0b4627]">↗ Hausse</span>}
              {indicator.trend === 'down' && <span className="text-xs font-mono font-bold text-neutral-600">↘ Baisse</span>}
              {indicator.trend === 'stable' && <span className="text-xs font-mono text-[#737373]">→ Stable</span>}
            </div>
          </div>

          <h4 className="text-xs font-serif font-bold text-[#141414] leading-snug mb-4">
            {indicator.name}
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
            <span className="truncate max-w-[140px]">Source : {indicator.source}</span>
            <span className="font-bold text-[#0b4627] group-hover:underline inline-flex items-center gap-0.5">
              Détail →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
