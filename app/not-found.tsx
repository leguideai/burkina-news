import Link from 'next/link';
import { Home, FileText, Activity, Database, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#faf8f5]">
      
      <div className="text-center max-w-xl mx-auto">
        <span className="font-mono text-7xl sm:text-8xl font-bold text-[#141414] block mb-2 opacity-20">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414] mb-3">
          Document ou Page Introuvable
        </h1>

        <p className="text-xs sm:text-sm font-serif text-[#555555] mb-8 leading-relaxed">
          Le document que vous recherchez a peut-être été déplacé ou sa référence a été modifiée dans le registre documentaire.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Link href="/fr" className="p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors text-center">
            <span className="font-mono text-xs font-bold text-[#0b4627] block mb-1">01</span>
            <span className="font-serif font-bold text-xs text-[#141414]">Accueil</span>
          </Link>

          <Link href="/fr/tracker" className="p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors text-center">
            <span className="font-mono text-xs font-bold text-[#0b4627] block mb-1">02</span>
            <span className="font-serif font-bold text-xs text-[#141414]">Le Tracker</span>
          </Link>

          <Link href="/fr/numeros" className="p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors text-center">
            <span className="font-mono text-xs font-bold text-[#0b4627] block mb-1">03</span>
            <span className="font-serif font-bold text-xs text-[#141414]">Numéros</span>
          </Link>

          <Link href="/fr/fil" className="p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors text-center">
            <span className="font-mono text-xs font-bold text-[#0b4627] block mb-1">04</span>
            <span className="font-serif font-bold text-xs text-[#141414]">Le Fil</span>
          </Link>
        </div>

        <Link 
          href="/fr"
          className="px-6 py-2.5 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-block"
        >
          Retourner à l'accueil
        </Link>
      </div>

    </div>
  );
}
