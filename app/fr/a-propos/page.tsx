import Link from 'next/link';

export const metadata = {
  title: 'À propos | Burkina News',
  description: 'Notre mission, notre collectif éditorial et notre ancrage.',
};

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center pb-8 mb-10 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          À propos · Burkina News
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] leading-tight">
          Comprendre le Burkina, <br /> raconter le réel.
        </h1>
      </div>

      <div className="space-y-12 text-[#333333] leading-relaxed">
        
        {/* Mission Statement */}
        <p className="text-lg sm:text-xl font-medium text-[#141414] leading-relaxed text-center max-w-2xl mx-auto">
          Dans un paysage informationnel saturé de déclarations sans lendemain et de rumeurs, notre mission est de fournir des faits vérifiables, des données chiffrées et un suivi documentaire continu de l'action publique.
        </p>

        {/* What We Do */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-6">
            Nos Trois Formats Majeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">Le Numéro</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Nos grands décryptages mensuels et dossiers sectoriels d'enquête, publiés avec leur registre exhaustif de sources primaires.
              </p>
            </div>
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">Le Fil</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Le condensé hebdomadaire des dix faits majeurs de la semaine, sourcés à la minute près, sans opinion ni conjecture.
              </p>
            </div>
            <div className="bg-white p-5 border border-[#e6dfd5]">
              <h3 className="font-serif font-bold text-base text-[#141414] mb-2">Le Tracker</h3>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Notre registre public des grands chantiers nationaux (objectif : 60 projets majeurs audités), suivis physiquement et documentairement selon 6 statuts vérifiés.
              </p>
            </div>
          </div>
        </section>

        {/* Collective Editorial Organization */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-4">
            Organisation de la Rédaction
          </h2>
          <p className="text-sm text-[#555555] mb-6">
            Burkina News fonctionne sous la responsabilité d'un collectif éditorial anonyme afin de garantir l'indépendance totale de nos analyses, la protection de nos observateurs de terrain et la primauté absolue des sources sur les signatures individuelles.
          </p>

          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 bg-white border border-[#e6dfd5]">
              <div className="font-mono font-bold text-[#0b4627] uppercase text-[11px] mb-1">
                Le Desk Éditorial & Investigation
              </div>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Pilote les grands décryptages mensuels, coordonne les enquêtes de terrain dans les 13 régions et valide chaque publication selon notre charte de preuve.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e6dfd5]">
              <div className="font-mono font-bold text-[#0b4627] uppercase text-[11px] mb-1">
                Le Desk Données & Tracker
              </div>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Audite les rapports institutionnels (DGMG, SONABEL, INSD, ministères techniques), met à jour les fiches de chantiers et actualise le Baromètre RELANCE.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e6dfd5]">
              <div className="font-mono font-bold text-[#0b4627] uppercase text-[11px] mb-1">
                Le Desk Veille & Archivage Documentaire
              </div>
              <p className="text-xs text-[#555555] font-serif leading-relaxed">
                Supervise la collecte des publications légales, numérise les rapports officiels et assure l'archivage permanent et sécurisé de chaque preuve documentaire.
              </p>
            </div>
          </div>
        </section>

        {/* Bobo-Dioulasso Ancrage */}
        <section className="pt-8 border-t border-[#e6dfd5]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-3">
            Ancrage à Bobo-Dioulasso & Ouagadougou
          </h2>
          <p className="text-sm text-[#444444] leading-relaxed">
            Nous avons fait le choix d'installer notre cœur d'observation à Bobo-Dioulasso, capitale économique et carrefour stratégique, avec des correspondants à Ouagadougou et dans les pôles régionaux. Cet ancrage nous permet de garder la rigueur et le recul nécessaires pour mesurer le réel, loin des effets de cour.
          </p>
        </section>

        {/* Notre Promesse */}
        <div className="bg-[#072e1a] text-white p-8 sm:p-10 border border-[#0b4627] space-y-4">
          <h3 className="font-serif font-bold text-xl text-white mb-2">
            Notre Pacte de Transparence
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm font-serif text-[#d1e3d9]">
            <li className="flex gap-2">
              <span className="font-mono font-bold text-[#ffd8a8]">1.</span>
              <span><strong>Preuve systématique :</strong> Aucune allégation n'est publiée sans référence directe à un document ou un constat physique.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-bold text-[#ffd8a8]">2.</span>
              <span><strong>Indépendance de financement :</strong> Aucun annonceur ni subvention ne peut influer sur nos conclusions.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono font-bold text-[#ffd8a8]">3.</span>
              <span><strong>Droit à la correction publique :</strong> Tout signalement avéré fait l'objet d'une rectification consignée dans notre <Link href="/fr/corrections" className="text-[#ffd8a8] underline">registre public des corrections</Link>.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
