"use client";

import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Tag,
  Clock,
  FileText,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { Article, CategoryCode, ContentType } from '@/data/types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';
import MicumIcon from '@/components/admin/MicumIcon';

export interface ArticleEditorFormHandle {
  insertToBody: (text: string) => void;
  replaceField: (field: string, value: string) => void;
  getFormData: () => { formData: Partial<Article>; tagsInput: string };
}

interface ArticleEditorFormProps {
  initialData?: Partial<Article>;
  isEditing: boolean;
  onSave: (data: Partial<Article>, tagsInput: string) => Promise<void>;
  onToggleMicum?: () => void;
  isMicumOpen?: boolean;
}

const CATEGORIES: { value: CategoryCode; label: string }[] = [
  { value: 'economie', label: 'Économie' },
  { value: 'securite', label: 'Sécurité' },
  { value: 'chantiers', label: 'Chantiers' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'societe', label: 'Société' },
  { value: 'histoire', label: 'Histoire' },
];

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'decryptage', label: 'Décryptage' },
  { value: 'analyse', label: 'Analyse' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'vrai-ou-faux', label: 'Vrai ou Faux' },
  { value: 'edito', label: 'Édito' },
  { value: 'le-chiffre', label: 'Le Chiffre' },
  { value: 'trois-questions', label: '3 Questions' },
];

const CONFIDENCE_LEVELS = [
  { value: 'high', label: 'Haute' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'low', label: 'Basse' },
];

const ArticleEditorForm = forwardRef<ArticleEditorFormHandle, ArticleEditorFormProps>(
  ({ initialData, isEditing, onSave, onToggleMicum, isMicumOpen }, ref) => {
    const defaultData: Partial<Article> = {
      title: '',
      titleEn: '',
      slug: '',
      excerpt: '',
      excerptEn: '',
      body: '',
      bodyEn: '',
      category: 'economie',
      type: 'decryptage',
      author: 'La Rédaction',
      readTime: '7 min',
      sourceCount: 5,
      confidence: 'high',
      image: '',
      tags: ['Burkina Faso', 'Enquête'],
      issueId: 'issue-03',
      ...initialData,
    };

    const [formData, setFormData] = useState<Partial<Article>>(defaultData);
    const [tagsInput, setTagsInput] = useState(
      (initialData?.tags || defaultData.tags || []).join(', ')
    );
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [isSaving, setIsSaving] = useState(false);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      insertToBody: (text: string) => {
        setFormData(prev => ({
          ...prev,
          body: (prev.body || '') + '\n\n' + text
        }));
      },
      replaceField: (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      },
      getFormData: () => ({ formData, tagsInput })
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
        excerptEn: translated.excerpt || prev.excerptEn,
        bodyEn: translated.body || prev.bodyEn,
      }));
    };

    const handleSaveClick = async () => {
      setIsSaving(true);
      try {
        await onSave(formData, tagsInput);
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
            {/* Left: Back + Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/admin/articles"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#736c62] hover:text-[#141414] transition-colors shrink-0"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Retour</span>
              </Link>
              <span className="text-[#e6dfd5]">/</span>
              <span className="text-xs font-mono text-[#736c62] truncate">
                {isEditing ? (formData.title || 'Édition').substring(0, 40) : 'Nouvelle enquête'}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* FR/EN Tabs */}
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

              {/* Micum Toggle */}
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

              {/* Save */}
              <button
                onClick={handleSaveClick}
                disabled={isSaving || !formData.title || !formData.body}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span className="hidden sm:inline">{isEditing ? 'Mettre à jour' : 'Publier'}</span>
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
                  placeholder="Titre de l'enquête..."
                  className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#141414] bg-transparent border-none outline-none placeholder:text-[#ccc] pb-2 border-b border-transparent focus:border-[#e6dfd5] transition-colors"
                />

                {/* Slug */}
                <div className="text-[11px] font-mono text-[#999]">
                  /{formData.slug || 'url-de-article'}
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Rubrique *</label>
                    <select value={formData.category || 'economie'} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CategoryCode }))} className={selectClass}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Format</label>
                    <select value={formData.type || 'decryptage'} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentType }))} className={selectClass}>
                      {CONTENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}><Clock size={10} className="inline mr-1" />Lecture</label>
                    <input type="text" value={formData.readTime || ''} onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))} className={inputClass} placeholder="7 min" />
                  </div>
                  <div>
                    <label className={labelClass}><FileText size={10} className="inline mr-1" />Sources</label>
                    <input type="number" min={0} value={formData.sourceCount || 0} onChange={(e) => setFormData(prev => ({ ...prev, sourceCount: parseInt(e.target.value) || 0 }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><ShieldCheck size={10} className="inline mr-1" />Confiance</label>
                    <select value={formData.confidence || 'high'} onChange={(e) => setFormData(prev => ({ ...prev, confidence: e.target.value as any }))} className={selectClass}>
                      {CONFIDENCE_LEVELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Cover Image */}
                <ImageUploader
                  value={formData.image || formData.imageUrl || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url, imageUrl: url }))}
                  label="Photo de couverture"
                />

                {/* Excerpt / Chapô */}
                <div>
                  <label className={labelClass}>Chapô / Accroche *</label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Résumé percutant de l'enquête..."
                    className={`${inputClass} font-serif resize-none`}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className={labelClass}>Corps de l&apos;enquête *</label>
                  <RichTextEditor
                    value={formData.body || ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, body: val }))}
                    placeholder="Rédigez le corps de l'enquête ici..."
                    minHeight="min-h-[400px]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className={labelClass}><Tag size={10} className="inline mr-1" />Tags</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Burkina Faso, Enquête, Énergie..."
                    className={inputClass}
                  />
                  <p className="text-[10px] font-mono text-[#999] mt-1">Séparez les tags par des virgules</p>
                </div>

                {/* Author */}
                <div>
                  <label className={labelClass}>Auteur</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className={inputClass}
                    placeholder="La Rédaction"
                  />
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
                      excerpt: formData.excerpt || '',
                      body: formData.body || ''
                    }}
                    onTranslated={handleTranslated}
                  />
                </div>

                <div>
                  <label className={labelClass}>Title (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="Article title in English..."
                    className={`${inputClass} font-serif text-lg`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Excerpt (EN)</label>
                  <textarea
                    value={formData.excerptEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                    rows={3}
                    placeholder="Article summary in English..."
                    className={`${inputClass} font-serif resize-none`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Body (EN)</label>
                  <RichTextEditor
                    value={formData.bodyEn || ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, bodyEn: val }))}
                    placeholder="Write the English article body here..."
                    label="BODY (EN)"
                    minHeight="min-h-[400px]"
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

ArticleEditorForm.displayName = 'ArticleEditorForm';
export default ArticleEditorForm;
