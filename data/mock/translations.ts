export interface NavCategory {
  code: string;
  labelFr: string;
  labelEn: string;
  hrefFr: string;
  hrefEn: string;
}

export const NAV_CATEGORIES: NavCategory[] = [
  { code: 'economie', labelFr: 'Économie', labelEn: 'Economy', hrefFr: '/fr/economie', hrefEn: '/en/economie' },
  { code: 'securite', labelFr: 'Sécurité', labelEn: 'Security', hrefFr: '/fr/securite', hrefEn: '/en/securite' },
  { code: 'chantiers', labelFr: 'Chantiers', labelEn: 'Infrastructure', hrefFr: '/fr/chantiers', hrefEn: '/en/chantiers' },
  { code: 'agriculture', labelFr: 'Agriculture', labelEn: 'Agriculture', hrefFr: '/fr/agriculture', hrefEn: '/en/agriculture' },
  { code: 'societe', labelFr: 'Société', labelEn: 'Society', hrefFr: '/fr/societe', hrefEn: '/en/societe' },
  { code: 'idees', labelFr: 'Idées', labelEn: 'Ideas', hrefFr: '/fr/idees', hrefEn: '/en/idees' },
];

export const UI_STRINGS = {
  fr: {
    siteTitle: 'Burkina News — L\'info juste, l\'info vraie',
    siteSlogan: '« L\'information juste, la preuve vérifiée, la trajectoire du pays »',
    dateline: 'Jeudi 28 août 2026 · Ouagadougou & Bobo-Dioulasso',
    methodLink: 'Charte & Sources',
    trackerBtn: 'Le Tracker',
    subscribeBtn: 'S\'abonner',
    searchPlaceholder: 'Rechercher un dossier, un chantier, une source...',
    allRightsReserved: 'Burkina News. Tous droits réservés.',
    publisherLine: 'Revue mensuelle d\'investigation & base documentaire sur le Burkina Faso. Rédaction basée à Bobo-Dioulasso et Ouagadougou.',
    editorialIndependence: 'Régie par une charte déontologique stricte. Aucune dépendance publicitaire. Traçabilité intégrale de chaque donnée.',
  },
  en: {
    siteTitle: 'Burkina News — Facts. Data. Direction.',
    siteSlogan: '“Facts. Verified evidence. The direction of the country.”',
    dateline: 'Thursday, August 28, 2026 · Ouagadougou & Bobo-Dioulasso',
    methodLink: 'Charter & Sources',
    trackerBtn: 'The Tracker',
    subscribeBtn: 'Subscribe',
    searchPlaceholder: 'Search investigations, projects, sources...',
    allRightsReserved: 'Burkina News. All rights reserved.',
    publisherLine: 'Monthly investigative journal & documentary platform on Burkina Faso. Newsroom based in Bobo-Dioulasso and Ouagadougou.',
    editorialIndependence: 'Governed by a strict editorial charter. Zero advertising influence. Full traceability for every data point.',
  }
};
