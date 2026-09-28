import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatusBadge from '@/components/tracker/StatusBadge';
import ArticleBodyRenderer from '@/components/editorial/ArticleBodyRenderer';
import { ArrowLeft, Clock, ShieldCheck, FileText, Share2, Printer, ChevronRight, Bookmark } from 'lucide-react';
import { articlesApi } from '@/lib/api/articles';
import { categoriesApi } from '@/lib/api/categories';
import { trackerApi } from '@/lib/api/tracker';
import { mapArticleDTOToArticle, mapProjectDTOToProject } from '@/lib/api/mappers';
import { Article, Project } from '@/data/types';
import { ArticleDTO } from '@/lib/api/types';
import SafeImage from '@/components/ui/SafeImage';

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPageEn({ 
  params 
}: { 
  params: Promise<{ category: string; slug: string }> 
}) {
  const { category: categoryCode, slug } = await params;
  let article: Article | null = null;
  let relatedArticles: Article[] = [];
  let relatedProjects: Project[] = [];
  let categoryNameEn = categoryCode;
  let subCategoryNameEn = '';

  // 1. Fetch live article by slug from PostgreSQL
  try {
    const apiArticle = await articlesApi.getArticle(slug);
    const raw = (apiArticle as any)?.article || apiArticle;
    if (raw && raw.id) {
      article = mapArticleDTOToArticle(raw);
      // Ensure English title/excerpt/body take precedence
      if (raw.title_en) article.title = raw.title_en;
      if (raw.excerpt_en) article.excerpt = raw.excerpt_en;
      if (raw.body_en) article.body = raw.body_en;
    }
    if ((apiArticle as any)?.related) {
      relatedArticles = ((apiArticle as any).related as ArticleDTO[]).map(dto => {
        const mapped = mapArticleDTOToArticle(dto);
        if (dto.title_en) mapped.title = dto.title_en;
        if (dto.excerpt_en) mapped.excerpt = dto.excerpt_en;
        return mapped;
      });
    } else if (apiArticle?.related_articles) {
      relatedArticles = apiArticle.related_articles.map(dto => {
        const mapped = mapArticleDTOToArticle(dto);
        if (dto.title_en) mapped.title = dto.title_en;
        if (dto.excerpt_en) mapped.excerpt = dto.excerpt_en;
        return mapped;
      });
    }
  } catch {
    // API error / Not found
  }

  if (!article) {
    notFound();
  }

  // 2. Fetch category & subcategory dynamically from PostgreSQL
  try {
    const catDto = await categoriesApi.getCategory(categoryCode);
    if (catDto) {
      categoryNameEn = catDto.name_en || catDto.name_fr || categoryCode;
      if (article.subCategory && catDto.sub_categories) {
        const sub = catDto.sub_categories.find(s => s.code === article?.subCategory);
        if (sub) {
          subCategoryNameEn = sub.name_en || sub.name_fr;
        }
      }
    }
  } catch {
    categoryNameEn = categoryCode;
  }

  // 3. Fetch related articles from PostgreSQL
  if (relatedArticles.length === 0) {
    try {
      const relRes = await articlesApi.listArticles({ category: article.category, limit: 10 });
      if (relRes.articles && relRes.articles.length > 0) {
        relatedArticles = relRes.articles
          .filter(a => a.slug !== article?.slug && a.id !== article?.id)
          .slice(0, 2)
          .map(dto => {
            const mapped = mapArticleDTOToArticle(dto);
            if (dto.title_en) mapped.title = dto.title_en;
            if (dto.excerpt_en) mapped.excerpt = dto.excerpt_en;
            return mapped;
          });
      }
    } catch {
      relatedArticles = [];
    }
  }

  // 4. Fetch related projects from Tracker dynamically
  try {
    const projRes = await trackerApi.listProjects({ category: article.category, limit: 2 });
    if (projRes.projects) {
      relatedProjects = projRes.projects.map(mapProjectDTOToProject);
    }
  } catch {
    relatedProjects = [];
  }

  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="min-h-screen bg-[#faf8f5] pb-24">
      
      {/* 1. Article Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <Link href={`/en/${article.category}`} className="hover:text-[#0b4627]">
              {categoryNameEn}
            </Link>
            {subCategoryNameEn && (
              <>
                <span>/</span>
                <Link href={`/en/${article.category}?sub=${article.subCategory}`} className="text-[#0b4627] font-semibold hover:underline">
                  {subCategoryNameEn}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#141414] font-bold truncate max-w-xs">{article.type}</span>
          </nav>

          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Link 
              href={`/en/${article.category}`}
              className="bg-[#0b4627] text-white px-2.5 py-0.5 font-bold hover:bg-[#072e1a] transition-colors"
            >
              {categoryNameEn}
            </Link>
            {subCategoryNameEn && (
              <Link 
                href={`/en/${article.category}?sub=${article.subCategory}`}
                className="bg-[#f4eee3] text-[#0b4627] border border-[#0b4627]/30 px-2 py-0.5 font-bold hover:bg-[#0b4627] hover:text-white transition-colors"
              >
                {subCategoryNameEn}
              </Link>
            )}
            <span className="text-[#737373]">·</span>
            <span className="font-bold text-[#141414]">{article.type.replace('-', ' ')}</span>
            <span className="text-[#737373]">·</span>
            <span className="text-[#0b4627] font-semibold flex items-center gap-1">
              <ShieldCheck size={13} />
              {article.sourceCount} verified sources
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-[1.16] mb-4">
            {article.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-base sm:text-xl font-serif italic text-[#333333] leading-relaxed mb-6">
            {article.excerpt}
          </p>

          {/* Bylines & Verification Meta */}
          <div className="pt-4 border-t border-[#141414] flex flex-wrap justify-between items-center gap-4 text-xs font-serif">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#141414]">{article.author || 'The Editorial Desk'}</span>
              <span className="text-[#737373]">·</span>
              <span className="text-[#555555]">{formattedDate}</span>
              <span className="text-[#737373]">·</span>
              <span className="text-[#555555]">Bobo-Dioulasso</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#0b4627] font-semibold">
              <ShieldCheck size={14} />
              <span>{article.sourceCount} primary sources verified</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Article Body & Investigation Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Longform Column (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Photograph */}
            <div className="bg-white border border-[#e6dfd5] overflow-hidden">
              <div className="aspect-[16/10] w-full bg-neutral-100">
                <SafeImage 
                  src={article.image || '/images/lead.jpeg'} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#737373] flex justify-between">
                <span>Documentary Photography</span>
                <span>Source: Burkina News Editorial Archives</span>
              </div>
            </div>

            {/* Article Body Content */}
            <div className="bg-white border border-[#e6dfd5] p-5 sm:p-10">
              <ArticleBodyRenderer content={article.body} lang="en" />

              {/* Red Team & Methodology Stamp */}
              <div className="mt-10 pt-6 border-t-2 border-[#141414] bg-[#faf8f5] p-5 text-xs font-serif">
                <div className="flex items-center gap-2 font-mono uppercase text-[10px] font-bold text-[#0b4627] mb-2">
                  <ShieldCheck size={14} />
                  <span>Investigation Closure Protocol</span>
                </div>
                <p className="text-[#555555] leading-relaxed">
                  This investigation was subjected to an adversarial audit (Red Team Test) and cross-verified against official public records and regulatory filings.
                </p>
              </div>
            </div>

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="font-mono text-[10px] uppercase text-[#737373]">Keywords:</span>
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-1 bg-white border border-[#e6dfd5] text-[11px] font-mono text-[#141414]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Dossier Meta Box */}
            <div className="bg-white border border-[#141414] p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#141414]">
                Traceability Sheet
              </h3>
              
              <dl className="divide-y divide-[#e6dfd5] text-xs font-mono">
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Category:</span>
                  <span className="font-bold text-[#141414]">{categoryNameEn}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Evidence Level:</span>
                  <span className="font-bold text-[#0b4627]">High Certainty</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Sources Cited:</span>
                  <span className="font-bold text-[#141414]">{article.sourceCount} documents</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Publication:</span>
                  <span className="font-semibold text-[#141414]">{formattedDate}</span>
                </div>
              </dl>
            </div>

            {/* Related Projects in Tracker */}
            {relatedProjects.length > 0 && (
              <div className="bg-white border border-[#e6dfd5] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-3 border-b border-[#e6dfd5]">
                  Related Tracker Projects
                </h3>
                <div className="space-y-3">
                  {relatedProjects.map(p => (
                    <div key={p.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] flex gap-3 items-start">
                      <div className="w-16 h-12 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <img 
                          src={p.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'} 
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <StatusBadge status={p.currentStatus} size="sm" />
                          <span className="text-[10px] font-mono text-[#737373]">{p.region}</span>
                        </div>
                        <h4 className="font-serif font-bold text-xs text-[#141414] leading-snug line-clamp-1">
                          <Link href={`/en/tracker/projets/${p.slug}`} className="hover:text-[#0b4627]">
                            {p.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Investigations (Pure PostgreSQL) */}
            {relatedArticles.length > 0 && (
              <div className="bg-white border border-[#e6dfd5] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#141414]">
                  Related Investigations
                </h3>
                <div className="space-y-3">
                  {relatedArticles.map(art => (
                    <div key={art.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] flex gap-3 items-start">
                      <div className="w-16 h-12 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <SafeImage 
                          src={art.image || '/images/lead.jpeg'} 
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-[#141414] leading-snug line-clamp-2 mb-1">
                          <Link href={`/en/${art.category}/${art.slug}`} className="hover:text-[#0b4627]">
                            {art.title}
                          </Link>
                        </h4>
                        <span className="font-mono text-[10px] text-[#0b4627] font-semibold">{art.sourceCount} sources</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <Link 
              href={`/en/${article.category}`}
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Back to {categoryNameEn}
            </Link>

          </aside>

        </div>
      </div>

    </article>
  );
}
