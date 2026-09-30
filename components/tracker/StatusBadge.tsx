import { ProjectStatus, PROJECT_STATUS_LABELS, PROJECT_STATUS_LABELS_EN } from '@/data/types';

const STATUS_CONFIG: Record<ProjectStatus, { dot: string; bg: string; text: string; border: string }> = {
  'annonce': { dot: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
  'engage': { dot: 'bg-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'en-construction': { dot: 'bg-[#ea580c]', bg: 'bg-[#fff7ed]', text: 'text-[#c2410c]', border: 'border-[#fed7aa]' },
  'inaugure': { dot: 'bg-[#0d9488]', bg: 'bg-[#f0fdfa]', text: 'text-[#0f766e]', border: 'border-[#99f6e4]' },
  'operationnel': { dot: 'bg-[#087443]', bg: 'bg-[#f0fdf4]', text: 'text-[#087443]', border: 'border-[#86efac]' },
  'impact-mesure': { dot: 'bg-[#7c3aed]', bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]', border: 'border-[#d8b4fe]' },
};

export default function StatusBadge({ status, size = 'sm', lang = 'fr' }: { status: ProjectStatus; size?: 'sm' | 'md'; lang?: 'fr' | 'en' }) {
  const labelMap = lang === 'en' ? PROJECT_STATUS_LABELS_EN : PROJECT_STATUS_LABELS;
  const label = labelMap[status] || status;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['annonce'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-md border ${config.bg} ${config.text} ${config.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {label}
    </span>
  );
}
