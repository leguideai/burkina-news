"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ArticleEditorForm, { ArticleEditorFormHandle } from '@/components/admin/ArticleEditorForm';
import MicumSidePanel from '@/components/admin/MicumSidePanel';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [isMicumOpen, setIsMicumOpen] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const editorRef = useRef<ArticleEditorFormHandle>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Impossible de charger les données.');
        const data = await res.json();
        const found = (data.articles || []).find((a: Article) => a.id === id);
        if (found) {
          setArticle(found);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        error('Erreur', err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (formData: Partial<Article>, tagsInput: string) => {
    if (!formData.title || !formData.category || !formData.body) {
      warning('Champs obligatoires', 'Veuillez remplir au minimum le titre, la rubrique et le corps.');
      return;
    }

    const payload: Article = {
      ...(formData as Article),
      id,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_article', payload })
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success('Article mis à jour', `"${payload.title}" a été enregistré.`);
      router.push('/admin/articles');
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message);
    }
  };

  const handleMicumInsertBody = (text: string) => {
    editorRef.current?.insertToBody(text);
  };

  const handleMicumReplaceField = (field: string, value: string) => {
    editorRef.current?.replaceField(field, value);
  };

  const handleMicumApplyAll = (data: any) => {
    if (data.title) editorRef.current?.replaceField('title', data.title);
    if (data.excerpt) editorRef.current?.replaceField('excerpt', data.excerpt);
    if (data.content || data.body) editorRef.current?.insertToBody(data.content || data.body);
    if (data.titleEn) editorRef.current?.replaceField('titleEn', data.titleEn);
    if (data.excerptEn) editorRef.current?.replaceField('excerptEn', data.excerptEn);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-3 text-[#736c62]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-mono">Chargement de l&apos;article...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <p className="text-sm font-mono text-[#736c62]">Article introuvable (ID: {id})</p>
        <Link href="/admin/articles" className="text-xs font-mono text-[#087443] hover:underline">
          ← Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 min-w-0">
        <ArticleEditorForm
          ref={editorRef}
          initialData={article!}
          isEditing={true}
          onSave={handleSave}
          onToggleMicum={() => setIsMicumOpen(!isMicumOpen)}
          isMicumOpen={isMicumOpen}
        />
      </div>
      <MicumSidePanel
        isOpen={isMicumOpen}
        onClose={() => setIsMicumOpen(false)}
        onOpen={() => setIsMicumOpen(true)}
        onToggle={() => setIsMicumOpen(!isMicumOpen)}
        mode="article"
        isEditing={true}
        currentData={article || undefined}
        onInsertToBody={handleMicumInsertBody}
        onReplaceField={handleMicumReplaceField}
        onApplyAll={handleMicumApplyAll}
      />
    </div>
  );
}
