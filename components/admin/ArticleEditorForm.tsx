"use client";

import React, { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
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
import { categoriesApi } from '@/lib/api/categories';
import { CategoryDTO, SubCategoryDTO } from '@/lib/api/types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import MicumTranslateButton from '@/components/admin/MicumTranslateButton';
import { useMicum } from '@/components/admin/MicumContext';

export interface ArticleEditorFormHandle {
  insertToBody: (text: string) => void;
  replaceField: (field: string, value: string) => void;
  getFormData: () => { formData: any; tagsInput: string };
}

interface ArticleEditorFormProps {
  initialData?: any;
  isEditing: boolean;
  onSave: (data: any, tagsInput: string) => Promise<void>;
}

const FALLBACK_CATEGORIES: { value: CategoryCode; label: string }[] = [
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
  { value: 'high', label: 'Haute (Niveau A)' },
  { value: 'medium', label: 'Moyenne (Niveau B)' },
  { value: 'low', label: 'Basse (Niveau C)' },
];

const ArticleEditorForm = forwardRef<ArticleEditorFormHandle, ArticleEditorFormProps>(
  ({ initialData, isEditing, onSave }, ref) => {
    // Categories loaded dynamically from Go API
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
      (async () => {
        try {
          const list = await categoriesApi.listCategories(true);
          if (isMounted && list && list.length > 0) {
            setCategories(list);
          }
        } catch {
          // Fallback handled smoothly
        } finally {
          if (isMounted) setCategoriesLoading(false);
        }
      })();
      return () => {
        isMounted = false;
      };
    }, []);

    // Normalize initialData whether it comes from ArticleDTO or legacy Article
    const normalizedInitial: Partial<Article> = useMemo(() => {
      if (!initialData) return {};
      return {
        id: initialData.id,
        title: initialData.title || initialData.title_fr || '',
        titleEn: initialData.titleEn || initialData.title_en || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || initialData.excerpt_fr || '',
        excerptEn: initialData.excerptEn || initialData.excerpt_en || '',
        body: initialData.body || initialData.body_fr || '',
        bodyEn: initialData.bodyEn || initialData.body_en || '',
        category: (initialData.category_code || initialData.category || 'economie') as CategoryCode,
        subCategory: initialData.sub_category_code || initialData.subCategory || '',
        type: (initialData.type || 'decryptage') as ContentType,
        author: initialData.author?.name || initialData.author || 'La Rédaction',
        readTime: initialData.read_time ? `${initialData.read_time} min` : (initialData.readTime || '5 min'),
        sourceCount: initialData.source_count !== undefined ? initialData.source_count : (initialData.sourceCount || 0),
        confidence: (initialData.confidence_level || initialData.confidence || 'high') as any,
        image: initialData.featured_image || initialData.image || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        issueId: initialData.issue_id || initialData.issueId || 'issue-03',
      };
    }, [initialData]);

    const defaultData: Partial<Article> = {
      title: '',
      titleEn: '',
      slug: '',
      excerpt: '',
      excerptEn: '',
      body: '',
      bodyEn: '',
      category: 'economie',
      subCategory: '',
      type: 'decryptage',
      author: 'La Rédaction',
      readTime: '5 min',
      sourceCount: 3,
      confidence: 'high',
      image: '',
      tags: ['Burkina Faso', 'Enquête'],
      issueId: 'issue-03',
      ...normalizedInitial,
    };

    const [formData, setFormData] = useState<Partial<Article>>(defaultData);
    const [tagsInput, setTagsInput] = useState(
      (normalizedInitial.tags || defaultData.tags || []).join(', ')
    );
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [isSaving, setIsSaving] = useState(false);

    // Sync if initialData changes after async load
    useEffect(() => {
      if (initialData) {
        setFormData(prev => ({
          ...prev,
          ...normalizedInitial,
        }));
        if (normalizedInitial.tags) {
          setTagsInput(normalizedInitial.tags.join(', '));
        }
      }
    }, [initialData, normalizedInitial]);

    // Compute available subcategories from dynamic categories or fallback
    const availableSubCategories: SubCategoryDTO[] = useMemo(() => {
      const selectedCatCode = formData.category || 'economie';
      const cat = categories.find(c => c.code === selectedCatCode || c.slug === selectedCatCode);
      return cat?.sub_categories || [];
    }, [categories, formData.category]);

    const { registerEditor, updateEditorData } = useMicum();

    // Register active form with MicumContext so floating assistant is 100% aware
    useEffect(() => {
      const unregister = registerEditor({
        sectionId: 'article',
        sectionTitle: isEditing ? `Édition : "${formData.title || 'Article'}"` : "Création d'Article",
        canInsert: true,
        currentData: formData,
        insertToBody: (text: string) => {
          setFormData(prev => ({
            ...prev,
            body: (prev.body || '') ? prev.body + '\n\n' + text : text
          }));
        },
        replaceField: (field: string, value: string) => {
          setFormData(prev => ({ ...prev, [field]: value }));
        },
        applyAll: (data: any) => {
          setFormData(prev => ({
            ...prev,
            title: data.title || prev.title,
            excerpt: data.excerpt || prev.excerpt,
            body: (data.content || data.body) ? ((prev.body || '') ? prev.body + '\n\n' + (data.content || data.body) : (data.content || data.body)) : prev.body,
            titleEn: data.titleEn || prev.titleEn,
            excerptEn: data.excerptEn || prev.excerptEn,
            bodyEn: (data.contentEn || data.bodyEn) || prev.bodyEn,
          }));
        }
      });
      return unregister;
    }, [registerEditor, isEditing, formData.title]);

    useEffect(() => {
      updateEditorData(formData);
    }, [formData, updateEditorData]);

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
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
                  type="button"
                  onClick={() => setActiveTab('fr')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-bold cursor-pointer transition-colors ${activeTab === 'fr' ? 'bg-[#087443] text-white' : 'text-[#736c62] hover:bg-[#faf8f5]'}`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-bold cursor-pointer transition-colors ${activeTab === 'en' ? 'bg-[#1e3a5f] text-white' : 'text-[#736c62] hover:bg-[#faf8f5]'}`}
                >
                  EN
                </button>
              </div>

              {/* Save */}
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isSaving || !formData.title || !formData.body}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#087443] text-white hover:bg-[#075f37] font-mono text-xs font-bold rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                <div>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Titre de l'enquête..."
                    className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#141414] bg-transparent border-none outline-none placeholder:text-[#bbb] pb-2 border-b border-transparent focus:border-[#e6dfd5] transition-colors"
                  />
                  {/* Slug */}
                  <div className="text-[11px] font-mono text-[#999] mt-1">
                    URL : /{formData.slug || 'slug-de-l-article'}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Rubrique *</label>
                    <select 
                      value={formData.category || 'economie'} 
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        category: e.target.value as CategoryCode,
                        subCategory: '' 
                      }))} 
                      className={selectClass}
                    >
                      {categories.length > 0 ? (
                        categories.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.name_fr}
                          </option>
                        ))
                      ) : (
                        FALLBACK_CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Sous-rubrique</label>
                    <select 
                      value={formData.subCategory || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))} 
                      className={selectClass}
                    >
                      <option value="">(Aucune)</option>
                      {availableSubCategories.map(sc => (
                        <option key={sc.code} value={sc.code}>
                          {sc.name_fr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Format</label>
                    <select 
                      value={formData.type || 'decryptage'} 
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentType }))} 
                      className={selectClass}
                    >
                      {CONTENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}><Clock size={10} className="inline mr-1" />Lecture</label>
                    <input 
                      type="text" 
                      value={formData.readTime || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))} 
                      className={inputClass} 
                      placeholder="5 min" 
                    />
                  </div>
                  <div>
                    <label className={labelClass}><FileText size={10} className="inline mr-1" />Sources</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={formData.sourceCount || 0} 
                      onChange={(e) => setFormData(prev => ({ ...prev, sourceCount: parseInt(e.target.value) || 0 }))} 
                      className={inputClass} 
                    />
                  </div>
                  <div>
                    <label className={labelClass}><ShieldCheck size={10} className="inline mr-1" />Confiance</label>
                    <select 
                      value={formData.confidence || 'high'} 
                      onChange={(e) => setFormData(prev => ({ ...prev, confidence: e.target.value as any }))} 
                      className={selectClass}
                    >
                      {CONFIDENCE_LEVELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Cover Image */}
                <ImageUploader
                  value={formData.image || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  label="Photo de couverture de l'enquête"
                  folder="content"
                  namingContext={{
                    type: 'editorial',
                    rubriqueOrCode: formData.category || 'ECONOMIE',
                    sujet: formData.slug || formData.title || 'article',
                    lang: activeTab === 'fr' ? 'FR' : 'EN',
                    statut: 'PUBLIE',
                  }}
                />

                {/* Excerpt / Chapô */}
                <div>
                  <label className={labelClass}>Chapô / Accroche Déontologique *</label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Résumé percutant posant les faits et l'enjeu d'investigation..."
                    className={`${inputClass} font-serif resize-none`}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className={labelClass}>Corps de l&apos;enquête *</label>
                  <RichTextEditor
                    value={formData.body || ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, body: val }))}
                    placeholder="Rédigez le corps de l'enquête ici (adossé aux preuves et sources primaires)..."
                    minHeight="min-h-[400px]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className={labelClass}><Tag size={10} className="inline mr-1" />Mots-clés & Tags</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Burkina Faso, Enquête, Économie, Souveraineté..."
                    className={inputClass}
                  />
                  <p className="text-[10px] font-mono text-[#736c62] mt-1">Séparez les tags par des virgules</p>
                </div>
              </>
            ) : (
              /* English Tab */
              <>
                <div className="flex items-center justify-between mb-4 bg-slate-50 border border-slate-200 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <Languages size={16} className="text-[#1e3a5f]" />
                    <span className="text-xs font-mono font-bold text-[#1e3a5f]">Traduction & Bilinguisme International</span>
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
