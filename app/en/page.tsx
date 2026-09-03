import Link from 'next/link';
import { getLatestIssue } from '@/data/mock/issues';
import { getLatestBrief } from '@/data/mock/briefs';
import { articles } from '@/data/mock/articles';
import { getKeyIndicators } from '@/data/mock/indicators';
import { projects, getProjectStats } from '@/data/mock/projects';
import ArticleCard from '@/components/editorial/ArticleCard';
import ProjectCard from '@/components/tracker/ProjectCard';
import InteractiveNewsletter from '@/components/ui/InteractiveNewsletter';
import { 
  ArrowRight, 
  Clock, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Quote,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export default function HomePageEn() {
  const latestIssue = getLatestIssue();
  const latestBrief = getLatestBrief();
  const indicators = getKeyIndicators();
  const projectStats = getProjectStats();
  const leadArticle = articles.find(a => a.type === 'decryptage') || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== leadArticle.id).slice(0, 4);
  const featuredProjects = projects.slice(0, 3);
  const terrainArticle = articles.find(a => a.type === 'terrain') || articles[5];
  const factCheckArticle = articles.find(a => a.type === 'vrai-ou-faux') || articles[4];
  const issueArticles = latestIssue ? articles.filter(a => a.issueId === latestIssue.id) : [];
  const issueSourcesCount = issueArticles.length > 0 
    ? issueArticles.reduce((acc, curr) => acc + curr.sourceCount, 0)
    : leadArticle.sourceCount;

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      
      {/* ──────────────────────────────────────────────────────────
          1. BROADSHEET LEAD PACKAGE (3-Column Newspaper Grid)
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 pb-12 border-b border-[#e6dfd5]">
        
        {/* Magazine Issue Identifier Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-[#141414]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627]">
              {latestIssue 
                ? `Issue 0${latestIssue.number} · ${new Date(latestIssue.publicationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` 
                : 'Issue 03 · August 2026'}
            </span>
            <span className="text-[#d4cece]">|</span>
            <span className="font-serif text-xs text-[#555555]">
              Monthly Investigative Journal & Fact Registry
            </span>
          </div>

          <div className="text-xs font-serif text-[#555555] flex items-center gap-3">
            <span className="text-[#0b4627] font-semibold">{issueSourcesCount} documented sources</span>
            <span>·</span>
            <Link href={`/en/numeros/${latestIssue?.slug || '2027-03'}`} className="font-bold text-[#0b4627] hover:underline">
              Read the full issue →
            </Link>
          </div>
        </div>

        {/* 3-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1 (Col 3 / 25%) : THE BRIEF */}
          <div className="lg:col-span-3 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e6dfd5] lg:pr-8 pb-8 lg:pb-0">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#141414]">
              <Link href={`/en/fil/${latestBrief?.slug || '2026-semaine-34'}`} className="hover:text-[#0b4627] transition-colors">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#0b4627] flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#0b4627] inline-block"></span>
                  The Brief (Weekly)
                </h3>
              </Link>
              <span className="text-[10px] font-mono text-[#737373]">Week 34</span>
            </div>

            <div className="space-y-3 font-serif text-xs">
              {latestBrief?.facts.slice(0, 5).map((fact, idx) => (
                <Link 
                  key={idx} 
                  href={`/en/fil/${latestBrief.slug}#fait-${idx + 1}`}
                  className="group block p-2 -mx-2 hover:bg-white hover:border-[#141414] border border-transparent transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-[#555555]">
                    <span className="font-bold text-[#0b4627] group-hover:underline">[{fact.time}]</span>
                    <span className="uppercase font-semibold">{fact.source}</span>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    {fact.image && (
                      <div className="w-14 h-11 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
                        <img 
                          src={fact.image} 
                          alt="Evidence thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <p className="text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug line-clamp-3">
                      {fact.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link 
              href={`/en/fil/${latestBrief?.slug || '2026-semaine-34'}`}
              className="mt-6 font-mono text-xs font-bold text-[#0b4627] hover:underline inline-flex items-center gap-1"
            >
              <span>All 10 weekly sourced facts</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* COLUMN 2 (Col 6 / 50%) : THE DEEP DIVE */}
          <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e6dfd5] lg:pr-8 pb-8 lg:pb-0">
            <div className="mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0b4627] bg-[#f4eee3] px-2 py-0.5 border border-[#e6dfd5]">
                The Deep Dive · Economy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#141414] leading-[1.18] mb-4">
              <Link href={`/en/${leadArticle.category}/${leadArticle.slug}`} className="hover:text-[#0b4627] transition-colors">
                {leadArticle.title}
              </Link>
            </h1>

            <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-4 border border-[#e6dfd5]">
              <img 
                src={leadArticle.image || leadArticle.imageUrl} 
                alt={leadArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-serif text-[#555555] mb-4 pb-3 border-b border-[#e6dfd5]">
              <span className="font-mono text-[11px] text-[#0b4627] font-semibold">{leadArticle.sourceCount} verified sources</span>
              <span>·</span>
              <span className="italic">Newsroom Investigation · Bobo-Dioulasso</span>
            </div>

            <p className="text-sm sm:text-base font-serif text-[#333333] leading-relaxed mb-6">
              {leadArticle.excerpt}
            </p>

            <Link 
              href={`/en/${leadArticle.category}/${leadArticle.slug}`}
              className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#0b4627] hover:bg-[#072e1a] px-5 py-3 self-start transition-colors"
            >
              Read full investigation →
            </Link>
          </div>

          {/* COLUMN 3 (Col 3 / 25%) : ANALYSES & QUOTE */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            <div className="pb-3 border-b-2 border-[#141414]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Analysis & Debate
              </h3>
            </div>

            <div className="space-y-6">
              {secondaryArticles.slice(0, 2).map((art) => (
                <article key={art.id} className="group pb-6 border-b border-[#e6dfd5] last:border-0 last:pb-0">
                  <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-100 mb-2.5 border border-[#e6dfd5]">
                    <img 
                      src={art.image || art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] block mb-1">
                    {art.category}
                  </span>
                  
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-2">
                    <Link href={`/en/${art.category}/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h4>
                  
                  <p className="text-xs font-serif text-[#555555] line-clamp-2 mb-2 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-mono text-[#0b4627] font-semibold">{art.sourceCount} verified sources</span>
                    <Link href={`/en/${art.category}/${art.slug}`} className="text-xs font-serif text-[#0b4627] font-bold hover:underline">
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Editorial Quote Box */}
            <div className="bg-[#f4eee3] border border-[#e6dfd5] p-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
                Editorial Note
              </span>
              <p className="font-serif italic text-xs leading-relaxed text-[#141414] mb-3">
                “The challenge of public policy is not the ambition of the decree, but the verifiable physical reality on the ground.”
              </p>
              <span className="text-[10px] font-mono text-[#737373] block">
                Burkina Newsroom · Bobo-Dioulasso
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. BURKINA IN FIGURES (Macroeconomic Strip)
      ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#e6dfd5] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#e6dfd5] gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#0b4627]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                Burkina in Figures · National Benchmarks
              </h2>
            </div>
            <Link href="/en/tracker/indicateurs" className="font-serif text-xs text-[#0b4627] hover:underline flex items-center gap-1">
              <span>View the 8 RELANCE indicators</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {indicators.slice(0, 4).map((ind) => (
              <div key={ind.code} className="border-l-2 border-[#0b4627] pl-4">
                <span className="text-[10px] font-mono uppercase text-[#737373] block mb-1">
                  {ind.category}
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#141414]">
                    {ind.currentValue}
                  </span>
                  <span className="text-xs font-mono text-[#555555]">
                    {ind.unit}
                  </span>
                </div>
                <p className="text-xs font-serif text-[#333333] line-clamp-1 mb-1">
                  {ind.name}
                </p>
                <span className="text-[10px] font-mono text-[#0b4627]">
                  {ind.trend === 'up' ? '↗ Increasing' : ind.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. THE TRACKER: MAJOR INFRASTRUCTURE SITES
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 border-b border-[#e6dfd5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-8 border-b-2 border-[#141414] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#0b4627]"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0b4627]">
                The Public Registry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414]">
              The Tracker: Major National Projects
            </h2>
            <p className="text-xs font-serif text-[#737373] mt-1">
              Physical and documentary monitoring of real project delivery in Burkina Faso.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#737373] hidden sm:inline">
              {projects.length} documented projects · Target: 60 projects
            </span>
            <Link 
              href="/en/tracker"
              className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#0b4627] hover:bg-[#072e1a] px-4 py-2 transition-colors flex items-center gap-1.5"
            >
              <span>Explore The Tracker</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} lang="en" />
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. ON THE GROUND & FACT CHECKING
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 border-b border-[#e6dfd5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Feature : On the Ground (Col 7) */}
          <div className="lg:col-span-7">
            <div className="pb-3 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#0b4627]"></span>
                On the Ground · Regional Reporting
              </h2>
              <span className="text-[11px] font-serif text-[#737373] italic">Bobo-Dioulasso Desk</span>
            </div>

            <article className="bg-white border border-[#e6dfd5] flex flex-col justify-between group h-[calc(100%-3rem)]">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                  <img 
                    src={terrainArticle.image || terrainArticle.imageUrl} 
                    alt={terrainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] block mb-2">
                    {terrainArticle.category} · Field Evidence
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-3">
                    <Link href={`/en/${terrainArticle.category}/${terrainArticle.slug}`}>
                      {terrainArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm font-serif text-[#444444] leading-relaxed mb-4">
                    {terrainArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif text-[#555555]">
                  <span className="italic">Newsroom Investigation · Bobo-Dioulasso</span>
                  <Link href={`/en/${terrainArticle.category}/${terrainArticle.slug}`} className="font-mono font-bold text-xs text-[#0b4627] hover:underline">
                    Read investigation →
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Right Feature : Fact Checking (Col 5) */}
          <div className="lg:col-span-5">
            <div className="pb-3 mb-6 border-b-2 border-[#141414] flex justify-between items-center">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#0b4627]"></span>
                Fact Check · Verified Claims
              </h2>
            </div>

            <article className="bg-white border border-[#e6dfd5] flex flex-col justify-between group h-[calc(100%-3rem)]">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 border-b border-[#e6dfd5]">
                  <img 
                    src={factCheckArticle.image || factCheckArticle.imageUrl} 
                    alt={factCheckArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c2410c] block mb-2">
                    Verification Dossier
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug mb-3">
                    <Link href={`/en/${factCheckArticle.category}/${factCheckArticle.slug}`}>
                      {factCheckArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm font-serif text-[#444444] leading-relaxed mb-4">
                    {factCheckArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif text-[#555555]">
                  <span className="text-[#0b4627] font-semibold">{factCheckArticle.sourceCount} verified sources</span>
                  <Link href={`/en/${factCheckArticle.category}/${factCheckArticle.slug}`} className="font-mono font-bold text-xs text-[#0b4627] hover:underline">
                    View data breakdown →
                  </Link>
                </div>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. NEWSLETTER SUBSCRIPTION
      ────────────────────────────────────────────────────────── */}
      <section id="newsletter" className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-16">
        <div className="border-2 border-[#141414] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#0b4627] font-bold block mb-2">
            The Weekly Newsletter
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#141414] mb-3">
            Receive the 10 verified facts of the week
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#555555] max-w-lg mx-auto mb-6 leading-relaxed">
            Every Sunday morning at 8:00 AM, key economic, infrastructure, and security developments in Burkina Faso, fully sourced and without commentary.
          </p>

          <InteractiveNewsletter lang="en" />
          
          <p className="text-[10px] font-serif text-[#737373] mt-3">
            Free at launch · Zero advertising · Your data is never shared
          </p>
        </div>
      </section>

    </div>
  );
}
