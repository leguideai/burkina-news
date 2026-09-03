import type { Brief } from '../types'
import { localizeBrief } from '../localize'

export const briefs: Brief[] = [
  {
    id: 'brief-34',
    title: 'Le Fil — Semaine 34',
    titleEn: 'The Brief — Week 34',
    slug: '2026-semaine-34',
    date: '2026-08-24',
    weekNumber: 34,
    image: '/images/lead.jpeg',
    facts: [
      { 
        time: '08:45', 
        text: 'Le Conseil des ministres approuve le cadre réglementaire pour les zones économiques spéciales.', 
        textEn: 'The Council of Ministers approves statutory framework establishing Special Economic Zones.',
        source: 'Présidence du Faso', 
        category: 'economie',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE7pSJKoIGpARFCaR6s4iBYUiLaPenvxIP6eg_ivTUbg&s=10'
      },
      { 
        time: '08:30', 
        text: 'La SONABEL annonce un taux d\'électrification rurale de 24,3 %, en hausse de 2 points.', 
        textEn: 'National utility SONABEL reports a rural electrification rate of 24.3%, up 2 percentage points year-on-year.',
        source: 'SONABEL', 
        category: 'chantiers',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfTHFMtacNzTw-vztKSDdisGXWeq9fXS8jB_y-goP0BOnTPS7QUns0-ZQ&s=10'
      },
      { 
        time: '08:15', 
        text: 'L\'INSD publie les données provisoires du commerce extérieur : excédent de 45 milliards FCFA sur S1 2026.', 
        textEn: 'INSD releases preliminary foreign trade statistics: 45 billion FCFA trade surplus recorded in H1 2026.',
        source: 'INSD', 
        category: 'economie',
        image: 'https://microdata.insd.bf//files/images/INSD.png'
      },
      { 
        time: '08:00', 
        text: 'Le CONASUR enregistre le retour de 12 000 personnes déplacées dans le Centre-Nord.', 
        textEn: 'CONASUR records the verified voluntary return of 12,000 internally displaced persons to Centre-Nord province.',
        source: 'CONASUR', 
        category: 'securite', 
        whyWatch: 'Première vague de retour significative dans cette région depuis 18 mois.',
        whyWatchEn: 'First statistically significant wave of civilian resettlement in this corridor in 18 months.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0NXfk-4ZSPp7HVPnv7SAmLhHzCBwrySGzRnAsbbb9Eg&s=10'
      },
      { 
        time: '07:45', 
        text: 'La DGPV confirme un taux de couverture semencière de 55 % pour la campagne 2026.', 
        textEn: 'DGPV confirms certified quality seed distribution reached 55% coverage for the 2026 agricultural campaign.',
        source: 'DGPV', 
        category: 'agriculture',
        image: 'https://lefaso.net/IMG/jpg/690828336_1455436459952509_7351871740454381150_n.jpg'
      },
      { 
        time: '07:30', 
        text: 'Le ministre de la Santé inaugure 3 nouveaux CSPS dans la Boucle du Mouhoun.', 
        textEn: 'The Minister of Health commissions 3 new primary health centers (CSPS) in the Boucle du Mouhoun region.',
        source: 'Ministère de la Santé', 
        category: 'societe',
        image: 'https://lefaso.net/local/cache-vignettes/L600xH337/5-2927-c6d0f.jpg?1787057136'
      },
      { 
        time: '07:15', 
        text: 'La BAD approuve un financement de 18 milliards FCFA pour l\'assainissement de Ouagadougou.', 
        textEn: 'The African Development Bank approves 18 billion FCFA concessional credit for Greater Ouagadougou drainage works.',
        source: 'BAD', 
        category: 'chantiers',
        image: 'https://burkina24.com/wp-content/uploads/2025/04/BAD-PM-scaled.jpg'
      },
      { 
        time: '07:00', 
        text: 'L\'AES tient sa troisième réunion ministérielle à Bamako : communiqué conjoint sur la sécurité transfrontalière.', 
        textEn: 'AES Confederation holds 3rd ministerial summit in Bamako: joint security pact adopted for corridor protection.',
        source: 'AES / Présidence Mali', 
        category: 'securite',
        image: 'https://tchadinfos.com/wp-content/uploads/2025/10/exxtats-aes-1200x654.jpg'
      },
      { 
        time: '06:45', 
        text: 'L\'INERA annonce la certification de deux nouvelles variétés de niébé résistantes à la sécheresse.', 
        textEn: 'National research institute INERA certifies two high-yield cowpea seed varieties resilient to arid conditions.',
        source: 'INERA', 
        category: 'agriculture',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo789lOPItu6jtRH8iV6CqV29MMAXO_GTzCQUgC4tEcWBN-elHpOqHnIo&s=10'
      },
      { 
        time: '06:30', 
        text: 'Le FMI publie son rapport Article IV pour le Burkina : croissance projetée à 5,3 % en 2026.', 
        textEn: 'The IMF publishes Article IV country assessment for Burkina Faso: economic expansion forecast raised to 5.3% in 2026.',
        source: 'FMI', 
        category: 'economie', 
        whyWatch: 'Chiffre en hausse par rapport à la projection de mars (4,9 %).',
        whyWatchEn: 'Upward revision compared to the previous March projection (4.9%).',
        image: 'https://image.seneweb.com/content/news/2026-06-04//thumb_1260x800_69838148aee61_Hub4mfuUiP.jpeg'
      },
    ],
  },
  {
    id: 'brief-33',
    title: 'Le Fil — Semaine 33',
    titleEn: 'The Brief — Week 33',
    slug: '2026-semaine-33',
    date: '2026-08-17',
    weekNumber: 33,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    facts: [
      { 
        time: '09:00', 
        text: 'Le Trésor public annonce un taux de recouvrement fiscal de 92 % au 30 juin 2026.', 
        textEn: 'Public Treasury reports statutory domestic tax revenue collection reached 92% of target as of June 30, 2026.',
        source: 'DGI', 
        category: 'economie', 
        image: 'https://www.aib.media/wp-content/uploads/2025/09/d975b634-66c2-4e0c-872d-290609f0abc1.jpeg' 
      },
      { 
        time: '08:40', 
        text: 'Ouverture du tronçon RN4 Koudougou–Dédougou après réhabilitation.', 
        textEn: 'Official opening of the fully rehabilitated RN4 national highway section connecting Koudougou to Dédougou.',
        source: 'DGIR', 
        category: 'chantiers', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQegRfC-a1CALnl4FOcYKIoWcTfa31RcPTZ35SHEYfZ0p-x0HTwQlepFzTj&s=10' 
      },
      { 
        time: '08:20', 
        text: 'La centrale solaire de Zina atteint 14,2 GWh de production cumulée sur 5 mois.', 
        textEn: 'Zina solar photovoltaic power plant registers 14.2 GWh of cumulative clean power fed into national grid over 5 months.',
        source: 'SONABEL', 
        category: 'chantiers', 
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        time: '08:00', 
        text: 'Le MENAPLN confirme la réouverture de 480 écoles sur les 1 200 prévues.', 
        textEn: 'Ministry of Education confirms 480 primary and secondary schools reopened out of the 1,200 targeted nationwide.',
        source: 'MENAPLN', 
        category: 'societe', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQayP8Ww23ah4com9T3_CWvc-UbBF_4wq2MxMLZbujJu8GbFJrq3NfpbCw&s=10' 
      },
      { 
        time: '07:40', 
        text: 'Signature d\'un accord de coopération agricole avec la Turquie.', 
        textEn: 'Bilateral technical agricultural cooperation treaty signed with Turkey focusing on automated grain storage.',
        source: 'Ministère des Affaires étrangères', 
        category: 'agriculture', 
        image: '/images/accord-turquie.png' 
      },
      { 
        time: '07:20', 
        text: 'Le taux d\'inflation se stabilise à 2,8 % en juillet 2026.', 
        textEn: 'National consumer price inflation moderates to 2.8% year-on-year in July 2026, within UEMOA convergence criteria.',
        source: 'INSD', 
        category: 'economie', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6i0FKWjuMznbG7MAYAv_T2Vnn3OSu8HtA4cMw9ZBfAR08diUYgXLlkFo&s=10' 
      },
      { 
        time: '07:00', 
        text: 'Les VDP comptent désormais 90 000 membres actifs selon le ministère de la Défense.', 
        textEn: 'Homeland Defense Volunteers (VDP) count 90,000 active registered personnel according to Ministry of Defense audit.',
        source: 'Ministère de la Défense', 
        category: 'securite', 
        image: 'https://burkina24.com/wp-content/uploads/2025/10/VDP-scaled.jpg' 
      },
      { 
        time: '06:40', 
        text: 'Endeavour Mining publie ses résultats Q1 : 4,2 tonnes d\'or produites à Kiéré.', 
        textEn: 'Endeavour Mining releases Q1 production filing: 4.2 metric tonnes of gold poured at Kiéré commercial mine.',
        source: 'Endeavour Mining', 
        category: 'economie', 
        image: 'https://kessiya.com/wp-content/uploads/2024/01/OIP-5.jpeg' 
      },
      { 
        time: '06:20', 
        text: 'Le PNUD lance un programme de formation professionnelle pour 5 000 jeunes déplacés.', 
        textEn: 'UNDP initiates certified vocational apprenticeship initiative benefiting 5,000 displaced young adults in Centre-Nord.',
        source: 'PNUD', 
        category: 'societe', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQpoIHBvZSwMMdBXWUt3kbDtUkcEkXLBWnQM6TN_BR3A&s=10' 
      },
      { 
        time: '06:00', 
        text: 'La Confédération AES annonce un exercice militaire conjoint pour septembre 2026.', 
        textEn: 'AES Joint Chiefs of Staff announce tripartite multinational military field exercise scheduled for September 2026.',
        source: 'État-major AES', 
        category: 'securite', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8kWdjQfDac6ZDLpXXY2i40IMH79QMZmwC0ao-TZwMzLjErWCCHO7R0rs&s=10' 
      },
    ],
  },
  {
    id: 'brief-32',
    title: 'Le Fil — Semaine 32',
    titleEn: 'The Brief — Week 32',
    slug: '2026-semaine-32',
    date: '2026-08-10',
    weekNumber: 32,
    image: 'https://www.sidwaya.info/wp-content/uploads/2025/09/2-31.jpg',
    facts: [
      { 
        time: '09:15', 
        text: 'Le gouvernement adopte la stratégie nationale de transformation numérique 2026-2030.', 
        textEn: 'Government formally adopts National Digital Modernization Strategy 2026-2030 in cabinet session.',
        source: 'Conseil des ministres', 
        category: 'economie', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBd21h3FfnMFj35xGtsOUvglG5W_o0qDk0E94_nVqh_Q&s=10' 
      },
      { 
        time: '08:50', 
        text: 'L\'OMS valide le Burkina comme pays prioritaire pour la campagne de vaccination antipaludique.', 
        textEn: 'World Health Organization validates Burkina Faso as priority territory for expanded rollout of pediatric malaria vaccine.',
        source: 'OMS', 
        category: 'societe', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQytGqd2MXUECDUuZ34RsvGmr3BYv-7b8dYS4hJ5T3PQQ&s=10' 
      },
      { 
        time: '08:30', 
        text: 'La production de coton estimée à 350 000 tonnes pour la campagne 2025-2026.', 
        textEn: 'SOFITEX estimates raw seed cotton output reached 350,000 metric tonnes for the 2025-2026 seasonal harvest.',
        source: 'SOFITEX', 
        category: 'agriculture', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgksWVhtio1nEb-29S9Lvco5tSw2v9Mm4KpxuKAsV7FQ&s=10' 
      },
      { 
        time: '08:10', 
        text: 'Le barrage de Bassiéri atteint 60 % d\'avancement des travaux.', 
        textEn: 'Civil engineering works on the Bassiéri irrigation dam reach 60% completion rate according to ministerial inspection.',
        source: 'DGRE', 
        category: 'chantiers', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5fl4uMQhzrEgKL_fRhd4UcCq-vJc22zfk9_ecODi_sw&s=10' 
      },
      { 
        time: '07:50', 
        text: 'L\'ambassade de Chine annonce un don de 200 bus pour le transport urbain.', 
        textEn: 'Chinese Embassy announces bilateral delivery of 200 high-capacity commuter buses for SOTRACO municipal network.',
        source: 'Ambassade de Chine', 
        category: 'chantiers', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWkobnGdQwhKk-HPwtX5LO7-lqXD8iqDVbK6cUuOvhWA&s=10' 
      },
      { 
        time: '07:30', 
        text: 'Les recettes minières atteignent 180 milliards FCFA au S1 2026, +15 % vs S1 2025.', 
        textEn: 'Public treasury mining revenues total 180 billion FCFA in H1 2026, a 15% increase compared to H1 2025.',
        source: 'DGMG', 
        category: 'economie', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQan6U3iPEpAgAN0Akf5s6zWCsIIohKoeQuEcdPkoF16Q&s=10' 
      },
      { 
        time: '07:10', 
        text: 'L\'université Thomas-Sankara ouvre trois nouveaux masters en sciences appliquées.', 
        textEn: 'Thomas Sankara University inaugurates three applied masters programs in data governance and renewable energy.',
        source: 'MESRSI', 
        category: 'societe', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7JcE1piVp4EVhuRHWDhQ66uOQjZXjS-8g2vbDGYSWOA&s=10' 
      },
      { 
        time: '06:50', 
        text: 'Le CILSS alerte sur un déficit pluviométrique de 15 % dans le Nord.', 
        textEn: 'CILSS weather bulletin signals 15% regional precipitation deficit across the northern Sahel agro-ecological strip.',
        source: 'CILSS', 
        category: 'agriculture', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOL2rHT0dTjH6wfGZy6QrxsYb53-_7XKzaDHiIzWv50g&s=10' 
      },
      { 
        time: '06:30', 
        text: 'Les forces armées reprennent le contrôle de deux localités dans l\'Est.', 
        textEn: 'Armed Forces and gendarmerie units re-establish full security control over two market towns in the Eastern region.',
        source: 'État-major', 
        category: 'securite', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFqFA0zN3cN0YxIjDC-kOQo6RpmX4wdHqKhiTLf2ONrA&s=10' 
      },
      { 
        time: '06:10', 
        text: 'Thomas Sankara fait l\'objet d\'un colloque international à Dakar.', 
        textEn: 'International academic symposium convenes in Dakar to examine the political economy and legacy of Thomas Sankara.',
        source: 'UCAD / CODESRIA', 
        category: 'idees', 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeYP8DctklaathBpL5M7ilvG1HpUu3YknAeniv9ioGcw&s=10' 
      },
    ],
  },
]

export const getBriefs = (lang: 'fr' | 'en' = 'fr'): Brief[] =>
  briefs.map(b => localizeBrief(b, lang))

export const getBriefBySlug = (slug: string, lang: 'fr' | 'en' = 'fr'): Brief | undefined => {
  const brief = briefs.find(b => b.slug === slug)
  return brief ? localizeBrief(brief, lang) : undefined
}

export const getLatestBrief = (lang: 'fr' | 'en' = 'fr'): Brief =>
  localizeBrief(briefs[0], lang)
