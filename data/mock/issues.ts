import type { Issue } from '../types'

export const issues: Issue[] = [
  {
    id: 'issue-03',
    number: 3,
    title: 'Le Burkina produit-il plus d\'or qu\'avant ?',
    slug: '2027-03',
    coverImage: '/images/lead.jpeg',
    publicationDate: '2026-08-01',
    summary: 'Notre troisième numéro plonge dans le secteur aurifère burkinabè : production réelle, revenus pour l\'État, et ce que les chiffres officiels ne disent pas. Également : bilan opérationnel de l\'AES à un an, reportage terrain à Kodéni, et l\'éditorial de la rédaction sur la mesure.',
    articleCount: 7,
    articleIds: ['art-01', 'art-02', 'art-04', 'art-06', 'art-12', 'art-13', 'art-05'],
    pdfUrl: '#',
  },
  {
    id: 'issue-02',
    number: 2,
    title: 'Énergie : le Burkina à la croisée des chemins',
    slug: '2027-02',
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85',
    publicationDate: '2026-07-01',
    summary: 'Le deuxième numéro interroge la stratégie énergétique du pays : solaire, thermique, interconnexions. Et un Grand Décryptage sur le budget 2026.',
    articleCount: 6,
    articleIds: ['art-05', 'art-16', 'art-02'],
  },
  {
    id: 'issue-01',
    number: 1,
    title: 'Comprendre la trajectoire du Burkina Faso',
    slug: '2027-01',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTelXSr6UnegMbp-8KAw4Ryh5xo63Rrdw0UOv0yuzp5zkcPdTLx54_DtGOI&s=10',
    publicationDate: '2026-06-01',
    summary: 'Premier numéro de Burkina News. Nous posons les bases : pourquoi un Tracker de projets ? Quelle méthode pour mesurer les promesses ? Et un tour d\'horizon des six rubriques qui structureront notre couverture.',
    articleCount: 5,
    articleIds: ['art-13', 'art-12'],
  },
]

export const getIssueBySlug = (slug: string): Issue | undefined =>
  issues.find(i => i.slug === slug)

export const getLatestIssue = (): Issue => issues[0]
