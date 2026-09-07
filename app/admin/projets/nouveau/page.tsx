"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ProjectEditorForm, { ProjectEditorFormHandle } from '@/components/admin/ProjectEditorForm';
import MicumSidePanel from '@/components/admin/MicumSidePanel';

export default function NewProjectPage() {
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [isMicumOpen, setIsMicumOpen] = useState(false);
  const editorRef = useRef<ProjectEditorFormHandle>(null);

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

  const handleMicumInsertBody = (text: string) => {
    editorRef.current?.insertToBody(text);
  };

  const handleMicumReplaceField = (field: string, value: string) => {
    editorRef.current?.replaceField(field, value);
  };

  const handleMicumApplyAll = (data: any) => {
    if (data.title || data.name) editorRef.current?.replaceField('title', data.title || data.name);
    if (data.description) editorRef.current?.insertToBody(data.description);
    if (data.sector) editorRef.current?.replaceField('sector', data.sector);
    if (data.region) editorRef.current?.replaceField('region', data.region);
    if (data.amount || data.currentBudget) editorRef.current?.replaceField('amount', data.amount || data.currentBudget);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 min-w-0">
        <ProjectEditorForm
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
        mode="project"
        isEditing={false}
        onInsertToBody={handleMicumInsertBody}
        onReplaceField={handleMicumReplaceField}
        onApplyAll={handleMicumApplyAll}
      />
    </div>
  );
}
