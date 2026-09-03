import { ProjectStatusEntry, ProjectStatus, PROJECT_STATUS_ORDER, PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS, PROJECT_STATUS_LABELS_EN } from '@/data/types'
import { CheckCircle2, Circle } from 'lucide-react'

interface StatusTimelineProps {
  statusHistory: ProjectStatusEntry[]
  currentStatus: ProjectStatus
  lang?: 'fr' | 'en'
}

export default function StatusTimeline({ statusHistory, currentStatus, lang = 'fr' }: StatusTimelineProps) {
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(currentStatus)
  const isEn = lang === 'en'

  return (
    <div className="w-full py-4">
      {/* On desktop (lg:), horizontal timeline. On tablets and phones, clean vertical timeline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative">
        <div className="hidden lg:block absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
        
        {PROJECT_STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex
          const color = PROJECT_STATUS_COLORS[status]
          const historyEntry = statusHistory.find(h => h.status === status)
          const label = isEn ? PROJECT_STATUS_LABELS_EN[status] : PROJECT_STATUS_LABELS[status]

          return (
            <div key={status} className="relative z-10 flex lg:flex-col items-center gap-3.5 lg:gap-2 mb-5 lg:mb-0 w-full lg:w-auto">
              {/* Vertical connecting line for mobile & tablet */}
              {index < PROJECT_STATUS_ORDER.length - 1 && (
                <div className="lg:hidden absolute left-[11px] top-7 bottom-[-20px] w-0.5 bg-gray-200 z-0" />
              )}
              
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-white transition-colors"
                style={{ 
                  backgroundColor: isCompleted ? color : 'white',
                  borderColor: isCompleted ? color : '#E5E7EB',
                  color: isCompleted ? 'white' : '#9CA3AF'
                }}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              </div>
              
              <div className="flex flex-col lg:items-center lg:text-center text-left min-w-0">
                <span className={`text-xs font-semibold ${isCompleted ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {label}
                </span>
                {historyEntry && (
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {new Date(historyEntry.date).toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
