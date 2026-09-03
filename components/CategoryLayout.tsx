import Link from 'next/link';
import { CategoryCode } from '@/data/types';
import { getCategoryByCode } from '@/data/mock/categories';
import { getArticlesByCategory, articles as allArticles } from '@/data/mock/articles';
import { getProjectsByCategory } from '@/data/mock/projects';
import { getIndicatorsByCategory } from '@/data/mock/indicators';
import ArticleCard from '@/components/editorial/ArticleCard';
import ProjectCard from '@/components/tracker/ProjectCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface CategoryLayoutProps {
  categoryCode: CategoryCode;
  lang?: 'fr' | 'en';
}

export function CategoryLayout({ categoryCode, lang = 'fr' }: CategoryLayoutProps) {
  const category = getCategoryByCode(categoryCode);
  const isEn = lang === 'en';
  
  if (!category) {
    return <div>{isEn ? "Category not found" : "Catégorie introuvable"}</div>;
  }

  let articles = getArticlesByCategory(categoryCode, lang);
  if (articles.length === 0) {
    articles = allArticles.slice(0, 4);
  }

  const projects = getProjectsByCategory(categoryCode, lang).slice(0, 2);
  const indicators = getIndicatorsByCategory(categoryCode, lang).slice(0, 2);
  const leadArticle = articles[0];
  const otherArticles = articles.slice(1);

  const homeHref = isEn ? '/en' : '/fr';
  const categoryName = isEn ? category.nameEn : category.nameFr;
  const categoryDesc = isEn ? category.descriptionEn : category.descriptionFr;

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5] pb-16">
      
      {/* 1. Category Header with Classic Newspaper Masthead styling */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href={homeHref} className="hover:text-[#0b4627]">{isEn ? "Home" : "Accueil"}</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">{isEn ? "Sections" : "Rubriques"}</span>
            <span>/</span>
            <span className="text-[#0b4627] font-bold">{categoryName}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
                {isEn ? "Editorial Section" : "Rubrique Éditoriale"}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                {categoryName}
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              {categoryDesc}
            </p>
          </div>

        </div>
      </header>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editorial Articles (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Lead Article */}
            {leadArticle && (
              <ArticleCard article={leadArticle} variant="lead" lang={lang} />
            )}

            {/* Sub-grid of other articles */}
            {otherArticles.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold font-serif text-[#141414] pb-2 border-b border-[#e6dfd5]">
                  {isEn ? `All investigations · ${categoryName}` : `Toutes les publications · ${categoryName}`}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {otherArticles.map(art => (
                    <ArticleCard key={art.id} article={art} variant="default" lang={lang} />
                  ))}
                </div>
              </div>
            )}

          </div>
          
          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Editorial Line Box */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] mb-2 pb-2 border-b border-[#e6dfd5]">
                {isEn ? "Editorial Standard" : "Ligne éditoriale"}
              </h4>
              <p className="font-serif text-[#444444] text-xs leading-relaxed mb-4">
                {isEn 
                  ? `Every investigation in the ${categoryName} section is grounded in verifiable official records, field reporting, and independent cross-checking.`
                  : `Chaque publication de la rubrique ${categoryName} s'appuie sur une documentation institutionnelle vérifiable, des visites de terrain et un contrôle méthodologique strict.`
                }
              </p>
              <Link href={isEn ? "/en/methode" : "/fr/methode"} className="text-xs font-mono font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1">
                {isEn ? "Read our verification charter →" : "Consulter notre charte de preuve →"}
              </Link>
            </div>
            
            {/* Tracker Projets liés */}
            {projects.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#141414]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                    {isEn ? "Related Tracker Projects" : "Projets liés dans le Tracker"}
                  </h4>
                  <Link href={isEn ? "/en/tracker" : "/fr/tracker"} className="text-xs font-mono text-[#0b4627] hover:underline">
                    {isEn ? "View all →" : "Tout voir →"}
                  </Link>
                </div>

                <div className="space-y-4">
                  {projects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} lang={lang} />
                  ))}
                </div>
              </div>
            )}

            {/* Indicateurs RELANCE liés */}
            {indicators.length > 0 && (
              <div className="border border-[#e6dfd5] bg-white p-5">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] mb-3 pb-2 border-b border-[#e6dfd5]">
                  {isEn ? "Barometer Indicators" : "Indicateurs du Baromètre"}
                </h4>
                
                <div className="space-y-3">
                  {indicators.map(ind => (
                    <Link 
                      key={ind.id} 
                      href={`/${isEn ? 'en' : 'fr'}/tracker/indicateurs/${ind.code}`}
                      className="block p-2.5 bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#141414] transition-colors"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-serif font-bold text-[#141414]">{ind.name}</span>
                        <span className="font-mono font-bold text-[#0b4627]">{ind.currentValue} {ind.unit}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#737373] mt-1 block">
                        {isEn ? "Target 2030:" : "Cible 2030 :"} {ind.target2030} {ind.unit}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>

        </div>
      </div>

    </div>
  );
}
