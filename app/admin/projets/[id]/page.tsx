"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ProjectEditorForm, { ProjectEditorFormHandle } from '@/components/admin/ProjectEditorForm';
import MicumSidePanel from '@/components/admin/MicumSidePanel';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [isMicumOpen, setIsMicumOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const editorRef = useRef<ProjectEditorFormHandle>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Impossible de charger les données.');
        const data = await res.json();
        const found = (data.projects || []).find((p: Project) => p.id === id);
        if (found) {
          setProject(found);
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

  const handleSave = async (formData: Partial<Project>) => {
    if (!formData.title) {
      warning('Champ obligatoire', 'Veuillez saisir au minimum le nom du chantier.');
      return;
    }

    const payload: Project = {
      ...(formData as Project),
      id,
      lastVerifiedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_project', payload })
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || 'Erreur inconnue.');

      success('Chantier mis à jour', `"${payload.title}" a été enregistré.`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-3 text-[#736c62]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-mono">Chargement du chantier...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <p className="text-sm font-mono text-[#736c62]">Chantier introuvable (ID: {id})</p>
        <Link href="/admin/projets" className="text-xs font-mono text-[#087443] hover:underline">
          ← Retour aux chantiers
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 min-w-0">
        <ProjectEditorForm
          ref={editorRef}
          initialData={project!}
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
        mode="project"
        isEditing={true}
        currentData={project || undefined}
        onInsertToBody={handleMicumInsertBody}
        onReplaceField={handleMicumReplaceField}
        onApplyAll={handleMicumApplyAll}
      />
    </div>
  );
}
