"use client";

import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import Tooltip from '@/components/ui/Tooltip';
import MicumIcon from '@/components/admin/MicumIcon';

interface MicumTranslateButtonProps {
  fieldsToTranslate: Record<string, string>;
  targetLang?: 'en' | 'fr';
  onTranslated: (translated: Record<string, string>) => void;
  label?: string;
  className?: string;
}

export default function MicumTranslateButton({
  fieldsToTranslate,
  targetLang = 'en',
  onTranslated,
  label = 'Traduire en anglais avec Micum',
  className = ''
}: MicumTranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [justDone, setJustDone] = useState(false);
  const { success, error, warning } = useToast();

  const handleTranslate = async () => {
    // Check if there is anything to translate
    const hasContent = Object.values(fieldsToTranslate).some(v => v && v.trim().length > 0);
    if (!hasContent) {
      warning('Contenu vide', 'Remplissez d\'abord la version française avant de lancer la traduction.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          payload: {
            fields: fieldsToTranslate,
            targetLang
          }
        })
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la traduction avec Micum');
      }

      const json = await res.json();
      if (json.data) {
        onTranslated(json.data);
        setJustDone(true);
        success('Traduction Micum réussie', 'Les champs ont été traduits avec succès en style journalistique.');
        setTimeout(() => setJustDone(false), 3000);
      }
    } catch (err: any) {
      error('Erreur Micum', err.message || 'Impossible de traduire le contenu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip content="Traduction journalistique haute précision par Micum (Desk IA)">
      <button
        type="button"
        onClick={handleTranslate}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 shadow-sm border ${
          justDone
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white border-emerald-700/30'
        } ${loading ? 'opacity-70 cursor-wait' : ''} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Micum traduit...</span>
          </>
        ) : justDone ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Traduit !</span>
          </>
        ) : (
          <>
            <MicumIcon size={16} glow />
            <span>{label}</span>
          </>
        )}
      </button>
    </Tooltip>
  );
}
