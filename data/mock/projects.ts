import type { Project } from '../types'
import { localizeProject } from '../localize'

export const projects: Project[] = [
  {
    id: 'proj-01',
    title: 'Centrale solaire de Koudougou',
    titleEn: 'Koudougou 30 MW Solar Power Plant',
    slug: 'centrale-solaire-koudougou',
    description: 'Construction d\'une centrale photovoltaïque de 30 MW à Koudougou pour renforcer le réseau électrique national et réduire la dépendance aux importations d\'électricité.',
    descriptionEn: 'Construction of a 30 MW utility-scale photovoltaic power plant in Koudougou to strengthen the national power transmission grid and curb thermal fuel and import dependence.',
    category: 'chantiers',
    region: 'Centre-Ouest',
    sector: 'Énergie',
    currentStatus: 'en-construction',
    statusHistory: [
      { 
        status: 'annonce', 
        date: '2024-03-15', 
        source: 'Conseil des ministres', 
        note: 'Annonce du projet lors du conseil des ministres',
        noteEn: 'Official project announcement at Council of Ministers session'
      },
      { 
        status: 'engage', 
        date: '2024-09-20', 
        source: 'Ministère de l\'Énergie', 
        note: 'Signature du contrat avec le constructeur',
        noteEn: 'EPC construction contract formal signing with lead developer'
      },
      { 
        status: 'en-construction', 
        date: '2025-06-10', 
        source: 'Visite de terrain BN', 
        note: 'Début effectif des travaux constaté sur site',
        noteEn: 'Civil engineering groundworks physically verified by Burkina News field observers'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'SONABEL' },
      { role: 'Constructeur', roleEn: 'EPC Contractor', name: 'Amea Power' },
      { role: 'Bailleur', roleEn: 'Financing Partner', name: 'Banque mondiale / IDA' },
    ],
    amount: '28,5 milliards',
    currency: 'FCFA',
    capacity: '30 MW',
    lastVerifiedAt: '2026-08-15',
    sources: [
      { title: 'Compte rendu du Conseil des ministres', url: '#', date: '2024-03-15', institution: 'Présidence' },
      { title: 'Rapport de financement IDA', url: '#', date: '2024-09-20', institution: 'Banque mondiale' },
      { title: 'Constat de terrain Burkina News', url: '#', date: '2025-06-10', institution: 'Burkina News' },
    ],
    linkedArticleIds: ['art-16', 'art-05'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'proj-02',
    title: 'Réhabilitation du rail Ouaga-Kaya',
    titleEn: 'Ouagadougou–Kaya Railway Rehabilitation',
    slug: 'rehabilitation-rail-ouaga-kaya',
    description: 'Réhabilitation de la ligne ferroviaire de 100 km entre Ouagadougou et Kaya pour le transport de marchandises et de passagers. Le projet inclut la réfection des voies, la modernisation des gares et l\'acquisition de matériel roulant.',
    descriptionEn: 'Complete track upgrading of the 100-kilometer rail line between Ouagadougou and Kaya for freight and passenger transport, including track bed renewal, station signaling, and rolling stock modernization.',
    category: 'chantiers',
    region: 'Centre-Nord',
    sector: 'Transport',
    currentStatus: 'engage',
    statusHistory: [
      { 
        status: 'annonce', 
        date: '2023-11-08', 
        source: 'Conseil des ministres',
        noteEn: 'Presidential council formal approval of the rehabilitation corridor'
      },
      { 
        status: 'engage', 
        date: '2025-02-15', 
        source: 'Ministère des Transports', 
        note: 'Attribution du marché et mobilisation du financement',
        noteEn: 'Tender award finalized and concessional credit facility mobilized'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'Ministère des Transports' },
      { role: 'Constructeur', roleEn: 'Operator / Contractor', name: 'Consortium Bolloré-Sitarail' },
      { role: 'Bailleur', roleEn: 'Multilateral Funder', name: 'BAD' },
    ],
    amount: '45 milliards',
    currency: 'FCFA',
    capacity: '100 km de voie ferrée',
    lastVerifiedAt: '2026-07-20',
    sources: [
      { title: 'Communiqué du Conseil des ministres', url: '#', date: '2023-11-08', institution: 'Présidence' },
      { title: 'Note de financement BAD', url: '#', date: '2025-02-15', institution: 'BAD' },
    ],
    linkedArticleIds: ['art-07'],
    image: 'https://media-files.abidjan.net/photo/000_Par8269405.jpg',
  },
  {
    id: 'proj-03',
    title: 'Usine de transformation de mangues de Bobo-Dioulasso',
    titleEn: 'Bobo-Dioulasso Industrial Mango Processing Unit',
    slug: 'usine-mangues-bobo-dioulasso',
    description: 'Construction d\'une unité de transformation de mangues séchées et de jus, capacité de 10 000 tonnes/an, créant 350 emplois directs.',
    descriptionEn: 'Agro-industrial processing facility producing dried organic mangoes and bottled juice, featuring a 10,000-tonne annual capacity and creating 350 direct permanent jobs in the western agricultural basin.',
    category: 'agriculture',
    region: 'Hauts-Bassins',
    sector: 'Agro-industrie',
    currentStatus: 'operationnel',
    statusHistory: [
      { status: 'annonce', date: '2023-06-20', source: 'Ministère de l\'Industrie', noteEn: 'Cabinet statement endorsing high-value agro-processing zone' },
      { status: 'engage', date: '2023-12-10', source: 'Protocole d\'accord', noteEn: 'Framework agreement signed with international technical partner' },
      { status: 'en-construction', date: '2024-04-15', source: 'Visite de chantier', noteEn: 'Industrial floor slab and refrigeration bay installation' },
      { status: 'inaugure', date: '2025-09-22', source: 'Cérémonie officielle', noteEn: 'Formal ribbon-cutting ceremony and test processing run' },
      { 
        status: 'operationnel', 
        date: '2026-01-15', 
        source: 'Rapport SONAGESS', 
        note: 'Première campagne de production lancée',
        noteEn: 'Commercial export shipments initiated under statutory trade certificates'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'SONAGESS' },
      { role: 'Partenaire technique', roleEn: 'Technical Partner', name: 'GIZ' },
      { role: 'Bailleur', roleEn: 'Bilateral Funder', name: 'Coopération allemande' },
    ],
    amount: '8,2 milliards',
    currency: 'FCFA',
    capacity: '10 000 tonnes/an',
    lastVerifiedAt: '2026-08-10',
    sources: [
      { title: 'Protocole d\'accord SONAGESS-GIZ', url: '#', date: '2023-12-10', institution: 'SONAGESS' },
      { title: 'Rapport de production S1 2026', url: '#', date: '2026-07-15', institution: 'SONAGESS' },
    ],
    linkedArticleIds: ['art-06'],
    image: 'https://www.araa.org/sites/default/files/styles/i/public/2023-07/3_0.jpg?itok=I6XH_vS_',
  },
  {
    id: 'proj-04',
    title: 'Barrage de Bassiéri',
    titleEn: 'Bassiéri Hydro-Agricultural Irrigation Dam',
    slug: 'barrage-bassieri',
    description: 'Construction d\'un barrage d\'irrigation de 35 millions de m³ pour sécuriser la production agricole dans la province du Kourwéogo.',
    descriptionEn: 'Construction of a 35-million-cubic-meter earth reservoir dam to ensure year-round dry-season irrigation and crop resilience across Kourwéogo province.',
    category: 'agriculture',
    region: 'Plateau-Central',
    sector: 'Eau / Irrigation',
    currentStatus: 'en-construction',
    statusHistory: [
      { status: 'annonce', date: '2024-01-20', source: 'PND RELANCE', noteEn: 'Priority water retention work registered in PND infrastructure book' },
      { status: 'engage', date: '2024-07-08', source: 'Appel d\'offres attribué', noteEn: 'Competitive tender awarded to prime engineering firm' },
      { 
        status: 'en-construction', 
        date: '2025-03-12', 
        source: 'Rapport DGRE', 
        note: 'Travaux de terrassement en cours',
        noteEn: 'Spillway and earth levee earthworks 60% completed'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'DGRE' },
      { role: 'Constructeur', roleEn: 'Prime Contractor', name: 'SOGEA-SATOM' },
      { role: 'Bailleur', roleEn: 'Financing Institution', name: 'BOAD' },
    ],
    amount: '18 milliards',
    currency: 'FCFA',
    capacity: '35 millions m³',
    lastVerifiedAt: '2026-07-28',
    sources: [
      { title: 'Document PND RELANCE 2026-2030', url: '#', date: '2024-01-20', institution: 'Présidence' },
      { title: 'Rapport d\'avancement DGRE', url: '#', date: '2026-06-30', institution: 'DGRE' },
    ],
    linkedArticleIds: [],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaeBmNKsMlT-g1tcyIZN9rCHfQ3Eadn5_2WSb4IAv-nQ&s=10',
  },
  {
    id: 'proj-05',
    title: 'Hôpital régional de Dédougou',
    titleEn: 'Dédougou 150-Bed Regional Hospital Center',
    slug: 'hopital-regional-dedougou',
    description: 'Construction d\'un hôpital régional de 150 lits à Dédougou, incluant un service d\'urgence, un bloc opératoire et un centre de radiologie.',
    descriptionEn: 'Construction of a modern 150-bed referral hospital facility in Dédougou equipped with 24/7 trauma care, surgical operating suites, and a digital radiology diagnostics hub.',
    category: 'societe',
    region: 'Boucle du Mouhoun',
    sector: 'Santé',
    currentStatus: 'inaugure',
    statusHistory: [
      { status: 'annonce', date: '2022-08-10', source: 'Ministère de la Santé', noteEn: 'Regional healthcare decentralized coverage plan announced' },
      { status: 'engage', date: '2023-02-28', source: 'Convention de financement', noteEn: 'Concessional funding protocol executed with IDB' },
      { status: 'en-construction', date: '2023-10-05', source: 'Pose première pierre', noteEn: 'Groundbreaking ceremony and structural frame construction' },
      { 
        status: 'inaugure', 
        date: '2026-05-18', 
        source: 'Cérémonie officielle', 
        note: 'Inauguré par le Premier ministre',
        noteEn: 'Officially inaugurated by the Prime Minister; commissioning trials initiated'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'Ministère de la Santé' },
      { role: 'Constructeur', roleEn: 'General Contractor', name: 'CGE-BF' },
      { role: 'Bailleur', roleEn: 'Financing Partner', name: 'BID' },
    ],
    amount: '22 milliards',
    currency: 'FCFA',
    capacity: '150 lits',
    lastVerifiedAt: '2026-08-01',
    sources: [
      { title: 'Convention BID-Burkina Faso', url: '#', date: '2023-02-28', institution: 'BID' },
      { title: 'Discours d\'inauguration', url: '#', date: '2026-05-18', institution: 'Primature' },
    ],
    linkedArticleIds: ['art-11'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv0EhICXYFiNB30C75iaatLafkZHTpla-d6qObKHPRUA&s=10',
  },
  {
    id: 'proj-06',
    title: 'Programme de réouverture de 1 200 écoles',
    titleEn: 'National 1,200 Schools Resumption Program',
    slug: 'programme-reouverture-1200-ecoles',
    description: 'Programme national de réouverture progressive des écoles fermées pour cause d\'insécurité, avec recrutement d\'enseignants et sécurisation des sites.',
    descriptionEn: 'Statutory emergency program for the secure, phased reopening of primary and secondary schools closed by insecurity, paired with targeted teacher postings and community perimeter protection.',
    category: 'societe',
    region: 'National',
    sector: 'Éducation',
    currentStatus: 'en-construction',
    statusHistory: [
      { status: 'annonce', date: '2025-09-01', source: 'Ministère de l\'Éducation', noteEn: 'National Back-to-School emergency initiative presented' },
      { status: 'engage', date: '2025-11-15', source: 'Décret présidentiel', noteEn: 'Presidential decree gazetting dedicated educational security funds' },
      { 
        status: 'en-construction', 
        date: '2026-02-01', 
        source: 'Rapport MENAPLN', 
        note: '480 écoles rouvertes à ce jour',
        noteEn: '480 schools restored and operational according to statutory Ministry tally'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'MENAPLN' },
      { role: 'Partenaire', roleEn: 'Implementing Partner', name: 'UNICEF' },
      { role: 'Bailleur', roleEn: 'Global Partner', name: 'GPE' },
    ],
    lastVerifiedAt: '2026-08-12',
    sources: [
      { title: 'Rapport d\'avancement MENAPLN', url: '#', date: '2026-07-31', institution: 'MENAPLN' },
      { title: 'Note UNICEF Burkina', url: '#', date: '2026-06-15', institution: 'UNICEF' },
    ],
    linkedArticleIds: ['art-10'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzwS0pPzb4d4OqMYCrQ3GnfJhy_DFiQeL33Meg1DI6Wg&s=105',
  },
  {
    id: 'proj-07',
    title: 'Route nationale RN1 — tronçon Bobo-Banfora',
    titleEn: 'National Highway RN1 — Bobo-Dioulasso to Banfora (85 km)',
    slug: 'rn1-bobo-banfora',
    description: 'Réhabilitation et élargissement de 85 km de la route nationale RN1 entre Bobo-Dioulasso et Banfora.',
    descriptionEn: 'Major asphalt resurfacing, structural widening, and culvert reinforcement over 85 kilometers of strategic international highway RN1 connecting Bobo-Dioulasso and Banfora.',
    category: 'chantiers',
    region: 'Cascades',
    sector: 'Routes',
    currentStatus: 'en-construction',
    statusHistory: [
      { status: 'annonce', date: '2024-05-12', source: 'Conseil des ministres', noteEn: 'Inter-state transit highway corridor upgrade authorized' },
      { status: 'engage', date: '2024-11-30', source: 'Ministère des Infrastructures', noteEn: 'Contract formally executed with international contractor' },
      { status: 'en-construction', date: '2025-04-20', source: 'Constat terrain', noteEn: 'Heavy earthworks, subgrade grading, and asphalt laying verified' },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'DGIR' },
      { role: 'Constructeur', roleEn: 'Civil Works Contractor', name: 'Razel-Bec' },
      { role: 'Bailleur', roleEn: 'Financing Partner', name: 'Union européenne' },
    ],
    amount: '52 milliards',
    currency: 'FCFA',
    capacity: '85 km',
    lastVerifiedAt: '2026-07-15',
    sources: [
      { title: 'Communiqué du Conseil des ministres', url: '#', date: '2024-05-12', institution: 'Présidence' },
    ],
    linkedArticleIds: [],
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'proj-08',
    title: 'Mine d\'or de Kiéré — extension phase 2',
    titleEn: 'Kiéré Gold Mine — Phase 2 Industrial Expansion',
    slug: 'mine-or-kiere-extension',
    description: 'Extension de la mine industrielle de Kiéré pour augmenter la capacité de production de 3 à 5 tonnes d\'or par an.',
    descriptionEn: 'Deep-pit capacity enlargement and carbon-in-leach processing expansion at the Kiéré commercial mine to scale steady-state gold output from 3 to 5 metric tonnes annually.',
    category: 'economie',
    region: 'Sud-Ouest',
    sector: 'Mines',
    currentStatus: 'operationnel',
    statusHistory: [
      { status: 'annonce', date: '2023-09-15', source: 'Société Endeavour Mining', noteEn: 'Commercial operator files mineral reserve extension study' },
      { status: 'engage', date: '2024-02-20', source: 'Permis d\'exploitation étendu', noteEn: 'Decree issued granting updated multi-year mining lease' },
      { status: 'en-construction', date: '2024-08-10', source: 'Rapport EIE', noteEn: 'Crusher circuit and secondary ball mill installation' },
      { status: 'inaugure', date: '2025-12-05', source: 'Cérémonie officielle', noteEn: 'Formal opening of the expanded processing circuit' },
      { 
        status: 'operationnel', 
        date: '2026-03-15', 
        source: 'Rapport Q1 Endeavour', 
        note: 'Production à 4,2 tonnes en Q1 2026',
        noteEn: 'Commercial gold output verified at 4.2 metric tonnes in statutory Q1 filings'
      },
    ],
    actors: [
      { role: 'Opérateur', roleEn: 'Mining Operator', name: 'Endeavour Mining' },
      { role: 'Régulateur', roleEn: 'State Regulator', name: 'DGMG' },
    ],
    amount: '85 millions',
    currency: 'USD',
    capacity: '5 tonnes/an',
    lastVerifiedAt: '2026-08-05',
    sources: [
      { title: 'Rapport annuel Endeavour Mining 2025', url: '#', date: '2026-03-15', institution: 'Endeavour Mining' },
      { title: 'Données DGMG Q1 2026', url: '#', date: '2026-04-30', institution: 'DGMG' },
    ],
    linkedArticleIds: ['art-01'],
    image: 'https://www.sikafinance.com/api/image/ImageNewsGet?id=DA5D943B-644D-49BD-965B-79413A1E9D01',
  },
  {
    id: 'proj-09',
    title: 'Centrale solaire de Zina',
    titleEn: 'Zina 18 MW Solar Photovoltaic Plant',
    slug: 'centrale-solaire-zina',
    description: 'Centrale photovoltaïque de 18 MW dans la province du Sourou, raccordée au réseau SONABEL.',
    descriptionEn: 'Utility-scale 18 MW photovoltaic park constructed in Sourou province, fully synchronized and feeding clean power into the SONABEL interconnected transmission grid.',
    category: 'chantiers',
    region: 'Boucle du Mouhoun',
    sector: 'Énergie',
    currentStatus: 'impact-mesure',
    statusHistory: [
      { status: 'annonce', date: '2023-04-10', source: 'Ministère de l\'Énergie', noteEn: 'National renewable generation procurement round launched' },
      { status: 'engage', date: '2023-10-25', source: 'Contrat PPP signé', noteEn: 'Concession and 25-year Power Purchase Agreement executed' },
      { status: 'en-construction', date: '2024-06-01', source: 'Début des travaux', noteEn: 'Tracker mounting and 45,000 PV modules installation' },
      { status: 'inaugure', date: '2026-03-15', source: 'Inauguration officielle', noteEn: 'Commissioning ceremony attended by ministerial delegation' },
      { status: 'operationnel', date: '2026-06-01', source: 'Raccordement SONABEL', noteEn: 'Substation synchronization with the 90 kV high-voltage line' },
      { 
        status: 'impact-mesure', 
        date: '2026-08-01', 
        source: 'Rapport production S1', 
        note: 'Production mesurée : 14,2 GWh sur 5 mois',
        noteEn: 'Audited generation performance: 14.2 GWh supplied over initial 5 operating months'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'SONABEL' },
      { role: 'Développeur', roleEn: 'Independent Power Producer', name: 'Total Energies Renewables' },
      { role: 'Bailleur', roleEn: 'DFI Co-Financier', name: 'Proparco / AFD' },
    ],
    amount: '15 milliards',
    currency: 'FCFA',
    capacity: '18 MW',
    lastVerifiedAt: '2026-08-18',
    sources: [
      { title: 'Rapport de production SONABEL S1 2026', url: '#', date: '2026-08-01', institution: 'SONABEL' },
    ],
    linkedArticleIds: ['art-16', 'art-05'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'proj-10',
    title: 'Programme national de semences améliorées',
    titleEn: 'National Certified Seed Distribution Offensive',
    slug: 'programme-semences-ameliorees',
    description: 'Distribution de 15 000 tonnes de semences certifiées dans les 13 régions pour la campagne agricole 2026.',
    descriptionEn: 'Countrywide agricultural logistics initiative deploying 15,000 metric tonnes of drought-tolerant certified staple seeds across all 13 administrative regions for the 2026 campaign.',
    category: 'agriculture',
    region: 'National',
    sector: 'Agriculture',
    currentStatus: 'en-construction',
    statusHistory: [
      { status: 'annonce', date: '2025-12-10', source: 'Ministère de l\'Agriculture', noteEn: 'Food sovereignty seed plan presented to farm organizations' },
      { status: 'engage', date: '2026-03-01', source: 'Budget alloué', noteEn: 'Procurement allocations disbursed to certified multiplication centers' },
      { 
        status: 'en-construction', 
        date: '2026-05-15', 
        source: 'Début de distribution', 
        note: '8 200 tonnes distribuées à ce jour',
        noteEn: '8,200 metric tonnes officially received and confirmed by regional agricultural offices'
      },
    ],
    actors: [
      { role: 'Maître d\'ouvrage', roleEn: 'Contracting Authority', name: 'Ministère de l\'Agriculture' },
      { role: 'Partenaire technique', roleEn: 'Scientific Partner', name: 'INERA' },
      { role: 'Bailleur', roleEn: 'Multilateral Agency', name: 'FAO' },
    ],
    lastVerifiedAt: '2026-08-08',
    sources: [
      { title: 'Rapport campagne agricole DGPV', url: '#', date: '2026-07-31', institution: 'DGPV' },
      { title: 'Note FAO Burkina', url: '#', date: '2026-06-30', institution: 'FAO' },
    ],
    linkedArticleIds: ['art-08'],
    image: 'https://www.sidwaya.info/wp-content/uploads/2025/09/2-31.jpg',
  },
]

export const getProjects = (lang: 'fr' | 'en' = 'fr'): Project[] =>
  projects.map(p => localizeProject(p, lang))

export const getProjectBySlug = (slug: string, lang: 'fr' | 'en' = 'fr'): Project | undefined => {
  const project = projects.find(p => p.slug === slug)
  return project ? localizeProject(project, lang) : undefined
}

export const getProjectsByCategory = (code: string, lang: 'fr' | 'en' = 'fr'): Project[] =>
  projects.filter(p => p.category === code).map(p => localizeProject(p, lang))

export const getProjectsByStatus = (status: string, lang: 'fr' | 'en' = 'fr'): Project[] =>
  projects.filter(p => p.currentStatus === status).map(p => localizeProject(p, lang))

export const getProjectStats = () => {
  const total = projects.length
  const byStatus = projects.reduce((acc, p) => {
    acc[p.currentStatus] = (acc[p.currentStatus] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return { total, byStatus }
}
