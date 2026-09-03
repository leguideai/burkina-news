import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug } from '@/data/mock/articles';
import { categories, getCategoryByCode } from '@/data/mock/categories';
import { getProjectsByCategory } from '@/data/mock/projects';
import StatusBadge from '@/components/tracker/StatusBadge';
import { ArrowLeft, Clock, ShieldCheck, FileText, Share2, Printer, ChevronRight, Bookmark } from 'lucide-react';

export function generateStaticParams() {
  return articles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ 
  params 
}: { 
  params: Promise<{ category: string; slug: string }> 
}) {
  const { category: categoryCode, slug } = await params;
  const article = getArticleBySlug(slug);
  const category = getCategoryByCode(categoryCode as any);

  if (!article) {
    notFound();
  }

  const relatedProjects = getProjectsByCategory(article.category).slice(0, 2);
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="min-h-screen bg-[#faf8f5] pb-24">
      
      {/* 1. Article Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href={`/fr/${article.category}`} className="hover:text-[#0b4627]">
              {category?.nameFr || article.category}
            </Link>
            <span>/</span>
            <span className="text-[#141414] font-bold truncate max-w-xs">{article.type}</span>
          </nav>

          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-wider mb-3">
            <span className="bg-[#0b4627] text-white px-2.5 py-0.5 font-bold">
              {category?.nameFr || article.category}
            </span>
            <span className="text-[#737373]">·</span>
            <span className="font-bold text-[#141414]">{article.type.replace('-', ' ')}</span>
            <span className="text-[#737373]">·</span>
            <span className="text-[#0b4627] font-semibold flex items-center gap-1">
              <ShieldCheck size={13} />
              {article.sourceCount} sources vérifiées
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
              <span className="font-bold text-[#141414]">Par La Rédaction</span>
              <span className="text-[#737373]">·</span>
              <span className="text-[#555555]">{formattedDate}</span>
              <span className="text-[#737373]">·</span>
              <span className="text-[#555555]">Bobo-Dioulasso</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#0b4627] font-semibold">
              <ShieldCheck size={14} />
              <span>{article.sourceCount} sources primaires vérifiées</span>
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
                <img 
                  src={article.image || '/images/lead.jpeg'} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-[#faf8f5] border-t border-[#e6dfd5] text-[11px] font-serif text-[#737373] flex justify-between">
                <span>Photographie documentaire</span>
                <span>Source : Archives Rédaction Burkina News</span>
              </div>
            </div>

            {/* Article Body Content */}
            <div className="bg-white border border-[#e6dfd5] p-5 sm:p-10 font-serif text-base sm:text-lg text-[#222222] leading-[1.8] space-y-6">
              {article.body ? (
                article.body.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={idx} className="font-bold text-xl sm:text-2xl text-[#141414] font-serif pt-4 pb-2 border-b border-[#e6dfd5]">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('«') && paragraph.includes('»')) {
                    return (
                      <blockquote key={idx} className="border-l-4 border-[#0b4627] pl-4 my-6 italic text-[#141414] bg-[#faf8f5] p-4">
                        {paragraph}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={idx} className={idx === 0 ? "first-letter:float-left first-letter:text-4xl sm:first-letter:text-5xl first-letter:pr-2.5 sm:first-letter:pr-3 first-letter:font-bold first-letter:text-[#141414] first-letter:font-serif first-letter:leading-none" : ""}>
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <p>Contenu documentaire complet en cours d'archivage.</p>
              )}

              {/* Red Team & Methodology Stamp */}
              <div className="mt-10 pt-6 border-t-2 border-[#141414] bg-[#faf8f5] p-5 text-xs font-serif">
                <div className="flex items-center gap-2 font-mono uppercase text-[10px] font-bold text-[#0b4627] mb-2">
                  <ShieldCheck size={14} />
                  <span>Protocole de Clôture d'Enquête</span>
                </div>
                <p className="text-[#555555] leading-relaxed">
                  Cette enquête a fait l'objet d'un audit contradictoire (Red Team Test) et de vérifications croisées avec les rapports légaux d'institutions publiques.
                </p>
              </div>
            </div>

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="font-mono text-[10px] uppercase text-[#737373]">Mots-clés :</span>
                {article.tags.map(tag => (
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
                Fiche de Traçabilité
              </h3>
              
              <dl className="divide-y divide-[#e6dfd5] text-xs font-mono">
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Rubrique :</span>
                  <span className="font-bold text-[#141414]">{category?.nameFr || article.category}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Niveau de preuve :</span>
                  <span className="font-bold text-[#0b4627]">Haute certitude</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Sources citées :</span>
                  <span className="font-bold text-[#141414]">{article.sourceCount} documents</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#737373]">Publication :</span>
                  <span className="font-semibold text-[#141414]">{formattedDate}</span>
                </div>
              </dl>
            </div>

            {/* Related Projects in Tracker */}
            {relatedProjects.length > 0 && (
              <div className="bg-white border border-[#e6dfd5] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b4627] pb-2 mb-3 border-b border-[#e6dfd5]">
                  Chantiers Liés dans le Tracker
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
                          <Link href={`/fr/tracker/projets/${p.slug}`} className="hover:text-[#0b4627]">
                            {p.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Investigations */}
            {relatedArticles.length > 0 && (
              <div className="bg-white border border-[#e6dfd5] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] pb-2 mb-3 border-b border-[#141414]">
                  Sur le Même Sujet
                </h3>
                <div className="space-y-3">
                  {relatedArticles.map(art => (
                    <div key={art.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] flex gap-3 items-start">
                      <div className="w-16 h-12 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <img 
                          src={art.image || '/images/lead.jpeg'} 
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-[#141414] leading-snug line-clamp-2 mb-1">
                          <Link href={`/fr/${art.category}/${art.slug}`} className="hover:text-[#0b4627]">
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
              href={`/fr/${article.category}`}
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Retour à la rubrique {category?.nameFr}
            </Link>

          </aside>

        </div>
      </div>

    </article>
  );
}
