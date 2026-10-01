/**
 * 🇧🇫 BURKINA NEWS — ADAPTATEURS DE DONNÉES UNIVERSELS
 * Conversion bidirectionnelle et sécurisée entre les DTOs du Backend Go/PostgreSQL
 * et les modèles métier consommés par le site public (FR & EN).
 */

import { ArticleDTO, CategoryDTO, SubCategoryDTO, ProjectDTO, IndicatorDTO, IssueDTO, CorrectionDTO, SubmissionDTO, BriefDTO, BriefFactDTO } from './types';
import { Article, Category, SubCategory, CategoryCode, ContentType, Project, Indicator, ProjectStatus, Issue, Correction, Brief, BriefFact } from '@/data/types';

/**
 * Convertit un ArticleDTO de l'API Go vers le format Article exploité par l'espace visiteur.
 */
export function mapArticleDTOToArticle(dto: ArticleDTO): Article {
  const image = dto.image || dto.featured_image || '/images/lead.jpeg';
  const authorName = dto.author?.name || 'La Rédaction';
  const readTimeStr = typeof dto.read_time === 'number' ? `${dto.read_time} min` : (dto.read_time || '5 min');

  return {
    id: dto.id,
    type: (dto.type || 'decryptage') as ContentType,
    status: (dto.status || 'published') as any,
    title: dto.title_fr,
    titleEn: dto.title_en || dto.title_fr,
    slug: dto.slug,
    excerpt: dto.excerpt_fr,
    excerptEn: dto.excerpt_en || dto.excerpt_fr,
    body: dto.body_fr,
    bodyEn: dto.body_en || dto.body_fr,
    category: (dto.category_code || 'economie') as CategoryCode,
    subCategory: dto.sub_category_code || '',
    image: image,
    imageUrl: image,
    author: authorName,
    publishedAt: dto.published_at || dto.created_at || new Date().toISOString(),
    readTime: readTimeStr,
    sourceCount: dto.source_count !== undefined ? dto.source_count : (dto.sources ? dto.sources.length : 0),
    confidence: (dto.confidence_level as any) || 'high',
    tags: dto.tags || [],
    issueId: dto.issue_id || 'issue-03',
    isExclusive: dto.is_exclusive || false,
    country: dto.country || 'Burkina Faso',
    region: dto.region,
    province: dto.province,
    commune: dto.commune,
    sector: dto.sector,
    bailleur: dto.bailleur,
  };
}

/**
 * Convertit un SubCategoryDTO de l'API Go vers le format SubCategory de l'espace visiteur.
 */
export function mapSubCategoryDTOToSubCategory(dto: SubCategoryDTO): SubCategory {
  return {
    code: dto.code,
    nameFr: dto.name_fr,
    nameEn: dto.name_en || dto.name_fr,
    categoryCode: dto.category_code as CategoryCode,
    descriptionFr: dto.description_fr || '',
    descriptionEn: dto.description_en || dto.description_fr || '',
  };
}

/**
 * Convertit un CategoryDTO de l'API Go vers le format Category de l'espace visiteur.
 */
export function mapCategoryDTOToCategory(dto: CategoryDTO): Category {
  return {
    code: dto.code as CategoryCode,
    nameFr: dto.name_fr,
    nameEn: dto.name_en || dto.name_fr,
    descriptionFr: dto.description_fr || '',
    descriptionEn: dto.description_en || dto.description_fr || '',
    slug: dto.slug || dto.code,
    color: dto.color || '#087443',
    icon: dto.icon || 'folder',
    order: dto.order_num || 0,
    subCategories: (dto.sub_categories || []).map(mapSubCategoryDTOToSubCategory),
  };
}

/**
 * Convertit un ProjectDTO de l'API Go vers le format Project exploité par l'espace visiteur.
 */
export function mapProjectDTOToProject(dto: ProjectDTO): Project {
  const d = dto as any;
  const currentStatus = (d.currentStatus || d.current_status || 'en-construction') as ProjectStatus;
  const rawHistory = d.statusHistory || d.status_history || [];
  const rawActors = d.actors || [];
  const rawSources = d.sources || [];
  const linkedArticleIds = d.linkedArticleIds || d.linked_article_ids || [];
  const linkedIndicatorCodes = d.linkedIndicatorCodes || d.linked_indicator_codes || [];
  const pndProgram = d.pndProgram || d.pnd_program || '';
  const lastVerifiedAt = d.lastVerifiedAt || d.last_verified_at || d.updated_at || d.created_at || '';
  const titleEn = d.titleEn || d.title_en || d.title;
  const descriptionEn = d.descriptionEn || d.description_en || d.description;
  const image = d.image || d.featured_image || d.featuredImage || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85';

  return {
    id: d.id,
    code: d.code,
    title: d.title,
    titleEn,
    slug: d.slug,
    description: d.description,
    descriptionEn,
    category: (d.category || 'chantiers') as CategoryCode,
    country: d.country || 'Burkina Faso',
    region: d.region,
    province: d.province || '',
    commune: d.commune || '',
    sector: d.sector,
    bailleur: d.bailleur || (rawActors.find((a: any) => a.role?.toLowerCase().includes('bailleur'))?.name) || '',
    currentStatus,
    statusHistory: rawHistory.map((h: any) => ({
      status: (h.status || 'annonce') as ProjectStatus,
      date: h.date || '',
      source: h.source || '',
      note: h.note || '',
      noteEn: h.noteEn || h.note_en || '',
    })),
    actors: rawActors.map((a: any) => ({
      role: a.role || '',
      roleEn: a.roleEn || a.role_en || a.role || '',
      name: a.name || '',
    })),
    amount: d.amount || '',
    currency: d.currency || 'FCFA',
    capacity: d.capacity || '',
    lastVerifiedAt,
    sources: rawSources.map((s: any) => ({
      title: s.title || '',
      url: s.url || '',
      date: s.date || '',
      institution: s.institution || '',
    })),
    linkedArticleIds,
    linkedIndicatorCodes,
    pndProgram,
    reliability: (d.reliability as any) || 'A',
    image,
  };
}

/**
 * Convertit un IndicatorDTO de l'API Go vers le format Indicator exploité par l'espace visiteur.
 */
export function mapIndicatorDTOToIndicator(dto: IndicatorDTO): Indicator {
  const d = dto as any;
  const baselineValue = d.baseline_value !== undefined && d.baseline_value !== null
    ? Number(d.baseline_value)
    : (d.baselineValue !== undefined && d.baselineValue !== null ? Number(d.baselineValue) : 0);
  const baselineYear = d.baseline_year !== undefined && d.baseline_year !== null
    ? Number(d.baseline_year)
    : (d.baselineYear !== undefined && d.baselineYear !== null ? Number(d.baselineYear) : 2020);
  const currentValue = d.current_value !== undefined && d.current_value !== null
    ? Number(d.current_value)
    : (d.currentValue !== undefined && d.currentValue !== null ? Number(d.currentValue) : 0);
  const currentYear = d.current_year !== undefined && d.current_year !== null
    ? Number(d.current_year)
    : (d.currentYear !== undefined && d.currentYear !== null ? Number(d.currentYear) : 2026);
  const target2028 = d.target_2028 !== undefined && d.target_2028 !== null
    ? Number(d.target_2028)
    : (d.target2028 !== undefined && d.target2028 !== null ? Number(d.target2028) : undefined);
  const target2030 = d.target_2030 !== undefined && d.target_2030 !== null
    ? Number(d.target_2030)
    : (d.target2030 !== undefined && d.target2030 !== null ? Number(d.target2030) : undefined);

  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    nameEn: dto.name_en || d.nameEn || dto.name,
    definition: dto.definition,
    definitionEn: dto.definition_en || d.definitionEn || dto.definition,
    unit: dto.unit || '',
    baselineValue,
    baselineYear,
    target2028,
    target2030,
    currentValue,
    currentYear,
    trend: (dto.trend || 'stable') as 'up' | 'down' | 'stable',
    source: dto.source || '',
    category: (dto.category || 'economie') as CategoryCode,
    program: dto.program || d.programEn || '',
    programEn: dto.program_en || d.programEn || '',
    pillar: dto.pillar || '',
    pillarEn: dto.pillar_en || d.pillarEn || '',
    image: dto.image || dto.featured_image || '',
    history: (dto.history || []).map((p) => ({
      year: p.year,
      value: p.value,
      source: p.source,
    })),
    linkedProjectSlugs: dto.linked_project_slugs || d.linkedProjectSlugs || [],
  };
}

/**
 * Convertit un IssueDTO de l'API Go vers le format Issue exploité par l'espace visiteur.
 */
export function mapIssueDTOToIssue(dto: IssueDTO): Issue {
  return {
    id: dto.id,
    number: dto.number,
    title: dto.title,
    titleEn: dto.title_en || dto.title,
    slug: dto.slug,
    coverImage: dto.cover_image || '/images/lead.jpeg',
    publicationDate: dto.publication_date,
    summary: dto.summary,
    summaryEn: dto.summary_en || dto.summary,
    articleCount: dto.article_count || (dto.article_ids ? dto.article_ids.length : 0),
    articleIds: dto.article_ids || [],
    pdfUrl: dto.pdf_url || '',
  };
}

/**
 * Convertit un CorrectionDTO de l'API Go vers le format Correction exploité par le registre public.
 */
export function mapCorrectionDTOToCorrection(dto: CorrectionDTO): Correction {
  return {
    id: dto.id,
    date: dto.date,
    articleTitle: dto.article_title,
    articleSlug: dto.article_slug || '',
    previousText: dto.previous_text,
    correctedText: dto.corrected_text,
    reason: dto.reason,
    validatedBy: dto.validated_by || 'Alfred Ouédraogo (Directeur éditorial)',
  };
}

export function mapBriefFactDTOToBriefFact(dto: BriefFactDTO): BriefFact {
  return {
    time: dto.time,
    text: dto.text_fr,
    textEn: dto.text_en || dto.text_fr,
    source: dto.source,
    sourceUrl: dto.source_url,
    category: (dto.category_code || 'economie') as CategoryCode,
    whyWatch: dto.why_watch_fr,
    whyWatchEn: dto.why_watch_en,
    image: dto.image || '',
  };
}

export function mapBriefDTOToBrief(dto: BriefDTO): Brief {
  return {
    id: dto.id,
    title: dto.title,
    titleEn: dto.title_en || dto.title,
    slug: dto.slug,
    date: dto.date,
    weekNumber: dto.week_number,
    image: dto.image || '',
    summary: dto.summary,
    summaryEn: dto.summary_en,
    facts: (dto.facts || []).map((f) => mapBriefFactDTOToBriefFact(f)),
  };
}


