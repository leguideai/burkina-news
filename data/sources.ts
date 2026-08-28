export const SOURCE_URLS: Record<string, string> = {
  'INSD': 'https://www.insd.bf',
  'SONABEL': 'https://www.sonabel.bf',
  'DGMG': 'https://www.mines.gov.bf',
  'Chambre des mines': 'https://chambredesmines.bf',
  'FMI': 'https://www.imf.org',
  'Banque mondiale': 'https://www.banquemondiale.org',
  'Présidence du Faso': 'https://www.presidencedufaso.bf',
  'Conseil des ministres': 'https://www.presidencedufaso.bf',
  'CONASUR': 'https://www.action-sociale.gov.bf',
  'DGPV': 'https://www.agriculture.bf',
  'Ministère de la Santé': 'https://www.sante.gov.bf',
  'BAD': 'https://www.afdb.org',
  'AES': 'https://aes-info.org',
  'AES / Présidence Mali': 'https://aes-info.org',
  'INERA': 'https://www.inera.bf',
  'DGI': 'https://www.dgi.bf',
  'DGIR': 'https://www.infrastructures.gov.bf',
  'MENAPLN': 'https://www.education.gov.bf',
  'SOFITEX': 'https://www.sofitex.bf',
  'DGRE': 'https://www.eau-burkina.bf',
  'ONEA': 'https://www.onea.bf',
  'OMS': 'https://www.who.int',
  'UNICEF': 'https://www.unicef.org',
  'FAO': 'https://www.fao.org',
  'OCHA': 'https://www.unocha.org',
  'Ministère de la Défense': 'https://www.defense.gov.bf',
  'État-major': 'https://www.defense.gov.bf',
  'État-major AES': 'https://aes-info.org',
  'BCEAO': 'https://www.bceao.int',
  'Endeavour Mining': 'https://www.endeavourmining.com',
  'Société Endeavour Mining': 'https://www.endeavourmining.com',
  'SONAGESS': 'https://www.sonagess.bf',
  'Ministère de l\'Énergie': 'https://www.energie.gov.bf',
  'Ministère des Transports': 'https://www.transports.gov.bf',
  'Ministère de l\'Industrie': 'https://www.industrie.gov.bf',
  'Ministère des Infrastructures': 'https://www.infrastructures.gov.bf',
  'Ministère de l\'Agriculture': 'https://www.agriculture.gov.bf',
  'Ministère de l\'Éducation': 'https://www.education.gov.bf',
  'Ministère des Affaires étrangères': 'https://www.mae.gov.bf',
  'MESRSI': 'https://www.mesrsi.gov.bf',
  'Ambassade de Chine': 'http://bf.china-embassy.gov.cn/fra/',
  'CILSS': 'https://www.cilss.int',
  'PNUD': 'https://www.undp.org/burkina-faso',
  'UCAD / CODESRIA': 'https://www.codesria.org',
};

/**
 * Returns the verified public portal URL for any primary source institution.
 */
export function getSourceUrl(sourceName: string, explicitUrl?: string): string {
  if (explicitUrl && explicitUrl.startsWith('http')) {
    return explicitUrl;
  }

  // Exact match
  if (SOURCE_URLS[sourceName]) {
    return SOURCE_URLS[sourceName];
  }

  // Partial match
  const lower = sourceName.toLowerCase();
  for (const [key, url] of Object.entries(SOURCE_URLS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url;
    }
  }

  // Generic fallback to Burkina Faso official portal
  return 'https://www.servicepublic.gov.bf';
}
