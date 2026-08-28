'use client'

import { Search, X } from 'lucide-react'
import { PROJECT_STATUS_LABELS } from '@/data/types'
import { useState } from 'react'

export interface FilterState {
  search: string
  sector: string
  region: string
  status: string
}

interface FilterBarProps {
  onFilter: (filters: FilterState) => void
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sector: '',
    region: '',
    status: '',
  })

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const removeFilter = (key: keyof FilterState) => {
    handleChange(key, '')
  }

  const activeFilterCount = (filters.sector ? 1 : 0) + (filters.region ? 1 : 0) + (filters.status ? 1 : 0)

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--line)] mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--orange)] focus:border-[var(--orange)]"
            placeholder="Rechercher un projet..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <select 
            className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-[var(--orange)] focus:border-[var(--orange)]"
            value={filters.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
          >
            <option value="">Tous les secteurs</option>
            <option value="Énergie">Énergie</option>
            <option value="Transport">Transport</option>
            <option value="Agro-industrie">Agro-industrie</option>
            <option value="Eau / Irrigation">Eau / Irrigation</option>
            <option value="Santé">Santé</option>
            <option value="Éducation">Éducation</option>
            <option value="Routes">Routes</option>
            <option value="Mines">Mines</option>
            <option value="Agriculture">Agriculture</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-[var(--orange)] focus:border-[var(--orange)]"
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
          >
            <option value="">Toutes les régions</option>
            <option value="National">National</option>
            <option value="Centre-Ouest">Centre-Ouest</option>
            <option value="Centre-Nord">Centre-Nord</option>
            <option value="Hauts-Bassins">Hauts-Bassins</option>
            <option value="Plateau-Central">Plateau-Central</option>
            <option value="Boucle du Mouhoun">Boucle du Mouhoun</option>
            <option value="Cascades">Cascades</option>
            <option value="Sud-Ouest">Sud-Ouest</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-[var(--orange)] focus:border-[var(--orange)]"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 py-1 mr-1">Filtres actifs:</span>
          {filters.sector && (
            <span className="inline-flex items-center gap-1 bg-[var(--soft)] text-[var(--ink)] text-xs px-2 py-1 rounded-full">
              Secteur: {filters.sector}
              <button onClick={() => removeFilter('sector')} className="hover:text-[var(--orange)]"><X className="w-3 h-3"/></button>
            </span>
          )}
          {filters.region && (
            <span className="inline-flex items-center gap-1 bg-[var(--soft)] text-[var(--ink)] text-xs px-2 py-1 rounded-full">
              Région: {filters.region}
              <button onClick={() => removeFilter('region')} className="hover:text-[var(--orange)]"><X className="w-3 h-3"/></button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 bg-[var(--soft)] text-[var(--ink)] text-xs px-2 py-1 rounded-full">
              Statut: {PROJECT_STATUS_LABELS[filters.status as keyof typeof PROJECT_STATUS_LABELS]}
              <button onClick={() => removeFilter('status')} className="hover:text-[var(--orange)]"><X className="w-3 h-3"/></button>
            </span>
          )}
          <button 
            onClick={() => {
              setFilters({ search: filters.search, sector: '', region: '', status: '' })
              onFilter({ search: filters.search, sector: '', region: '', status: '' })
            }}
            className="text-xs text-[var(--orange)] hover:underline ml-2"
          >
            Effacer tout
          </button>
        </div>
      )}
    </div>
  )
}
