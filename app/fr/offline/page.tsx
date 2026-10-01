'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, Home, Clock } from 'lucide-react';

export default function OfflinePageFr() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#e6dfd5] shadow-xs text-center">
        <div className="w-16 h-16 bg-[#faf8f5] text-[#b33a2b] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#e6dfd5]">
          <WifiOff className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#141414] mb-3">
          Connexion Internet Interrompue
        </h1>

        <p className="text-sm text-[#736e65] mb-6 leading-relaxed">
          Le réseau est actuellement instable ou indisponible. Vous pouvez continuer à lire les dépêches et articles pré-enregistrés dans votre cache local.
        </p>

        <div className="space-y-3">
          <Link
            href="/fr/fil"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0b4627] text-white rounded-xl text-sm font-medium hover:bg-[#08351d] transition-colors"
          >
            <Clock className="w-4 h-4" />
            Consulter le Fil (Dépêches en cache)
          </Link>

          <Link
            href="/fr"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#f0ede6] text-[#141414] rounded-xl text-sm font-medium hover:bg-[#e6dfd5] transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à l'Accueil
          </Link>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-[#e6dfd5] text-[#736e65] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors mt-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer la connexion
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#f0ede6] text-xs text-[#a39e93]">
          🇧🇫 Mode hors-ligne résilient Burkina News · Cache PWA actif
        </div>
      </div>
    </div>
  );
}
