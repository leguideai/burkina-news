// 🇧🇫 BURKINA NEWS · RÉFÉRENTIEL DYNAMIQUE INITIAL DES FILTRES DU TRACKER
// Géré et éditable en temps réel depuis le Dashboard Admin (/admin/projets/filtres)
import { TrackerSector, TrackerBailleur, TrackerFiltersConfig } from '../types';
import { BURKINA_REGIONS_17 } from './referentiel-territoire';

export const INITIAL_TRACKER_SECTORS: TrackerSector[] = [
  {
    id: 'sec-agri',
    code: 'agriculture-irrigation',
    name: 'Agriculture & Irrigation',
    nameEn: 'Agriculture & Irrigation',
    description: 'Aménagements hydro-agricoles, barrages agropastoraux, plaines irriguées et semences certifiées.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-eau',
    code: 'eau-assainissement',
    name: 'Eau & Assainissement',
    nameEn: 'Water & Sanitation',
    description: 'Adduction en eau potable (AEP), forages solaires, stations de pompage et réseaux d\'assainissement urbain.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-educ',
    code: 'education-formation',
    name: 'Éducation & Formation',
    nameEn: 'Education & Training',
    description: 'Lycées scientifiques et professionnels, universités polytechniques et centres d\'apprentissage de métiers.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-ener',
    code: 'energie-electrification',
    name: 'Énergie & Électrification',
    nameEn: 'Energy & Electrification',
    description: 'Centrales solaires photovoltaïques, interconnexions régionales, centrales thermiques et électrification rurale.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-ind',
    code: 'industrie-souverainete',
    name: 'Industrie & Souveraineté',
    nameEn: 'Industry & Sovereignty',
    description: 'Usines de transformation locale (coton, or, agroalimentaire), raffineries et parcs industriels.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-min',
    code: 'mines-carrieres',
    name: 'Mines & Carrières',
    nameEn: 'Mining & Quarries',
    description: 'Infrastructures d\'exploitation aurifère, manganèse, carrières de granit et fonds minier de développement local (FMDL).',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-sant',
    code: 'sante-action-sociale',
    name: 'Santé & Action sociale',
    nameEn: 'Health & Social Action',
    description: 'Centres Hospitaliers Régionaux (CHR), Centres Médicaux avec Antenne chirurgicale (CMA) et dialyse.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-secu',
    code: 'securite-defense',
    name: 'Sécurité & Défense',
    nameEn: 'Security & Defense',
    description: 'Bases de soutien logistique, clôtures frontalières, casernes et infrastructures de surveillance aérienne.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-num',
    code: 'telecoms-numerique',
    name: 'Télécoms & Numérique',
    nameEn: 'Telecoms & Digital',
    description: 'Backbone national en fibre optique, data centers souverains et connectivité administrative.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'sec-trans',
    code: 'transport-desenclavement',
    name: 'Transport & Désenclavement',
    nameEn: 'Transport & Infrastructure',
    description: 'Routes nationales bitumées (RN), ponts de franchissement, gares multimodales et aéroports.',
    createdAt: '2026-01-15T00:00:00.000Z'
  }
];

export const INITIAL_TRACKER_BAILLEURS: TrackerBailleur[] = [
  {
    id: 'bai-bad',
    code: 'bad',
    name: 'BAD (Banque Africaine de Développement)',
    type: 'multilateral',
    country: 'Côte d\'Ivoire (Siège)',
    description: 'Partenaire multilatéral prioritaire pour l\'intégration régionale et les corridors routiers.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-bm',
    code: 'banque-mondiale',
    name: 'Banque mondiale',
    type: 'multilateral',
    country: 'International (USA)',
    description: 'Financements IDA pour l\'énergie, l\'eau, l\'éducation et la résilience communautaire.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-bid',
    code: 'bid',
    name: 'BID (Banque Islamique de Développement)',
    type: 'multilateral',
    country: 'Arabie Saoudite',
    description: 'Appui aux projets d\'infrastructures d\'eau, santé et barrages hydro-agricoles.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-boad',
    code: 'boad',
    name: 'BOAD (Banque Ouest Africaine de Développement)',
    type: 'multilateral',
    country: 'Togo (UEMOA)',
    description: 'Prêts concessionnels d\'intégration régionale UEMOA, énergie et voiries urbaines.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-cedeao',
    code: 'cedeao',
    name: 'CEDEAO / BIDC',
    type: 'multilateral',
    country: 'Nigéria / Togo',
    description: 'Fonds régionaux d\'interconnexion électrique et postes de contrôle juxtaposés.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-bilateral',
    code: 'cooperation-bilaterale',
    name: 'Coopération bilatérale',
    type: 'bilateral',
    country: 'Partenaires étatiques',
    description: 'Accords directs État à État (Japon JICA, Chine EximBank, Turquie, Russie, etc.).',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-etat',
    code: 'etat-burkina-faso',
    name: 'État du Burkina Faso (Trésor Public)',
    type: 'etatique',
    country: 'Burkina Faso',
    description: 'Budget de l\'État, Fonds Spéciaux de Développement, prélèvements miniers et contribution patriotique.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-saoudien',
    code: 'fonds-saoudien',
    name: 'Fonds Saoudien de Développement',
    type: 'bilateral',
    country: 'Arabie Saoudite',
    description: 'Prêts à taux bonifié pour désenclavement et infrastructures d\'adduction d\'eau.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-prive',
    code: 'secteur-prive',
    name: 'Secteur privé (Partenariats Public-Privé)',
    type: 'prive',
    country: 'Burkina Faso / International',
    description: 'Concessions BOT/BOOT, producteurs indépendants d\'électricité (IPP) et industriels.',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'bai-ue',
    code: 'union-europeenne',
    name: 'Union Européenne',
    type: 'multilateral',
    country: 'Belgique',
    description: 'Subventions et instruments de coopération au développement économique et social.',
    createdAt: '2026-01-15T00:00:00.000Z'
  }
];

export const INITIAL_TRACKER_FILTERS_CONFIG: TrackerFiltersConfig = {
  sectors: INITIAL_TRACKER_SECTORS,
  bailleurs: INITIAL_TRACKER_BAILLEURS,
  regions: [...BURKINA_REGIONS_17].sort((a, b) => a.localeCompare(b, 'fr')),
  updatedAt: '2026-01-15T00:00:00.000Z'
};
