import { NextResponse } from 'next/server';
import { getAdminStore } from '@/data/admin-store';
import { BURKINA_REGIONS_17 } from '@/data/mock/referentiel-territoire';
import { INITIAL_TRACKER_FILTERS_CONFIG } from '@/data/mock/tracker-filters';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'fr';

    const store = getAdminStore();
    const config = store.trackerFilters || INITIAL_TRACKER_FILTERS_CONFIG;

    // Secteurs : extraire les libellés et trier par ordre alphabétique
    const sectors = (config.sectors || [])
      .map(s => (lang === 'en' && s.nameEn ? s.nameEn : s.name))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, lang));

    // Bailleurs : extraire les libellés et trier par ordre alphabétique
    const bailleurs = (config.bailleurs || [])
      .map(b => b.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, lang));

    // Régions : trier par ordre alphabétique
    const regions = (config.regions && config.regions.length > 0 ? config.regions : BURKINA_REGIONS_17)
      .slice()
      .sort((a, b) => a.localeCompare(b, lang));

    return NextResponse.json({
      success: true,
      sectors,
      bailleurs,
      regions,
      rawSectors: config.sectors || [],
      rawBailleurs: config.bailleurs || [],
      updatedAt: config.updatedAt,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Error fetching tracker filters:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des filtres du Tracker' },
      { status: 500 }
    );
  }
}
