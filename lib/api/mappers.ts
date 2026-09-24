/**
 * 🇧🇫 BURKINA NEWS — ADAPTATEURS DE DONNÉES UNIVERSELS
 * Conversion bidirectionnelle et sécurisée entre les DTOs du Backend Go/PostgreSQL
 * et les modèles métier consommés par le site public (FR & EN).
 */

import { ArticleDTO, CategoryDTO, SubCategoryDTO, ProjectDTO, IndicatorDTO } from './types';
import { Article, Category, SubCategory, CategoryCode, ContentType, Project, Indicator, ProjectStatus } from '@/data/types';

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
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    titleEn: dto.title_en || dto.title,
    slug: dto.slug,
    description: dto.description,
    descriptionEn: dto.description_en || dto.description,
    category: (dto.category || 'chantiers') as CategoryCode,
    region: dto.region,
    province: dto.province || '',
    sector: dto.sector,
    currentStatus: (dto.current_status || 'en-construction') as ProjectStatus,
    statusHistory: (dto.status_history || []).map((h) => ({
      status: h.status as ProjectStatus,
      date: h.date,
      source: h.source,
      note: h.note,
      noteEn: h.note_en,
    })),
    actors: (dto.actors || []).map((a) => ({
      role: a.role,
      roleEn: a.role_en,
      name: a.name,
    })),
    amount: dto.amount || '',
    currency: dto.currency || 'FCFA',
    capacity: dto.capacity || '',
    lastVerifiedAt: dto.last_verified_at || dto.updated_at || dto.created_at || '',
    sources: (dto.sources || []).map((s) => ({
      title: s.title,
      url: s.url,
      date: s.date,
      institution: s.institution,
    })),
    linkedArticleIds: dto.linked_article_ids || [],
    linkedIndicatorCodes: dto.linked_indicator_codes || [],
    pndProgram: dto.pnd_program || '',
    reliability: (dto.reliability as any) || 'A',
    image: dto.image || dto.featured_image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85',
  };
}

/**
 * Convertit un IndicatorDTO de l'API Go vers le format Indicator exploité par l'espace visiteur.
 */
export function mapIndicatorDTOToIndicator(dto: IndicatorDTO): Indicator {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    nameEn: dto.name_en || dto.name,
    definition: dto.definition,
    definitionEn: dto.definition_en || dto.definition,
    unit: dto.unit,
    baselineValue: dto.baseline_value,
    baselineYear: dto.baseline_year,
    target2028: dto.target_2028 ?? undefined,
    target2030: dto.target_2030 ?? undefined,
    currentValue: dto.current_value,
    currentYear: dto.current_year,
    trend: (dto.trend || 'stable') as 'up' | 'down' | 'stable',
    source: dto.source,
    category: (dto.category || 'economie') as CategoryCode,
    program: dto.program || '',
    programEn: dto.program_en || '',
    pillar: dto.pillar || '',
    pillarEn: dto.pillar_en || '',
    image: dto.image || dto.featured_image || '',
    history: (dto.history || []).map((p) => ({
      year: p.year,
      value: p.value,
      source: p.source,
    })),
    linkedProjectSlugs: dto.linked_project_slugs || [],
  };
}

