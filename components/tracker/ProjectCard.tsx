import { Project, PROJECT_STATUS_ORDER, PROJECT_STATUS_LABELS, PROJECT_STATUS_LABELS_EN, PROJECT_STATUS_COLORS } from '@/data/types';
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
  const title = isEn && project.titleEn ? project.titleEn : project.title;
  const description = isEn && project.descriptionEn ? project.descriptionEn : project.description;
  const projectHref = `/${isEn ? 'en' : 'fr'}/tracker/projets/${project.slug}`;
  const statusLabel = isEn ? PROJECT_STATUS_LABELS_EN[project.currentStatus] : PROJECT_STATUS_LABELS[project.currentStatus];

  return (
    <Link 
      href={projectHref}
      className="group bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all flex flex-col justify-between h-full rounded-xl overflow-hidden shadow-xs cursor-pointer block"
    >
      <div>
        {/* Miniature Image Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <StatusBadge status={project.currentStatus} size="sm" lang={lang} />
            {project.code && (
              <span className="bg-[#141414]/90 text-white px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-md">
                {project.code}
              </span>
            )}
          </div>
          <div className="absolute bottom-2.5 right-2.5 bg-[#141414]/90 text-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md">
            {project.province ? `${project.province} · ${project.region}` : project.region}
          </div>
        </div>

        <div className="p-5">
          {/* Sector & Subtitle */}
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-1.5">
            {project.sector}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-2">
            {title}
          </h3>

          <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          {/* Specs Table */}
          <div className="bg-[#faf8f5] border border-[#e6dfd5] p-3 text-[11px] font-mono space-y-1.5 mb-2">
            {project.amount && (
              <div className="flex justify-between">
                <span className="text-[#737373] uppercase">{isEn ? 'Budget:' : 'Budget :'}</span>
                <span className="font-bold text-[#141414]">{project.amount} {project.currency}</span>
              </div>
            )}
            {project.capacity && (
              <div className="flex justify-between">
                <span className="text-[#737373] uppercase">{isEn ? 'Capacity:' : 'Capacité :'}</span>
                <span className="font-semibold text-[#141414]">{project.capacity}</span>
              </div>
            )}
            {project.bailleur && (
              <div className="flex justify-between">
                <span className="text-[#737373] uppercase">{isEn ? 'Donor:' : 'Bailleur :'}</span>
                <span className="font-semibold text-[#0b4627] truncate max-w-[140px]">{project.bailleur}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#737373] uppercase">{isEn ? 'Client authority:' : "Maître d'ouvrage :"}</span>
              <span className="font-semibold text-[#141414] truncate max-w-[140px]">
                {project.actors[0]?.name || (isEn ? 'Burkinabè State' : 'État burkinabè')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-step progress rule & footer */}
      <div className="px-5 pb-5 pt-0">
        <div className="pt-2 pb-3 border-t border-[#e6dfd5]">
          <div className="flex justify-between text-[10px] font-mono text-[#737373] uppercase mb-1.5">
            <span className="shrink-0">{isEn ? `Stage: ${currentIndex + 1}/6` : `Avancement : ${currentIndex + 1}/6`}</span>
            <span 
              className="font-bold truncate pl-2"
              style={{ color: PROJECT_STATUS_COLORS[project.currentStatus] }}
            >
              {statusLabel}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PROJECT_STATUS_ORDER.map((s, idx) => {
              const isCompleted = idx <= currentIndex;
              const stepColor = PROJECT_STATUS_COLORS[s];
              return (
                <div 
                  key={s} 
                  className="h-1.5 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: isCompleted ? stepColor : '#E5E7EB',
                  }}
                  title={`${idx + 1}. ${isEn ? PROJECT_STATUS_LABELS_EN[s] : PROJECT_STATUS_LABELS[s]}`}
                />
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-[11px] font-serif text-[#737373]">
          <span>{isEn ? 'Verified on ' : 'Vérifié le '}{new Date(project.lastVerifiedAt).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}</span>
          <span 
            className="font-mono font-bold text-xs text-[#0b4627] group-hover:underline inline-flex items-center gap-1"
          >
            {isEn ? 'Project File' : 'Fiche'} <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export { ProjectCard };
