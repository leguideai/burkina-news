'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  allOptionLabel?: string;
  allValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  lang?: 'fr' | 'en';
  autoSort?: boolean;
  highlightActive?: boolean;
  variant?: 'default' | 'status';
  statusColorMap?: Record<string, string>;
  statusNumberMap?: Record<string, string>;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  allOptionLabel,
  allValue = 'all',
  placeholder,
  searchPlaceholder,
  label,
  className = '',
  buttonClassName = '',
  icon,
  disabled = false,
  lang = 'fr',
  autoSort = true,
  highlightActive = true,
  variant = 'default',
  statusColorMap,
  statusNumberMap,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isStatusVariant = variant === 'status';

  // Normalisation des options
  const normalizedOptions = useMemo<SelectOption[]>(() => {
    const list = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
    if (!autoSort) return list;
    return [...list].sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
  }, [options, autoSort]);

  const isSelectedActive = Boolean(value && value !== allValue);

  // Label actuellement sélectionné
  const currentLabel = useMemo(() => {
    if (!isSelectedActive) {
      return placeholder || allOptionLabel || (lang === 'fr' ? 'Tous' : 'All');
    }
    const found = normalizedOptions.find((opt) => opt.value === value);
    return found ? found.label : value;
  }, [value, isSelectedActive, allOptionLabel, placeholder, normalizedOptions, lang]);

  // Couleur du statut sélectionné (si mode statut)
  const currentStatusColor = useMemo(() => {
    if (isStatusVariant && isSelectedActive && statusColorMap && statusColorMap[value]) {
      return statusColorMap[value];
    }
    return undefined;
  }, [isStatusVariant, isSelectedActive, statusColorMap, value]);

  // Filtrage réactif selon la saisie de l'utilisateur
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return normalizedOptions;
    }
    const term = normalizeString(searchTerm.trim());
    return normalizedOptions.filter((opt) => normalizeString(opt.label).includes(term));
  }, [normalizedOptions, searchTerm]);

  // Focus automatique sur le champ de recherche à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fermeture lors d'un clic extérieur ou appui sur Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(allValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Styles spécifiques pour le bouton déclencheur
  let buttonClasses = 'w-full sm:w-auto min-w-fit px-2.5 py-1.5 border text-xs font-mono text-left transition-all flex items-center justify-between gap-1.5 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-[#0b4627] whitespace-nowrap ';

  if (isStatusVariant) {
    if (isSelectedActive) {
      buttonClasses += 'bg-white border-2 font-bold shadow-xs ';
    } else {
      // Présentation distinctive du statut (Pill sombre & accentué)
      buttonClasses += 'bg-[#141414] text-white border-[#141414] hover:bg-[#262626] font-bold shadow-xs ';
    }
  } else {
    if (isSelectedActive && highlightActive) {
      buttonClasses += 'bg-[#f4efe8] border-[#c4b9aa] text-[#141414] font-medium ';
    } else {
      buttonClasses += 'bg-[#faf8f5] border-[#e6dfd5] text-[#141414] hover:border-[#141414] ';
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-[10px] font-mono uppercase text-[#737373] mb-1">
          {label}
        </label>
      )}

      {/* Bouton déclencheur */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonClassName}`}
        style={
          isStatusVariant && isSelectedActive && currentStatusColor
            ? { borderColor: currentStatusColor, color: currentStatusColor }
            : undefined
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 truncate">
          {/* Badge icon spécial pour le statut */}
          {isStatusVariant && !isSelectedActive && (
            <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse shrink-0" />
          )}
          {isStatusVariant && isSelectedActive && currentStatusColor && (
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: currentStatusColor }}
            />
          )}
          {!isStatusVariant && icon && <span className="shrink-0 text-[#737373]">{icon}</span>}
          <span className="truncate">{currentLabel}</span>
        </span>

        <span className="flex items-center gap-1 shrink-0 ml-1">
          {isSelectedActive && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e as any)}
              className={`p-0.5 rounded hover:bg-black/10 ${
                isStatusVariant && !isSelectedActive ? 'text-neutral-400 hover:text-white' : 'text-[#737373] hover:text-[#852E20]'
              }`}
              title={lang === 'fr' ? 'Réinitialiser' : 'Clear'}
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${
              isStatusVariant && !isSelectedActive ? 'text-neutral-400' : 'text-[#737373]'
            } ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Menu déroulant Popover avec champ de recherche intégré */}
      {isOpen && (
        <div className="absolute z-50 left-0 mt-1.5 w-full min-w-[240px] max-w-sm bg-white border border-[#e6dfd5] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-mono">
          {/* Champ de recherche en tête du sélecteur */}
          <div className="p-2 border-b border-[#e6dfd5] bg-[#faf8f5]">
            <div className="relative flex items-center">
              <Search size={13} className="absolute left-2.5 text-[#737373] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchPlaceholder ||
                  (lang === 'fr' ? 'Taper pour filtrer...' : 'Type to search...')
                }
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#e6dfd5] rounded-md text-xs text-[#141414] placeholder:text-[#888888] focus:outline-none focus:border-[#0b4627] focus:ring-1 focus:ring-[#0b4627]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 text-[#737373] hover:text-[#141414] p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Liste des options défilable */}
          <div className="max-h-60 overflow-y-auto overscroll-contain py-1 text-xs divide-y divide-[#f5f2ed]">
            {/* Option par défaut (Tous / All) si définie */}
            {allOptionLabel && !searchTerm && (
              <div
                role="option"
                aria-selected={!isSelectedActive}
                onClick={() => handleSelect(allValue)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  !isSelectedActive
                    ? isStatusVariant
                      ? 'bg-[#141414] text-white font-bold'
                      : 'bg-[#f4efe8] text-[#0b4627] font-bold'
                    : 'text-[#555555] hover:bg-[#faf8f5] hover:text-[#141414]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isStatusVariant && (
                    <span className="w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
                  )}
                  <span>{allOptionLabel}</span>
                </div>
                {!isSelectedActive && (
                  <Check size={13} className={isStatusVariant ? 'text-white' : 'text-[#0b4627]'} />
                )}
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value;
                const optColor = statusColorMap ? statusColorMap[opt.value] : undefined;
                const optNumber = statusNumberMap ? statusNumberMap[opt.value] : undefined;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#f4efe8] text-[#141414] font-bold'
                        : 'text-[#141414] hover:bg-[#faf8f5] hover:text-[#0b4627]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isStatusVariant && optNumber && (
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                          style={{ backgroundColor: optColor || '#141414' }}
                        >
                          {optNumber}
                        </span>
                      )}
                      {isStatusVariant && !optNumber && optColor && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: optColor }}
                        />
                      )}
                      <span className="truncate" style={isSelected && optColor ? { color: optColor } : undefined}>
                        {opt.label}
                      </span>
                    </div>

                    {isSelected && (
                      <Check
                        size={13}
                        className="shrink-0 ml-2"
                        style={{ color: optColor || '#0b4627' }}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-xs text-[#737373] font-sans">
                {lang === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
                {searchTerm && (
                  <div className="text-[11px] font-mono text-[#888888] mt-1 truncate">
                    « {searchTerm} »
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pied de liste : compteur d'éléments */}
          <div className="px-3 py-1.5 bg-[#faf8f5] border-t border-[#e6dfd5] text-[10px] text-[#737373] flex justify-between items-center font-mono">
            <span>
              {filteredOptions.length}{' '}
              {filteredOptions.length > 1
                ? lang === 'fr'
                  ? 'options disponibles'
                  : 'options available'
                : lang === 'fr'
                ? 'option disponible'
                : 'option available'}
            </span>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-[#0b4627] hover:underline"
              >
                {lang === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
