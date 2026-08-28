import Link from 'next/link';
import { getLatestIssue } from '@/data/mock/issues';
import { getLatestBrief } from '@/data/mock/briefs';
import { articles } from '@/data/mock/articles';
import { getKeyIndicators } from '@/data/mock/indicators';
import { projects, getProjectStats } from '@/data/mock/projects';
import ArticleCard from '@/components/editorial/ArticleCard';
import ProjectCard from '@/components/tracker/ProjectCard';
import { 
  ArrowRight, 
  Clock, 
  PlayCircle, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Radio,
  Quote,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  FileCheck
} from 'lucide-react';

export default function HomePage() {
  const latestIssue = getLatestIssue();
  const latestBrief = getLatestBrief();
  const indicators = getKeyIndicators();
  const projectStats = getProjectStats();
  const leadArticle = articles.find(a => a.type === 'decryptage') || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== leadArticle.id).slice(0, 4);
  const featuredProjects = projects.slice(0, 3);
  const terrainArticle = articles.find(a => a.type === 'terrain') || articles[5];
  const factCheckArticle = articles.find(a => a.type === 'vrai-ou-faux') || articles[4];

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      
      {/* ──────────────────────────────────────────────────────────
          1. BROADSHEET LEAD PACKAGE (3-Column Newspaper Grid)
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 pb-12 border-b border-[#e6dfd5]">
        
        {/* Magazine Issue Identifier Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-[#141414]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627]">
              Numéro 03 · Août 2026
            </span>
            <span className="text-[#d4cece]">|</span>
            <span className="font-serif text-xs text-[#555555]">
              Revue Mensuelle d'Enquête & Veille Documentaire
            </span>
          </div>

          <div className="text-xs font-serif text-[#555555] flex items-center gap-3">
            <span>7 500 mots</span>
            <span>·</span>
            <span>13 sources documentées</span>
            <span>·</span>
            <Link href="/fr/numeros/2027-03" className="font-bold text-[#0b4627] hover:underline">
              Feuilleter le numéro complet →
            </Link>
          </div>
        </div>

        {/* 3-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1 (Col 3 / 25%) : LE FIL DE LA SEMAINE */}
          <div className="lg:col-span-3 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e6dfd5] lg:pr-8 pb-8 lg:pb-0">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#141414]">
              <Link href={`/fr/fil/${latestBrief?.slug || '2026-semaine-34'}`} className="hover:text-[#0b4627] transition-colors">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#0b4627] flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#0b4627] inline-block"></span>
                  Le Fil Hebdo
                </h3>
              </Link>
              <span className="text-[10px] font-mono text-[#737373]">Semaine 34</span>
            </div>

            <div className="space-y-3 font-serif text-xs">
              {latestBrief?.facts.slice(0, 5).map((fact, idx) => (
                <Link 
                  key={idx} 
                  href={`/fr/fil/${latestBrief.slug}#fait-${idx + 1}`}
                  className="group block p-2 -mx-2 hover:bg-white hover:border-[#141414] border border-transparent transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-[#555555]">
                    <span className="font-bold text-[#0b4627] group-hover:underline">[{fact.time}]</span>
                    <span className="uppercase font-semibold">{fact.source}</span>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    {fact.image && (
                      <div className="w-14 h-11 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <img 
                          src={fact.image} 
                          alt="Preuve factuelle" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <p className="text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug line-clamp-3">
                      {fact.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link 
              href={`/fr/fil/${latestBrief?.slug || '2026-semaine-34'}`}
              className="mt-6 font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
            >
              <span>Tous les 10 faits de la semaine</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* COLUMN 2 (Col 6 / 50%) : LE GRAND DÉCRYPTAGE (THE HERO) */}
          <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e6dfd5] lg:pr-8 pb-8 lg:pb-0">
            <div className="mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">
                Grand Décryptage · Économie
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#141414] leading-[1.18] mb-4">
              <Link href={`/fr/${leadArticle.category}/${leadArticle.slug}`} className="hover:text-[#0b4627] transition-colors">
                {leadArticle.title}
              </Link>
            </h1>

            <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-4 border border-[#e6dfd5]">
              <img 
                src={leadArticle.image} 
                alt={leadArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm sm:text-base font-serif text-[#333333] leading-relaxed mb-4">
              {leadArticle.excerpt}
            </p>

            <div className="pt-3 border-t border-[#e6dfd5] flex flex-wrap justify-between items-center text-xs font-serif text-[#555555]">
              <span>Par {leadArticle.author} · Bobo-Dioulasso</span>
              <span className="font-mono text-[11px] text-[#0b4627] font-semibold">{leadArticle.sourceCount} sources vérifiées</span>
            </div>
          </div>

          {/* COLUMN 3 (Col 3 / 25%) : ANALYSES & DÉBATS */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="pb-3 border-b-2 border-[#141414]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Analyses & Points de vue
              </h3>
            </div>

            <div className="space-y-5">
              {secondaryArticles.slice(0, 2).map((art) => (
                <article key={art.id} className="group pb-5 border-b border-[#e6dfd5] last:border-0 last:pb-0">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-1">
                    {art.category}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-1.5">
                    <Link href={`/fr/${art.category}/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h4>
                  <p className="text-xs font-serif text-[#555555] line-clamp-2 mb-2">
                    {art.excerpt}
                  </p>
                  <span className="text-[11px] font-mono text-[#0b4627] font-semibold">{art.sourceCount} sources vérifiées</span>
                </article>
              ))}
            </div>

            {/* Editorial Quote Frame */}
            <div className="bg-[#f4eee3] border border-[#e6dfd5] p-5">
              <Quote size={20} className="text-[#0b4627] mb-2 opacity-50" />
              <p className="font-serif italic text-xs text-[#141414] leading-relaxed mb-3">
                « Ce que nous mesurons, c'est l'écart entre la promesse publique et la réalité vérifiable sur le sol burkinabè. »
              </p>
              <span className="text-[10px] font-mono uppercase font-bold text-[#555555] block">
                — Charte éditoriale Burkina News
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────
          2. LE BAROMÈTRE ÉCONOMIQUE & SOCIAL (National Indicators Strip)
      ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#e6dfd5] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-6 border-b border-[#141414]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-1">
                Données & PND 2026–2030
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414]">
                Le Baromètre Économique & Social du Burkina Faso
              </h2>
            </div>

            <Link 
              href="/fr/tracker/indicateurs" 
              className="text-xs font-mono font-bold text-[#0b4627] hover:underline flex items-center gap-1"
            >
              <span>Consulter les 20 indicateurs du Baromètre</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e6dfd5] border border-[#e6dfd5] bg-[#faf8f5]">
            {indicators.map((ind) => (
              <div key={ind.id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#737373] uppercase mb-2">
                    <span>{ind.code}</span>
                    <span className="text-[#0b4627] font-bold">2026</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-bold font-mono text-[#141414] tracking-tight">
                      {ind.currentValue}
                    </span>
                    <span className="text-sm font-mono text-[#555555]">{ind.unit}</span>
                  </div>

                  <h3 className="text-xs font-serif font-bold text-[#141414] leading-snug mb-3">
                    {ind.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-[#e6dfd5] text-[10px] font-mono text-[#737373] flex justify-between">
                  <span>Cible 2030 : {ind.target2030} {ind.unit}</span>
                  <Link href={`/fr/tracker/indicateurs/${ind.code}`} className="text-[#0b4627] font-bold hover:underline">
                    Détail →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. LE TRACKER DES PROJETS DU FASO (Intelligence Hub)
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-14">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 mb-8 border-b-2 border-[#141414]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-1">
              Base Documentaire & Suivi Terrain
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414]">
              Le Tracker : État d'avancement des grands chantiers
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-serif text-[#555555] hidden sm:inline">
              60 projets audités selon 6 statuts stricts
            </span>
            <Link 
              href="/fr/tracker"
              className="px-4 py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
            >
              Ouvrir le Tracker →
            </Link>
          </div>
        </div>

        {/* 3 Featured Project Dossiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────
          4. ENQUÊTES DE TERRAIN & FACT-CHECKING
      ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-b border-[#e6dfd5] py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="pb-4 mb-8 border-b border-[#141414]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-1">
              Vérifications & Observations Directes
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414]">
              Sur le terrain à Bobo-Dioulasso & Examen des déclarations
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Field Report */}
            <article className="border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between hover:border-[#141414] transition-colors">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                  <img 
                    src={terrainArticle.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=85'} 
                    alt={terrainArticle.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#0b4627] font-bold mb-3 pb-2 border-b border-[#e6dfd5]">
                    <span>Sur le terrain · Bobo-Dioulasso</span>
                    <span>Enquête</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#141414] leading-snug mb-3">
                    <Link href={`/fr/chantiers/${terrainArticle.slug}`} className="hover:text-[#0b4627]">
                      {terrainArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm font-serif text-[#444444] leading-relaxed mb-4">
                    {terrainArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif text-[#555555]">
                  <span>Enquête de terrain · La Rédaction</span>
                  <Link href={`/fr/chantiers/${terrainArticle.slug}`} className="font-mono font-bold text-xs text-[#0b4627] hover:underline">
                    Lire le reportage →
                  </Link>
                </div>
              </div>
            </article>

            {/* Fact Check */}
            <article className="border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between hover:border-[#141414] transition-colors">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                  <img 
                    src={factCheckArticle.image || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=85'} 
                    alt={factCheckArticle.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold mb-3 pb-2 border-b border-[#e6dfd5]">
                    <span className="text-[#0b4627]">Vrai ou Faux · Vérification</span>
                    <span className="text-[#c2410c] bg-white px-2 py-0.5 border border-[#e6dfd5]">Vrai mais incomplet</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#141414] leading-snug mb-3">
                    <Link href={`/fr/securite/${factCheckArticle.slug}`} className="hover:text-[#0b4627]">
                      {factCheckArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm font-serif text-[#444444] leading-relaxed mb-4">
                    {factCheckArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif text-[#555555]">
                  <span>9 sources confrontées</span>
                  <Link href={`/fr/securite/${factCheckArticle.slug}`} className="font-mono font-bold text-xs text-[#0b4627] hover:underline">
                    Voir l'analyse des chiffres →
                  </Link>
                </div>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. NEWSLETTER D'INVESTIGATION (Clean, dignified)
      ────────────────────────────────────────────────────────── */}
      <section id="newsletter" className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-16">
        <div className="border-2 border-[#141414] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
            La lettre hebdomadaire
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414] mb-3">
            Recevez les 10 faits vérifiés de la semaine
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg mx-auto mb-6 leading-relaxed">
            Chaque dimanche matin à 8h00, l'essentiel de l'actualité politique, économique et sécuritaire du Burkina Faso, sourcé et sans commentaire.
          </p>

          <form action="#" className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              required
              className="px-4 py-2.5 bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#141414] focus:outline-none focus:border-[#141414] flex-1"
            />
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
            >
              S'inscrire
            </button>
          </form>
          
          <p className="text-[10px] font-serif text-[#737373] mt-3">
            Gratuit au lancement · Zéro publicité · Vos données ne sont jamais partagées
          </p>
        </div>
      </section>

    </div>
  );
}
