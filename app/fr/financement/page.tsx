import { PieChart, Shield, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Financement & Indépendance | Burkina News',
  description: 'Transparence sur notre modèle économique et nos sources de financement.',
};

export default function FinancementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Transparence Économique
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-3">
          Qui Finance Burkina News
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-2xl mx-auto">
          L'indépendance éditoriale commence par la transparence financière. Voici notre modèle économique.
        </p>
      </div>

      {/* Intro Box */}
      <div className="bg-white border border-[#141414] p-6 mb-12">
        <p className="text-base text-[#141414] leading-relaxed">
          Notre modèle économique est pensé pour garantir notre totale liberté d'investigation. Nous refusons les subventions étatiques directes, les publi-reportages déguisés et toute publicité susceptible de créer un conflit d'intérêts avec nos enquêtes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        
        {/* Breakdown */}
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4 pb-2 border-b border-[#e6dfd5]">
            Répartition des Ressources (2026)
          </h2>

          <div className="space-y-4 text-xs font-serif">
            <div className="bg-white border border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#141414]">Fonds propres de la rédaction</h3>
                <p className="text-[#737373] mt-0.5">Apport initial pour garantir le lancement et l'autonomie</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#0b4627]">60%</span>
            </div>

            <div className="bg-white border border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#141414]">Subventions fondations presse</h3>
                <p className="text-[#737373] mt-0.5">Bourses d'investigation et journalisme de données</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#0b4627]">30%</span>
            </div>

            <div className="bg-[#faf8f5] border border-dashed border-[#e6dfd5] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#737373]">Abonnements & Lettre premium</h3>
                <p className="text-[#737373] mt-0.5">Soutien direct des lecteurs (en cours de déploiement)</p>
              </div>
              <span className="text-2xl font-bold font-mono text-[#737373]">10%</span>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4 pb-2 border-b border-[#e6dfd5]">
            Nos Trois Principes Inaltérables
          </h2>

          <ul className="space-y-4 text-xs font-serif text-[#444444]">
            <li className="p-4 bg-white border border-[#e6dfd5]">
              <span className="font-mono font-bold text-[#0b4627] uppercase block mb-1">
                1. Étanchéité Absolue
              </span>
              <p className="leading-relaxed">
                Aucun bailleur, donateur ou partenaire ne peut influer sur le choix de nos enquêtes, le statut d'un chantier dans le Tracker ou la notation d'un indicateur.
              </p>
            </li>

            <li className="p-4 bg-white border border-[#e6dfd5]">
              <span className="font-mono font-bold text-[#0b4627] uppercase block mb-1">
                2. Déclaration Publique
              </span>
              <p className="leading-relaxed">
                Tout apport ou soutien dépassant 5% du budget annuel de la rédaction fait l'objet d'une déclaration nominative et publique sur cette page.
              </p>
            </li>

            <li className="p-4 bg-white border border-[#e6dfd5]">
              <span className="font-mono font-bold text-[#0b4627] uppercase block mb-1">
                3. Souveraineté du Comité Éditorial
              </span>
              <p className="leading-relaxed">
                Le comité éditorial décide seul et collectivement des sujets d'investigation et des publications sur la base exclusive des preuves documentaires recueillies.
              </p>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
