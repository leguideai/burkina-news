"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Article, CategoryCode } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';
import { Loader2 } from 'lucide-react';

function NewArticleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as CategoryCode | null;
  const { success, error, warning } = useToast();

  const handleSave = async (formData: Partial<Article>, tagsInput: string) => {
    if (!formData.title || !formData.category || !formData.body) {
      warning('Champs obligatoires', 'Veuillez remplir au minimum le titre, la rubrique et le corps de l\'article.');
      return;
    }

    const payload: Article = {
      ...(formData as Article),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_article', payload })
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success('Article publié', `"${payload.title}" a été enregistré avec succès.`);
      router.push('/admin/articles');
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message);
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

