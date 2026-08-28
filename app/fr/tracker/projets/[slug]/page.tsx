import { projects, getProjectBySlug } from '@/data/mock/projects';
import { articles } from '@/data/mock/articles';
import StatusBadge from '@/components/tracker/StatusBadge';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_ORDER } from '@/data/types';
import { ArrowLeft, Clock, MapPin, Building2, Coins, Zap, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSourceUrl } from '@/data/sources';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECT_STATUS_ORDER.indexOf(project.currentStatus);
  const linkedArticles = project.linkedArticleIds
    .map(id => articles.find(a => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      
      {/* 1. Header with Broadsheet Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href="/fr/tracker" className="hover:text-[#0b4627]">Le Tracker</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold truncate max-w-xs">{project.title}</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <StatusBadge status={project.currentStatus} size="md" />
              <span className="text-xs font-mono text-[#555555]">
                Région {project.region} · Secteur {project.sector}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs font-serif text-[#555555]">
              <span className="flex items-center gap-1.5 text-[#0b4627] font-semibold">
                <ShieldCheck size={14} /> Audit documentaire certifié
              </span>
              <span>·</span>
              <span>Dernière vérification : {new Date(project.lastVerifiedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Dossier Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Project Image */}
            <div className="border border-[#e6dfd5] bg-white overflow-hidden">
              <div className="aspect-[16/9] w-full bg-neutral-100">
                <img 
                  src={project.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85'} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#737373] flex justify-between">
                <span>Photographie documentaire du chantier</span>
                <span>Source : Rédaction Burkina News</span>
              </div>
            </div>

            {/* Description & Overview */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-4 border-b border-[#e6dfd5]">
                Présentation & Objectifs du Projet
              </h2>
              <p className="text-sm sm:text-base font-serif text-[#333333] leading-relaxed">
                {project.description}
              </p>
            </section>

            {/* Historical Status Timeline (Audit Trail) */}
            <section className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <div className="flex justify-between items-center pb-2 mb-6 border-b border-[#e6dfd5]">
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627]">
                  Chronologie Documentée des 6 Statuts
                </h2>
                <span className="text-[11px] font-mono text-[#737373]">
                  Étape {currentIndex + 1} sur 6
                </span>
              </div>

              {/* Step indicator bar */}
              <div className="grid grid-cols-6 gap-1 mb-8">
                {PROJECT_STATUS_ORDER.map((s, idx) => (
                  <div key={s} className="space-y-1">
                    <div className={`h-1.5 ${idx <= currentIndex ? 'bg-[#0b4627]' : 'bg-neutral-200'}`} />
                    <span className="text-[9px] font-mono uppercase text-[#737373] block truncate">
                      {PROJECT_STATUS_LABELS[s]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Entries */}
              <div className="space-y-6 relative border-l-2 border-[#0b4627] ml-2 pl-6">
                {project.statusHistory.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#0b4627] border-2 border-white"></div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <StatusBadge status={entry.status} size="sm" />
                      <span className="font-mono text-xs font-bold text-[#141414]">
                        {new Date(entry.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-xs text-[#737373] inline-flex items-center gap-1">
                        · Source :{' '}
                        <a 
                          href={getSourceUrl(entry.source)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b4627] hover:underline inline-flex items-center gap-0.5"
                          title={`Ouvrir le portail ou document officiel : ${entry.source}`}
                        >
                          <span>{entry.source}</span>
                          <ExternalLink size={9} />
                        </a>
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs font-serif text-[#555555] mt-1 bg-[#faf8f5] p-3 border border-[#e6dfd5]">
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Linked Articles / Investigations */}
            {linkedArticles.length > 0 && (
              <section className="space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 border-b border-[#141414]">
                  Enquêtes & Décryptages associés
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {linkedArticles.map(art => (
                    <article key={art.id} className="p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-[#0b4627] block mb-1">
                          {art.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#141414] mb-2 leading-snug">
                          <Link href={`/fr/${art.category}/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h4>
                      </div>
                      <Link href={`/fr/${art.category}/${art.slug}`} className="text-xs font-mono font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1 pt-2 border-t border-neutral-100">
                        Lire l'article →
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar Specs & Sources (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Technical Specifications Card */}
            <div className="bg-white border border-[#141414] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-3 mb-4 border-b border-[#141414]">
                Fiche Technique
              </h3>

              <dl className="divide-y divide-[#e6dfd5] text-xs font-mono">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#737373]">Statut actuel :</dt>
                  <dd className="font-bold text-[#141414]">{PROJECT_STATUS_LABELS[project.currentStatus]}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#737373]">Secteur :</dt>
                  <dd className="font-semibold text-[#141414]">{project.sector}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#737373]">Région :</dt>
                  <dd className="font-semibold text-[#141414]">{project.region}</dd>
                </div>
                {project.amount && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#737373]">Budget estimé :</dt>
                    <dd className="font-bold text-[#0b4627]">{project.amount} {project.currency}</dd>
                  </div>
                )}
                {project.capacity && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#737373]">Capacité :</dt>
                    <dd className="font-semibold text-[#141414]">{project.capacity}</dd>
                  </div>
                )}
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#737373]">Dernier constat :</dt>
                  <dd className="font-semibold text-[#141414]">{new Date(project.lastVerifiedAt).toLocaleDateString('fr-FR')}</dd>
                </div>
              </dl>
            </div>

            {/* Project Actors Table */}
            <div className="bg-white border border-[#e6dfd5] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-3 mb-4 border-b border-[#e6dfd5]">
                Parties Prenantes
              </h3>

              <div className="space-y-3 text-xs font-serif">
                {project.actors.map((actor, idx) => (
                  <div key={idx} className="pb-2 border-b border-[#e6dfd5] last:border-0 last:pb-0">
                    <span className="text-[10px] font-mono text-[#737373] uppercase block">{actor.role}</span>
                    <span className="font-bold text-[#141414]">{actor.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Primary Sources */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-3 mb-3 border-b border-[#e6dfd5]">
                Sources Primaires Référencées
              </h3>

              <ul className="space-y-3 text-xs font-serif">
                {project.sources.map((src, idx) => (
                  <li key={idx} className="pb-2 border-b border-[#e6dfd5] last:border-0 last:pb-0">
                    <a 
                      href={getSourceUrl(src.institution || src.title, src.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#141414] hover:text-[#0b4627] hover:underline block leading-snug"
                      title="Consulter le document source officiel"
                    >
                      <span>{src.title}</span>
                      <ExternalLink size={10} className="inline ml-1 text-[#0b4627]" />
                    </a>
                    <span className="text-[11px] text-[#737373] block mt-0.5">
                      {src.institution} · {new Date(src.date).toLocaleDateString('fr-FR')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back Button */}
            <Link 
              href="/fr/tracker"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Retour à l'annuaire du Tracker
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
