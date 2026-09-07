"use client";

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Languages,
} from 'lucide-react';
import { Project, ProjectStatus, PROJECT_STATUS_ORDER, PROJECT_STATUS_LABELS, ProjectActor } from '@/data/types';
import ImageUploader from '@/components/admin/ImageUploader';
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';
import MicumIcon from '@/components/admin/MicumIcon';

export interface ProjectEditorFormHandle {
  insertToBody: (text: string) => void;
  replaceField: (field: string, value: string) => void;
  getFormData: () => { formData: Partial<Project> };
}

interface ProjectEditorFormProps {
  initialData?: Partial<Project>;
  isEditing: boolean;
  onSave: (data: Partial<Project>) => Promise<void>;
  onToggleMicum?: () => void;
  isMicumOpen?: boolean;
}

const SECTORS = [
  'Énergie',
  'Transport',
  'Eau & Assainissement',
  'Mines',
  'Santé',
  'Éducation',
  'Agriculture & Irrigation',
  'Télécoms & Numérique'
];

const REGIONS = [
  'Centre (Ouagadougou)',
  'Hauts-Bassins (Bobo-Dioulasso)',
  'Boucle du Mouhoun',
  'Cascades',
  'Centre-Est',
  'Centre-Nord',
  'Centre-Ouest',
  'Centre-Sud',
  'Est',
  'Nord',
  'Plateau-Central',
  'Sahel',
  'Sud-Ouest',
  'National (Multi-régions)'
];

const ProjectEditorForm = forwardRef<ProjectEditorFormHandle, ProjectEditorFormProps>(
  ({ initialData, isEditing, onSave, onToggleMicum, isMicumOpen }, ref) => {
    const defaultData: Partial<Project> = {
      title: '',
      titleEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      sector: 'Énergie',
      region: 'Centre (Ouagadougou)',
      category: 'chantiers',
      currentStatus: 'annonce',
      amount: '',
      capacity: '',
      image: '',
      actors: [],
      ...initialData,
    };

    const [formData, setFormData] = useState<Partial<Project>>(defaultData);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [isSaving, setIsSaving] = useState(false);

    useImperativeHandle(ref, () => ({
      insertToBody: (text: string) => {
        setFormData(prev => ({
          ...prev,
          description: (prev.description || '') + '\n\n' + text
        }));
      },
      replaceField: (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      },
      getFormData: () => ({ formData })
    }));

    const handleTitleChange = (val: string) => {
      setFormData(prev => ({
        ...prev,
        title: val,
        slug: prev.slug && isEditing ? prev.slug : val.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      }));
    };

    const handleTranslated = (translated: Record<string, string>) => {
      setFormData(prev => ({
        ...prev,
        titleEn: translated.title || prev.titleEn,
        descriptionEn: translated.description || prev.descriptionEn,
      }));
    };

    const handleAddActor = () => {
      setFormData(prev => ({
        ...prev,
        actors: [...(prev.actors || []), { name: '', role: '' }]
      }));
    };

    const handleRemoveActor = (index: number) => {
      setFormData(prev => ({
        ...prev,
        actors: (prev.actors || []).filter((_, i) => i !== index)
      }));
    };

    const handleActorChange = (index: number, field: 'name' | 'role', value: string) => {
      setFormData(prev => ({
        ...prev,
        actors: (prev.actors || []).map((a, i) => i === index ? { ...a, [field]: value } : a)
      }));
    };

    const handleSaveClick = async () => {
      setIsSaving(true);
      try {
        await onSave(formData);
      } finally {
        setIsSaving(false);
      }
    };

    const labelClass = "text-[11px] font-mono uppercase text-[#736c62] font-semibold mb-1 block";
    const inputClass = "w-full border border-[#e6dfd5] bg-white px-3 py-2 text-sm font-mono text-[#141414] focus:outline-none focus:border-[#087443] transition-colors rounded";
    const selectClass = "w-full border border-[#e6dfd5] bg-white px-3 py-2 text-sm font-mono text-[#141414] focus:outline-none focus:border-[#087443] transition-colors rounded cursor-pointer";

    return (
      <div className="flex flex-col h-full">
        {/* Command Bar */}
        <div className="shrink-0 sticky top-0 z-10 bg-white border-b border-[#e6dfd5] px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/admin/projets"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#736c62] hover:text-[#141414] transition-colors shrink-0"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Retour</span>
              </Link>
              <span className="text-[#e6dfd5]">/</span>
              <span className="text-xs font-mono text-[#736c62] truncate">
                {isEditing ? (formData.title || 'Édition').substring(0, 40) : 'Nouveau chantier'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex border border-[#e6dfd5] rounded overflow-hidden">
                <button
                  onClick={() => setActiveTab('fr')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-bold cursor-pointer transition-colors ${activeTab === 'fr' ? 'bg-[#087443] text-white' : 'text-[#736c62] hover:bg-[#faf8f5]'}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-bold cursor-pointer transition-colors ${activeTab === 'en' ? 'bg-[#1e3a5f] text-white' : 'text-[#736c62] hover:bg-[#faf8f5]'}`}
                >
                  EN
                </button>
              </div>

              {onToggleMicum && (
                <button
                  onClick={onToggleMicum}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors border ${isMicumOpen ? 'bg-emerald-50 border-emerald-300 text-[#087443]' : 'border-[#e6dfd5] text-[#736c62] hover:text-[#087443] hover:border-emerald-300'}`}
                  title="Ouvrir/fermer Micum"
                >
                  <MicumIcon size={16} />
                  <span className="hidden sm:inline">Micum</span>
                </button>
              )}

              <button
                onClick={handleSaveClick}
                disabled={isSaving || !formData.title}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span className="hidden sm:inline">{isEditing ? 'Mettre à jour' : 'Créer'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {activeTab === 'fr' ? (
              <>
                {/* Title */}
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nom du chantier / projet..."
                  className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#141414] bg-transparent border-none outline-none placeholder:text-[#ccc] pb-2 border-b border-transparent focus:border-[#e6dfd5] transition-colors"
                />

                <div className="text-[11px] font-mono text-[#999]">
                  /{formData.slug || 'url-du-projet'}
                </div>

                {/* Sector & Region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Secteur</label>
                    <select value={formData.sector || ''} onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))} className={selectClass}>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}><MapPin size={10} className="inline mr-1" />Région</label>
                    <select value={formData.region || ''} onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))} className={selectClass}>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                {/* Amount & Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Montant / Budget</label>
                    <input type="text" value={formData.amount || ''} onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))} className={inputClass} placeholder="45 milliards FCFA" />
                  </div>
                  <div>
                    <label className={labelClass}>Capacité</label>
                    <input type="text" value={formData.capacity || ''} onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))} className={inputClass} placeholder="50 MWc" />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className={labelClass}>Statut actuel</label>
                  <select value={formData.currentStatus || 'annonce'} onChange={(e) => setFormData(prev => ({ ...prev, currentStatus: e.target.value as ProjectStatus }))} className={selectClass}>
                    {PROJECT_STATUS_ORDER.map(s => (
                      <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <ImageUploader
                  value={formData.image || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  label="Photo du chantier"
                />

                {/* Description */}
                <div>
                  <label className={labelClass}>Description / Note technique</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={8}
                    placeholder="Description détaillée du projet, contexte, enjeux..."
                    className={`${inputClass} font-serif resize-none`}
                  />
                </div>

                {/* Actors */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Acteurs du projet</label>
                    <button
                      onClick={handleAddActor}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#087443] hover:text-emerald-800 cursor-pointer"
                    >
                      <Plus size={12} />
                      Ajouter
                    </button>
                  </div>
                  {(formData.actors || []).length === 0 && (
                    <p className="text-[11px] font-mono text-[#999]">Aucun acteur ajouté.</p>
                  )}
                  <div className="space-y-2">
                    {(formData.actors || []).map((actor, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={actor.name}
                          onChange={(e) => handleActorChange(i, 'name', e.target.value)}
                          placeholder="Nom de l'acteur"
                          className={`flex-1 ${inputClass}`}
                        />
                        <input
                          type="text"
                          value={actor.role}
                          onChange={(e) => handleActorChange(i, 'role', e.target.value)}
                          placeholder="Rôle"
                          className={`flex-1 ${inputClass}`}
                        />
                        <button onClick={() => handleRemoveActor(i)} className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* English Tab */
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Languages size={16} className="text-[#1e3a5f]" />
                    <span className="text-sm font-mono font-bold text-[#1e3a5f]">Version anglaise</span>
                  </div>
                  <MicumTranslateButton
                    fieldsToTranslate={{
                      title: formData.title || '',
                      description: formData.description || '',
                    }}
                    onTranslated={handleTranslated}
                  />
                </div>

                <div>
                  <label className={labelClass}>Project Name (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="Project name in English..."
                    className={`${inputClass} font-serif text-lg`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Description (EN)</label>
                  <textarea
                    value={formData.descriptionEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    rows={8}
                    placeholder="Project description in English..."
                    className={`${inputClass} font-serif resize-none`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProjectEditorForm.displayName = 'ProjectEditorForm';
export default ProjectEditorForm;
