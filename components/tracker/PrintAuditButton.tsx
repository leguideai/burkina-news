'use client';

import React from 'react';
import { Printer, Download, FileText } from 'lucide-react';

interface PrintAuditButtonProps {
  lang?: 'fr' | 'en';
  variant?: 'outline' | 'solid';
  title?: string;
  className?: string;
}

export default function PrintAuditButton({
  lang = 'fr',
  variant = 'outline',
  title,
  className = '',
}: PrintAuditButtonProps) {
  const isEn = lang === 'en';
  const label = title || (isEn ? 'Export Audit Dossier (PDF)' : 'Fiche d’Audit Certifiée (PDF)');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (variant === 'solid') {
    return (
      <button
        onClick={handlePrint}
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer ${className}`}
        aria-label={label}
      >
        <Download size={14} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePrint}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer ${className}`}
      aria-label={label}
    >
      <Printer size={13} />
      <span>{label}</span>
    </button>
  );
}
