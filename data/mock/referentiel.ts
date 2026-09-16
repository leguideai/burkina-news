import { CategoryCode, SubCategory } from '../types';

// =====================================================================
// 1. RÉFÉRENTIEL DES 24 SOUS-RUBRIQUES FERMÉES (Brief Samba v5)
// =====================================================================

export const SUB_CATEGORIES: SubCategory[] = [
  // ── ÉCONOMIE (5 sous-rubriques) ──────────────────────────────────
  {
    code: 'conjoncture',
    nameFr: 'Conjoncture',
    nameEn: 'Economic Outlook',
    categoryCode: 'economie',
    descriptionFr: 'Indicateurs macroéconomiques, croissance, inflation et politique budgétaire.',
    descriptionEn: 'Macroeconomic indicators, GDP growth, inflation, and fiscal policy.',
  },
  {
    code: 'financement',
    nameFr: 'Financement',
    nameEn: 'Financing',
    categoryCode: 'economie',
    descriptionFr: 'Dette publique, émissions obligataires du Trésor, coopération et banques régionales.',
    descriptionEn: 'Public debt, Treasury bonds, development banking, and regional financial markets.',
  },
  {
    code: 'or-mines',
    nameFr: 'Or & mines',
    nameEn: 'Gold & Mining',
    categoryCode: 'economie',
    descriptionFr: 'Production aurifère, carrières, réglementation minière et retombées pour les collectivités.',
    descriptionEn: 'Gold production, mining regulations, royalties, and community development.',
  },
  {
    code: 'industrie',
    nameFr: 'Industrie',
    nameEn: 'Industry',
    categoryCode: 'economie',
    descriptionFr: 'Transformation locale, filières manufacturières, cimenteries et zones industrielles.',
    descriptionEn: 'Domestic processing, manufacturing, agro-industrial parks, and industrial zones.',
  },
  {
    code: 'investissement',
    nameFr: 'Investissement',
    nameEn: 'Investment',
    categoryCode: 'economie',
    descriptionFr: 'Climat des affaires, partenariats public-privé (PPP), capitaux locaux et IDE.',
    descriptionEn: 'Business climate, public-private partnerships, domestic private equity, and FDI.',
  },

  // ── SÉCURITÉ (3 sous-rubriques) ──────────────────────────────────
  {
    code: 'situation',
    nameFr: 'Situation',
    nameEn: 'Security Situation',
    categoryCode: 'securite',
    descriptionFr: 'Évaluation des théâtres d\'opérations, souveraineté territoriale et dynamique sahélienne.',
    descriptionEn: 'Operational theater assessments, territorial sovereignty, and regional Sahelian dynamics.',
  },
  {
    code: 'humanitaire',
    nameFr: 'Humanitaire',
    nameEn: 'Humanitarian',
    categoryCode: 'securite',
    descriptionFr: 'Personnes déplacées internes (PDI), réinstallation des populations et aide d\'urgence.',
    descriptionEn: 'Internally displaced persons (IDPs), resettlement operations, and relief aid.',
  },
  {
    code: 'services',
    nameFr: 'Services',
    nameEn: 'Public Services & Resettlement',
    categoryCode: 'securite',
    descriptionFr: 'Retour de l\'État, réouverture des écoles, centres de santé et administration civile.',
    descriptionEn: 'Restoration of state presence, reopening of civil infrastructure, schools, and clinics.',
  },

  // ── CHANTIERS (5 sous-rubriques) ─────────────────────────────────
  {
    code: 'energie',
    nameFr: 'Énergie',
    nameEn: 'Energy',
    categoryCode: 'chantiers',
    descriptionFr: 'Centrales solaires, interconnexions électriques régionales et électrification rurale.',
    descriptionEn: 'Solar photovoltaic plants, cross-border power interconnections, and rural electrification.',
  },
  {
    code: 'transport',
    nameFr: 'Transport',
    nameEn: 'Transport & Roads',
    categoryCode: 'chantiers',
    descriptionFr: 'Corridors routiers, désenclavement, ponts, voiries urbaines et réseau ferroviaire.',
    descriptionEn: 'Interstate transport corridors, national roads, bridges, and rail infrastructure.',
  },
  {
    code: 'hydraulique',
    nameFr: 'Hydraulique',
    nameEn: 'Water & Dams',
    categoryCode: 'chantiers',
    descriptionFr: 'Grands barrages, canaux d\'irrigation, retenues d\'eau et réseaux d\'eau potable (ONEA).',
    descriptionEn: 'Multi-purpose dams, irrigation canals, water reservoirs, and drinking water supply.',
  },
  {
    code: 'numerique',
    nameFr: 'Numérique',
    nameEn: 'Digital Infrastructure',
    categoryCode: 'chantiers',
    descriptionFr: 'Dorsale de fibre optique (backbone), couverture réseau 4G/5G et centres de données.',
    descriptionEn: 'National optical fiber backbone, telecommunications coverage, and sovereign data centers.',
  },
  {
    code: 'equipements',
    nameFr: 'Équipements',
    nameEn: 'Public Facilities',
    categoryCode: 'chantiers',
    descriptionFr: 'Centres hospitaliers régionaux (CHR), universités, complexes scolaires et édifices publics.',
    descriptionEn: 'Regional referral hospitals, university campuses, vocational centers, and public facilities.',
  },

  // ── AGRICULTURE (4 sous-rubriques) ───────────────────────────────
  {
    code: 'souverainete',
    nameFr: 'Souveraineté',
    nameEn: 'Food Sovereignty',
    categoryCode: 'agriculture',
    descriptionFr: 'Offensive agropastorale, sécurité alimentaire nationale, réserves de céréales (SONAGESS).',
    descriptionEn: 'National food self-sufficiency initiatives, strategic grain reserves, and agricultural policy.',
  },
  {
    code: 'filieres',
    nameFr: 'Filières',
    nameEn: 'Agricultural Value Chains',
    categoryCode: 'agriculture',
    descriptionFr: 'Coton, sésame, anacarde, maïs, riz de bas-fonds et cultures de rente.',
    descriptionEn: 'Cotton, sesame, cashew, maize, lowland rice, and commercial crops.',
  },
  {
    code: 'elevage',
    nameFr: 'Élevage',
    nameEn: 'Livestock & Pastoralism',
    categoryCode: 'agriculture',
    descriptionFr: 'Cheptel national, zones pastorales, abattoirs frigorifiques modernes et filière cuir.',
    descriptionEn: 'Livestock census, pastoral corridors, modern abattoirs, and dairy & leather value chains.',
  },
  {
    code: 'modernisation',
    nameFr: 'Modernisation',
    nameEn: 'Modernization & Mechanization',
    categoryCode: 'agriculture',
    descriptionFr: 'Mécanisation agricole, maîtrise de l\'eau, intrants locaux et recherche agronomique (INERA).',
    descriptionEn: 'Tractor mechanization, solar pump irrigation, bio-fertilizers, and agronomic research.',
  },

  // ── SOCIÉTÉ (4 sous-rubriques) ───────────────────────────────────
  {
    code: 'education',
    nameFr: 'Éducation',
    nameEn: 'Education',
    categoryCode: 'societe',
    descriptionFr: 'Système scolaire, formation professionnelle, alphabétisation et enseignement supérieur.',
    descriptionEn: 'Primary and secondary schooling, vocational training institutes, and university research.',
  },
  {
    code: 'sante',
    nameFr: 'Santé',
    nameEn: 'Healthcare',
    categoryCode: 'societe',
    descriptionFr: 'Gratuité des soins ciblés, pharmacopée nationale, plateaux techniques et couverture santé.',
    descriptionEn: 'Universal healthcare initiatives, pharmaceutical independence, and district health networks.',
  },
  {
    code: 'pauvrete',
    nameFr: 'Pauvreté',
    nameEn: 'Social Inclusion & Poverty',
    categoryCode: 'societe',
    descriptionFr: 'Filets sociaux, résilience des ménages ruraux, emploi des jeunes et pouvoir d\'achat.',
    descriptionEn: 'Social safety nets, rural household economic resilience, youth employment, and cost of living.',
  },
  {
    code: 'gouvernance',
    nameFr: 'Gouvernance',
    nameEn: 'Governance & Anti-corruption',
    categoryCode: 'societe',
    descriptionFr: 'Lutte contre la corruption (ASCE-LC), numérisation administrative et justice de proximité.',
    descriptionEn: 'Public integrity oversight, state digital services, anti-corruption audits, and judiciary reforms.',
  },

  // ── HISTOIRE (3 sous-rubriques) ──────────────────────────────────
  {
    code: 'revolutions',
    nameFr: 'Révolutions',
    nameEn: 'Revolutions & Sankara Era',
    categoryCode: 'histoire',
    descriptionFr: 'Révolution démocratique et populaire (1983-1987), doctrine d\'autosuffisance et mémoires.',
    descriptionEn: 'Democratic and Popular Revolution (1983-1987), self-reliance doctrines, and national memory.',
  },
  {
    code: 'independances',
    nameFr: 'Indépendances',
    nameEn: 'Independence & Republics',
    categoryCode: 'histoire',
    descriptionFr: 'Haute-Volta, luttes anticoloniales, reconstitution de 1947 et bâtisseurs de la République.',
    descriptionEn: 'Upper Volta archives, anti-colonial resistance, 1947 reconstitution, and founding pioneers.',
  },
  {
    code: 'panafricanisme',
    nameFr: 'Panafricanisme',
    nameEn: 'Pan-Africanism',
    categoryCode: 'histoire',
    descriptionFr: 'Alliances fédérales ouest-africaines, pensée politique sahélienne et histoire des peuples.',
    descriptionEn: 'West African federal integration, Sahelian political thought, and transnational histories.',
  },
];

export function getSubCategoriesByCategory(catCode: CategoryCode): SubCategory[] {
  return SUB_CATEGORIES.filter(s => s.categoryCode === catCode);
}

export function getSubCategoryByCode(subCode: string): SubCategory | undefined {
  return SUB_CATEGORIES.find(s => s.code === subCode);
}

// Règle d'activation automatique (Brief Samba v5, section 4.2)
export function isSubCategoryActive(
  publishedArticlesCount: number,
  wasEverActivated: boolean = false
): boolean {
  if (wasEverActivated) return true;
  return publishedArticlesCount >= 2;
}

// =====================================================================
// 2. RÉFÉRENTIEL DES 45 PROVINCES PAR RÉGION (Burkina Faso)
// =====================================================================

export interface RegionReferentiel {
  region: string;
  regionEn: string;
  chefLieu: string;
  provinces: string[];
}

export const BURKINA_REGIONS: RegionReferentiel[] = [
  {
    region: 'Boucle du Mouhoun',
    regionEn: 'Boucle du Mouhoun',
    chefLieu: 'Dédougou',
    provinces: ['Balé', 'Banwa', 'Kossi', 'Mouhoun', 'Nayala', 'Sourou'],
  },
  {
    region: 'Cascades',
    regionEn: 'Cascades',
    chefLieu: 'Banfora',
    provinces: ['Comoé', 'Léraba'],
  },
  {
    region: 'Centre',
    regionEn: 'Centre (Ouagadougou)',
    chefLieu: 'Ouagadougou',
    provinces: ['Kadiogo'],
  },
  {
    region: 'Centre-Est',
    regionEn: 'Centre-East',
    chefLieu: 'Tenkodogo',
    provinces: ['Boulgou', 'Koulpélogo', 'Kouritenga'],
  },
  {
    region: 'Centre-Nord',
    regionEn: 'Centre-North',
    chefLieu: 'Kaya',
    provinces: ['Bam', 'Namentenga', 'Sanmatenga'],
  },
  {
    region: 'Centre-Ouest',
    regionEn: 'Centre-West',
    chefLieu: 'Koudougou',
    provinces: ['Boulkiemdé', 'Sanguié', 'Sissili', 'Ziro'],
  },
  {
    region: 'Centre-Sud',
    regionEn: 'Centre-South',
    chefLieu: 'Manga',
    provinces: ['Bazèga', 'Nahouri', 'Zoundwéogo'],
  },
  {
    region: 'Est',
    regionEn: 'East',
    chefLieu: 'Fada N\'Gourma',
    provinces: ['Gnagna', 'Gourma', 'Komondjari', 'Kompienga', 'Tapoa'],
  },
  {
    region: 'Hauts-Bassins',
    regionEn: 'Hauts-Bassins',
    chefLieu: 'Bobo-Dioulasso',
    provinces: ['Houet', 'Kénédougou', 'Tuy'],
  },
  {
    region: 'Nord',
    regionEn: 'North',
    chefLieu: 'Ouahigouya',
    provinces: ['Loroum', 'Passoré', 'Yatenga', 'Zondoma'],
  },
  {
    region: 'Plateau-Central',
    regionEn: 'Plateau-Central',
    chefLieu: 'Ziniaré',
    provinces: ['Ganzourgou', 'Kourwéogo', 'Oubritenga'],
  },
  {
    region: 'Sahel',
    regionEn: 'Sahel',
    chefLieu: 'Dori',
    provinces: ['Oudalan', 'Séno', 'Soum', 'Yagha'],
  },
  {
    region: 'Sud-Ouest',
    regionEn: 'South-West',
    chefLieu: 'Gaoua',
    provinces: ['Bougouriba', 'Ioba', 'Noumbiel', 'Poni'],
  },
];

export const ALL_PROVINCES: string[] = BURKINA_REGIONS.flatMap(r => r.provinces).sort((a, b) => a.localeCompare('fr'));

export function getProvincesByRegion(regionName: string): string[] {
  const match = BURKINA_REGIONS.find(r => r.region.toLowerCase() === regionName.toLowerCase());
  return match ? match.provinces : ALL_PROVINCES;
}

export function getRegionByProvince(provinceName: string): string | undefined {
  const match = BURKINA_REGIONS.find(r => r.provinces.includes(provinceName));
  return match?.region;
}

// =====================================================================
// 3. LES 4 PRODUITS DU JOURNAL & LEURS SOUS-MENUS OFFICIELS
// =====================================================================

export interface ProductMenuItem {
  code: string;
  labelFr: string;
  labelEn: string;
  hrefFr: string;
  hrefEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

export interface JournalProduct {
  code: string;
  nameFr: string;
  nameEn: string;
  badge?: string;
  hrefFr: string;
  hrefEn: string;
  hasSubMenus: boolean;
  subMenus: ProductMenuItem[];
}

export const JOURNAL_PRODUCTS: JournalProduct[] = [
  {
    code: 'tracker',
    nameFr: 'Le Tracker',
    nameEn: 'The Tracker',
    badge: 'Base Documentaire',
    hrefFr: '/fr/tracker',
    hrefEn: '/en/tracker',
    hasSubMenus: true,
    subMenus: [
      { code: 'statut', labelFr: 'Par statut', labelEn: 'By Status', hrefFr: '/fr/tracker?filter=statut', hrefEn: '/en/tracker?filter=statut' },
      { code: 'secteur', labelFr: 'Par secteur', labelEn: 'By Sector', hrefFr: '/fr/tracker?filter=secteur', hrefEn: '/en/tracker?filter=secteur' },
      { code: 'region', labelFr: 'Par région', labelEn: 'By Region', hrefFr: '/fr/tracker?filter=region', hrefEn: '/en/tracker?filter=region' },
      { code: 'province', labelFr: 'Par province', labelEn: 'By Province', hrefFr: '/fr/tracker?filter=province', hrefEn: '/en/tracker?filter=province' },
      { code: 'programme', labelFr: 'Par programme PND', labelEn: 'By PND Program', hrefFr: '/fr/tracker?filter=programme', hrefEn: '/en/tracker?filter=programme' },
      { code: 'fiabilite', labelFr: 'Fiabilité', labelEn: 'Reliability', hrefFr: '/fr/tracker?filter=fiabilite', hrefEn: '/en/tracker?filter=fiabilite' },
      { code: 'nouveaux', labelFr: 'Nouvellement ajoutés', labelEn: 'Recently Added', hrefFr: '/fr/tracker?filter=nouveaux', hrefEn: '/en/tracker?filter=nouveaux' },
    ],
  },
  {
    code: 'relance',
    nameFr: 'RELANCE',
    nameEn: 'RELANCE',
    badge: 'PND 2026-2030',
    hrefFr: '/fr/tracker/indicateurs',
    hrefEn: '/en/tracker/indicateurs',
    hasSubMenus: true,
    subMenus: [
      { code: 'barometre', labelFr: 'Baromètre', labelEn: 'Barometer', hrefFr: '/fr/tracker/indicateurs', hrefEn: '/en/tracker/indicateurs' },
      { code: 'piliers', labelFr: 'Par pilier', labelEn: 'By Pillar', hrefFr: '/fr/tracker/indicateurs?filter=piliers', hrefEn: '/en/tracker/indicateurs?filter=piliers' },
      { code: 'ecarts', labelFr: 'Écarts & litiges', labelEn: 'Discrepancies & Disputes', hrefFr: '/fr/tracker/indicateurs?filter=ecarts', hrefEn: '/en/tracker/indicateurs?filter=ecarts' },
      { code: 'brief', labelFr: 'Investment Brief', labelEn: 'Investment Brief', hrefFr: '/fr/tracker/indicateurs?filter=brief', hrefEn: '/en/tracker/indicateurs?filter=brief' },
      { code: 'methode', labelFr: 'Méthode RELANCE', labelEn: 'RELANCE Method', hrefFr: '/fr/methode', hrefEn: '/en/methode' },
    ],
  },
  {
    code: 'numeros',
    nameFr: 'Les Numéros',
    nameEn: 'Issues',
    badge: 'Revue Mensuelle',
    hrefFr: '/fr/numeros',
    hrefEn: '/en/numeros',
    hasSubMenus: false,
    subMenus: [], // Aucun sous-menu : flux chronologique mensuel
  },
  {
    code: 'fil',
    nameFr: 'Le Fil Hebdo',
    nameEn: 'Weekly Brief',
    badge: 'Dépêches 60s',
    hrefFr: '/fr/fil',
    hrefEn: '/en/fil',
    hasSubMenus: false,
    subMenus: [], // Aucun sous-menu : flux chronologique hebdomadaire
  },
];
