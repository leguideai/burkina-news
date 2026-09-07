"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';

export default function MicumBriefing() {
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<any>({
    greeting: 'Bonjour Samba. Voici le tour d’horizon de la rédaction ce matin :',
    highlights: [
      '2 signalements lecteurs vérifiés en attente de validation déontologique dans le registre.',
      'Chantier du rail Ouaga-Kaya : la date d’étape prévisionnelle nécessite une mise à jour suite au dernier décret.',
      'Le bulletin trimestriel de l’INSD est disponible : 3 indicateurs clés peuvent être actualisés en 1 clic.'
    ],
    recommendation: 'Recommandation éditoriale : Le dossier sur l’usine de transformation de mangues de Bobo-Dioulasso est complet à 95% et prêt pour mise en avant en Grand Décryptage.',
    timestamp: '08:00'
  });

  const loadBriefing = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'morning_brief', payload: {} })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setBriefing(json.data);
      }
    } catch (e) {
      // Keep initial fallback state
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#123827] via-[#0A482A] to-[var(--ink)] text-white rounded-2xl p-5 md:p-6 shadow-xl border border-emerald-600/30 relative overflow-hidden mb-8">
      {/* Background ambient glow */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-extrabold text-white tracking-tight">
                Le Morning Briefing de Micum
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-extrabold border border-emerald-400/30 uppercase tracking-widest">
                Desk IA & Veille
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              Scan des données & urgences de la rédaction · Actualisé à {briefing.timestamp}
            </p>
          </div>
        </div>

        <Tooltip content="Rafraîchir l'analyse de la rédaction avec Micum">
          <button
            type="button"
            onClick={loadBriefing}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-100 flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </Tooltip>
      </div>

      {/* Greeting & Highlights */}
      <div className="relative z-10 space-y-3">
        <p className="text-xs md:text-sm font-medium text-emerald-100/90">
          {briefing.greeting}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {briefing.highlights.map((item: string, idx: number) => (
            <div 
              key={idx}
              className="bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-xl border border-white/10 text-xs text-white/90 leading-relaxed flex items-start gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Recommendation box */}
        {briefing.recommendation && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-400/25 rounded-xl flex flex-wrap items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{briefing.recommendation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/une"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>Piloter la Une</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
        <span className="text-[11px] text-emerald-300/70 uppercase tracking-wider font-bold">
          Actions Rapides Micum :
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/signalements"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Traiter les signalements ➔
          </Link>
          <Link
            href="/admin/indicateurs"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Actualiser les indicateurs ➔
          </Link>
          <Link
            href="/admin/fil"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Compiler le Fil hebdo ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
