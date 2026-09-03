import { Project, PROJECT_STATUS_ORDER, PROJECT_STATUS_LABELS } from '@/data/types';
import StatusBadge from './StatusBadge';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  lang?: 'fr' | 'en';
}

export default function ProjectCard({ project, lang = 'fr' }: ProjectCardProps) {
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(project.currentStatus);
  const imageSrc = project.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=85';
  const isEn = lang === 'en';
  const projectHref = `/${isEn ? 'en' : 'fr'}/tracker/projets/${project.slug}`;

  return (
    <div className="group bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all flex flex-col justify-between h-full">
      <div>
        {/* Miniature Image Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
          <img 
            src={imageSrc} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <StatusBadge status={project.currentStatus} size="sm" lang={lang} />
          </div>
          <div className="absolute bottom-2.5 right-2.5 bg-[#141414]/90 text-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
            {project.region}
          </div>
        </div>

        <div className="p-5">
          {/* Sector & Subtitle */}
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-1.5">
            {project.sector}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-2">
            <Link href={projectHref}>
              {project.title}
            </Link>
          </h3>

          <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Specs Table */}
          <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-[11px] font-mono space-y-1.5 mb-2">
            {project.amount && (
              <div className="flex justify-between">
                <span className="text-[#737373] uppercase">Budget :</span>
                <span className="font-bold text-[#141414]">{project.amount} {project.currency}</span>
              </div>
            )}
            {project.capacity && (
              <div className="flex justify-between">
                <span className="text-[#737373] uppercase">Capacité :</span>
                <span className="font-semibold text-[#141414]">{project.capacity}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#737373] uppercase">Maître d'ouvrage :</span>
              <span className="font-semibold text-[#141414] truncate max-w-[140px]">
                {project.actors[0]?.name || 'État burkinabè'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-step progress rule & footer */}
      <div className="px-5 pb-5 pt-0">
        <div className="pt-2 pb-3 border-t border-[#e6dfd5]">
          <div className="flex justify-between text-[10px] font-mono text-[#737373] uppercase mb-1">
            <span>Avancement : {currentIndex + 1}/6</span>
            <span className="text-[#141414] font-semibold">{PROJECT_STATUS_LABELS[project.currentStatus]}</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PROJECT_STATUS_ORDER.map((s, idx) => (
              <div 
                key={s} 
                className={`h-1 ${idx <= currentIndex ? 'bg-[#0b4627]' : 'bg-neutral-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-[11px] font-serif text-[#737373]">
          <span>{isEn ? 'Verified on ' : 'Vérifié le '}{new Date(project.lastVerifiedAt).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}</span>
          <Link 
            href={projectHref}
            className="font-mono font-bold text-xs text-[#0b4627] hover:underline inline-flex items-center gap-1"
          >
            {isEn ? 'Dossier' : 'Fiche'} <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export { ProjectCard };
