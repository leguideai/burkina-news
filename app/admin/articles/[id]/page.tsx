"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';
import { articlesApi } from '@/lib/api/articles';
import { ArticleDTO, UpdateArticleInput } from '@/lib/api/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [article, setArticle] = useState<ArticleDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await articlesApi.adminGetArticle(id);
        if (isMounted) {
          if (data && data.id) {
            setArticle(data);
          } else {
            setNotFound(true);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          error('Erreur', err.message || 'Impossible de récupérer les données de l\'article.');
          setNotFound(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = async (formData: any, tagsInput: string) => {
    if (!formData.title || !formData.category || !formData.body) {
      warning('Champs obligatoires', 'Veuillez remplir au minimum le titre, la rubrique et le corps de l\'enquête.');
      return;
    }

    const payload: UpdateArticleInput = {
      title_fr: formData.title,
      title_en: formData.titleEn || undefined,
      excerpt_fr: formData.excerpt || formData.title,
      excerpt_en: formData.excerptEn || undefined,
      body_fr: formData.body,
      body_en: formData.bodyEn || undefined,
      category_code: formData.category,
      sub_category_code: formData.subCategory || undefined,
      featured_image: formData.image,
      type: formData.type,
      confidence_level: formData.confidence,
      tags: tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    try {
      const updated = await articlesApi.updateArticle(id, payload);
      success('Article mis à jour', `"${updated.title_fr}" a été enregistré avec succès.`);
      router.push('/admin/articles');
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message || 'Impossible de mettre à jour l\'article.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-3 text-[#736c62]">
          <Loader2 size={20} className="animate-spin text-[#087443]" />
          <span className="text-sm font-mono">Chargement de l&apos;enquête depuis la base...</span>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <p className="text-sm font-mono text-[#736c62]">Article introuvable en base (ID: {id})</p>
        <Link href="/admin/articles" className="text-xs font-mono text-[#087443] hover:underline font-bold">
          ← Retour au catalogue des articles
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ArticleEditorForm
        initialData={article}
        isEditing={true}
        onSave={handleSave}
      />
    </div>
  );
}
