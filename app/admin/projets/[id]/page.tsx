"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { useToast } from '@/components/admin/Toast';
import ProjectEditorForm from '@/components/admin/ProjectEditorForm';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { success, error, warning } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    <div className="h-[calc(100vh-4rem)]">
      <ProjectEditorForm
        initialData={project!}
        isEditing={true}
        onSave={handleSave}
      />
    </div>
  );
}

