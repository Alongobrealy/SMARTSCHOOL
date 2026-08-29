export interface CongoDepartmentInfo {
  id: string;
  name: string;
  code: string;
  chefLieu: string;
  communesAndDistricts: string[];
}

export const CONGO_DEPARTMENTS: CongoDepartmentInfo[] = [
  {
    id: 'bzv',
    name: 'Brazzaville',
    code: 'BZV',
    chefLieu: 'Brazzaville',
    communesAndDistricts: [
      'Arrondissement 1 Makélékélé',
      'Arrondissement 2 Bacongo',
      'Arrondissement 3 Poto-Poto',
      'Arrondissement 4 Moungali',
      'Arrondissement 5 Ouenzé',
      'Arrondissement 6 Talangaï',
      'Arrondissement 7 Mfilou',
      'Arrondissement 8 Madibou',
      'Arrondissement 9 Djiri',
      'Île Mbamou'
    ]
  },
  {
    id: 'pnr',
    name: 'Pointe-Noire',
    code: 'PNR',
    chefLieu: 'Pointe-Noire',
    communesAndDistricts: [
      'Arrondissement 1 Emery Patrice Lumumba',
      'Arrondissement 2 Mvou-Mvou',
      'Arrondissement 3 Tié-Tié',
      'Arrondissement 4 Loandjili',
      'Arrondissement 5 Mongo-Poukou',
      'Arrondissement 6 Ngoyo',
      'District de Tchiamba-Nzassi'
    ]
  },
  {
    id: 'pool',
    name: 'Pool',
    code: 'POL',
    chefLieu: 'Kinkala',
    communesAndDistricts: [
      'Commune de Kinkala',
      'District de Mindouli',
      'District de Boko',
      'District de Kindamba',
      'District de Ngabé',
      'District de Mayama',
      'District d\'Ignié',
      'District de Louingui',
      'District de Goma Tsé-Tsé',
      'District de Vinza',
      'District de Mbandza-Ndounga'
    ]
  },
  {
    id: 'bouenza',
    name: 'Bouenza',
    code: 'BZA',
    chefLieu: 'Madingou',
    communesAndDistricts: [
      'Commune de Nkayi',
      'Commune de Madingou',
      'Commune de Loutété',
      'District de Mouyondzi',
      'District de Loudima',
      'District de Mabombo',
      'District de Boko-Songho',
      'District de Kingoué',
      'District de Tsiaki',
      'District de Yamba'
    ]
  },
  {
    id: 'niari',
    name: 'Niari',
    code: 'NRI',
    chefLieu: 'Dolisie',
    communesAndDistricts: [
      'Commune de Dolisie',
      'Commune de Mossendjo',
      'District de Kibangou',
      'District de Louvakou',
      'District de Makabana',
      'District de Mayoko',
      'District de Moutamba',
      'District de Banda',
      'District de Londéla-Kayes',
      'District de Nyanga'
    ]
  },
  {
    id: 'kouilou',
    name: 'Kouilou',
    code: 'KLU',
    chefLieu: 'Loango',
    communesAndDistricts: [
      'Commune de Loango',
      'District de Hinda',
      'District de Madingo-Kayes',
      'District de Kakamoéka',
      'District de Mvouti',
      'District de Nzambi'
    ]
  },
  {
    id: 'cuvette',
    name: 'Cuvette',
    code: 'CVT',
    chefLieu: 'Owando',
    communesAndDistricts: [
      'Commune d\'Owando',
      'Commune d\'Oyo',
      'District de Boundji',
      'District de Makoua',
      'District de Mossaka',
      'District de Loukoléla',
      'District de Ngoko',
      'District de Tchikapika',
      'District de Tokou'
    ]
  },
  {
    id: 'cuvette_ouest',
    name: 'Cuvette-Ouest',
    code: 'CVO',
    chefLieu: 'Ewo',
    communesAndDistricts: [
      'Commune d\'Ewo',
      'District de Kéllé',
      'District d\'Okoyo',
      'District de Mbomo',
      'District d\'Etoumbi',
      'District de Mbama'
    ]
  },
  {
    id: 'plateaux',
    name: 'Plateaux',
    code: 'PLT',
    chefLieu: 'Djambala',
    communesAndDistricts: [
      'Commune de Djambala',
      'Commune de Gamboma',
      'District de Ngo',
      'District de Lékana',
      'District de Mpouya',
      'District d\'Allembé',
      'District d\'Ongogni',
      'District de Makotimpoko'
    ]
  },
  {
    id: 'sangha',
    name: 'Sangha',
    code: 'SGH',
    chefLieu: 'Ouesso',
    communesAndDistricts: [
      'Commune d\'Ouesso',
      'Commune de Pokola',
      'District de Mokéko',
      'District de Sembé',
      'District de Souanké',
      'District de Ngbala',
      'District de Kabo'
    ]
  },
  {
    id: 'likouala',
    name: 'Likouala',
    code: 'LKL',
    chefLieu: 'Impfondo',
    communesAndDistricts: [
      'Commune d\'Impfondo',
      'District de Dongou',
      'District de Bétou',
      'District d\'Enyellé',
      'District d\'Epéna',
      'District de Liranga',
      'District de Bouanila'
    ]
  },
  {
    id: 'lekoumou',
    name: 'Lékoumou',
    code: 'LKM',
    chefLieu: 'Sibiti',
    communesAndDistricts: [
      'Commune de Sibiti',
      'District de Komono',
      'District de Zanaga',
      'District de Bambama',
      'District de Mayéyé'
    ]
  }
];

export const CONGO_COMMUNES = [
  'Arrondissement 1 Makélékélé',
  'Arrondissement 2 Bacongo',
  'Arrondissement 3 Poto-Poto',
  'Arrondissement 4 Moungali',
  'Arrondissement 5 Ouenzé',
  'Arrondissement 6 Talangaï',
  'Arrondissement 7 Mfilou',
  'Arrondissement 8 Madibou',
  'Arrondissement 9 Djiri',
  'Arrondissement 1 Emery Patrice Lumumba',
  'Arrondissement 2 Mvou-Mvou',
  'Arrondissement 3 Tié-Tié',
  'Arrondissement 4 Loandjili',
  'Arrondissement 5 Mongo-Poukou',
  'Arrondissement 6 Ngoyo',
  'Commune de Dolisie',
  'Commune de Nkayi',
  'Commune de Ouesso',
  'Commune d\'Oyo',
  'Commune d\'Owando',
  'Commune de Kinkala',
  'Commune de Djambala',
  'Commune de Sibiti',
  'Commune de Madingou',
  'Commune d\'Impfondo',
  'Autre District Urbain / Rural'
];

export const SCHOOL_ATTRIBUTIONS = [
  'Complexe Scolaire',
  'Lycée d\'Enseignement Général',
  'Lycée Technique & Commercial',
  'Collège d\'Enseignement Général (CEG)',
  'École Primaire & Maternelle',
  'Centre de Formation Professionnelle & Métiers',
  'Académie Privée d\'Excellence'
];

export const SCHOOL_TYPES_LIST = [
  { id: 'complexe', label: 'Complexe Scolaire Intégré (Maternelle, Primaire, Collège, Lycée)', baseRate: 25000 },
  { id: 'secondaire', label: 'Collège & Lycée Secondaire (BEPC & BAC)', baseRate: 25000 },
  { id: 'primaire', label: 'École Maternelle & Primaire (CP1 - CM2 / CEPE)', baseRate: 25000 },
  { id: 'professionnel', label: 'Formation Technique, Professionnelle & Métiers', baseRate: 25000 }
];

export const ADMIN_FUNCTIONS = [
  'Promoteur / Fondateur',
  'Directeur Général',
  'Proviseur',
  'Principal',
  'Censeur des Études',
  'Directeur des Études (D.E)',
  'Secrétaire Général',
  'Responsable Administratif & Financier (RAF)',
  'Économe / Responsable de Gestion',
  'Chef d\'Établissement'
];
