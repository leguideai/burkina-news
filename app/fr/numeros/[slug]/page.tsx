import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { issues, getIssueBySlug } from '@/data/mock/issues';
import { articles } from '@/data/mock/articles';
import { categories } from '@/data/mock/categories';

export function generateStaticParams() {
  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export default async function IssueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  
  if (!issue) {
    notFound();
  }

  const issueArticles = issue.articleIds
    .map(id => articles.find(a => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const date = new Date(issue.publicationDate);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  const sourcesCount = issueArticles.reduce((acc, curr) => acc + curr.sourceCount, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* 1. Header with Cover Photo */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/fr" className="hover:text-[#0b4627]">Accueil</Link>
            <span>/</span>
            <Link href="/fr/numeros" className="hover:text-[#0b4627]">Les Numéros</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Numéro {issue.number}</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
              <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Édition Mensuelle</span>
              <span>·</span>
              <span className="text-[#555555]">{formattedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              {issue.title}
            </h1>

            <p className="text-sm sm:text-base font-serif text-[#444444] max-w-3xl leading-relaxed">
              {issue.summary}
            </p>
          </div>

        </div>
      </header>

      {/* 2. Sommaire & Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Articles List (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="pb-3 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Sommaire du Numéro {issue.number}
              </h2>
              <span className="font-mono text-xs text-[#737373]">{issue.articleCount} contenus audités</span>
            </div>

            <div className="divide-y divide-[#e6dfd5] bg-white border border-[#e6dfd5]">
              {issueArticles.map((art, idx) => (
                <article key={art.id} className="p-6 hover:bg-[#faf8f5] transition-colors group flex flex-col sm:flex-row gap-5 items-start">
                  <div className="flex items-center gap-3 sm:block shrink-0">
                    <span className="font-mono text-xl font-bold text-[#0b4627] block mb-2">
                      0{idx + 1}
                    </span>
                    <div className="w-28 sm:w-36 aspect-[16/10] overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                      <img 
                        src={art.image || '/images/lead.jpeg'} 
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-[#0b4627] mb-1">
                      <span>{art.category}</span>
                      <span>·</span>
                      <span className="text-[#0b4627] font-semibold">{art.sourceCount} sources vérifiées</span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-2">
                      <Link href={`/fr/${art.category}/${art.slug}`}>
                        {art.title}
                      </Link>
                    </h3>

                    <p className="font-serif text-xs sm:text-sm text-[#555555] leading-relaxed line-clamp-2 mb-3">
                      {art.excerpt}
                    </p>

                    <Link 
                      href={`/fr/${art.category}/${art.slug}`}
                      className="font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
                    >
                      Consulter l'enquête →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Cover Card */}
            <div className="border border-[#e6dfd5] bg-white p-5">
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 border border-[#e6dfd5] mb-4">
                <img 
                  src={issue.coverImage} 
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-[#e6dfd5]">
                  <span className="text-[#737373]">Publication :</span>
                  <span className="font-bold text-[#141414]">{formattedDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e6dfd5]">
                  <span className="text-[#737373]">Dossiers :</span>
                  <span className="font-bold text-[#141414]">{issue.articleCount} articles</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e6dfd5]">
                  <span className="text-[#737373]">Sources citées :</span>
                  <span className="font-bold text-[#0b4627]">{sourcesCount} sources</span>
                </div>
              </div>
            </div>

            {/* PDF Card */}
            <div className="border border-[#141414] bg-white p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 pb-2 border-b border-[#141414]">
                Édition d'Archive
              </h3>
              <p className="text-xs font-serif text-[#555555] mb-4">
                Consultez ou téléchargez la version intégrale documentée du Numéro {issue.number}.
              </p>
              {issue.pdfUrl ? (
                <a 
                  href={issue.pdfUrl}
                  className="w-full py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  Télécharger le PDF
                </a>
              ) : (
                <span className="w-full py-2 bg-[#faf8f5] border border-[#e6dfd5] text-[#737373] text-xs font-mono text-center block">
                  Format numérique en ligne
                </span>
              )}
            </div>

            {/* Back link */}
            <Link 
              href="/fr/numeros"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← Tous les numéros
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
