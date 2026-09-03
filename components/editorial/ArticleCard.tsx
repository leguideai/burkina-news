import Link from 'next/link';
import { Article } from '@/data/types';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'horizontal' | 'lead';
  lang?: 'fr' | 'en';
}

export default function ArticleCard({ article, variant = 'default', lang = 'fr' }: ArticleCardProps) {
  const imageSrc = article.image || article.imageUrl || '/images/lead.jpeg';
  const isEn = lang === 'en';
  const articleHref = `/${isEn ? 'en' : 'fr'}/${article.category}/${article.slug}`;
  const verifiedSourcesLabel = isEn ? `${article.sourceCount} verified sources` : `${article.sourceCount} sources vérifiées`;

  // 1. LEAD VARIANT (Main centerpiece story)
  if (variant === 'lead') {
    return (
      <article className="group flex flex-col bg-white border border-[#e6dfd5] p-6 sm:p-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mb-6">
          <img 
            src={imageSrc} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#555555] mb-3">
          <span className="font-bold text-[#0b4627]">{article.category}</span>
          <span>·</span>
          <span className="text-[#0b4627] font-semibold flex items-center gap-1">
            <ShieldCheck size={13} />
            {verifiedSourcesLabel}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#141414] leading-[1.18] mb-4 group-hover:text-[#0b4627] transition-colors">
          <Link href={articleHref}>
            {article.title}
          </Link>
        </h2>

        <p className="text-sm sm:text-base font-serif text-[#444444] leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <div className="pt-4 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-serif">
          <span className="text-[#555555] italic">
            {isEn ? "Newsroom Investigation · Bobo-Dioulasso" : "Enquête Rédactionnelle · Bobo-Dioulasso"}
          </span>
          <Link href={articleHref} className="font-bold text-[#0b4627] hover:underline flex items-center gap-1">
            <span>{isEn ? "Read investigation" : "Lire l'enquête"}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </article>
    );
  }

  // 2. HORIZONTAL VARIANT (Classic two-column)
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 p-4 bg-white border border-[#e6dfd5] hover:border-[#141414] transition-colors">
        <div className="sm:w-1/3 aspect-[4/3] overflow-hidden bg-neutral-100 shrink-0">
          <img 
            src={imageSrc} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="sm:w-2/3 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-1">
              {article.category}
            </div>
            <h3 className="text-base font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug line-clamp-2 mb-2">
              <Link href={articleHref}>
                {article.title}
              </Link>
            </h3>
            <p className="text-xs font-serif text-[#555555] line-clamp-2 mb-2">
              {article.excerpt}
            </p>
          </div>
          <div className="text-[11px] text-[#0b4627] flex justify-between items-center pt-2 border-t border-neutral-100 font-mono">
            <span className="font-semibold">{verifiedSourcesLabel}</span>
            <span className="text-[#737373] group-hover:text-[#0b4627] font-bold">
              {isEn ? "Read →" : "Lire →"}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 3. COMPACT VARIANT (With photographic evidence thumbnail)
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 pb-4 mb-4 border-b border-[#e6dfd5] last:border-0 last:pb-0 last:mb-0 items-start">
        <div className="w-20 h-16 shrink-0 overflow-hidden bg-neutral-100 border border-[#e6dfd5]">
          <img 
            src={imageSrc} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b4627] mb-0.5">
            {article.category}
          </div>
          <h4 className="text-xs font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug line-clamp-2 mb-1">
            <Link href={articleHref}>
              {article.title}
            </Link>
          </h4>
          <span className="text-[10px] font-mono text-[#0b4627] font-semibold">{verifiedSourcesLabel}</span>
        </div>
      </article>
    );
  }

  // 4. DEFAULT CARD (Grid)
  return (
    <article className="group flex flex-col bg-white border border-[#e6dfd5] p-5 hover:border-[#141414] transition-colors h-full">
      <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-4">
        <img 
          src={imageSrc} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#555555] mb-2">
            <span className="font-bold text-[#0b4627]">{article.category}</span>
          </div>

          <h3 className="text-lg font-bold font-serif text-[#141414] group-hover:text-[#0b4627] transition-colors leading-snug line-clamp-2 mb-2">
            <Link href={articleHref}>
              {article.title}
            </Link>
          </h3>

          <p className="text-xs font-serif text-[#555555] leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-[#e6dfd5] flex justify-between items-center text-xs font-mono text-[#737373]">
          <span className="font-semibold text-[#0b4627]">{verifiedSourcesLabel}</span>
          <span className="font-serif font-bold text-[#0b4627] group-hover:underline">
            {isEn ? "Read →" : "Lire →"}
          </span>
        </div>
      </div>
    </article>
  );
}

export { ArticleCard };
