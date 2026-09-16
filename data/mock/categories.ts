import type { Category, Article } from '../types'
import { getSubCategoriesByCategory } from './referentiel'

export const categories: Category[] = [
  {
    code: 'economie',
    nameFr: 'Économie',
    nameEn: 'Economy',
    descriptionFr: 'Finances publiques, mines, industrie, commerce et développement économique du Burkina Faso.',
    descriptionEn: 'Public finance, mining, industry, trade and economic development in Burkina Faso.',
    slug: 'economie',
    color: '#087443',
    subCategories: getSubCategoriesByCategory('economie'),
  },
  {
    code: 'securite',
    nameFr: 'Sécurité',
    nameEn: 'Security',
    descriptionFr: 'Défense nationale, AES, diplomatie, géopolitique et relations internationales.',
    descriptionEn: 'National defense, AES, diplomacy, geopolitics and international relations.',
    slug: 'securite',
    color: '#1E3A5F',
    subCategories: getSubCategoriesByCategory('securite'),
  },
  {
    code: 'chantiers',
    nameFr: 'Chantiers',
    nameEn: 'Infrastructure',
    descriptionFr: 'Énergie, routes, eau, rail, télécommunications et grands projets d\'infrastructure.',
    descriptionEn: 'Energy, roads, water, rail, telecoms and major infrastructure projects.',
    slug: 'chantiers',
    color: '#D97706',
    subCategories: getSubCategoriesByCategory('chantiers'),
  },
  {
    code: 'agriculture',
    nameFr: 'Agriculture',
    nameEn: 'Agriculture',
    descriptionFr: 'Production agricole, élevage, foncier, agro-industrie et sécurité alimentaire.',
    descriptionEn: 'Crop production, livestock, land, agro-industry and food security.',
    slug: 'agriculture',
    color: '#15803D',
    subCategories: getSubCategoriesByCategory('agriculture'),
  },
  {
    code: 'societe',
    nameFr: 'Société',
    nameEn: 'Society',
    descriptionFr: 'Santé, éducation, emploi, gouvernance, libertés et vie sociale.',
    descriptionEn: 'Health, education, employment, governance, freedoms and social life.',
    slug: 'societe',
    color: '#7C3AED',
    subCategories: getSubCategoriesByCategory('societe'),
  },
  {
    code: 'histoire',
    nameFr: 'Histoire',
    nameEn: 'History',
    descriptionFr: 'Mémoire, archives, Sankara, comparaisons historiques et trajectoires de la nation.',
    descriptionEn: 'Memory, archives, Sankara, historical comparisons and national trajectories.',
    slug: 'histoire',
    color: '#BE185D',
    subCategories: getSubCategoriesByCategory('histoire'),
  },
]

export const getCategoryByCode = (code: string): Category | undefined =>
  categories.find(c => c.code === code || (code === 'idees' && c.code === 'histoire'))

/**
 * Règle d'activation des sous-rubriques (Brief Samba v5, section 4.2) :
 * - Masquée tant qu'elle contient moins de 2 contenus publiés
 * - Automatiquement visible dès le 2e contenu publié
 * - Reste visible une fois activée (pas de masquage rétroactif)
 */
export function getActiveSubCategories(categoryCode: string, articles: Article[]) {
  const cat = getCategoryByCode(categoryCode)
  if (!cat || !cat.subCategories) return []

  return cat.subCategories.map(sub => {
    const publishedCount = articles.filter(a => 
      (a.category === cat.code || (cat.code === 'histoire' && a.category === 'idees')) &&
      a.subCategory === sub.code
    ).length

    // Règle des 2 contenus ou pré-activé par défaut si démo
    const isVisible = publishedCount >= 2

    return {
      ...sub,
      publishedCount,
      isActivated: isVisible,
    }
  })
}

