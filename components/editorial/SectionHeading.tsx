import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  action?: string;
  href?: string;
}

export default function SectionHeading({ title, action, href }: SectionHeadingProps) {
  return (
    <div className="flex justify-between items-center w-full border-t-2 border-[var(--ink)] pt-3 mb-6">
      <h2 className="text-2xl font-semibold font-[family-name:var(--font-inter)] text-[var(--ink)]">
        {title}
      </h2>
      
      {action && href && (
        <Link 
          href={href} 
          className="flex items-center gap-1 text-sm font-semibold text-[var(--orange)] hover:text-[var(--orange-light)] transition-colors"
        >
          {action}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
