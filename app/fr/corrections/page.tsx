import { AlertTriangle, Check } from 'lucide-react';

export const metadata = {
  title: 'Registre des corrections | Burkina News',
  description: 'Notre registre public listant toutes les corrections apportées à nos articles et données.',
};

export default function CorrectionsPage() {
  const corrections = [
    { 
      date: '2026-08-15', 
      articleTitle: 'Le Burkina produit-il plus d\'or?', 
      previousText: 'Production de 59 tonnes en 2025', 
      correctedText: 'Production de 57,6 tonnes en 2025', 
      reason: 'Correction suite à la publication des chiffres définitifs DGMG', 
      validatedBy: 'Comité Éditorial' 
    },
    { 
      date: '2026-07-28', 
      articleTitle: 'Centrale solaire de Zina', 
      previousText: 'Raccordée en mai 2026', 
      correctedText: 'Raccordée en juin 2026', 
      reason: 'Date corrigée sur la base du rapport officiel SONABEL', 
      validatedBy: 'Desk Données & Tracker' 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Transparence & Rigueur
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-3">
          Registre Public des Corrections
        </h1>
        <p className="text-sm sm:text-base text-[#555555]">
          Toute modification ou précision factuelle apportée après publication est consignée publiquement ici.
        </p>
      </div>

      {/* Policy Note */}
      <div className="bg-white border border-[#e6dfd5] p-6 mb-10">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-2 pb-2 border-b border-[#e6dfd5]">
          Protocole de Correction
        </h3>
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
          Lorsqu'une erreur factuelle ou une mise à jour statistique est identifiée dans nos publications ou dans les fiches du Tracker, nous rectifions l'article concerné, y adossons la source primaire contradictoire et répertorions la correction dans ce registre public permanent.
        </p>
      </div>

      {/* Corrections List */}
      <div className="space-y-6">
        {corrections.map((correction, i) => (
          <div key={i} className="border border-[#e6dfd5] bg-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 border-b border-[#e6dfd5] pb-3">
              <div>
                <span className="font-mono text-xs text-[#737373]">
                  {new Date(correction.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="text-base font-bold font-serif text-[#141414] mt-0.5">{correction.articleTitle}</h3>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b4627] bg-[#faf8f5] px-2.5 py-1 border border-[#e6dfd5]">
                Validé par : {correction.validatedBy}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs font-serif">
              <div className="bg-[#fff5f5] p-3.5 border border-red-200">
                <span className="font-mono text-[10px] font-bold uppercase text-red-800 block mb-1">Version précédente</span>
                <p className="text-red-900 line-through">{correction.previousText}</p>
              </div>
              <div className="bg-[#f0fdf4] p-3.5 border border-green-200">
                <span className="font-mono text-[10px] font-bold uppercase text-green-800 block mb-1 flex items-center gap-1">
                  <Check size={12} /> Version rectifiée
                </span>
                <p className="text-green-900 font-medium">{correction.correctedText}</p>
              </div>
            </div>

            <div className="text-xs font-serif text-[#555555] bg-[#faf8f5] p-3 border border-[#e6dfd5]">
              <span className="font-mono font-bold text-[#141414]">Motif : </span>
              {correction.reason}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
