/**
 * 🇧🇫 BURKINA NEWS — ADAPTATEURS DE DONNÉES UNIVERSELS
 * Conversion bidirectionnelle et sécurisée entre les DTOs du Backend Go/PostgreSQL
 * et les modèles métier consommés par le site public (FR & EN).
 */

import { ArticleDTO, CategoryDTO, SubCategoryDTO } from './types';
import { Article, Category, SubCategory, CategoryCode, ContentType } from '@/data/types';

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
