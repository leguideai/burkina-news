"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';
import { articlesApi } from '@/lib/api/articles';
import { CreateArticleInput } from '@/lib/api/types';
import { Loader2 } from 'lucide-react';

function NewArticleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { success, error, warning } = useToast();

  const handleSave = async (formData: any, tagsInput: string) => {
    if (!formData.title || !formData.category || !formData.body) {
      warning('Champs obligatoires', 'Veuillez renseigner au minimum le titre, la rubrique et le corps de l\'enquête.');
      return;
    }

    const payload: CreateArticleInput = {
      title_fr: formData.title,
      title_en: formData.titleEn || undefined,
      excerpt_fr: formData.excerpt || formData.title,
      excerpt_en: formData.excerptEn || undefined,
      body_fr: formData.body,
      body_en: formData.bodyEn || undefined,
      category_code: formData.category,
      sub_category_code: formData.subCategory || undefined,
      featured_image: formData.image || '/images/lead.jpeg',
      type: formData.type || 'decryptage',
      confidence_level: formData.confidence || 'high',
      status: formData.status || 'published',
      tags: tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean),
      sources: formData.sourceCount ? [
        {
          name: 'Sources documentaires primaires vérifiées par la rédaction',
          type: 'rapport_officiel',
          date: new Date().toISOString().split('T')[0],
        }
      ] : [],
    };

    try {
      const created = await articlesApi.createArticle(payload);
      success('Article publié', `"${created.title_fr}" a été enregistré avec succès.`);
      router.push('/admin/articles');
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message || 'Impossible d\'enregistrer l\'article.');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ArticleEditorForm
        initialData={categoryParam ? { category: categoryParam } : undefined}
        isEditing={false}
        onSave={handleSave}
      />
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 size={24} className="animate-spin text-[#736c62]" />
      </div>
    }>
      <NewArticleContent />
    </Suspense>
  );
}
