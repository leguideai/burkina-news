import { ProjectStatus, PROJECT_STATUS_LABELS } from '@/data/types';

const STATUS_CONFIG: Record<ProjectStatus, { dot: string; bg: string; text: string; border: string }> = {
  'annonce': { dot: 'bg-neutral-400', bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' },
  'engage': { dot: 'bg-neutral-800', bg: 'bg-neutral-100', text: 'text-neutral-900', border: 'border-neutral-300' },
  'en-construction': { dot: 'bg-[#c2410c]', bg: 'bg-[#fff7ed]', text: 'text-[#9a3412]', border: 'border-[#fed7aa]' },
  'inaugure': { dot: 'bg-[#0b4627]', bg: 'bg-[#f0fdf4]', text: 'text-[#14532d]', border: 'border-[#bbf7d0]' },
  'operationnel': { dot: 'bg-[#0b4627]', bg: 'bg-[#0b4627]/10', text: 'text-[#0b4627]', border: 'border-[#0b4627]/20' },
  'impact-mesure': { dot: 'bg-neutral-900', bg: 'bg-neutral-900 text-white', text: 'text-white', border: 'border-neutral-900' },
};

export default function StatusBadge({ status, size = 'sm' }: { status: ProjectStatus; size?: 'sm' | 'md' }) {
  const label = PROJECT_STATUS_LABELS[status] || status;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['annonce'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-sm border ${config.bg} ${config.text} ${config.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {label}
    </span>
  );
}
