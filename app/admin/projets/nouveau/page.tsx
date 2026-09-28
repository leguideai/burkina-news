"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/data/types';
import { trackerApi } from '@/lib/api/tracker';
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

    try {
      await trackerApi.adminCreateProject({
        title: formData.title || '',
        title_en: formData.titleEn,
        description: formData.description || '',
        description_en: formData.descriptionEn,
        category: formData.category || 'chantiers',
        region: formData.region || 'Centre (Ouagadougou)',
        province: formData.province,
        sector: formData.sector || 'Énergie',
        current_status: (formData.currentStatus || 'annonce') as any,
        pnd_program: formData.pndProgram,
        reliability: formData.reliability || 'A',
        amount: formData.amount,
        currency: formData.currency || 'FCFA',
        capacity: formData.capacity,
        image: formData.image,
        linked_indicator_codes: formData.linkedIndicatorCodes,
        linked_article_ids: formData.linkedArticleIds,
        actors: (formData.actors || []).map((a) => ({ role: a.role, role_en: a.roleEn, name: a.name })),
        sources: (formData.sources || []).map((s) => ({ title: s.title, url: s.url, date: s.date, institution: s.institution })),
        initial_source: formData.sources?.[0]?.title || 'Enregistrement initial Desk Tracker',
        initial_note: 'Création initiale du chantier',
      });

      success('Chantier créé', `"${formData.title}" a été enregistré.`);
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

