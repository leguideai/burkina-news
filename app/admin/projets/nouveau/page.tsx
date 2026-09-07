"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ProjectEditorForm from '@/components/admin/ProjectEditorForm';

export default function NewProjectPage() {
  const router = useRouter();
  const { success, error, warning } = useToast();

  const handleSave = async (formData: Partial<Project>) => {
    if (!formData.title) {
      warning('Champ obligatoire', 'Veuillez saisir au minimum le nom du chantier.');
      return;
    }

    const payload: Project = {
      ...(formData as Project),
      statusHistory: formData.statusHistory || [],
      sources: formData.sources || [],
      linkedArticleIds: formData.linkedArticleIds || [],
      lastVerifiedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_project', payload })
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success('Chantier créé', `"${payload.title}" a été enregistré.`);
      router.push('/admin/projets');
    } catch (err: any) {
      error('Échec de la sauvegarde', err.message);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ProjectEditorForm
        isEditing={false}
        onSave={handleSave}
      />
    </div>
  );
}

