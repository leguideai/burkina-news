import Link from 'next/link';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import { issuesApi } from '@/lib/api/issues';
import { mapIssueDTOToIssue } from '@/lib/api/mappers';
import { Issue } from '@/data/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Monthly Issues | Burkina News',
  description: 'A monthly journal. A Deep Dive investigation. Verified facts, figures, and trajectory.',
};

export default async function IssuesPageEn() {
  let enIssues: Issue[] = [];

  try {
    const res = await issuesApi.listIssues({ limit: 50 });
    const remote = res.issues;
    if (remote && remote.length > 0) {
      enIssues = remote.map((dto) => {
        const mapped = mapIssueDTOToIssue(dto);
        if (dto.title_en) mapped.title = dto.title_en;
        if (dto.summary_en) mapped.summary = dto.summary_en;
        return mapped;
      });
    }
  } catch {
    enIssues = [];
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      
      {/* Header Masthead */}
      <header className="bg-white border-b border-[#e6dfd5] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737373] mb-4" aria-label="Breadcrumb">
            <Link href="/en" className="hover:text-[#0b4627]">Home</Link>
            <span>/</span>
            <span className="text-[#141414] font-bold">Issues</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141414]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] block mb-1">
                Monthly Investigative Editions
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#141414] leading-tight">
                Burkina News Monthly Issues
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg leading-relaxed">
              Every first Sunday of the month: a major sectoral Deep Dive, on-the-ground reporting, and an exhaustive documentary review of national indicators.
            </p>
          </div>
        </div>
      </header>

      {/* Issues Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enIssues.map((issue) => {
            const date = new Date(issue.publicationDate);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            });

            return (
              <Link 
                key={issue.id} 
                href={`/en/numeros/${issue.slug}`}
                className="bg-white border border-[#e6dfd5] hover:border-[#141414] transition-all flex flex-col justify-between group rounded-xl overflow-hidden shadow-xs cursor-pointer block"
              >
                <div>
                  <div className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                    <img
                      src={issue.coverImage}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#0b4627] text-white text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-wider rounded-md">
                      Issue {issue.number}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-[11px] font-mono text-[#737373] uppercase mb-2">
                      {formattedDate} · {issue.articleCount} dossiers
                    </div>

                    <h2 className="text-xl font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-3">
                      {issue.title}
                    </h2>

                    <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-3 mb-4">
                      {issue.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif">
                    <span className="font-mono text-[11px] text-[#737373]">Certified Edition</span>
                    <span className="font-mono font-bold text-xs text-[#0b4627] group-hover:underline inline-flex items-center gap-1">
                      Read Issue <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
