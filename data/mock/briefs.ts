import type { Brief } from '../types'

export const briefs: Brief[] = [
  {
    id: 'brief-34',
    title: 'Le Fil — Semaine 34',
    slug: '2026-semaine-34',
    date: '2026-08-24',
    weekNumber: 34,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=800&q=85',
    facts: [
      { 
        time: '08:45', 
        text: 'Le Conseil des ministres approuve le cadre réglementaire pour les zones économiques spéciales.', 
        source: 'Présidence du Faso', 
        category: 'economie',
        image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '08:30', 
        text: 'La SONABEL annonce un taux d\'électrification rurale de 24,3 %, en hausse de 2 points.', 
        source: 'SONABEL', 
        category: 'chantiers',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '08:15', 
        text: 'L\'INSD publie les données provisoires du commerce extérieur : excédent de 45 milliards FCFA sur S1 2026.', 
        source: 'INSD', 
        category: 'economie',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '08:00', 
        text: 'Le CONASUR enregistre le retour de 12 000 personnes déplacées dans le Centre-Nord.', 
        source: 'CONASUR', 
        category: 'securite', 
        whyWatch: 'Première vague de retour significative dans cette région depuis 18 mois.',
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '07:45', 
        text: 'La DGPV confirme un taux de couverture semencière de 55 % pour la campagne 2026.', 
        source: 'DGPV', 
        category: 'agriculture',
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '07:30', 
        text: 'Le ministre de la Santé inaugure 3 nouveaux CSPS dans la Boucle du Mouhoun.', 
        source: 'Ministère de la Santé', 
        category: 'societe',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '07:15', 
        text: 'La BAD approuve un financement de 18 milliards FCFA pour l\'assainissement de Ouagadougou.', 
        source: 'BAD', 
        category: 'chantiers',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '07:00', 
        text: 'L\'AES tient sa troisième réunion ministérielle à Bamako : communiqué conjoint sur la sécurité transfrontalière.', 
        source: 'AES / Présidence Mali', 
        category: 'securite',
        image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '06:45', 
        text: 'L\'INERA annonce la certification de deux nouvelles variétés de niébé résistantes à la sécheresse.', 
        source: 'INERA', 
        category: 'agriculture',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80'
      },
      { 
        time: '06:30', 
        text: 'Le FMI publie son rapport Article IV pour le Burkina : croissance projetée à 5,3 % en 2026.', 
        source: 'FMI', 
        category: 'economie', 
        whyWatch: 'Chiffre en hausse par rapport à la projection de mars (4,9 %).',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
      },
    ],
  },
  {
    id: 'brief-33',
    title: 'Le Fil — Semaine 33',
    slug: '2026-semaine-33',
    date: '2026-08-17',
    weekNumber: 33,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=85',
    facts: [
      { time: '09:00', text: 'Le Trésor public annonce un taux de recouvrement fiscal de 92 % au 30 juin 2026.', source: 'DGI', category: 'economie', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
      { time: '08:40', text: 'Ouverture du tronçon RN4 Koudougou–Dédougou après réhabilitation.', source: 'DGIR', category: 'chantiers', image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=400&q=80' },
      { time: '08:20', text: 'La centrale solaire de Zina atteint 14,2 GWh de production cumulée sur 5 mois.', source: 'SONABEL', category: 'chantiers', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80' },
      { time: '08:00', text: 'Le MENAPLN confirme la réouverture de 480 écoles sur les 1 200 prévues.', source: 'MENAPLN', category: 'societe', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80' },
      { time: '07:40', text: 'Signature d\'un accord de coopération agricole avec la Turquie.', source: 'Ministère des Affaires étrangères', category: 'agriculture', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80' },
      { time: '07:20', text: 'Le taux d\'inflation se stabilise à 2,8 % en juillet 2026.', source: 'INSD', category: 'economie', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80' },
      { time: '07:00', text: 'Les VDP comptent désormais 90 000 membres actifs selon le ministère de la Défense.', source: 'Ministère de la Défense', category: 'securite', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80' },
      { time: '06:40', text: 'Endeavour Mining publie ses résultats Q1 : 4,2 tonnes d\'or produites à Kiéré.', source: 'Endeavour Mining', category: 'economie', image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=400&q=80' },
      { time: '06:20', text: 'Le PNUD lance un programme de formation professionnelle pour 5 000 jeunes déplacés.', source: 'PNUD', category: 'societe', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80' },
      { time: '06:00', text: 'La Confédération AES annonce un exercice militaire conjoint pour septembre 2026.', source: 'État-major AES', category: 'securite', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'brief-32',
    title: 'Le Fil — Semaine 32',
    slug: '2026-semaine-32',
    date: '2026-08-10',
    weekNumber: 32,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=85',
    facts: [
      { time: '09:15', text: 'Le gouvernement adopte la stratégie nationale de transformation numérique 2026-2030.', source: 'Conseil des ministres', category: 'economie', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80' },
      { time: '08:50', text: 'L\'OMS valide le Burkina comme pays prioritaire pour la campagne de vaccination antipaludique.', source: 'OMS', category: 'societe', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80' },
      { time: '08:30', text: 'La production de coton estimée à 350 000 tonnes pour la campagne 2025-2026.', source: 'SOFITEX', category: 'agriculture', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80' },
      { time: '08:10', text: 'Le barrage de Bassiéri atteint 60 % d\'avancement des travaux.', source: 'DGRE', category: 'chantiers', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80' },
      { time: '07:50', text: 'L\'ambassade de Chine annonce un don de 200 bus pour le transport urbain.', source: 'Ambassade de Chine', category: 'chantiers', image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=400&q=80' },
      { time: '07:30', text: 'Les recettes minières atteignent 180 milliards FCFA au S1 2026, +15 % vs S1 2025.', source: 'DGMG', category: 'economie', image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=400&q=80' },
      { time: '07:10', text: 'L\'université Thomas-Sankara ouvre trois nouveaux masters en sciences appliquées.', source: 'MESRSI', category: 'societe', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80' },
      { time: '06:50', text: 'Le CILSS alerte sur un déficit pluviométrique de 15 % dans le Nord.', source: 'CILSS', category: 'agriculture', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80' },
      { time: '06:30', text: 'Les forces armées reprennent le contrôle de deux localités dans l\'Est.', source: 'État-major', category: 'securite', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80' },
      { time: '06:10', text: 'Thomas Sankara fait l\'objet d\'un colloque international à Dakar.', source: 'UCAD / CODESRIA', category: 'idees', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80' },
    ],
  },
]

export const getBriefBySlug = (slug: string): Brief | undefined =>
  briefs.find(b => b.slug === slug)

export const getLatestBrief = (): Brief => briefs[0]
