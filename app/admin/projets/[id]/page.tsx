"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { trackerApi } from '@/lib/api/tracker';
import { mapProjectDTOToProject } from '@/lib/api/mappers';
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
        const { projects: dtos } = await trackerApi.listProjects({ limit: 100 });
        const all = dtos.map(mapProjectDTOToProject);
        const found = all.find((p: Project) => p.id === id || p.slug === id);
        if (found) {
          setProject(found);
        } else {
          const fallback = await fetch('/api/admin/data');
          if (fallback.ok) {
            const data = await fallback.json();
            const f = (data.projects || []).find((p: Project) => p.id === id || p.slug === id);
            if (f) setProject(f);
            else setNotFound(true);
          } else {
            setNotFound(true);
          }
        }
      } catch (err: any) {
        try {
          const fallback = await fetch('/api/admin/data');
          if (fallback.ok) {
            const data = await fallback.json();
            const f = (data.projects || []).find((p: Project) => p.id === id || p.slug === id);
            if (f) setProject(f);
            else setNotFound(true);
          } else {
            setNotFound(true);
          }
        } catch {
          error('Erreur', err.message);
          setNotFound(true);
        }
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

    try {
      await trackerApi.adminUpdateProject(id, {
        title: formData.title,
        title_en: formData.titleEn,
        description: formData.description,
        description_en: formData.descriptionEn,
        category: formData.category,
        region: formData.region,
        province: formData.province,
        sector: formData.sector,
        pnd_program: formData.pndProgram,
        reliability: formData.reliability,
        amount: formData.amount,
        currency: formData.currency,
        capacity: formData.capacity,
        image: formData.image,
        linked_indicator_codes: formData.linkedIndicatorCodes,
        linked_article_ids: formData.linkedArticleIds,
        actors: (formData.actors || []).map((a) => ({ role: a.role, role_en: a.roleEn, name: a.name })),
        sources: (formData.sources || []).map((s) => ({ title: s.title, url: s.url, date: s.date, institution: s.institution })),
      });

      success('Chantier mis à jour', `"${formData.title}" a été enregistré.`);
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

