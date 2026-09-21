"use client";

import React, { useState } from 'react';
import { Radio, Wifi, WifiOff, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { useFilStream } from '@/hooks/useFilStream';
import { BriefFactDTO } from '@/lib/api/types';

interface FilLiveStreamProps {
  locale?: 'fr' | 'en';
}

export default function FilLiveStream({ locale = 'fr' }: FilLiveStreamProps) {
  const [liveFacts, setLiveFacts] = useState<BriefFactDTO[]>([]);

  const { isConnected } = useFilStream({
    onNewFact: (newFact) => {
      setLiveFacts((prev) => [newFact, ...prev.slice(0, 4)]);
    },
    onUpdateFact: (updated) => {
      setLiveFacts((prev) => prev.map(f => f.id === updated.id ? updated : f));
    },
    onDeleteFact: ({ id }) => {
      setLiveFacts((prev) => prev.filter(f => f.id !== id));
    },
  });

  const isFr = locale === 'fr';

  return (
    <div className="bg-white border border-[#e6dfd5] p-4 sm:p-5 mb-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e6dfd5]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#087443] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#087443]"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#736c62]"></span>
            )}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
            {isFr ? 'Le Fil Direct — Dépêches 60s' : 'Live Wire — 60s Dispatches'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#087443] bg-[#087443]/10 px-2 py-0.5 rounded">
              <Wifi size={12} className="animate-pulse" />
              <span>{isFr ? 'Diffusion SSE active' : 'Live SSE active'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#736c62] bg-neutral-100 px-2 py-0.5 rounded">
              <WifiOff size={12} />
              <span>{isFr ? 'Connexion en attente' : 'Reconnecting...'}</span>
            </span>
          )}
        </div>
      </div>

      {liveFacts.length > 0 ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#087443] font-bold uppercase">
            <Sparkles size={12} />
            <span>{isFr ? 'Dernières dépêches reçues en direct :' : 'Latest breaking dispatches:'}</span>
          </div>
          <div className="divide-y divide-[#f4eee3] bg-[#faf8f5] border border-[#e6dfd5] p-3 rounded">
            {liveFacts.map((fact) => (
              <div key={fact.id} className="py-2.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-[#141414] text-[#ffd8a8] rounded shrink-0">
                    {fact.time}
                  </span>
                  <div>
                    <p className="font-serif text-xs text-[#141414] leading-relaxed">
                      {isFr ? fact.text_fr : (fact.text_en || fact.text_fr)}
                    </p>
                    {fact.source && (
                      <span className="font-mono text-[10px] text-[#736c62] mt-1 inline-block">
                        Source : {fact.source}
                      </span>
                    )}
                  </div>
                </div>
                {fact.source_url && (
                  <a
                    href={fact.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#087443] hover:underline self-end sm:self-auto shrink-0"
                  >
                    <span>{isFr ? 'Source officielle' : 'Official source'}</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs font-serif text-[#5a554e]">
          <Clock size={13} className="text-[#087443] shrink-0" />
          <span>
            {isFr
              ? 'En attente de nouvelles dépêches certifiées du desk rédactionnel. Les faits vérifiés apparaîtront instantanément ici.'
              : 'Awaiting verified dispatches from the news desk. Incoming certified facts will stream in real time.'}
          </span>
        </div>
      )}
    </div>
  );
}
