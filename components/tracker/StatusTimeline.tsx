import { ProjectStatusEntry, ProjectStatus, PROJECT_STATUS_ORDER, PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '@/data/types'
import { CheckCircle2, Circle } from 'lucide-react'

interface StatusTimelineProps {
  statusHistory: ProjectStatusEntry[]
  currentStatus: ProjectStatus
}

export default function StatusTimeline({ statusHistory, currentStatus }: StatusTimelineProps) {
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="w-full py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative">
        <div className="hidden sm:block absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
        
        {PROJECT_STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex
          const color = PROJECT_STATUS_COLORS[status]
          const historyEntry = statusHistory.find(h => h.status === status)

          return (
            <div key={status} className="relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-0 w-full sm:w-auto">
              {/* Mobile connecting line */}
              {index < PROJECT_STATUS_ORDER.length - 1 && (
                <div className="sm:hidden absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-gray-200 z-0" />
              )}
              
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-white"
                style={{ 
                  backgroundColor: isCompleted ? color : 'white',
                  borderColor: isCompleted ? color : '#E5E7EB',
                  color: isCompleted ? 'white' : '#9CA3AF'
                }}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col sm:items-center sm:text-center text-left">
                <span className={`text-xs font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {PROJECT_STATUS_LABELS[status]}
                </span>
                {historyEntry && (
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    {new Date(historyEntry.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
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
