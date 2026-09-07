"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ArticleEditorForm, { ArticleEditorFormHandle } from '@/components/admin/ArticleEditorForm';
import MicumSidePanel from '@/components/admin/MicumSidePanel';

export default function NewArticlePage() {
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [isMicumOpen, setIsMicumOpen] = useState(false);
  const editorRef = useRef<ArticleEditorFormHandle>(null);

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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 min-w-0">
        <ArticleEditorForm
          ref={editorRef}
          isEditing={false}
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
        isEditing={false}
        onInsertToBody={handleMicumInsertBody}
        onReplaceField={handleMicumReplaceField}
        onApplyAll={handleMicumApplyAll}
      />
    </div>
  );
}
