import type { Category } from '../types'

export const categories: Category[] = [
  {
    code: 'economie',
    nameFr: 'Économie',
    nameEn: 'Economy',
    descriptionFr: 'Finances publiques, mines, industrie, commerce et développement économique du Burkina Faso.',
    descriptionEn: 'Public finance, mining, industry, trade and economic development in Burkina Faso.',
    slug: 'economie',
    color: '#087443',
  },
  {
    code: 'securite',
    nameFr: 'Sécurité',
    nameEn: 'Security',
    descriptionFr: 'Défense nationale, AES, diplomatie, géopolitique et relations internationales.',
    descriptionEn: 'National defense, AES, diplomacy, geopolitics and international relations.',
    slug: 'securite',
    color: '#1E3A5F',
  },
  {
    code: 'chantiers',
    nameFr: 'Chantiers',
    nameEn: 'Infrastructure',
    descriptionFr: 'Énergie, routes, eau, rail, télécommunications et grands projets d\'infrastructure.',
    descriptionEn: 'Energy, roads, water, rail, telecoms and major infrastructure projects.',
    slug: 'chantiers',
    color: '#D97706',
  },
  {
    code: 'agriculture',
    nameFr: 'Agriculture',
    nameEn: 'Agriculture',
    descriptionFr: 'Production agricole, élevage, foncier, agro-industrie et sécurité alimentaire.',
    descriptionEn: 'Crop production, livestock, land, agro-industry and food security.',
    slug: 'agriculture',
    color: '#15803D',
  },
  {
    code: 'societe',
    nameFr: 'Société',
    nameEn: 'Society',
    descriptionFr: 'Santé, éducation, emploi, gouvernance, libertés et vie sociale.',
    descriptionEn: 'Health, education, employment, governance, freedoms and social life.',
    slug: 'societe',
    color: '#7C3AED',
  },
  {
    code: 'idees',
    nameFr: 'Idées',
    nameEn: 'Ideas',
    descriptionFr: 'Sankara, comparaisons internationales, trajectoires de développement et tribunes.',
    descriptionEn: 'Sankara, international comparisons, development trajectories and opinion.',
    slug: 'idees',
    color: '#BE185D',
  },
]

export const getCategoryByCode = (code: string): Category | undefined =>
  categories.find(c => c.code === code)
