"use client";

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-[var(--ink)] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-lg my-8">
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <span className="text-[var(--orange)] font-bold text-xs uppercase tracking-wider mb-2">
          La lettre Burkina News
        </span>
        <h3 className="text-3xl font-[family-name:var(--font-serif)] text-white mb-4">
          L'essentiel, chaque semaine.
        </h3>
        <p className="text-[var(--soft)] text-sm leading-relaxed max-w-md">
          Recevez tous les vendredis matin notre sélection d'articles, nos analyses approfondies et un résumé des faits marquants au Burkina Faso.
        </p>
      </div>
      
      <div className="md:w-1/2 bg-[var(--green-dark)] p-8 md:p-12 flex flex-col justify-center">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <CheckCircle className="text-[var(--orange)] mb-4" size={48} />
            <h4 className="text-xl text-white font-[family-name:var(--font-serif)] mb-2">Merci pour votre inscription</h4>
            <p className="text-sm text-[var(--soft)]">
              Vous recevrez notre prochaine newsletter très bientôt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="w-full px-4 py-3 rounded bg-white text-[var(--ink)] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
              />
            </div>
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-[var(--orange)] hover:bg-[var(--orange-light)] text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
            </button>
            <p className="text-[10px] text-[var(--soft)] opacity-70 text-center mt-2">
              En vous inscrivant, vous acceptez nos conditions générales d'utilisation. Vous pouvez vous désabonner à tout moment.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
