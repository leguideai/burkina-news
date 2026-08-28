import Link from 'next/link';
import { CheckCircle, FileText, Database, Archive, Edit3, ShieldCheck, Calculator } from 'lucide-react';

export const metadata = {
  title: 'Notre méthode | Burkina News',
  description: 'La méthode journalistique, la hiérarchie des sources et les principes de transparence de Burkina News.',
};

export default function MethodePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-serif">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pb-8 mb-12 border-b border-[#141414]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627] block mb-2">
          Transparence & Rigueur Méthodologique
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight mb-4">
          Notre Méthode de Travail
        </h1>
        <p className="text-base sm:text-lg text-[#555555]">
          Pour restaurer la confiance dans l'information, nous rendons publics nos critères de preuve, notre hiérarchie des sources et nos protocoles de vérification.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 relative">
        
        {/* Sticky Table of Contents */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24 space-y-4 bg-white p-5 border border-[#e6dfd5]">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 border-b border-[#e6dfd5]">
              Au sommaire
            </h3>
            <ul className="space-y-2.5 text-xs font-serif text-[#555555]">
              <li><a href="#positionnement" className="hover:text-[#0b4627] transition-colors block">1. Notre positionnement</a></li>
              <li><a href="#sources" className="hover:text-[#0b4627] transition-colors block">2. Hiérarchie des sources</a></li>
              <li><a href="#tracker" className="hover:text-[#0b4627] transition-colors block">3. Le Tracker des projets</a></li>
              <li><a href="#verification" className="hover:text-[#0b4627] transition-colors block">4. Protocole de vérification</a></li>
              <li><a href="#archivage" className="hover:text-[#0b4627] transition-colors block">5. Archivage des preuves</a></li>
              <li><a href="#corrections" className="hover:text-[#0b4627] transition-colors block">6. Registre des corrections</a></li>
              <li><a href="#traitement-donnees" className="hover:text-[#0b4627] transition-colors block">7. Audit des données chiffrées</a></li>
            </ul>
          </div>
        </div>

        {/* Content Body */}
        <div className="w-full md:w-3/4 space-y-12 text-[#333333] leading-relaxed">
          
          {/* Section 1 */}
          <section id="positionnement" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <ShieldCheck size={16} />
              <span>Section 01</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              1. Notre positionnement
            </h2>
            <p className="mb-4">
              <strong>Le gouvernement a fixé ses objectifs. Nous mesurons où il en est.</strong> Notre travail n'est ni pro-gouvernemental, ni anti-gouvernemental. Il s'agit d'un journalisme d'investigation rigoureux, factuel, fondé sur la mesure des résultats concrets et la confrontation systématique des annonces avec la réalité du terrain.
            </p>
            <p className="text-sm text-[#555555]">
              Nous croyons que le débat public s'appauvrit lorsqu'il se résume à des postures politiques. En nous concentrant sur les chantiers, les réformes économiques et les indicateurs mesurables, nous apportons des repères stables et incontestables.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sources" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <FileText size={16} />
              <span>Section 02</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              2. Hiérarchie stricte des sources
            </h2>
            <p className="mb-4 text-sm text-[#555555]">
              Toute information publiée par notre rédaction obéit à une hiérarchie stricte de recevabilité des preuves :
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li><strong>Sources primaires institutionnelles :</strong> Rapports de la DGMG, INSD, BCEAO, arrêtés ministériels et comptes administratifs certifiés.</li>
              <li><strong>Organismes multilatéraux :</strong> Banque Mondiale, FMI, BAD, agences des Nations Unies, systématiquement croisés avec les données nationales.</li>
              <li><strong>Vérification directe de terrain :</strong> Constats physiques réalisés par nos observateurs à Bobo-Dioulasso, Ouagadougou et dans les 13 régions.</li>
              <li><strong>Bailleurs et constructeurs :</strong> Documents contractuels et rapports d'étape d'ingénierie des entreprises exécutantes.</li>
              <li><strong>Presse tierce :</strong> Utilisée uniquement comme point de départ de recherche, jamais comme source d'affirmation sans remontée au document primaire.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section id="tracker" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <Database size={16} />
              <span>Section 03</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              3. Le Tracker des projets et ses 6 statuts
            </h2>
            <p className="mb-4 text-sm text-[#555555]">
              Notre registre des grands chantiers classe chaque projet selon une séquence immuable de six statuts vérifiés :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>1. Annoncé :</strong> Simple déclaration ou promesse officielle.</div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>2. Engagé :</strong> Financement bouclé ou marché formellement notifié.</div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>3. En construction :</strong> Travaux physiquement engagés sur le site.</div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>4. Inauguré :</strong> Réception officielle des ouvrages.</div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>5. Opérationnel :</strong> Service public ou production effectivement rendus.</div>
              <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5]"><strong>6. Impact mesuré :</strong> Données quantitatives publiées sur l'efficacité réelle.</div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="verification" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <CheckCircle size={16} />
              <span>Section 04</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              4. Protocole de vérification & Red Team
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed">
              Avant la parution de toute enquête ou actualisation de données, nous appliquons un test de résistance éditoriale (« Red Team ») : un membre de la rédaction examine la solidité de chaque chiffre en tentant d'identifier des faiblesses méthodologiques ou des sources contradictoires.
            </p>
          </section>

          {/* Section 5 */}
          <section id="archivage" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <Archive size={16} />
              <span>Section 05</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              5. Archivage permanent des preuves
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed">
              Parce que les pages web et les communiqués peuvent être modifiés ou supprimés, nous archivons systématiquement une copie horodatée (snapshot numérique ou capture PDF) de chaque document primaire cité dans nos bases documentaires.
            </p>
          </section>

          {/* Section 6 */}
          <section id="corrections" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <Edit3 size={16} />
              <span>Section 06</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              6. Registre public des corrections
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed mb-4">
              L'erreur est possible, sa dissimulation est inadmissible. Toute précision ou rectification factuelle fait l'objet d'une mise à jour transparente dans l'article et d'une entrée permanente dans notre <Link href="/fr/corrections" className="text-[#0b4627] font-bold underline">registre public des corrections</Link>.
            </p>
          </section>

          {/* Section 7 */}
          <section id="traitement-donnees" className="bg-white p-6 sm:p-8 border border-[#e6dfd5]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-2">
              <Calculator size={16} />
              <span>Section 07</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141414] mb-4">
              7. Audit et réconciliation des données chiffrées
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed">
              Pour traiter les volumineux rapports institutionnels (budgets de l'État, rapports miniers, bilans énergétiques), notre équipe applique des méthodes rigoureuses de réconciliation statistique. Chaque série de données fait l'objet d'un double contrôle arithmétique et d'un pointage manuel auprès des services émetteurs avant toute publication.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
}
