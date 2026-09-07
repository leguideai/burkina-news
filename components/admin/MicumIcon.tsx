"use client";

import React from 'react';
import Image from 'next/image';

interface MicumIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function MicumIcon({
  size = 24,
  className = '',
  glow = false
}: MicumIconProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden relative select-none ${glow ? 'shadow-md shadow-emerald-700/30' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/micum.png"
        alt="Micum (IA)"
        width={size}
        height={size}
        className="w-full h-full object-cover pointer-events-none rounded-full"
      />
    </span>
  );
}

export function MicumBadge({
  label = "Micum · Desk IA",
  sublabel,
  className = ""
}: {
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#0E4D30]/90 via-[#087443]/90 to-[#0A5C36]/90 border border-emerald-500/30 text-white shadow-xs ${className}`}>
      <MicumIcon size={20} glow />
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[11px] font-mono font-bold tracking-tight text-white flex items-center gap-1">
          {label}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </span>
        {sublabel && (
          <span className="text-[9px] font-mono text-emerald-200/90">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
