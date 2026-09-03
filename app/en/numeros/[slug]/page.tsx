import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, BookOpen, ShieldCheck } from 'lucide-react';
import { issues, getIssueBySlug } from '@/data/mock/issues';
import { getArticles } from '@/data/mock/articles';
import { categories } from '@/data/mock/categories';

export function generateStaticParams() {
  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export default async function IssueDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug, 'en');
  
  if (!issue) {
    notFound();
  }

  const enArticles = getArticles('en');
  const issueArticles = issue.articleIds
    .map(id => enArticles.find(a => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const date = new Date(issue.publicationDate);
  const formattedDate = date.toLocaleDateString('en-US', {
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
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <Link href="/en/numeros" className="hover:text-[#0b4627]">Issues</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Issue {issue.number}</span>
          </nav>

          <div className="pb-6 border-b border-[#141414]">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] mb-2">
              <span className="bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">Issue {issue.number}</span>
              <span>·</span>
              <span className="text-[#555555]">{formattedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight mb-4">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-[#555555]">
              <span className="flex items-center gap-1.5 text-[#0b4627] font-semibold font-mono">
                <ShieldCheck size={14} /> Full investigative issue
              </span>
              <span>·</span>
              <span>{issue.articleCount} dossiers</span>
              <span>·</span>
              <span className="text-[#0b4627] font-semibold">{sourcesCount} documented sources</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column: Table of Contents (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Issue Editorial Introduction */}
            <div className="bg-white border border-[#e6dfd5] p-6 sm:p-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
                Editorial Overview
              </span>
              <p className="text-sm sm:text-base font-serif text-[#333333] leading-relaxed">
                {issue.summary}
              </p>
            </div>

            {/* Sommaire / Table of Contents */}
            <div className="space-y-4">
              <div className="pb-3 border-b-2 border-[#141414] flex justify-between items-center">
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  Table of Contents ({issueArticles.length} investigations)
                </h2>
                <span className="text-xs font-serif text-[#737373] italic">
                  Issue 0{issue.number}
                </span>
              </div>

              {issueArticles.map((art, idx) => (
                <article 
                  key={art.id}
                  className="bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#141414] text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                          Dossier 0{idx + 1}
                        </span>
                        <span className="uppercase text-[#0b4627] font-semibold">
                          {art.category}
                        </span>
                      </div>
                      <span className="text-[#0b4627] font-semibold">{art.sourceCount} verified sources</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-start my-3">
                      {art.image && (
                        <div className="w-full sm:w-36 aspect-[16/10] shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                          <img 
                            src={art.image} 
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-2">
                          <Link href={`/en/${art.category}/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h3>

                        <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs">
                    <span className="text-[#737373] font-serif italic">
                      Newsroom Investigation · Bobo-Dioulasso
                    </span>
                    <Link 
                      href={`/en/${art.category}/${art.slug}`}
                      className="font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
                    >
                      Read investigation →
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
                  <span className="text-[#737373]">Publication:</span>
                  <span className="font-bold text-[#141414]">{formattedDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e6dfd5]">
                  <span className="text-[#737373]">Dossiers:</span>
                  <span className="font-bold text-[#141414]">{issue.articleCount} articles</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e6dfd5]">
                  <span className="text-[#737373]">Referenced Sources:</span>
                  <span className="font-bold text-[#0b4627]">{sourcesCount} sources</span>
                </div>
              </div>
            </div>

            {/* PDF Card with real download */}
            <div className="border border-[#141414] bg-white p-5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 pb-2 border-b border-[#141414]">
                Archive Edition
              </h3>
              <p className="text-xs font-serif text-[#555555] mb-4">
                Download the complete verified documentary edition of Issue {issue.number}.
              </p>
              {issue.pdfUrl ? (
                <a 
                  href={issue.pdfUrl}
                  download={`Burkina-News-Issue-0${issue.number}.pdf`}
                  className="w-full py-2 bg-[#0b4627] hover:bg-[#072e1a] text-white text-xs font-mono font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  Download Official PDF
                </a>
              ) : (
                <span className="w-full py-2 bg-[#faf8f5] border border-[#e6dfd5] text-[#737373] text-xs font-mono text-center block">
                  Online Digital Edition
                </span>
              )}
            </div>

            {/* Back link */}
            <Link 
              href="/en/numeros"
              className="w-full py-2.5 bg-white border border-[#141414] text-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-center block hover:bg-[#141414] hover:text-white transition-colors"
            >
              ← All Monthly Issues
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
