"use client";

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface InteractiveNewsletterProps {
  lang?: 'fr' | 'en';
}

export default function InteractiveNewsletter({ lang = 'fr' }: InteractiveNewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const isEn = lang === 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setStatus('success');
      setFeedbackMessage(
        isEn 
          ? 'Subscription confirmed! You will receive the weekly Brief every Sunday.'
          : (data.message || 'Inscription confirmée ! Vous recevrez la lettre hebdomadaire chaque dimanche.')
      );
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMessage(err.message || (isEn ? 'An error occurred. Please try again.' : 'Une erreur est survenue.'));
    }
  };

  return (
    <div className="w-full">
      {status === 'success' ? (
        <div className="bg-[#f0fdf4] border border-green-300 p-4 text-xs font-serif text-[#0b4627] flex items-center gap-2 max-w-md mx-auto">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "Your email address" : "Votre adresse email"}
            required
            disabled={status === 'loading'}
            className="px-4 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414] flex-1 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-70 flex items-center justify-center gap-1.5"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>{isEn ? "Subscribing..." : "Envoi..."}</span>
              </>
            ) : (
              <span>{isEn ? "Subscribe" : "S'inscrire"}</span>
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <div className="mt-2 text-xs text-red-600 flex items-center justify-center gap-1">
          <AlertCircle size={13} />
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  );
}
