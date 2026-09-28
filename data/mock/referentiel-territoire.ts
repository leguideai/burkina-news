// 🇧🇫 BURKINA NEWS · RÉFÉRENTIEL OFFICIEL DES CIRCONSCRIPTIONS ADMINISTRATIVES
// Réforme officielle : 17 Régions · 47 Provinces · 351 Communes / Départements
// Source : Décret portant réorganisation territoriale et découpage administratif (350 départements, 351 communes)

export interface CommuneItem {
  num: number;
  commune: string;
  typeCommune: "rurale" | "urbaine" | "urbaine à statut particulier";
  province: string;
  region: string;
  statutChefLieu?: string;
  chefLieu?: string;
}

export interface RegionStructure {
  region: string;
  provinces: string[];
  communesCount: number;
}

export const BURKINA_COMMUNES_351: CommuneItem[] = [
  {
    "num": 1,
    "commune": "Bagassi",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 2,
    "commune": "Bana",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 3,
    "commune": "Boromo",
    "typeCommune": "urbaine",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Boromo"
  },
  {
    "num": 4,
    "commune": "Fara",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 5,
    "commune": "Oury",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 6,
    "commune": "Pompoï",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 7,
    "commune": "Poura",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 8,
    "commune": "Pâ",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 9,
    "commune": "Siby",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 10,
    "commune": "Yaho",
    "typeCommune": "rurale",
    "province": "Balé",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 11,
    "commune": "Balavé",
    "typeCommune": "rurale",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 12,
    "commune": "Kouka",
    "typeCommune": "rurale",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 13,
    "commune": "Sami",
    "typeCommune": "rurale",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 14,
    "commune": "Sanaba",
    "typeCommune": "rurale",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 15,
    "commune": "Solenzo",
    "typeCommune": "urbaine",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Solenzo"
  },
  {
    "num": 16,
    "commune": "Tansila",
    "typeCommune": "rurale",
    "province": "Banwa",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 17,
    "commune": "Bondokuy",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 18,
    "commune": "Douroula",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 19,
    "commune": "Dédougou",
    "typeCommune": "urbaine",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Dédougou"
  },
  {
    "num": 20,
    "commune": "Kona",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 21,
    "commune": "Ouarkoye",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 22,
    "commune": "Safané",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 23,
    "commune": "Tchériba",
    "typeCommune": "rurale",
    "province": "Mouhoun",
    "region": "Bankui",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 24,
    "commune": "Bondigui",
    "typeCommune": "rurale",
    "province": "Bougouriba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 25,
    "commune": "Diébougou",
    "typeCommune": "urbaine",
    "province": "Bougouriba",
    "region": "Djôrô",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Diébougou"
  },
  {
    "num": 26,
    "commune": "Dolo",
    "typeCommune": "rurale",
    "province": "Bougouriba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 27,
    "commune": "Iolonioro",
    "typeCommune": "rurale",
    "province": "Bougouriba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 28,
    "commune": "Tiankoura",
    "typeCommune": "rurale",
    "province": "Bougouriba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 29,
    "commune": "Dano",
    "typeCommune": "urbaine",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Dano"
  },
  {
    "num": 30,
    "commune": "Dissin",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 31,
    "commune": "Guéguéré",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 32,
    "commune": "Koper",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 33,
    "commune": "Niégo",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 34,
    "commune": "Oronkua",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 35,
    "commune": "Ouessa",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 36,
    "commune": "Zambo",
    "typeCommune": "rurale",
    "province": "Ioba",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 37,
    "commune": "Batié",
    "typeCommune": "urbaine",
    "province": "Noumbiel",
    "region": "Djôrô",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Batié"
  },
  {
    "num": 38,
    "commune": "Boussoukoula",
    "typeCommune": "rurale",
    "province": "Noumbiel",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 39,
    "commune": "Kpuéré",
    "typeCommune": "rurale",
    "province": "Noumbiel",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 40,
    "commune": "Legmoin",
    "typeCommune": "rurale",
    "province": "Noumbiel",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 41,
    "commune": "Midébdo",
    "typeCommune": "rurale",
    "province": "Noumbiel",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 42,
    "commune": "Bouroum-Bouroum",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 43,
    "commune": "Bousséra",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 44,
    "commune": "Djigoué",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 45,
    "commune": "Gaoua",
    "typeCommune": "urbaine",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Gaoua"
  },
  {
    "num": 46,
    "commune": "Gbomblora",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 47,
    "commune": "Kampti",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 48,
    "commune": "Loropéni",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 49,
    "commune": "Malba",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 50,
    "commune": "Nako",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 51,
    "commune": "Périgban",
    "typeCommune": "rurale",
    "province": "Poni",
    "region": "Djôrô",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 52,
    "commune": "Diabo",
    "typeCommune": "rurale",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 53,
    "commune": "Diapangou",
    "typeCommune": "rurale",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 54,
    "commune": "Fada N'Gourma",
    "typeCommune": "urbaine",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Fada N'Gourma"
  },
  {
    "num": 55,
    "commune": "Matiacoali",
    "typeCommune": "rurale",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 56,
    "commune": "Tibga",
    "typeCommune": "rurale",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 57,
    "commune": "Yamba",
    "typeCommune": "rurale",
    "province": "Gourma",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 58,
    "commune": "Kompienga",
    "typeCommune": "rurale",
    "province": "Kompienga",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 59,
    "commune": "Madjoari",
    "typeCommune": "rurale",
    "province": "Kompienga",
    "region": "Goulmou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 60,
    "commune": "Pama",
    "typeCommune": "urbaine",
    "province": "Kompienga",
    "region": "Goulmou",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Pama"
  },
  {
    "num": 61,
    "commune": "Bama",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 62,
    "commune": "Bobo-Dioulasso",
    "typeCommune": "urbaine à statut particulier",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "Chef-lieu de province et de région, ancienne capitale",
    "chefLieu": "Bobo-Dioulasso"
  },
  {
    "num": 63,
    "commune": "Dandé",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 64,
    "commune": "Faramana",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 65,
    "commune": "Fô",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 66,
    "commune": "Karangasso-Sambla",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 67,
    "commune": "Karangasso-Vigué",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 68,
    "commune": "Koundougou",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 69,
    "commune": "Léna",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 70,
    "commune": "Padéma",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 71,
    "commune": "Péni",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 72,
    "commune": "Satiri",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 73,
    "commune": "Toussiana",
    "typeCommune": "rurale",
    "province": "Houet",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 74,
    "commune": "Banzon",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 75,
    "commune": "Djigouéra",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 76,
    "commune": "Kangala",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 77,
    "commune": "Kayan",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 78,
    "commune": "Koloko",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 79,
    "commune": "Kourignon",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 80,
    "commune": "Kourouma",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 81,
    "commune": "Morolaba",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 82,
    "commune": "N'Dorola",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 83,
    "commune": "Orodara",
    "typeCommune": "urbaine",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Orodara"
  },
  {
    "num": 84,
    "commune": "Samogohiri",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 85,
    "commune": "Samorogouan",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 86,
    "commune": "Sindo",
    "typeCommune": "rurale",
    "province": "Kénédougou",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 87,
    "commune": "Boni",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 88,
    "commune": "Békuy",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 89,
    "commune": "Béréba",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 90,
    "commune": "Founzan",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 91,
    "commune": "Houndé",
    "typeCommune": "urbaine",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Houndé"
  },
  {
    "num": 92,
    "commune": "Koti",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 93,
    "commune": "Koumbia",
    "typeCommune": "rurale",
    "province": "Tuy",
    "region": "Guiriko",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 94,
    "commune": "Komki-Ipala",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 95,
    "commune": "Komsilga",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 96,
    "commune": "Koubri",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 97,
    "commune": "Ouagadougou",
    "typeCommune": "urbaine à statut particulier",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "Chef-lieu de province et de région, capitale nationale",
    "chefLieu": "Ouagadougou"
  },
  {
    "num": 98,
    "commune": "Pabré",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 99,
    "commune": "Saaba",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 100,
    "commune": "Tanghin-Dassouri",
    "typeCommune": "rurale",
    "province": "Kadiogo",
    "region": "Kadiogo",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 101,
    "commune": "Bourzanga",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 102,
    "commune": "Guibaré",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 103,
    "commune": "Kongoussi",
    "typeCommune": "urbaine",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Kongoussi"
  },
  {
    "num": 104,
    "commune": "Nasséré",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 105,
    "commune": "Rollo",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 106,
    "commune": "Rouko",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 107,
    "commune": "Sabcé",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 108,
    "commune": "Tikaré",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 109,
    "commune": "Zimtenga",
    "typeCommune": "rurale",
    "province": "Bam",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 110,
    "commune": "Boala",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 111,
    "commune": "Boulsa",
    "typeCommune": "urbaine",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Boulsa"
  },
  {
    "num": 112,
    "commune": "Bouroum",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 113,
    "commune": "Dargo",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 114,
    "commune": "Nagbingou",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 115,
    "commune": "Tougouri",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 116,
    "commune": "Yalgo",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 117,
    "commune": "Zéguédéguin",
    "typeCommune": "rurale",
    "province": "Namentenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 118,
    "commune": "Barsalogho",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 119,
    "commune": "Boussouma",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 120,
    "commune": "Dablo",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 121,
    "commune": "Kaya",
    "typeCommune": "urbaine",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Kaya"
  },
  {
    "num": 122,
    "commune": "Korsimoro",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 123,
    "commune": "Mané",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 124,
    "commune": "Namissiguima",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 125,
    "commune": "Pensa",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 126,
    "commune": "Pibaoré",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 127,
    "commune": "Pissila",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 128,
    "commune": "Ziga",
    "typeCommune": "rurale",
    "province": "Sandbondtenga",
    "region": "Kuilsé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 129,
    "commune": "Déou",
    "typeCommune": "rurale",
    "province": "Oudalan",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 130,
    "commune": "Gorom-Gorom",
    "typeCommune": "urbaine",
    "province": "Oudalan",
    "region": "Liptako",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Gorom-Gorom"
  },
  {
    "num": 131,
    "commune": "Markoye",
    "typeCommune": "rurale",
    "province": "Oudalan",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 132,
    "commune": "Oursi",
    "typeCommune": "rurale",
    "province": "Oudalan",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 133,
    "commune": "Tin-Akoff",
    "typeCommune": "rurale",
    "province": "Oudalan",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 134,
    "commune": "Bani",
    "typeCommune": "rurale",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 135,
    "commune": "Dori",
    "typeCommune": "urbaine",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Dori"
  },
  {
    "num": 136,
    "commune": "Falangountou",
    "typeCommune": "rurale",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 137,
    "commune": "Gorgadji",
    "typeCommune": "rurale",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 138,
    "commune": "Sampelga",
    "typeCommune": "rurale",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 139,
    "commune": "Seytenga",
    "typeCommune": "rurale",
    "province": "Séno",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 140,
    "commune": "Boundoré",
    "typeCommune": "rurale",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 141,
    "commune": "Mansila",
    "typeCommune": "rurale",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 142,
    "commune": "Solhan",
    "typeCommune": "rurale",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 143,
    "commune": "Sébba",
    "typeCommune": "urbaine",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Sébba"
  },
  {
    "num": 144,
    "commune": "Tankougounadié",
    "typeCommune": "rurale",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 145,
    "commune": "Titabé",
    "typeCommune": "rurale",
    "province": "Yagha",
    "region": "Liptako",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 146,
    "commune": "Bagré",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 147,
    "commune": "Bané",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 148,
    "commune": "Bissiga",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 149,
    "commune": "Bitou",
    "typeCommune": "urbaine",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": "Bitou"
  },
  {
    "num": 150,
    "commune": "Boussouma",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 151,
    "commune": "Béguédo",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 152,
    "commune": "Garango",
    "typeCommune": "urbaine",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": "Garango"
  },
  {
    "num": 153,
    "commune": "Komtoèga",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 154,
    "commune": "Niaogho",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 155,
    "commune": "Tenkodogo",
    "typeCommune": "urbaine",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Tenkodogo"
  },
  {
    "num": 156,
    "commune": "Zabré",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 157,
    "commune": "Zoaga",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 158,
    "commune": "Zonsé",
    "typeCommune": "rurale",
    "province": "Boulgou",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 159,
    "commune": "Comin-Yanga",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 160,
    "commune": "Dourtenga",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 161,
    "commune": "Lalgaye",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 162,
    "commune": "Ouargaye",
    "typeCommune": "urbaine",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Ouargaye"
  },
  {
    "num": 163,
    "commune": "Sangha",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 164,
    "commune": "Soudougui",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 165,
    "commune": "Yargatenga",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 166,
    "commune": "Yondé",
    "typeCommune": "rurale",
    "province": "Koulpelogo",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 167,
    "commune": "Andemtenga",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 168,
    "commune": "Baskouré",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 169,
    "commune": "Dialgaye",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 170,
    "commune": "Gounghin",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 171,
    "commune": "Kando",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 172,
    "commune": "Koupéla",
    "typeCommune": "urbaine",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Koupéla"
  },
  {
    "num": 173,
    "commune": "Pouytenga",
    "typeCommune": "urbaine",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": "Pouytenga"
  },
  {
    "num": 174,
    "commune": "Tensobentenga",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 175,
    "commune": "Yargo",
    "typeCommune": "rurale",
    "province": "Kourittenga",
    "region": "Nakambé",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 176,
    "commune": "Bingo",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 177,
    "commune": "Imasgo",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 178,
    "commune": "Kindi",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 179,
    "commune": "Kokologo",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 180,
    "commune": "Koudougou",
    "typeCommune": "urbaine",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Koudougou"
  },
  {
    "num": 181,
    "commune": "Nandiala",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 182,
    "commune": "Nanoro",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 183,
    "commune": "Pella",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 184,
    "commune": "Poa",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 185,
    "commune": "Ramongo",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 186,
    "commune": "Sabou",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 187,
    "commune": "Siglé",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 188,
    "commune": "Soaw",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 189,
    "commune": "Sourgou",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 190,
    "commune": "Thyou",
    "typeCommune": "rurale",
    "province": "Boulkiemdé",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 191,
    "commune": "Dassa",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 192,
    "commune": "Didyr",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 193,
    "commune": "Godyr",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 194,
    "commune": "Kordié",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 195,
    "commune": "Kyon",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 196,
    "commune": "Pouni",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 197,
    "commune": "Réo",
    "typeCommune": "urbaine",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Réo"
  },
  {
    "num": 198,
    "commune": "Ténado",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 199,
    "commune": "Zamo",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 200,
    "commune": "Zawara",
    "typeCommune": "rurale",
    "province": "Sanguié",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 201,
    "commune": "Biéha",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 202,
    "commune": "Boura",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 203,
    "commune": "Léo",
    "typeCommune": "urbaine",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Léo"
  },
  {
    "num": 204,
    "commune": "Niabouri",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 205,
    "commune": "Nébiélianayou",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 206,
    "commune": "Silly",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 207,
    "commune": "Tô",
    "typeCommune": "rurale",
    "province": "Sissili",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 208,
    "commune": "Bakata",
    "typeCommune": "rurale",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 209,
    "commune": "Bougnounou",
    "typeCommune": "rurale",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 210,
    "commune": "Cassou",
    "typeCommune": "rurale",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 211,
    "commune": "Dalo",
    "typeCommune": "rurale",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 212,
    "commune": "Gao",
    "typeCommune": "rurale",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 213,
    "commune": "Sapouy",
    "typeCommune": "urbaine",
    "province": "Ziro",
    "region": "Nando",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Sapouy"
  },
  {
    "num": 214,
    "commune": "Doulougou",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 215,
    "commune": "Gaongo",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 216,
    "commune": "Ipelcé",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 217,
    "commune": "Kayao",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 218,
    "commune": "Kombissiri",
    "typeCommune": "urbaine",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Kombissiri"
  },
  {
    "num": 219,
    "commune": "Saponé",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 220,
    "commune": "Toécé",
    "typeCommune": "rurale",
    "province": "Bazèga",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 221,
    "commune": "Guiaro",
    "typeCommune": "rurale",
    "province": "Nahouri",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 222,
    "commune": "Pô",
    "typeCommune": "urbaine",
    "province": "Nahouri",
    "region": "Nazinon",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Pô"
  },
  {
    "num": 223,
    "commune": "Tiébélé",
    "typeCommune": "rurale",
    "province": "Nahouri",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 224,
    "commune": "Zecco",
    "typeCommune": "rurale",
    "province": "Nahouri",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 225,
    "commune": "Ziou",
    "typeCommune": "rurale",
    "province": "Nahouri",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 226,
    "commune": "Bindé",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 227,
    "commune": "Béré",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 228,
    "commune": "Gogo",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 229,
    "commune": "Gomboussougou",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 230,
    "commune": "Guiba",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 231,
    "commune": "Manga",
    "typeCommune": "urbaine",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Manga"
  },
  {
    "num": 232,
    "commune": "Nobéré",
    "typeCommune": "rurale",
    "province": "Zoundwéogo",
    "region": "Nazinon",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 233,
    "commune": "Absouya",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 234,
    "commune": "Dapélogo",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 235,
    "commune": "Loumbila",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 236,
    "commune": "Nagréongo",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 237,
    "commune": "Ourgou-Manéga",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 238,
    "commune": "Ziniaré",
    "typeCommune": "urbaine",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Ziniaré"
  },
  {
    "num": 239,
    "commune": "Zitenga",
    "typeCommune": "rurale",
    "province": "Bassitenga",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 240,
    "commune": "Boudry",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 241,
    "commune": "Kogho",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 242,
    "commune": "Mogtédo",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 243,
    "commune": "Méguet",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 244,
    "commune": "Salogo",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 245,
    "commune": "Zam",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 246,
    "commune": "Zorgho",
    "typeCommune": "urbaine",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Zorgho"
  },
  {
    "num": 247,
    "commune": "Zoungou",
    "typeCommune": "rurale",
    "province": "Ganzourgou",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 248,
    "commune": "Boussé",
    "typeCommune": "urbaine",
    "province": "Kourwéogo",
    "region": "Oubri",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Boussé"
  },
  {
    "num": 249,
    "commune": "Laye",
    "typeCommune": "rurale",
    "province": "Kourwéogo",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 250,
    "commune": "Niou",
    "typeCommune": "rurale",
    "province": "Kourwéogo",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 251,
    "commune": "Sourgoubila",
    "typeCommune": "rurale",
    "province": "Kourwéogo",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 252,
    "commune": "Toéghin",
    "typeCommune": "rurale",
    "province": "Kourwéogo",
    "region": "Oubri",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 253,
    "commune": "Bilanga",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 254,
    "commune": "Bogandé",
    "typeCommune": "urbaine",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Bogandé"
  },
  {
    "num": 255,
    "commune": "Coalla",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 256,
    "commune": "Liptougou",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 257,
    "commune": "Manni",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 258,
    "commune": "Piéla",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 259,
    "commune": "Thion",
    "typeCommune": "rurale",
    "province": "Gnagna",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 260,
    "commune": "Bartiébougou",
    "typeCommune": "rurale",
    "province": "Komondjari",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 261,
    "commune": "Foutouri",
    "typeCommune": "rurale",
    "province": "Komondjari",
    "region": "Sirba",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 262,
    "commune": "Gayéri",
    "typeCommune": "urbaine",
    "province": "Komondjari",
    "region": "Sirba",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Gayéri"
  },
  {
    "num": 263,
    "commune": "Baraboulé",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 264,
    "commune": "Djibo",
    "typeCommune": "urbaine",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Djibo"
  },
  {
    "num": 265,
    "commune": "Djiguel",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 266,
    "commune": "Kelbo",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 267,
    "commune": "Nassoumbou",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 268,
    "commune": "Pobé-Mengao",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 269,
    "commune": "Tongomayel",
    "typeCommune": "rurale",
    "province": "Djelgodji",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 270,
    "commune": "Arbinda",
    "typeCommune": "rurale",
    "province": "Karo-Peli",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 271,
    "commune": "Koutougou",
    "typeCommune": "rurale",
    "province": "Karo-Peli",
    "region": "Soum",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 272,
    "commune": "Barani",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 273,
    "commune": "Bomborokuy",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 274,
    "commune": "Bourasso",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 275,
    "commune": "Djibasso",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 276,
    "commune": "Dokuy",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 277,
    "commune": "Doumbala",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 278,
    "commune": "Kombori",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 279,
    "commune": "Madouba",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 280,
    "commune": "Nouna",
    "typeCommune": "urbaine",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Nouna"
  },
  {
    "num": 281,
    "commune": "Sono",
    "typeCommune": "rurale",
    "province": "Koosin",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 282,
    "commune": "Gassan",
    "typeCommune": "rurale",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 283,
    "commune": "Gossina",
    "typeCommune": "rurale",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 284,
    "commune": "Kougny",
    "typeCommune": "rurale",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 285,
    "commune": "Toma",
    "typeCommune": "urbaine",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Toma"
  },
  {
    "num": 286,
    "commune": "Yaba",
    "typeCommune": "rurale",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 287,
    "commune": "Yé",
    "typeCommune": "rurale",
    "province": "Nayala",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 288,
    "commune": "Di",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 289,
    "commune": "Gomboro",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 290,
    "commune": "Kassoum",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 291,
    "commune": "Kiembara",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 292,
    "commune": "Lanfièra",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 293,
    "commune": "Lankoué",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 294,
    "commune": "Tougan",
    "typeCommune": "urbaine",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Tougan"
  },
  {
    "num": 295,
    "commune": "Toéni",
    "typeCommune": "rurale",
    "province": "Sourou",
    "region": "Sourou",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 296,
    "commune": "Banfora",
    "typeCommune": "urbaine",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Banfora"
  },
  {
    "num": 297,
    "commune": "Bérégadougou",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 298,
    "commune": "Mangodara",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 299,
    "commune": "Moussodougou",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 300,
    "commune": "Niangoloko",
    "typeCommune": "urbaine",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": "Niangoloko"
  },
  {
    "num": 301,
    "commune": "Ouo",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 302,
    "commune": "Sidéradougou",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 303,
    "commune": "Soubakaniédougou",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 304,
    "commune": "Tiéfora",
    "typeCommune": "rurale",
    "province": "Comoé",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 305,
    "commune": "Dakoro",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 306,
    "commune": "Douna",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 307,
    "commune": "Kankalaba",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 308,
    "commune": "Loumana",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 309,
    "commune": "Niankorodougou",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 310,
    "commune": "Ouéléni",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 311,
    "commune": "Sindou",
    "typeCommune": "urbaine",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Sindou"
  },
  {
    "num": 312,
    "commune": "Wolonkoto",
    "typeCommune": "rurale",
    "province": "Léraba",
    "region": "Tannounyan",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 313,
    "commune": "Botou",
    "typeCommune": "rurale",
    "province": "Dyamongou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 314,
    "commune": "Kantchari",
    "typeCommune": "rurale",
    "province": "Dyamongou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 315,
    "commune": "Diapaga",
    "typeCommune": "urbaine",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Diapaga"
  },
  {
    "num": 316,
    "commune": "Logobou",
    "typeCommune": "rurale",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 317,
    "commune": "Namounou",
    "typeCommune": "rurale",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 318,
    "commune": "Partiaga",
    "typeCommune": "rurale",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 319,
    "commune": "Tambaga",
    "typeCommune": "rurale",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 320,
    "commune": "Tansarga",
    "typeCommune": "rurale",
    "province": "Gobnangou",
    "region": "Tapoa",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 321,
    "commune": "Banh",
    "typeCommune": "rurale",
    "province": "Lorum",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 322,
    "commune": "Ouindigui",
    "typeCommune": "rurale",
    "province": "Lorum",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 323,
    "commune": "Sollé",
    "typeCommune": "rurale",
    "province": "Lorum",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 324,
    "commune": "Titao",
    "typeCommune": "urbaine",
    "province": "Lorum",
    "region": "Yaadga",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Titao"
  },
  {
    "num": 325,
    "commune": "Arbollé",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 326,
    "commune": "Bagaré",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 327,
    "commune": "Bokin",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 328,
    "commune": "Gomponsom",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 329,
    "commune": "Kirsi",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 330,
    "commune": "Lâ-Todin",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 331,
    "commune": "Pilimpikou",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 332,
    "commune": "Samba",
    "typeCommune": "rurale",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 333,
    "commune": "Yako",
    "typeCommune": "urbaine",
    "province": "Passoré",
    "region": "Yaadga",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Yako"
  },
  {
    "num": 334,
    "commune": "Barga",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 335,
    "commune": "Kalsaga",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 336,
    "commune": "Kaïn",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 337,
    "commune": "Kossouka",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 338,
    "commune": "Koumbri",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 339,
    "commune": "Namissiguima",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 340,
    "commune": "Ouahigouya",
    "typeCommune": "urbaine",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "Chef-lieu de province et de région",
    "chefLieu": "Ouahigouya"
  },
  {
    "num": 341,
    "commune": "Oula",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 342,
    "commune": "Rambo",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 343,
    "commune": "Séguénéga",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 344,
    "commune": "Tangaye",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 345,
    "commune": "Thiou",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 346,
    "commune": "Zogoré",
    "typeCommune": "rurale",
    "province": "Yatenga",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 347,
    "commune": "Bassi",
    "typeCommune": "rurale",
    "province": "Zondoma",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 348,
    "commune": "Boussou",
    "typeCommune": "rurale",
    "province": "Zondoma",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 349,
    "commune": "Gourcy",
    "typeCommune": "urbaine",
    "province": "Zondoma",
    "region": "Yaadga",
    "statutChefLieu": "Chef-lieu de province",
    "chefLieu": "Gourcy"
  },
  {
    "num": 350,
    "commune": "Léba",
    "typeCommune": "rurale",
    "province": "Zondoma",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  },
  {
    "num": 351,
    "commune": "Tougo",
    "typeCommune": "rurale",
    "province": "Zondoma",
    "region": "Yaadga",
    "statutChefLieu": "",
    "chefLieu": ""
  }
];

export const BURKINA_REGIONS_17: string[] = [
  "Bankui",
  "Djôrô",
  "Goulmou",
  "Guiriko",
  "Kadiogo",
  "Kuilsé",
  "Liptako",
  "Nakambé",
  "Nando",
  "Nazinon",
  "Oubri",
  "Sirba",
  "Soum",
  "Sourou",
  "Tannounyan",
  "Tapoa",
  "Yaadga"
];

// Mapping Région -> Provinces associées
export const REGION_PROVINCES_MAP: Record<string, string[]> = {
  "Bankui": ["Balé", "Banwa", "Mouhoun"],
  "Djôrô": ["Bougouriba", "Ioba", "Noumbiel", "Poni"],
  "Goulmou": ["Gourma", "Kompienga"],
  "Guiriko": ["Houet", "Kénédougou", "Tuy"],
  "Kadiogo": ["Kadiogo"],
  "Kuilsé": ["Bam", "Namentenga", "Sandbondtenga"],
  "Liptako": ["Oudalan", "Séno", "Yagha"],
  "Nakambé": ["Boulgou", "Koulpelogo", "Kourittenga"],
  "Nando": ["Boulkiemdé", "Sanguié", "Sissili", "Ziro"],
  "Nazinon": ["Bazèga", "Nahouri", "Zoundwéogo"],
  "Oubri": ["Bassitenga", "Ganzourgou", "Kourwéogo"],
  "Sirba": ["Gnagna", "Komondjari"],
  "Soum": ["Djelgodji", "Karo-Peli"],
  "Sourou": ["Koosin", "Nayala", "Sourou"],
  "Tannounyan": ["Comoé", "Léraba"],
  "Tapoa": ["Dyamongou", "Gobnangou"],
  "Yaadga": ["Lorum", "Passoré", "Yatenga", "Zondoma"],
};

// Mapping Province -> Communes associées
export const PROVINCE_COMMUNES_MAP: Record<string, string[]> = {
  "Balé": ["Bagassi", "Bana", "Boromo", "Fara", "Oury", "Pompoï", "Poura", "Pâ", "Siby", "Yaho"],
  "Bam": ["Bourzanga", "Guibaré", "Kongoussi", "Nasséré", "Rollo", "Rouko", "Sabcé", "Tikaré", "Zimtenga"],
  "Banwa": ["Balavé", "Kouka", "Sami", "Sanaba", "Solenzo", "Tansila"],
  "Bassitenga": ["Absouya", "Dapélogo", "Loumbila", "Nagréongo", "Ourgou-Manéga", "Ziniaré", "Zitenga"],
  "Bazèga": ["Doulougou", "Gaongo", "Ipelcé", "Kayao", "Kombissiri", "Saponé", "Toécé"],
  "Bougouriba": ["Bondigui", "Diébougou", "Dolo", "Iolonioro", "Tiankoura"],
  "Boulgou": ["Bagré", "Bané", "Bissiga", "Bitou", "Boussouma", "Béguédo", "Garango", "Komtoèga", "Niaogho", "Tenkodogo", "Zabré", "Zoaga", "Zonsé"],
  "Boulkiemdé": ["Bingo", "Imasgo", "Kindi", "Kokologo", "Koudougou", "Nandiala", "Nanoro", "Pella", "Poa", "Ramongo", "Sabou", "Siglé", "Soaw", "Sourgou", "Thyou"],
  "Comoé": ["Banfora", "Bérégadougou", "Mangodara", "Moussodougou", "Niangoloko", "Ouo", "Sidéradougou", "Soubakaniédougou", "Tiéfora"],
  "Djelgodji": ["Baraboulé", "Djibo", "Djiguel", "Kelbo", "Nassoumbou", "Pobé-Mengao", "Tongomayel"],
  "Dyamongou": ["Botou", "Kantchari"],
  "Ganzourgou": ["Boudry", "Kogho", "Mogtédo", "Méguet", "Salogo", "Zam", "Zorgho", "Zoungou"],
  "Gnagna": ["Bilanga", "Bogandé", "Coalla", "Liptougou", "Manni", "Piéla", "Thion"],
  "Gobnangou": ["Diapaga", "Logobou", "Namounou", "Partiaga", "Tambaga", "Tansarga"],
  "Gourma": ["Diabo", "Diapangou", "Fada N'Gourma", "Matiacoali", "Tibga", "Yamba"],
  "Houet": ["Bama", "Bobo-Dioulasso", "Dandé", "Faramana", "Fô", "Karangasso-Sambla", "Karangasso-Vigué", "Koundougou", "Léna", "Padéma", "Péni", "Satiri", "Toussiana"],
  "Ioba": ["Dano", "Dissin", "Guéguéré", "Koper", "Niégo", "Oronkua", "Ouessa", "Zambo"],
  "Kadiogo": ["Komki-Ipala", "Komsilga", "Koubri", "Ouagadougou", "Pabré", "Saaba", "Tanghin-Dassouri"],
  "Karo-Peli": ["Arbinda", "Koutougou"],
  "Komondjari": ["Bartiébougou", "Foutouri", "Gayéri"],
  "Kompienga": ["Kompienga", "Madjoari", "Pama"],
  "Koosin": ["Barani", "Bomborokuy", "Bourasso", "Djibasso", "Dokuy", "Doumbala", "Kombori", "Madouba", "Nouna", "Sono"],
  "Koulpelogo": ["Comin-Yanga", "Dourtenga", "Lalgaye", "Ouargaye", "Sangha", "Soudougui", "Yargatenga", "Yondé"],
  "Kourittenga": ["Andemtenga", "Baskouré", "Dialgaye", "Gounghin", "Kando", "Koupéla", "Pouytenga", "Tensobentenga", "Yargo"],
  "Kourwéogo": ["Boussé", "Laye", "Niou", "Sourgoubila", "Toéghin"],
  "Kénédougou": ["Banzon", "Djigouéra", "Kangala", "Kayan", "Koloko", "Kourignon", "Kourouma", "Morolaba", "N'Dorola", "Orodara", "Samogohiri", "Samorogouan", "Sindo"],
  "Lorum": ["Banh", "Ouindigui", "Sollé", "Titao"],
  "Léraba": ["Dakoro", "Douna", "Kankalaba", "Loumana", "Niankorodougou", "Ouéléni", "Sindou", "Wolonkoto"],
  "Mouhoun": ["Bondokuy", "Douroula", "Dédougou", "Kona", "Ouarkoye", "Safané", "Tchériba"],
  "Nahouri": ["Guiaro", "Pô", "Tiébélé", "Zecco", "Ziou"],
  "Namentenga": ["Boala", "Boulsa", "Bouroum", "Dargo", "Nagbingou", "Tougouri", "Yalgo", "Zéguédéguin"],
  "Nayala": ["Gassan", "Gossina", "Kougny", "Toma", "Yaba", "Yé"],
  "Noumbiel": ["Batié", "Boussoukoula", "Kpuéré", "Legmoin", "Midébdo"],
  "Oudalan": ["Déou", "Gorom-Gorom", "Markoye", "Oursi", "Tin-Akoff"],
  "Passoré": ["Arbollé", "Bagaré", "Bokin", "Gomponsom", "Kirsi", "Lâ-Todin", "Pilimpikou", "Samba", "Yako"],
  "Poni": ["Bouroum-Bouroum", "Bousséra", "Djigoué", "Gaoua", "Gbomblora", "Kampti", "Loropéni", "Malba", "Nako", "Périgban"],
  "Sandbondtenga": ["Barsalogho", "Boussouma", "Dablo", "Kaya", "Korsimoro", "Mané", "Namissiguima", "Pensa", "Pibaoré", "Pissila", "Ziga"],
  "Sanguié": ["Dassa", "Didyr", "Godyr", "Kordié", "Kyon", "Pouni", "Réo", "Ténado", "Zamo", "Zawara"],
  "Sissili": ["Biéha", "Boura", "Léo", "Niabouri", "Nébiélianayou", "Silly", "Tô"],
  "Sourou": ["Di", "Gomboro", "Kassoum", "Kiembara", "Lanfièra", "Lankoué", "Tougan", "Toéni"],
  "Séno": ["Bani", "Dori", "Falangountou", "Gorgadji", "Sampelga", "Seytenga"],
  "Tuy": ["Boni", "Békuy", "Béréba", "Founzan", "Houndé", "Koti", "Koumbia"],
  "Yagha": ["Boundoré", "Mansila", "Solhan", "Sébba", "Tankougounadié", "Titabé"],
  "Yatenga": ["Barga", "Kalsaga", "Kaïn", "Kossouka", "Koumbri", "Namissiguima", "Ouahigouya", "Oula", "Rambo", "Séguénéga", "Tangaye", "Thiou", "Zogoré"],
  "Ziro": ["Bakata", "Bougnounou", "Cassou", "Dalo", "Gao", "Sapouy"],
  "Zondoma": ["Bassi", "Boussou", "Gourcy", "Léba", "Tougo"],
  "Zoundwéogo": ["Bindé", "Béré", "Gogo", "Gomboussougou", "Guiba", "Manga", "Nobéré"],
};

// Liste plate des 47 provinces
export const BURKINA_PROVINCES_47: string[] = Object.keys(PROVINCE_COMMUNES_MAP).sort((a, b) => a.localeCompare("fr"));

// =====================================================================
// FONCTIONS DE RECHERCHE CONDITIONNELLE
// =====================================================================

/**
 * Retourne la liste des provinces conditionnées par la région sélectionnée
 * Si aucune région n'est passée, retourne les 47 provinces
 */
export function getProvincesByRegion(region?: string | null): string[] {
  if (!region || region === "Toutes les régions" || region === "National" || region === "National (Multi-régions)") {
    return BURKINA_PROVINCES_47;
  }
  return REGION_PROVINCES_MAP[region] || [];
}

/**
 * Retourne la liste des communes/villes conditionnées par la province ou la région sélectionnée
 */
export function getCommunesByCondition(province?: string | null, region?: string | null): string[] {
  if (province && PROVINCE_COMMUNES_MAP[province]) {
    return PROVINCE_COMMUNES_MAP[province];
  }
  if (region && REGION_PROVINCES_MAP[region]) {
    const provs = REGION_PROVINCES_MAP[region];
    const communes: string[] = [];
    for (const p of provs) {
      if (PROVINCE_COMMUNES_MAP[p]) {
        communes.push(...PROVINCE_COMMUNES_MAP[p]);
      }
    }
    return communes.sort((a, b) => a.localeCompare("fr"));
  }
  return BURKINA_COMMUNES_351.map(c => c.commune).sort((a, b) => a.localeCompare("fr"));
}

/**
 * Trouve les informations territoriales d'une commune donnée
 */
export function getCommuneDetails(communeName: string): CommuneItem | undefined {
  return BURKINA_COMMUNES_351.find(c => c.commune.toLowerCase() === communeName.toLowerCase());
}

/**
 * Détermine la région d'une province donnée
 */
export function getRegionByProvinceName(provinceName: string): string | undefined {
  for (const [region, provinces] of Object.entries(REGION_PROVINCES_MAP)) {
    if (provinces.includes(provinceName)) {
      return region;
    }
  }
  return undefined;
}
